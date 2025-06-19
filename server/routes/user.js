const express = require('express');
const router = express.Router();

const {
  updateProfile,
  getProfile,
  getPotentialMatches,
  likeUser,
  skipUser,
  getAllUsers,
  deleteUser,
  toggleBanUser
} = require('../controllers/userController');

// Profile Routes
router.put('/profile', updateProfile);
router.get('/profile/:userId', getProfile);

// Matching Routes
router.get('/matches/:userId', getPotentialMatches);
router.post('/like', likeUser);
router.post('/skip', skipUser);

// Admin Routes
router.get('/all', getAllUsers);
router.delete('/:id', deleteUser);
router.put('/ban/:id', toggleBanUser);
module.exports = router;