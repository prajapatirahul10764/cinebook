const Booking = require('../models/Booking');
const Show = require('../models/Show');
const generateBookingReference = require('../utils/bookingRefGenerator');

// @desc    Create a new movie ticket booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showId, seats } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid show ID and select at least one seat'
      });
    }

    // Fetch show
    const show = await Show.findById(showId).populate('movie').populate('theatre');
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Selected show not found'
      });
    }

    // Check seat availability strictly on the backend
    const alreadyBooked = seats.some(seat => show.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected seats are no longer available. Please select different seats.'
      });
    }

    // Calculate total amount
    const totalAmount = seats.length * show.price;

    // Generate unique booking reference
    const bookingReference = generateBookingReference();

    // Update show booked seats & available seats
    show.bookedSeats.push(...seats);
    show.availableSeats = Math.max(0, show.availableSeats - seats.length);
    await show.save();

    // Create booking record
    const booking = await Booking.create({
      user: req.user._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      show: show._id,
      seats,
      totalAmount,
      bookingReference,
      status: 'Confirmed',
      bookingDate: new Date()
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster language duration')
      .populate('theatre', 'name location city')
      .populate('show', 'date time screen price')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster language duration releaseDate')
      .populate('theatre', 'name location city')
      .populate('show', 'date time screen price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'User bookings fetched successfully',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title poster language duration description rating')
      .populate('theatre', 'name location city')
      .populate('show', 'date time screen price')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      message: 'Booking details fetched successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Update status to Cancelled
    booking.status = 'Cancelled';
    await booking.save();

    // Release seats on the show record
    const show = await Show.findById(booking.show);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter(seat => !booking.seats.includes(seat));
      show.availableSeats = show.availableSeats + booking.seats.length;
      await show.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title poster')
      .populate('theatre', 'name city')
      .populate('show', 'date time screen price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'All bookings fetched successfully',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
};
