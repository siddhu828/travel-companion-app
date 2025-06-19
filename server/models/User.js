const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  age: Number,
  gender: String,
  bio: String,
  interests: [String],
  profilePicture: String,
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  skippedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isBanned:{type : Boolean, default: false}
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
