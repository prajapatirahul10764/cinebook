const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenName: {
    type: String,
    required: true
  },
  totalSeats: {
    type: Number,
    default: 32
  }
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a theatre name'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please provide theatre location'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please specify city'],
      trim: true
    },
    screens: [screenSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Theatre', theatreSchema);
