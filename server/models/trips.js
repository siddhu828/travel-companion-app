const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  interests: [String],
  travelType: String, 
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);