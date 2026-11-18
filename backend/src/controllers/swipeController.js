'use strict';

const { getDatabase, seedDatabase, needsSeed } = require('../db');
const { SwipeService } = require('../services/swipeService');

const db = getDatabase();
if (needsSeed(db)) seedDatabase(db);

const service = new SwipeService(db);

function getFeed(req, res) {
  try {
    const profiles = service.getFeed('me');
    res.json({ profiles });
  } catch (err) {
    console.error('[feed]', err.message);
    res.status(500).json({ error: 'Failed to load feed' });
  }
}

function postSwipe(req, res) {
  const { targetId, direction } = req.body ?? {};

  if (!targetId || typeof targetId !== 'string') {
    return res.status(400).json({ error: 'targetId is required and must be a string' });
  }
  if (direction !== 'like' && direction !== 'pass') {
    return res.status(400).json({ error: "direction must be 'like' or 'pass'" });
  }

  try {
    const result = service.recordSwipe('me', targetId, direction);
    res.json(result);
  } catch (err) {
    console.error('[swipe]', err.message);
    res.status(400).json({ error: err.message });
  }
}

function getMatches(req, res) {
  try {
    const matches = service.getMatches('me');
    res.json({ matches });
  } catch (err) {
    console.error('[matches]', err.message);
    res.status(500).json({ error: 'Failed to load matches' });
  }
}

function postReset(req, res) {
  try {
    const { resetDatabase } = require('../db');
    resetDatabase(db);
    res.json({ ok: true, message: 'Database reset and seeded successfully' });
  } catch (err) {
    console.error('[reset]', err.message);
    res.status(500).json({ error: 'Failed to reset database' });
  }
}

module.exports = { getFeed, postSwipe, getMatches, postReset };
