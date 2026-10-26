const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      sparse: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a movie description']
    },
    genre: {
      type: [String],
      required: [true, 'Please specify at least one genre']
    },
    language: {
      type: String,
      required: [true, 'Please specify movie language'],
      trim: true
    },
    duration: {
      type: String,
      required: [true, 'Please specify movie duration']
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please specify release date']
    },
    poster: {
      type: String,
      required: [true, 'Please provide poster image URL']
    },
    backdrop: {
      type: String,
      default: ''
    },
    trailer: {
      type: String,
      default: ''
    },
    trailerUrl: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    numReviews: {
      type: Number,
      default: 0
    },
    voteCount: {
      type: Number,
      default: 0
    },
    director: {
      type: String,
      default: ''
    },
    cast: {
      type: [String],
      default: []
    },
    certification: {
      type: String,
      default: 'UA'
    },
    status: {
      type: [String],
      default: ['NOW_SHOWING']
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

movieSchema.pre('save', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.trailerUrl && !this.trailer) {
    this.trailer = this.trailerUrl;
  } else if (this.trailer && !this.trailerUrl) {
    this.trailerUrl = this.trailer;
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);

