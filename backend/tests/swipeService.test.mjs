import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { createRequire } from 'module';

// Use createRequire so we can load CJS modules from an ESM Vitest context
const require = createRequire(import.meta.url);
const { initSchema, seedDatabase } = require('../src/db/index.js');
const { SwipeService } = require('../src/services/swipeService.js');
const { PRE_LIKED_IDS } = require('../src/db/seedData.js');

/** Allowed public fields on a profile – nothing more, nothing less. */
const ALLOWED_PROFILE_KEYS = new Set(['id','name','age','photo','bio','location','interests']);

/** Fields that must NEVER appear in any feed or one-sided-swipe response. */
const FORBIDDEN_KEYS = [
  'liked','likes','likedYou','liked_you','hasLiked','has_liked',
  'incomingLike','incoming_like','direction','swiper_id','isMatch',
  'matched','pending',
];

function freshDB() {
  const db = new Database(':memory:');
  initSchema(db);
  seedDatabase(db);
  return db;
}

describe('SwipeService — Privacy & Correctness', () => {
  let db, svc;

  beforeEach(() => {
    db = freshDB();
    svc = new SwipeService(db);
  });

  // ─── 1. Feed ─────────────────────────────────────────────────────────────

  describe('Feed', () => {
    it('returns all 32 profiles when me has not swiped', () => {
      expect(svc.getFeed('me')).toHaveLength(32);
    });

    it('excludes profiles me has already swiped (like)', () => {
      svc.recordSwipe('me', 'p01', 'like');
      const ids = svc.getFeed('me').map(p => p.id);
      expect(ids).not.toContain('p01');
      expect(ids).toHaveLength(31);
    });

    it('excludes profiles me has already swiped (pass)', () => {
      svc.recordSwipe('me', 'p03', 'pass');
      const ids = svc.getFeed('me').map(p => p.id);
      expect(ids).not.toContain('p03');
    });

    it('excludes multiple swiped profiles', () => {
      svc.recordSwipe('me', 'p01', 'like');
      svc.recordSwipe('me', 'p02', 'pass');
      svc.recordSwipe('me', 'p03', 'like');
      const ids = svc.getFeed('me').map(p => p.id);
      expect(ids).not.toContain('p01');
      expect(ids).not.toContain('p02');
      expect(ids).not.toContain('p03');
      expect(ids).toHaveLength(29);
    });

    it('profile objects have ONLY the allowed public fields (no like-leak)', () => {
      const profiles = svc.getFeed('me');
      expect(profiles.length).toBeGreaterThan(0);

      for (const p of profiles) {
        const keys = Object.keys(p);

        // Every allowed key must be present
        for (const k of ALLOWED_PROFILE_KEYS) expect(keys).toContain(k);

        // No key may be one of the forbidden leak-fields
        for (const f of FORBIDDEN_KEYS) {
          expect(keys).not.toContain(f);
        }

        // Exactly the allowed fields — nothing extra
        expect(keys.sort()).toEqual([...ALLOWED_PROFILE_KEYS].sort());
      }
    });

    it('feed ordering is NOT boosted by incoming likes (pre-liked profiles appear in natural order)', () => {
      const ids = svc.getFeed('me').map(p => p.id);

      // p02 is pre-liked but should NOT be at index 0 (p01 comes first)
      expect(ids[0]).toBe('p01');

      // All PRE_LIKED_IDS appear in the feed at their natural rowid positions
      const preLikedInFeed = ids.filter(id => PRE_LIKED_IDS.includes(id));
      expect(preLikedInFeed).toEqual(PRE_LIKED_IDS); // same order as seed
    });
  });

  // ─── 2. Swiping ──────────────────────────────────────────────────────────

  describe('Swiping', () => {
    it('one-sided like → { matched: false } and nothing else', () => {
      // p01 has NOT liked me
      expect(PRE_LIKED_IDS).not.toContain('p01');
      const result = svc.recordSwipe('me', 'p01', 'like');

      expect(result).toEqual({ matched: false });
      expect(result.profile).toBeUndefined();
    });

    it('pass on a profile that liked me → { matched: false }, no match created', () => {
      expect(PRE_LIKED_IDS).toContain('p02'); // p02 liked me in seed
      const result = svc.recordSwipe('me', 'p02', 'pass');

      expect(result).toEqual({ matched: false });
      expect(svc.getMatches('me')).toHaveLength(0);
    });

    it('mutual like → { matched: true, profile } with clean profile shape', () => {
      const result = svc.recordSwipe('me', 'p02', 'like'); // p02 already liked me

      expect(result.matched).toBe(true);
      expect(result.profile).toBeDefined();
      expect(result.profile.id).toBe('p02');
      expect(result.profile.name).toBe('Maya Patel');

      // The profile in the match response must also have no leak fields
      const keys = Object.keys(result.profile);
      for (const f of FORBIDDEN_KEYS) expect(keys).not.toContain(f);
      expect(keys.sort()).toEqual([...ALLOWED_PROFILE_KEYS].sort());
    });

    it('duplicate swipe (like → like) is idempotent: no duplicate rows, no error', () => {
      svc.recordSwipe('me', 'p02', 'like');
      expect(() => svc.recordSwipe('me', 'p02', 'like')).not.toThrow();

      const swipes = db.prepare(
        'SELECT COUNT(*) AS cnt FROM swipes WHERE swiper_id=? AND target_id=?'
      ).get('me', 'p02');
      expect(swipes.cnt).toBe(1);

      const matches = db.prepare('SELECT COUNT(*) AS cnt FROM matches').get();
      expect(matches.cnt).toBe(1); // only one match row
    });

    it('duplicate swipe (pass → pass) is idempotent', () => {
      svc.recordSwipe('me', 'p04', 'pass');
      expect(() => svc.recordSwipe('me', 'p04', 'pass')).not.toThrow();

      const swipes = db.prepare(
        'SELECT COUNT(*) AS cnt FROM swipes WHERE swiper_id=? AND target_id=?'
      ).get('me', 'p04');
      expect(swipes.cnt).toBe(1);
    });

    it('rejects empty targetId', () => {
      expect(() => svc.recordSwipe('me', '', 'like')).toThrow();
    });

    it('rejects invalid direction', () => {
      expect(() => svc.recordSwipe('me', 'p01', 'superlike')).toThrow();
    });

    it('rejects swiping on yourself', () => {
      expect(() => svc.recordSwipe('me', 'me', 'like')).toThrow();
    });

    it('rejects unknown profileId', () => {
      expect(() => svc.recordSwipe('me', 'does_not_exist', 'like')).toThrow();
    });
  });

  // ─── 3. Matches ──────────────────────────────────────────────────────────

  describe('Matches', () => {
    it('returns 0 matches before any swipe from me', () => {
      expect(svc.getMatches('me')).toHaveLength(0);
    });

    it('lists ONLY mutual matches — one-sided likes never appear', () => {
      svc.recordSwipe('me', 'p02', 'like'); // mutual (p02 pre-liked me)
      svc.recordSwipe('me', 'p05', 'pass'); // p05 pre-liked me but I passed
      svc.recordSwipe('me', 'p01', 'like'); // I liked p01, but p01 hasn't liked me

      const matches = svc.getMatches('me');
      expect(matches).toHaveLength(1);
      expect(matches[0].id).toBe('p02');

      const ids = matches.map(m => m.id);
      expect(ids).not.toContain('p05');
      expect(ids).not.toContain('p01');
    });

    it('accumulates multiple mutual matches', () => {
      svc.recordSwipe('me', 'p02', 'like');
      svc.recordSwipe('me', 'p05', 'like');
      svc.recordSwipe('me', 'p09', 'like');

      const matches = svc.getMatches('me');
      expect(matches).toHaveLength(3);
      const ids = matches.map(m => m.id);
      expect(ids).toContain('p02');
      expect(ids).toContain('p05');
      expect(ids).toContain('p09');
    });

    it('match objects include matched_at and clean profile shape', () => {
      svc.recordSwipe('me', 'p02', 'like');
      const [match] = svc.getMatches('me');

      expect(match.matched_at).toBeTruthy();
      // Profile fields present
      for (const k of ALLOWED_PROFILE_KEYS) expect(match).toHaveProperty(k);
      // No forbidden fields
      for (const f of FORBIDDEN_KEYS) expect(Object.keys(match)).not.toContain(f);
    });
  });
});
