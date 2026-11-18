'use strict';

class SwipeService {
  constructor(db) {
    this.db = db;
  }

  getFeed(userId = 'me') {
    const rows = this.db.prepare(`
      SELECT id, name, age, photo, bio, location, interests
      FROM   profiles
      WHERE  id NOT IN (
               SELECT target_id FROM swipes WHERE swiper_id = ?
             )
        AND  id != ?
      ORDER  BY rowid ASC
    `).all(userId, userId);

    return rows.map(this._parseProfile);
  }

  recordSwipe(swiperId = 'me', targetId, direction) {
    if (!targetId || typeof targetId !== 'string' || !targetId.trim())
      throw new Error('targetId must be a non-empty string');
    if (direction !== 'like' && direction !== 'pass')
      throw new Error("direction must be 'like' or 'pass'");
    if (swiperId === targetId)
      throw new Error('Cannot swipe on yourself');

    const targetRow = this.db.prepare(
      'SELECT id, name, age, photo, bio, location, interests FROM profiles WHERE id = ?'
    ).get(targetId);
    if (!targetRow) throw new Error(`Profile "${targetId}" not found`);

    const result = this.db.transaction(() => {
      this.db.prepare(`
        INSERT OR IGNORE INTO swipes (swiper_id, target_id, direction)
        VALUES (?, ?, ?)
      `).run(swiperId, targetId, direction);

      if (direction === 'like') {
        const theyLikedMe = this.db.prepare(`
          SELECT 1 FROM swipes
          WHERE  swiper_id = ? AND target_id = ? AND direction = 'like'
        `).get(targetId, swiperId);

        if (theyLikedMe) {
          const [a, b] = [swiperId, targetId].sort();
          this.db.prepare(`
            INSERT OR IGNORE INTO matches (user_a, user_b) VALUES (?, ?)
          `).run(a, b);

          return { matched: true, profile: this._parseProfile(targetRow) };
        }
      }

      return { matched: false };
    })();

    return result;
  }

  getMatches(userId = 'me') {
    const rows = this.db.prepare(`
      SELECT p.id, p.name, p.age, p.photo, p.bio, p.location, p.interests,
             m.created_at AS matched_at
      FROM   matches m
      JOIN   profiles p
             ON p.id = CASE WHEN m.user_a = ? THEN m.user_b ELSE m.user_a END
      WHERE  m.user_a = ? OR m.user_b = ?
      ORDER  BY m.created_at DESC
    `).all(userId, userId, userId);

    return rows.map(r => ({
      ...this._parseProfile(r),
      matched_at: r.matched_at,
    }));
  }

  _parseProfile(row) {
    return {
      id:        row.id,
      name:      row.name,
      age:       row.age,
      photo:     row.photo,
      bio:       row.bio,
      location:  row.location,
      interests: typeof row.interests === 'string'
        ? JSON.parse(row.interests)
        : row.interests,
    };
  }
}

module.exports = { SwipeService };
