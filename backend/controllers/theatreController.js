const Theatre = require('../models/Theatre');

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
const getTheatres = async (req, res, next) => {
  try {
    const theatres = await Theatre.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      message: 'Theatres fetched successfully',
      count: theatres.length,
      data: theatres
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre by ID
// @route   GET /api/theatres/:id
// @access  Public
const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }

    res.json({
      success: true,
      message: 'Theatre details fetched successfully',
      data: theatre
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new theatre
// @route   POST /api/theatres
// @access  Private/Admin
const createTheatre = async (req, res, next) => {
  try {
    const { name, location, city, screens } = req.body;

    if (!name || !location || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, location, and city for theatre'
      });
    }

    const screensArray = screens && Array.isArray(screens) && screens.length > 0
      ? screens
      : [
          { screenName: 'Screen 1', totalSeats: 32 },
          { screenName: 'Screen 2', totalSeats: 32 }
        ];

    const theatre = await Theatre.create({
      name,
      location,
      city,
      screens: screensArray
    });

    res.status(201).json({
      success: true,
      message: 'Theatre added successfully',
      data: theatre
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
const updateTheatre = async (req, res, next) => {
  try {
    let theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }

    theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Theatre updated successfully',
      data: theatre
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }

    await theatre.deleteOne();

    res.json({
      success: true,
      message: 'Theatre deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre
};
