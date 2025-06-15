const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/userController');

router.put('/profile', updateProfile);
router.get('/profile/:userId', getProfile);
const { 
    getProfile, updateProfile,
    getPotentialMatches, likeUser, skipUser
  } = require('../controllers/userController');
  
  router.get('/matches/:userId', getPotentialMatches);
  router.post('/like', likeUser);
  router.post('/skip', skipUser);
module.exports = router;