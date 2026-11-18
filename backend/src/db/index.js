'use strict';

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DEFAULT_DB_PATH = path.join(__dirname, '..', '..', 'data', 'coy.db');

const instances = new Map();

function getDatabase(dbPath = DEFAULT_DB_PATH) {
  if (instances.has(dbPath)) return instances.get(dbPath);

  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  initSchema(db);

  instances.set(dbPath, db);
  return db;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      age        INTEGER NOT NULL,
      photo      TEXT NOT NULL,
      bio        TEXT NOT NULL,
      location   TEXT NOT NULL,
      interests  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      swiper_id  TEXT NOT NULL,
      target_id  TEXT NOT NULL,
      direction  TEXT NOT NULL CHECK(direction IN ('like','pass')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(swiper_id, target_id)
    );

    CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
    CREATE INDEX IF NOT EXISTS idx_swipes_target ON swipes(target_id);

    CREATE TABLE IF NOT EXISTS matches (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_a     TEXT NOT NULL,
      user_b     TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_a, user_b)
    );

    CREATE INDEX IF NOT EXISTS idx_matches_a ON matches(user_a);
    CREATE INDEX IF NOT EXISTS idx_matches_b ON matches(user_b);
  `);
}

function resetDatabase(db) {
  db.exec(`
    DELETE FROM matches;
    DELETE FROM swipes;
    DELETE FROM profiles;
  `);
  seedDatabase(db);
}

function seedDatabase(db) {
  const { PROFILES, PRE_LIKED_IDS } = require('./seedData');

  const insertProfile = db.prepare(`
    INSERT OR REPLACE INTO profiles (id, name, age, photo, bio, location, interests)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertSwipe = db.prepare(`
    INSERT OR IGNORE INTO swipes (swiper_id, target_id, direction)
    VALUES (?, 'me', 'like')
  `);

  const seed = db.transaction(() => {
    for (const p of PROFILES) {
      insertProfile.run(p.id, p.name, p.age, p.photo, p.bio, p.location, JSON.stringify(p.interests));
    }
    for (const id of PRE_LIKED_IDS) {
      insertSwipe.run(id);
    }
  });

  seed();
}

function needsSeed(db) {
  const row = db.prepare('SELECT COUNT(*) AS cnt FROM profiles').get();
  return row.cnt === 0;
}

module.exports = { getDatabase, initSchema, seedDatabase, resetDatabase, needsSeed };
