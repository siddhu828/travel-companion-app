const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/User');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// GET all users 
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

const { adminLogin } = require('../controllers/authController');
router.post('/admin-login', adminLogin);


module.exports = router;