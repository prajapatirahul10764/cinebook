const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Please select a movie']
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Please select a theatre']
    },
    screen: {
      type: String,
      required: [true, 'Please specify screen name/number']
    },
    date: {
      type: String,
      required: [true, 'Please specify show date (YYYY-MM-DD)']
    },
    time: {
      type: String,
      required: [true, 'Please specify show time (e.g. 18:30)']
    },
    price: {
      type: Number,
      required: [true, 'Please specify ticket price'],
      min: [1, 'Price must be greater than 0']
    },
    totalSeats: {
      type: Number,
      required: [true, 'Please specify total seats'],
      min: [1, 'Total seats must be greater than 0'],
      default: 32
    },
    availableSeats: {
      type: Number,
      required: true,
      default: 32
    },
    bookedSeats: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Show', showSchema);
