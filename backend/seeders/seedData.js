const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const recalculateMovieRating = require('../utils/calculateRating');
const generateBookingReference = require('../utils/bookingRefGenerator');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async () => {
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

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const userPassword = await bcrypt.hash('User@123', salt);

    const users = await User.create([
      {
        name: 'CineBook Admin',
        email: 'admin@cinebook.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'user@cinebook.com',
        password: userPassword,
        role: 'user'
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@gmail.com',
        password: userPassword,
        role: 'user'
      },
      {
        name: 'Priya Patel',
        email: 'priya@gmail.com',
        password: userPassword,
        role: 'user'
      },
      {
        name: 'Alex Johnson',
        email: 'alex@gmail.com',
        password: userPassword,
        role: 'user'
      },
      {
        name: 'Sneha Verma',
        email: 'sneha@gmail.com',
        password: userPassword,
        role: 'user'
      }
    ]);

    const adminUser = users[0];
    const demoUser = users[1];
    const rahulUser = users[2];
    const priyaUser = users[3];

    console.log('Seeding Movies...');
    const movies = await Movie.create([
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        language: 'English',
        duration: '2h 49m',
        releaseDate: new Date('2014-11-07'),
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR', 'TOP_RATED', 'FEATURED'],
        featured: true,
        rating: 8.7,
        voteCount: 0
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        genre: ['Sci-Fi', 'Thriller', 'Action'],
        language: 'English',
        duration: '2h 28m',
        releaseDate: new Date('2010-07-16'),
        poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR', 'TOP_RATED'],
        featured: false,
        rating: 8.8,
        voteCount: 0
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genre: ['Action', 'Crime', 'Drama'],
        language: 'English',
        duration: '2h 32m',
        releaseDate: new Date('2008-07-18'),
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Maggie Gyllenhaal'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR', 'TOP_RATED'],
        featured: false,
        rating: 9.0,
        voteCount: 0
      },
      {
        title: 'Avatar',
        description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: 'English',
        duration: '2h 42m',
        releaseDate: new Date('2009-12-18'),
        poster: 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=5PSNL1q36VY',
        director: 'James Cameron',
        cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR'],
        featured: false,
        rating: 7.8,
        voteCount: 0
      },
      {
        title: 'Avengers: Endgame',
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        duration: '3h 1m',
        releaseDate: new Date('2019-04-26'),
        poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        director: 'Anthony Russo, Joe Russo',
        cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR', 'TOP_RATED'],
        featured: false,
        rating: 8.4,
        voteCount: 0
      },
      {
        title: 'Dangal',
        description: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
        genre: ['Drama', 'Sports', 'Biography'],
        language: 'Hindi',
        duration: '2h 41m',
        releaseDate: new Date('2016-12-23'),
        poster: 'https://image.tmdb.org/t/p/w500/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/nBuiFy5ZxUwJt9znwlorHM0hN1s.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=x_7YlGv9u1g',
        director: 'Nitesh Tiwari',
        cast: ['Aamir Khan', 'Sakshi Tanwar', 'Fatima Sana Shaikh', 'Sanya Malhotra'],
        certification: 'U',
        status: ['NOW_SHOWING', 'POPULAR', 'TOP_RATED'],
        featured: false,
        rating: 8.3,
        voteCount: 0
      },
      {
        title: '3 Idiots',
        description: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the world called them idiots.',
        genre: ['Comedy', 'Drama'],
        language: 'Hindi',
        duration: '2h 50m',
        releaseDate: new Date('2009-12-25'),
        poster: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/u7kuUaySqXBVAtqEl9vkTkAzHV9.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=K0eDlFX9GMc',
        director: 'Rajkumar Hirani',
        cast: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi', 'Kareena Kapoor'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR', 'TOP_RATED'],
        featured: false,
        rating: 8.4,
        voteCount: 0
      },
      {
        title: 'RRR',
        description: 'A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.',
        genre: ['Action', 'Drama', 'Adventure'],
        language: 'Telugu',
        duration: '3h 2m',
        releaseDate: new Date('2022-03-25'),
        poster: 'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/i0Y0wP8H6SRgjr6QmuwbtQbS24D.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=f_vbAtFSEc0',
        director: 'S. S. Rajamouli',
        cast: ['N. T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR'],
        featured: false,
        rating: 7.8,
        voteCount: 0
      },
      {
        title: 'KGF: Chapter 2',
        description: "In the blood-soaked Kolar Gold Fields, Rocky's name strikes fear into his foes. While his allies look up to him, the government sees him as a threat to law and order.",
        genre: ['Action', 'Drama'],
        language: 'Kannada',
        duration: '2h 48m',
        releaseDate: new Date('2022-04-14'),
        poster: 'https://image.tmdb.org/t/p/w500/khNVygolU0TxLIDWff5tQlAhZ23.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/nUAjSrwQldqZJVsgQs3hpQmRASS.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=Po3jStA673E',
        director: 'Prashanth Neel',
        cast: ['Yash', 'Sanjay Dutt', 'Raveena Tandon', 'Srinidhi Shetty'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR'],
        featured: false,
        rating: 8.3,
        voteCount: 0
      },
      {
        title: 'Spider-Man: No Way Home',
        description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.',
        genre: ['Action', 'Adventure', 'Fantasy'],
        language: 'English',
        duration: '2h 28m',
        releaseDate: new Date('2021-12-17'),
        poster: 'https://image.tmdb.org/t/p/w500/5weKu49pzJCt06OPpjvT80efnQj.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
        director: 'Jon Watts',
        cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR'],
        featured: false,
        rating: 8.2,
        voteCount: 0
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        genre: ['Biography', 'Drama', 'History'],
        language: 'English',
        duration: '3h',
        releaseDate: new Date('2023-07-21'),
        poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        director: 'Christopher Nolan',
        cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
        certification: 'UA',
        status: ['NOW_SHOWING', 'POPULAR', 'TOP_RATED'],
        featured: false,
        rating: 8.6,
        voteCount: 0
      },
      {
        title: 'Pushpa: The Rise',
        description: 'Violence flares up in the Seshachalam forests of Andhra Pradesh when Pushpa Raj, a red sanders smuggler, rises to power while a ruthless police officer threatens his authority.',
        genre: ['Action', 'Drama'],
        language: 'Telugu',
        duration: '2h 59m',
        releaseDate: new Date('2021-12-17'),
        poster: 'https://image.tmdb.org/t/p/w500/kKDnGklCDRK8hrFGH4pLr7ZDA33.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xFbWiSJwZhbAd8FTDbtWE67rJxU.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=Q1DY3hW-550',
        director: 'Sukumar',
        cast: ['Allu Arjun', 'Fahadh Faasil', 'Rashmika Mandanna', 'Jagadeesh Prathap Bandari'],
        certification: 'UA',
        status: ['UPCOMING', 'POPULAR'],
        featured: false,
        rating: 7.6,
        voteCount: 0
      }
    ]);

    console.log('Seeding Theatres...');
    const theatres = await Theatre.create([
      {
        name: 'PVR ICON Infiniti Mall',
        location: 'Andheri West',
        city: 'Mumbai',
        screens: [
          { screenName: 'Screen 1 (IMAX)', totalSeats: 32 },
          { screenName: 'Screen 2 (4DX)', totalSeats: 32 },
          { screenName: 'Screen 3 (Gold)', totalSeats: 32 }
        ]
      },
      {
        name: 'INOX Forum Mall',
        location: 'Koramangala',
        city: 'Bengaluru',
        screens: [
          { screenName: 'Screen A', totalSeats: 32 },
          { screenName: 'Screen B', totalSeats: 32 }
        ]
      },
      {
        name: 'Cinepolis Select CITYWALK',
        location: 'Saket',
        city: 'Delhi',
        screens: [
          { screenName: 'Auditorium 1', totalSeats: 32 },
          { screenName: 'Auditorium 2', totalSeats: 32 }
        ]
      }
    ]);

    console.log('Seeding Shows...');
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const shows = await Show.create([
      {
        movie: movies[1]._id, // Inception
        theatre: theatres[0]._id, // PVR Mumbai
        screen: 'Screen 1 (IMAX)',
        date: todayStr,
        time: '18:00',
        price: 250,
        totalSeats: 32,
        availableSeats: 30,
        bookedSeats: ['A1', 'A2']
      },
      {
        movie: movies[1]._id, // Inception
        theatre: theatres[0]._id,
        screen: 'Screen 1 (IMAX)',
        date: tomorrowStr,
        time: '21:30',
        price: 280,
        totalSeats: 32,
        availableSeats: 32,
        bookedSeats: []
      },
      {
        movie: movies[0]._id, // Interstellar
        theatre: theatres[1]._id, // INOX Bengaluru
        screen: 'Screen A',
        date: todayStr,
        time: '19:30',
        price: 220,
        totalSeats: 32,
        availableSeats: 31,
        bookedSeats: ['B4']
      },
      {
        movie: movies[2]._id, // The Dark Knight
        theatre: theatres[2]._id, // Cinepolis Delhi
        screen: 'Auditorium 1',
        date: todayStr,
        time: '20:00',
        price: 260,
        totalSeats: 32,
        availableSeats: 32,
        bookedSeats: []
      },
      {
        movie: movies[7]._id, // RRR
        theatre: theatres[1]._id, // INOX Bengaluru
        screen: 'Screen B',
        date: todayStr,
        time: '16:00',
        price: 200,
        totalSeats: 32,
        availableSeats: 32,
        bookedSeats: []
      },
      {
        movie: movies[5]._id, // Dangal
        theatre: theatres[0]._id,
        screen: 'Screen 2 (4DX)',
        date: todayStr,
        time: '14:00',
        price: 180,
        totalSeats: 32,
        availableSeats: 32,
        bookedSeats: []
      },
      {
        movie: movies[10]._id, // Oppenheimer
        theatre: theatres[2]._id, // Cinepolis Delhi
        screen: 'Auditorium 2',
        date: todayStr,
        time: '17:00',
        price: 300,
        totalSeats: 32,
        availableSeats: 32,
        bookedSeats: []
      }
    ]);

    console.log('Seeding Reviews...');
    await Review.create([
      {
        user: demoUser._id,
        movie: movies[1]._id, // Inception
        rating: 5,
        comment: 'Absolute masterpiece! The mind-bending storyline and Hans Zimmer score are unbeatable.'
      },
      {
        user: rahulUser._id,
        movie: movies[1]._id, // Inception
        rating: 4,
        comment: 'Great visuals and brilliant acting by Leonardo DiCaprio. Ending leaves you thinking!'
      },
      {
        user: demoUser._id,
        movie: movies[0]._id, // Interstellar
        rating: 5,
        comment: 'An emotional rollercoaster through space and time. Christopher Nolan at his finest!'
      },
      {
        user: priyaUser._id,
        movie: movies[0]._id, // Interstellar
        rating: 4,
        comment: 'Stunning cinematic visuals and a moving score, though a bit long.'
      },
      {
        user: rahulUser._id,
        movie: movies[2]._id, // Dark Knight
        rating: 5,
        comment: 'Heath Ledger as Joker is legendary. Best superhero movie ever made!'
      }
    ]);

    // Recalculate average ratings for seeded movies
    for (const m of movies) {
      await recalculateMovieRating(m._id);
    }

    console.log('Seeding Sample Bookings...');
    await Booking.create([
      {
        user: demoUser._id,
        movie: movies[1]._id, // Inception
        theatre: theatres[0]._id,
        show: shows[0]._id,
        seats: ['A1', 'A2'],
        totalAmount: 500,
        bookingReference: generateBookingReference(),
        status: 'Confirmed',
        bookingDate: new Date()
      },
      {
        user: rahulUser._id,
        movie: movies[0]._id, // Interstellar
        theatre: theatres[1]._id,
        show: shows[2]._id,
        seats: ['B4'],
        totalAmount: 220,
        bookingReference: generateBookingReference(),
        status: 'Confirmed',
        bookingDate: new Date()
      }
    ]);

    console.log('\n==========================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('==========================================');
    console.log('Demo Credentials:');
    console.log('Admin Email   : admin@cinebook.com');
    console.log('Admin Password: Admin@123');
    console.log('User Email    : user@cinebook.com');
    console.log('User Password : User@123');
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Data:', error);
    process.exit(1);
  }
};

seedData();
