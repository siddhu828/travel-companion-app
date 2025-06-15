const express = require('express');
const router = express.Router();
const { createTrip, getUserTrips } = require('../controllers/tripController');

router.post('/', createTrip);
router.get('/:userId', getUserTrips);

module.exports = router;