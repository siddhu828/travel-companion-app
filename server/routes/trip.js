const express = require('express');
const router = express.Router();
const {
  createTrip,
  getUserTrips,
  getAllTrips,
  getPotentialMatchesFromTrip,
  deleteTrip
} = require('../controllers/tripController');

router.get('/matches/:userId/:tripId', getPotentialMatchesFromTrip);
router.post('/', createTrip);
router.get('/:userId', getUserTrips);
router.get('/', getAllTrips);
router.delete('/:id', deleteTrip);

module.exports = router;