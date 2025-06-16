const express = require('express');
const router = express.Router();
const { createTrip, getUserTrips } = require('../controllers/tripController');
const { getPotentialMatchesFromTrip } = require('../controllers/tripController');

router.get('/matches/:userId/:tripId', getPotentialMatchesFromTrip);
router.post('/', createTrip);
router.get('/:userId', getUserTrips);

module.exports = router;