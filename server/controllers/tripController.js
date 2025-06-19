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

// tripController.js
exports.getPotentialMatchesFromTrip = async (req, res) => {
  try {
    const { userId, tripId } = req.params;

    const user = await User.findById(userId);
    const trip = await Trip.findById(tripId);

    if (!trip || !user) return res.status(404).json({ msg: "Trip or user not found" });

    const potentialUsers = await User.find({
      _id: { $ne: userId },
      interests: { $in: trip.interests },
      _id: { $nin: [...user.likedUsers, ...user.skippedUsers, ...user.blockedUsers] }
    }).select('-password');

    const filteredMatches = [];

    for (const matchUser of potentialUsers) {
      const theirTrips = await Trip.find({ user: matchUser._id });

      const hasOverlap = theirTrips.some(t =>
        t.destination.toLowerCase() === trip.destination.toLowerCase() &&
        new Date(t.endDate) >= new Date(trip.startDate) &&
        new Date(t.startDate) <= new Date(trip.endDate)
      );

      if (hasOverlap) {
        filteredMatches.push(matchUser);
      }
    }

    res.json(filteredMatches);
  } catch (err) {
    console.error("Matching error:", err);
    res.status(500).json({ msg: 'Error fetching matches' });
  }
};

exports.getAllTrips = async (req, res) => {
  const trips = await Trip.find().populate('user');
  res.json(trips);
};

exports.deleteTrip = async (req, res) => {
  await Trip.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Trip deleted' });
};