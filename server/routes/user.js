const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
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
router.get('/all', async (req, res) => {
  const excludeId = req.query.exclude;

  try {
    const users = await User.find({ _id: { $ne: excludeId } });
    res.json(users);
  } catch (err) {
    console.error("❌ Error in /user/all:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});
router.delete('/:id', deleteUser);
router.put('/ban/:id', toggleBanUser);
module.exports = router;