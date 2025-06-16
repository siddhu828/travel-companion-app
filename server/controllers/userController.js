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
    const currentUserId = req.params.userId;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) return res.status(404).json({ msg: 'User not found' });

    const matches = await User.find({
      _id: { $ne: currentUserId }, // Not the user themself
      interests: { $in: currentUser.interests }, // Shared interests
      _id: { $nin: [...currentUser.likedUsers, ...currentUser.skippedUsers, ...currentUser.blockedUsers] }
    }).select('-password');

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error finding matches' });
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