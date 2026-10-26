const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

// @desc    Get all shows (optional filters by movie, theatre, date)
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const { movie, theatre, date } = req.query;
    let query = {};

    if (movie) query.movie = movie;
    if (theatre) query.theatre = theatre;
    if (date) query.date = date;

    const shows = await Show.find(query)
      .populate('movie', 'title genre language duration poster rating')
      .populate('theatre', 'name location city screens')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      message: 'Shows fetched successfully',
      count: shows.length,
      data: shows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show details
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title genre language duration poster rating description')
      .populate('theatre', 'name location city');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.json({
      success: true,
      message: 'Show details fetched successfully',
      data: show
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seat status for a show
// @route   GET /api/shows/:id/seats
// @access  Public
const getShowSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.json({
      success: true,
      message: 'Show seat status fetched successfully',
      data: {
        showId: show._id,
        totalSeats: show.totalSeats,
        availableSeats: show.availableSeats,
        bookedSeats: show.bookedSeats,
        price: show.price
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new show
// @route   POST /api/shows
// @access  Private/Admin
const createShow = async (req, res, next) => {
  try {
    const { movie, theatre, screen, date, time, price, totalSeats } = req.body;

    if (!movie || !theatre || !screen || !date || !time || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required show fields (movie, theatre, screen, date, time, price)'
      });
    }

    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(404).json({ success: false, message: 'Referenced movie not found' });
    }

    const theatreExists = await Theatre.findById(theatre);
    if (!theatreExists) {
      return res.status(404).json({ success: false, message: 'Referenced theatre not found' });
    }

    const seatsCount = totalSeats ? Number(totalSeats) : 32;

    const show = await Show.create({
      movie,
      theatre,
      screen,
      date,
      time,
      price: Number(price),
      totalSeats: seatsCount,
      availableSeats: seatsCount,
      bookedSeats: []
    });

    const populatedShow = await Show.findById(show._id)
      .populate('movie', 'title')
      .populate('theatre', 'name city');

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully',
      data: populatedShow
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin
const updateShow = async (req, res, next) => {
  try {
    let show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('movie', 'title').populate('theatre', 'name city');

    res.json({
      success: true,
      message: 'Show updated successfully',
      data: show
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    await show.deleteOne();

    res.json({
      success: true,
      message: 'Show deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowById,
  getShowSeats,
  createShow,
  updateShow,
  deleteShow
};
