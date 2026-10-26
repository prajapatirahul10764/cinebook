const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Routes mounted at /api/movies/:movieId/reviews
router.route('/')
  .get(getMovieReviews)
  .post(protect, createReview);

module.exports = router;
