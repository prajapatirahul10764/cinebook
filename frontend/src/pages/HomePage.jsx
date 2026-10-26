import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import MovieImage from '../components/MovieImage';
import {
  Ticket,
  ShieldCheck,
  Star,
  Zap,
  Film,
  Sparkles,
  ArrowRight,
  Flame,
  Tv,
  Calendar,
  Clock,
  ThumbsUp,
  MessageSquare,
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/movies');
      if (res.success) {
        setMovies(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  // 1. Featured Hero Movie
  const featuredMovie = movies.find(m => m.featured) || (movies.length > 0 ? movies[0] : null);

  // 2. Now Showing Movies
  const nowShowingMovies = movies.filter(
    m => m.status && m.status.includes('NOW_SHOWING')
  );

  // 3. Popular Movies (sorted by rating / votes or status)
  const popularMovies = movies
    .filter(m => m.status && m.status.includes('POPULAR'))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // 4. Top Rated Movies
  const topRatedMovies = [...movies]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // 5. Upcoming Movies
  const upcomingMovies = movies.filter(
    m => m.status && m.status.includes('UPCOMING')
  );

  const genresList = [
    { name: 'Action', count: movies.filter(m => m.genre.includes('Action')).length, color: 'from-red-600 to-rose-700' },
    { name: 'Adventure', count: movies.filter(m => m.genre.includes('Adventure')).length, color: 'from-amber-500 to-orange-600' },
    { name: 'Sci-Fi', count: movies.filter(m => m.genre.includes('Sci-Fi')).length, color: 'from-purple-600 to-indigo-700' },
    { name: 'Drama', count: movies.filter(m => m.genre.includes('Drama')).length, color: 'from-blue-600 to-cyan-700' },
    { name: 'Thriller', count: movies.filter(m => m.genre.includes('Thriller')).length, color: 'from-emerald-600 to-teal-700' },
    { name: 'Biography', count: movies.filter(m => m.genre.includes('Biography')).length, color: 'from-fuchsia-600 to-pink-700' }
  ];

  const staticReviews = [
    {
      name: 'Rohan Deshmukh',
      avatar: 'R',
      movie: 'Interstellar',
      rating: 5,
      comment: 'An absolute cosmic masterpiece. Christopher Nolan makes you feel the gravity of love and time. The backdrop visuals on CineBook detailed view are just brilliant!'
    },
    {
      name: 'Sarah D\'souza',
      avatar: 'S',
      movie: 'Inception',
      rating: 5,
      comment: 'Fascinating concept and outstanding acting. The seat selection process was incredibly fast and the booking was confirmed in seconds.'
    },
    {
      name: 'Karthik Rao',
      avatar: 'K',
      movie: 'RRR',
      rating: 4,
      comment: 'Spectacular action scenes! Rajamouli at his finest. CineBook made selecting IMAX screens simple.'
    }
  ];

  if (loading) return <LoadingSpinner message="Fetching cinema catalog..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMovies} />;

  return (
    <div className="space-y-20 pb-16">
      
      {/* 2. HERO BANNER */}
      {featuredMovie && (
        <section className="relative rounded-3xl overflow-hidden border border-[#292A31] bg-[#0f0f16] min-h-[500px] sm:min-h-[600px] flex items-center shadow-2xl">
          {/* 16:9 Backdrop Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <MovieImage
              src={featuredMovie.backdrop}
              alt={featuredMovie.title}
              title={featuredMovie.title}
              isBackdrop={true}
              className="w-full h-full object-cover opacity-35 scale-105"
            />
            {/* Dark overlays to blend into background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-[#08090D]/65" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl px-6 sm:px-12 py-16 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-[#E50914] text-xs font-black uppercase tracking-wider red-glow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NOW SHOWING</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {featuredMovie.title}
            </h1>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <span className="bg-[#E50914] text-white px-2.5 py-0.5 rounded-full">
                {featuredMovie.language}
              </span>
              <div className="flex items-center space-x-1">
                {featuredMovie.genre && featuredMovie.genre.slice(0, 2).map((g, i) => (
                  <span key={i} className="bg-zinc-900 border border-[#292A31] px-2.5 py-0.5 rounded-full">
                    {g}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-1.5 text-zinc-400">
                <Clock className="w-4 h-4 text-[#E50914]" />
                <span>{featuredMovie.duration}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-zinc-400">
                <Star className="w-4 h-4 text-[#F5B400] fill-[#F5B400]" />
                <span className="text-[#F5B400] font-black">{featuredMovie.rating}</span>
                <span>/ 10</span>
              </div>
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
              {featuredMovie.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to={`/movies/${featuredMovie._id}`}
                className="px-8 py-4 bg-[#E50914] hover:bg-[#b80710] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#E50914]/30 transition-all hover:scale-105 active:scale-95 flex items-center space-x-2.5 red-glow-sm"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
              </Link>

              <Link
                to={`/movies/${featuredMovie._id}`}
                className="px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 text-white border border-[#292A31] font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center space-x-2"
              >
                <Film className="w-4 h-4 text-zinc-400" />
                <span>View Details</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. NOW SHOWING SECTION */}
      {nowShowingMovies.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#292A31] pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-7 bg-[#E50914] rounded-full inline-block shadow-sm shadow-[#E50914]/50" />
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase font-heading">Now Showing</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Catch the latest blockbusters playing in theatres near you</p>
              </div>
            </div>
            <Link
              to="/movies"
              className="text-xs font-black text-[#E50914] hover:text-[#b80710] flex items-center space-x-1.5 uppercase tracking-widest"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nowShowingMovies.slice(0, 4).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* 4. POPULAR MOVIES SECTION */}
      {popularMovies.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#292A31] pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-7 bg-[#F5B400] rounded-full inline-block shadow-sm shadow-[#F5B400]/50" />
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase font-heading">Popular Releases</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Most talked about movies based on audience bookings</p>
              </div>
            </div>
            <Link
              to="/movies?sort=rating"
              className="text-xs font-black text-[#E50914] hover:text-[#b80710] flex items-center space-x-1.5 uppercase tracking-widest"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* 5. TOP RATED SECTION */}
      {topRatedMovies.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#292A31] pb-4">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-[#F5B400] fill-[#F5B400]" />
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase font-heading">Top Rated</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Highest rated blockbusters by verified critics and audiences</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRatedMovies.map((movie) => (
              <div key={movie._id} className="group bg-[#15161D] rounded-2xl overflow-hidden border border-[#292A31] hover:border-[#F5B400]/50 p-4 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div className="flex space-x-4">
                  <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden shrink-0 bg-zinc-950 border border-[#292A31]">
                    <MovieImage src={movie.poster} alt={movie.title} title={movie.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 overflow-hidden">
                    <Link to={`/movies/${movie._id}`}>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors truncate">{movie.title}</h4>
                    </Link>
                    <p className="text-[10px] uppercase font-bold text-zinc-500">{movie.genre.slice(0, 2).join(', ')}</p>
                    <div className="flex items-center space-x-1 text-xs">
                      <Star className="w-3.5 h-3.5 text-[#F5B400] fill-[#F5B400]" />
                      <span className="text-[#F5B400] font-black">{movie.rating}</span>
                      <span className="text-zinc-500 text-[10px]">({movie.numReviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/movies/${movie._id}`}
                  className="w-full text-center py-2 bg-zinc-900 border border-[#292A31] hover:border-[#E50914] text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  View Review Details
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. UPCOMING MOVIES SECTION */}
      {upcomingMovies.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#292A31] pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-7 bg-[#E50914] rounded-full inline-block shadow-sm shadow-[#E50914]/50" />
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase font-heading">Upcoming Movies</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Anticipated hits releasing soon</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingMovies.map((movie) => (
              <div key={movie._id} className="group bg-[#15161D] rounded-2xl overflow-hidden border border-[#292A31] hover:border-[#E50914]/50 transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[2/3] overflow-hidden bg-zinc-950 relative">
                  <MovieImage src={movie.poster} alt={movie.title} title={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15161D] via-transparent to-black/30" />
                  <div className="absolute top-3 left-3 bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                    RELEASING SOON
                  </div>
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-[#15161D]">
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">{movie.title}</h3>
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{movie.genre.slice(0, 2).join(', ')}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-[#292A31] pt-3">
                    <div className="flex items-center space-x-1.5 text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
                      <span>{new Date(movie.releaseDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    </div>
                    <Link
                      to={`/movies/${movie._id}`}
                      className="px-3.5 py-1.5 bg-zinc-900 border border-[#292A31] hover:border-[#E50914] text-zinc-300 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. EXPLORE GENRES */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#292A31] pb-4">
          <span className="w-2 h-7 bg-[#E50914] rounded-full inline-block" />
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase font-heading">Explore Genres</h2>
            <p className="text-xs sm:text-sm text-zinc-400">Filter movies based on your mood and taste</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {genresList.map((g) => (
            <Link
              key={g.name}
              to={`/movies?genre=${g.name}`}
              className="group relative overflow-hidden rounded-2xl border border-[#292A31] bg-[#15161D] p-6 hover:border-[#E50914]/50 hover:shadow-xl hover:shadow-[#E50914]/5 transition-all text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-900 mx-auto flex items-center justify-center border border-[#292A31] group-hover:bg-[#E50914]/10 group-hover:border-[#E50914]/30 transition-colors">
                <Film className="w-5 h-5 text-zinc-400 group-hover:text-[#E50914] transition-colors" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors">{g.name}</h4>
                <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">{g.count} Movie{g.count !== 1 ? 's' : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. WHY CHOOSE CINEBOOK */}
      <section className="bg-[#15161D] border border-[#292A31] rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider font-heading">Why Choose CineBook?</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Engineered to deliver the ultimate cinema booking and rating platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-[#292A31] space-y-3 hover:border-[#E50914]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center border border-[#E50914]/20 shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Instant Ticket Booking</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Book multiplex tickets for standard, IMAX, or 4DX screens instantly. Pick seats in real-time.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-[#292A31] space-y-3 hover:border-[#F5B400]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#F5B400]/10 text-[#F5B400] flex items-center justify-center border border-[#F5B400]/20 shadow-md">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">10-Point Rating System</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Ratings calculated from verified moviegoers, doubling reviews into clear out-of-10 index scores.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-[#292A31] space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Secure Payments & Admin</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Safe user authentication with fully features dashboard panels for theater, screen, and show management.
            </p>
          </div>
        </div>
      </section>

      {/* 9. HOW IT WORKS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider font-heading">How It Works</h2>
          <p className="text-xs sm:text-sm text-zinc-400">Get your ticket in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Choose Movie', desc: 'Browse our list of current or upcoming cinema hits.' },
            { step: '02', title: 'Select Theatre & Show', desc: 'Pick your preferred local multiplex, showtime date, and screen format.' },
            { step: '03', title: 'Pick Seats', desc: 'Choose your desired seats from our real-time reactive seat matrix.' },
            { step: '04', title: 'Get Digital Ticket', desc: 'Confirm booking instantly and get your print-friendly digital ticket code.' }
          ].map((item) => (
            <div key={item.step} className="bg-[#15161D] border border-[#292A31] rounded-2xl p-6 relative overflow-hidden space-y-3 group hover:border-[#E50914]/40 transition-colors">
              <span className="absolute top-2 right-4 text-3xl font-black text-[#E50914]/10 group-hover:text-[#E50914]/20 transition-colors font-heading">{item.step}</span>
              <h4 className="text-base font-bold text-white">{item.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#292A31] pb-4">
          <MessageSquare className="w-5 h-5 text-[#E50914]" />
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase font-heading">What Our Users Say</h2>
            <p className="text-xs sm:text-sm text-zinc-400">Real verified testimonials from movie bookers</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {staticReviews.map((rev, index) => (
            <div key={index} className="bg-[#15161D] border border-[#292A31] rounded-2xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E50914] to-zinc-800 text-white font-black text-xs flex items-center justify-center">
                    {rev.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{rev.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-semibold">Verified Booker</p>
                  </div>
                </div>
                <div className="flex items-center space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-[#F5B400] fill-[#F5B400]' : 'text-zinc-700'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{rev.comment}"
              </p>
              <div className="pt-2 border-t border-[#292A31] flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <span>Movie: {rev.movie}</span>
                <span className="text-emerald-500 flex items-center space-x-1">
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Purchased Ticket</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-r from-[#E50914] via-[#b80710] to-[#E50914] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        {/* Abstract lights background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent)] z-0" />
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-wider font-heading">Experience Cinema in IMAX & 4DX</h2>
          <p className="text-red-100 text-xs sm:text-sm max-w-xl">
            Book tickets in just 30 seconds. Choose screens, select premium leather seats, and watch official movie trailers.
          </p>
        </div>
        <Link
          to="/movies"
          className="relative z-10 px-8 py-4 bg-white hover:bg-zinc-100 text-[#E50914] font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          Book Movie Tickets Now
        </Link>
      </section>

    </div>
  );
};

export default HomePage;
