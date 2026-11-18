'use strict';

const express = require('express');
const { getFeed, postSwipe, getMatches, postReset } = require('../controllers/swipeController');

const router = express.Router();

router.get('/feed',     getFeed);
router.post('/swipe',   postSwipe);
router.get('/matches',  getMatches);
router.post('/reset',   postReset);

module.exports = router;
