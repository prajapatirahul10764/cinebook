const Movie = require('../models/Movie');

// @desc    Get all movies with search and filters
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, rating, status, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
        { language: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre) {
      query.genre = { $in: [genre] };
    }

    if (language) {
      query.language = { $regex: `^${language}$`, $options: 'i' };
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (status) {
      query.status = { $in: [status] };
    }

    let sortQuery = { createdAt: -1 };
    if (sort) {
      if (sort === 'rating') {
        sortQuery = { rating: -1 };
      } else if (sort === 'releaseDate') {
        sortQuery = { releaseDate: -1 };
      } else if (sort === 'title') {
        sortQuery = { title: 1 };
      }
    }

    const movies = await Movie.find(query).sort(sortQuery);

    res.json({
      success: true,
      message: 'Movies fetched successfully',
      count: movies.length,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie details fetched successfully',
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      genre,
      language,
      duration,
      releaseDate,
      poster,
      backdrop,
      trailer,
      trailerUrl,
      director,
      cast,
      certification,
      status,
      featured,
      rating
    } = req.body;

    if (!title || !description || !genre || !language || !duration || !releaseDate || !poster) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required movie fields (title, description, genre, language, duration, releaseDate, poster)'
      });
    }

    const genreArray = Array.isArray(genre) ? genre : genre.split(',').map(g => g.trim());
    const castArray = Array.isArray(cast) ? cast : cast ? cast.split(',').map(c => c.trim()) : [];
    const statusArray = Array.isArray(status) ? status : status ? status.split(',').map(s => s.trim()) : ['NOW_SHOWING'];

    const movie = await Movie.create({
      title,
      description,
      genre: genreArray,
      language,
      duration: String(duration),
      releaseDate,
      poster,
      backdrop: backdrop || '',
      trailer: trailer || trailerUrl || '',
      trailerUrl: trailerUrl || trailer || '',
      director: director || '',
      cast: castArray,
      certification: certification || 'UA',
      status: statusArray,
      featured: featured === true || featured === 'true',
      rating: Number(rating) || 0
    });

    res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    if (req.body.genre && !Array.isArray(req.body.genre)) {
      req.body.genre = req.body.genre.split(',').map(g => g.trim());
    }

    if (req.body.cast && !Array.isArray(req.body.cast)) {
      req.body.cast = req.body.cast.split(',').map(c => c.trim());
    }

    if (req.body.status && !Array.isArray(req.body.status)) {
      req.body.status = req.body.status.split(',').map(s => s.trim());
    }

    if (req.body.featured !== undefined) {
      req.body.featured = req.body.featured === true || req.body.featured === 'true';
    }

    // Sync trailer fields if either changes
    if (req.body.trailerUrl && !req.body.trailer) {
      req.body.trailer = req.body.trailerUrl;
    } else if (req.body.trailer && !req.body.trailerUrl) {
      req.body.trailerUrl = req.body.trailer;
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    await movie.deleteOne();

    res.json({
      success: true,
      message: 'Movie deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};
