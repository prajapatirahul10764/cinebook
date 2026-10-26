const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');

dotenv.config({ path: __dirname + '/../.env' });

const movieUpdates = [
  {
    title: 'Interstellar',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg'
  },
  {
    title: 'Inception',
    poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg'
  },
  {
    title: 'The Dark Knight',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg'
  },
  {
    title: 'Avatar',
    poster: 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg'
  },
  {
    title: 'Avengers: Endgame',
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg'
  },
  {
    title: 'Dangal',
    poster: 'https://image.tmdb.org/t/p/w500/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/nBuiFy5ZxUwJt9znwlorHM0hN1s.jpg'
  },
  {
    title: '3 Idiots',
    poster: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/u7kuUaySqXBVAtqEl9vkTkAzHV9.jpg'
  },
  {
    title: 'RRR',
    poster: 'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/i0Y0wP8H6SRgjr6QmuwbtQbS24D.jpg'
  },
  {
    title: 'KGF: Chapter 2',
    poster: 'https://image.tmdb.org/t/p/w500/khNVygolU0TxLIDWff5tQlAhZ23.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/nUAjSrwQldqZJVsgQs3hpQmRASS.jpg'
  },
  {
    title: 'Spider-Man: No Way Home',
    poster: 'https://image.tmdb.org/t/p/w500/5weKu49pzJCt06OPpjvT80efnQj.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg'
  },
  {
    title: 'Oppenheimer',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg'
  },
  {
    title: 'Pushpa: The Rise',
    poster: 'https://image.tmdb.org/t/p/w500/kKDnGklCDRK8hrFGH4pLr7ZDA33.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xFbWiSJwZhbAd8FTDbtWE67rJxU.jpg'
  }
];

const updateMovies = async () => {
  try {
    const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cinebook';
    const fallbackUri = 'mongodb://127.0.0.1:27017/cinebook';

    console.log(`Connecting to MongoDB at: ${primaryUri}`);
    try {
      await mongoose.connect(primaryUri);
    } catch (err) {
      console.warn(`⚠️ Could not connect to primary URI (${err.message}). Trying local fallback: ${fallbackUri}`);
      await mongoose.connect(fallbackUri);
    }

    console.log('Updating movie posters and backdrops...');
    for (const update of movieUpdates) {
      const updatedMovie = await Movie.findOneAndUpdate(
        { title: update.title },
        { 
          poster: update.poster, 
          backdrop: update.backdrop 
        },
        { new: true }
      );
      
      if (updatedMovie) {
        console.log(`✅ Updated images for: "${update.title}"`);
      } else {
        console.warn(`⚠️ Movie not found in database: "${update.title}"`);
      }
    }

    console.log('✅ Finished updating movies.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating movies:', error);
    process.exit(1);
  }
};

updateMovies();
