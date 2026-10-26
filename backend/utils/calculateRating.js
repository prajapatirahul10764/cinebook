const Review = require('../models/Review');
const Movie = require('../models/Movie');

const recalculateMovieRating = async (movieId) => {
  try {
    const reviews = await Review.find({ movie: movieId });
    const numReviews = reviews.length;

    const movie = await Movie.findById(movieId);
    if (!movie) return;

    let averageRating = movie.rating || 0;
    if (numReviews > 0) {
      const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
      // Reviews are 1 to 5 stars, Movie rating is out of 10
      averageRating = Number(((sum / numReviews) * 2).toFixed(1));
    }

    await Movie.findByIdAndUpdate(movieId, {
      rating: averageRating,
      numReviews: numReviews,
      voteCount: numReviews
    });
  } catch (error) {
    console.error(`Error recalculating rating for movie ${movieId}:`, error);
  }
};

module.exports = recalculateMovieRating;
