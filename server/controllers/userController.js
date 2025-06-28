const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  console.log("🛬 Hit updateProfile route");  //  this should appear

  try {
    console.log("Received profile update data:", req.body);
    const { userId, name, age, gender, bio, interests, profilePicture } = req.body;
    console.log("🔍 Updating user with ID:", userId);

    const updateData = {};
    if (name) updateData.name = name;
    if (age) updateData.age = parseInt(age);
    if (gender) updateData.gender = gender;
    if (bio) updateData.bio = bio;
    if (interests) updateData.interests = interests;
    if (profilePicture) updateData.profilePicture = profilePicture;

    console.log("Final data being updated:", updateData);

    const updated = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ msg: 'Error updating profile' });
  }
};
// Fetch potential matches for a user
exports.getPotentialMatches = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = await User.findById(userId).populate('trips');

    if (!currentUser) return res.status(404).json({ msg: 'User not found' });

    const liked = currentUser.likedUsers || [];
    const skipped = currentUser.skippedUsers || [];

    // 🚩 Collect all interests from the user's trips
    const userTripInterests = currentUser.trips.flatMap(trip => trip.interests || []);
    const userTrips = currentUser.trips;

    const allUsers = await User.find({ 
      _id: { $nin: [userId, ...liked, ...skipped] } 
    }).populate('trips').select('-password');

    const potentialMatches = allUsers.filter(otherUser => {
      if (!otherUser.trips || otherUser.trips.length === 0) return false;

      // 🔁 Check for trip interest overlap
      const hasCommonInterest = otherUser.trips.some(trip =>
        trip.interests?.some(i => userTripInterests.includes(i))
      );

      // 🔁 Check for trip date + destination overlap
      const hasMatchingTrip = otherUser.trips.some(theirTrip =>
        userTrips.some(myTrip =>
          theirTrip.destination === myTrip.destination &&
          new Date(theirTrip.startDate) <= new Date(myTrip.endDate) &&
          new Date(theirTrip.endDate) >= new Date(myTrip.startDate)
        )
      );

      return hasCommonInterest && hasMatchingTrip;
    });

    res.json(potentialMatches);
  } catch (err) {
    console.error('❌ Match error:', err.message);
    res.status(500).json({ msg: 'Server error while matching' });
  }
};
// Like a user
exports.likeUser = async (req, res) => {
    try {
      const { userId, targetId } = req.body;
      await User.findByIdAndUpdate(userId, { $addToSet: { likedUsers: targetId } });
      res.json({ msg: 'User liked!' });
    } catch (err) {
      res.status(500).json({ msg: 'Error liking user' });
    }
};
  
  // Skip a user
exports.skipUser = async (req, res) => {
  try {
    const { userId, targetId } = req.body;
    await User.findByIdAndUpdate(userId, { $addToSet: { skippedUsers: targetId } });
    res.json({ msg: 'User skipped.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error skipping user' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.query.exclude;

    const query = currentUserId
      ? { _id: { $ne: currentUserId } }
      : {}; // no filter if no exclude param

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ msg: 'Error fetching users' });
  }
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User deleted' });
};

exports.toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ msg: user.isBanned ? "User banned" : "User unbanned" });
  } catch (err) {
    res.status(500).json({ msg: 'Error toggling ban status' });
  }
};