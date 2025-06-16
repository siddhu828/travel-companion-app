const express = require('express');
const router = express.Router();

const {
  updateProfile,
  getProfile,
  getPotentialMatches,
  likeUser,
  skipUser
} = require('../controllers/userController');

// Profile Routes
router.put('/profile', updateProfile);
router.get('/profile/:userId', getProfile);

// Matching Routes
router.get('/matches/:userId', getPotentialMatches);
router.post('/like', likeUser);
router.post('/skip', skipUser);

module.exports = router;