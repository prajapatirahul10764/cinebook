const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Get admin dashboard metrics & stats
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalTheatres = await Theatre.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Calculate revenue from confirmed bookings
    const confirmedBookings = await Booking.find({ status: 'Confirmed' });
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: {
        totalMovies,
        totalTheatres,
        totalShows,
        totalUsers,
        totalBookings,
        totalReviews,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      message: 'Users fetched successfully',
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews across all movies for moderation
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('movie', 'title poster')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'All reviews fetched successfully',
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllReviews
};
