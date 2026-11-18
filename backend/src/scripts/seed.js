'use strict';

const { getDatabase, seedDatabase, needsSeed } = require('../db');

const db = getDatabase();
if (needsSeed(db)) {
  seedDatabase(db);
  console.log('Seeded 32 profiles + 7 pre-liked swipes.');
} else {
  console.log('Database already seeded. Run "npm run reset" to wipe and re-seed.');
}
