const Trip = require('../models/trips');
const User = require('../models/User');

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const { userId, destination, startDate, endDate, interests, travelType, description } = req.body;

    const newTrip = new Trip({
      user: userId,
      destination,
      startDate,
      endDate,
      interests,
      travelType,
      description
    });

    const savedTrip = await newTrip.save();

    // Link trip to user
    await User.findByIdAndUpdate(userId, { $push: { trips: savedTrip._id } });

    res.status(201).json(savedTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating trip' });
  }
};

// Get trips of current user
exports.getUserTrips = async (req, res) => {
  try {
    const userId = req.params.userId;
    const trips = await Trip.find({ user: userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching trips' });
  }
};