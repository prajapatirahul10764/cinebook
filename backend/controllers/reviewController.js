const Review = require('../models/Review');
const Movie = require('../models/Movie');
const recalculateMovieRating = require('../utils/calculateRating');

// @desc    Get all reviews for a movie
// @route   GET /api/movies/:movieId/reviews
// @access  Public
const getMovieReviews = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Reviews fetched successfully',
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review for a movie
// @route   POST /api/movies/:movieId/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating (1-5) and comment'
      });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: req.user._id,
      movie: movieId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this movie. You can edit your existing review.'
      });
    }

    const review = await Review.create({
      user: req.user._id,
      movie: movieId,
      rating: Number(rating),
      comment
    });

    // Recalculate movie average rating
    await recalculateMovieRating(movieId);

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this review'
      });
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;

    await review.save();

    // Recalculate rating
    await recalculateMovieRating(review.movie);

    const updatedReview = await Review.findById(review._id).populate('user', 'name');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner or Admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const movieId = review.movie;
    await review.deleteOne();

    // Recalculate movie rating
    await recalculateMovieRating(movieId);

    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview
};
