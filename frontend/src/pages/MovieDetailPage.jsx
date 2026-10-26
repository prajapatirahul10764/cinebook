import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import MovieImage from '../components/MovieImage';
import { Star, Clock, Calendar, Ticket, MapPin, Play, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Show Selector State
  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowId, setSelectedShowId] = useState('');

  // Edit Review Modal State
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchMovieData();
  }, [id]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      setError('');

      const [movieRes, showsRes, reviewsRes] = await Promise.all([
        API.get(`/movies/${id}`),
        API.get(`/shows?movie=${id}`),
        API.get(`/movies/${id}/reviews`)
      ]);

      if (movieRes.success) {
        setMovie(movieRes.data);
      }
      if (showsRes.success) {
        setShows(showsRes.data);
        // Pre-select first theatre and date if available
        if (showsRes.data.length > 0) {
          const firstShow = showsRes.data[0];
          setSelectedTheatreId(firstShow.theatre?._id || '');
          setSelectedDate(firstShow.date || '');
          setSelectedShowId(firstShow._id);
        }
      }
      if (reviewsRes.success) {
        setReviews(reviewsRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  // Handle Review Actions
  const handleAddReview = async (reviewData) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const res = await API.post(`/movies/${id}/reviews`, reviewData);
    if (res.success) {
      await fetchMovieData();
    }
  };

  const handleUpdateReview = async (reviewData) => {
    if (!editingReview) return;
    const res = await API.put(`/reviews/${editingReview._id}`, reviewData);
    if (res.success) {
      setEditingReview(null);
      await fetchMovieData();
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const res = await API.delete(`/reviews/${reviewId}`);
      if (res.success) {
        await fetchMovieData();
      }
    }
  };

  // Handle Proceed to Booking
  const handleProceedToBooking = () => {
    if (!selectedShowId) {
      alert('Please select a showtime first');
      return;
    }
    if (!user) {
      navigate('/login', { state: { from: `/booking/${id}?showId=${selectedShowId}` } });
    } else {
      navigate(`/booking/${id}?showId=${selectedShowId}`);
    }
  };

  if (loading) return <LoadingSpinner message="Loading movie details, trailer & showtimes..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMovieData} />;
  if (!movie) return null;

  // Filter shows by selected theatre and date
  const uniqueTheatres = Array.from(
    new Map(shows.map(s => [s.theatre?._id, s.theatre])).values()
  ).filter(Boolean);

  const availableDates = Array.from(
    new Set(
      shows
        .filter(s => !selectedTheatreId || s.theatre?._id === selectedTheatreId)
        .map(s => s.date)
    )
  );

  const filteredShows = shows.filter(
    s =>
      (!selectedTheatreId || s.theatre?._id === selectedTheatreId) &&
      (!selectedDate || s.date === selectedDate)
  );

  const trailerEmbedUrl = getYouTubeEmbedUrl(movie.trailerUrl || movie.trailer);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Movie Hero Banner with Large Backdrop */}
      <div className="relative rounded-3xl overflow-hidden border border-[#292A31] bg-[#15161D] shadow-2xl">
        
        {/* Backdrop background */}
        <div className="absolute inset-0 h-[280px] sm:h-[350px] z-0 overflow-hidden">
          <MovieImage
            src={movie.backdrop}
            alt={movie.title}
            title={movie.title}
            isBackdrop={true}
            className="w-full h-full object-cover opacity-25 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15161D] via-[#15161D]/75 to-transparent" />
        </div>

        {/* Info Layout */}
        <div className="relative z-10 pt-[160px] sm:pt-[220px] px-6 sm:px-10 pb-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {/* Poster Card */}
          <div className="md:col-span-1 aspect-[2/3] max-w-xs mx-auto w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#292A31] bg-zinc-950">
            <MovieImage
              src={movie.poster}
              alt={movie.title}
              title={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Metadata & Title */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#E50914] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                {movie.language}
              </span>
              <span className="bg-[#F5B400] text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                {movie.certification || 'UA'}
              </span>
              {movie.genre && movie.genre.map((g, i) => (
                <span key={i} className="bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#292A31]">
                  {g}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-heading">
              {movie.title}
            </h1>

            {/* Metrics Bar */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-zinc-400 py-3 border-y border-[#292A31]">
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4 text-[#F5B400] fill-[#F5B400]" />
                <span className="font-black text-white text-sm">
                  {movie.rating ? Number(movie.rating).toFixed(1) : 'N/A'}
                </span>
                <span className="text-[10px] text-zinc-500 font-semibold">({movie.numReviews || 0} reviews)</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#E50914]" />
                <span>{movie.duration}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-[#E50914]" />
                <span>Released: {new Date(movie.releaseDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
              </div>
            </div>

            {/* Director & Cast Metadata */}
            <div className="space-y-1.5 text-xs">
              <p className="text-zinc-400">
                <span className="font-bold uppercase tracking-wider text-zinc-500 mr-2">Director:</span>
                <span className="text-white font-semibold">{movie.director || 'Christopher Nolan'}</span>
              </p>
              {movie.cast && movie.cast.length > 0 && (
                <p className="text-zinc-400">
                  <span className="font-bold uppercase tracking-wider text-zinc-500 mr-2">Cast:</span>
                  <span className="text-white font-medium">{movie.cast.join(', ')}</span>
                </p>
              )}
            </div>

            {/* Synopsis Description */}
            <p className="text-sm text-zinc-300 leading-relaxed font-normal">
              {movie.description}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#showtimes-section"
                className="px-8 py-3.5 bg-[#E50914] hover:bg-[#b80710] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#E50914]/30 transition-all hover:scale-105 flex items-center space-x-2.5 red-glow-sm"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Show Tickets</span>
              </a>

              {trailerEmbedUrl && (
                <a
                  href="#trailer-section"
                  className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-[#292A31] font-black text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all flex items-center space-x-2"
                >
                  <Play className="w-4 h-4 text-[#E50914] fill-[#E50914]" />
                  <span>Watch Trailer</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Ticket Booking Section */}
      <div id="showtimes-section" className="bg-[#15161D] border border-[#292A31] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#292A31] pb-4">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-7 bg-[#E50914] rounded-full inline-block shadow-sm shadow-[#E50914]/50" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase font-heading">
              Select Theatre & Showtime
            </h2>
          </div>
        </div>

        {shows.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 space-y-2 bg-zinc-900/40 rounded-2xl border border-[#292A31]">
            <p className="font-bold text-base text-white font-heading">No shows available for this movie yet.</p>
            <p className="text-xs text-zinc-500">Please check back later or browse another title.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Theatre Filters */}
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5 font-heading">
                1. Select Theatre
              </label>
              <div className="flex flex-wrap gap-3">
                {uniqueTheatres.map((t) => (
                  <button
                    key={t._id}
                    onClick={() => {
                      setSelectedTheatreId(t._id);
                      setSelectedShowId('');
                    }}
                    className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 border cursor-pointer ${
                      selectedTheatreId === t._id
                        ? 'bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-[#E50914]/30 scale-102 red-glow-sm'
                        : 'bg-zinc-900 border-[#292A31] text-zinc-300 hover:border-[#E50914]/40 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{t.name} ({t.city})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filters */}
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5 font-heading">
                2. Select Date
              </label>
              <div className="flex flex-wrap gap-3">
                {availableDates.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedShowId('');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedDate === d
                        ? 'bg-[#F5B400] border-[#F5B400] text-zinc-950 shadow-md font-extrabold scale-102'
                        : 'bg-zinc-900 border-[#292A31] text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Showtimes Grid */}
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5 font-heading">
                3. Select Timing & Price
              </label>
              {filteredShows.length === 0 ? (
                <p className="text-xs text-[#F5B400] italic">No showtimes match your current theatre/date selection.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {filteredShows.map((show) => (
                    <button
                      key={show._id}
                      onClick={() => setSelectedShowId(show._id)}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 cursor-pointer ${
                        selectedShowId === show._id
                          ? 'bg-[#E50914]/10 border-[#E50914] text-white ring-1 ring-[#E50914] shadow-lg shadow-[#E50914]/10'
                          : 'bg-zinc-900 border-[#292A31] text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      <div className="text-lg font-black text-white font-heading">{show.time}</div>
                      <div className="text-[11px] text-zinc-400">{show.screen}</div>
                      <div className="text-xs font-black text-[#E50914]">₹{show.price} / ticket</div>
                      <div className="text-[10px] text-emerald-500 pt-0.5 font-bold uppercase tracking-wider">
                        {show.availableSeats} seats left
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Proceed Action */}
            <div className="pt-4 flex justify-end">
              <button
                disabled={!selectedShowId}
                onClick={handleProceedToBooking}
                className="px-8 py-4 bg-[#E50914] hover:bg-[#b80710] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#E50914]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                PROCEED TO SEAT SELECTION →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trailer Section */}
      <div id="trailer-section" className="bg-[#15161D] border border-[#292A31] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2.5 font-heading uppercase tracking-wide">
          <Play className="w-4 h-4 text-[#E50914] fill-[#E50914]" />
          <span>Official Trailer</span>
        </h2>
        {trailerEmbedUrl ? (
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#292A31] shadow-2xl bg-zinc-950">
            <iframe
              src={trailerEmbedUrl}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
        ) : (
          <div className="bg-zinc-900/40 rounded-2xl p-8 text-center text-zinc-400 text-sm border border-[#292A31] flex flex-col items-center justify-center space-y-2">
            <AlertCircle className="w-8 h-8 text-zinc-700" />
            <p className="font-semibold text-zinc-500">Official video trailer unavailable for this movie.</p>
          </div>
        )}
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-[#15161D] border border-[#292A31] rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#292A31] pb-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wide">
              Audience Reviews ({reviews.length})
            </h2>
          </div>
          <div className="flex items-center space-x-2 bg-zinc-900 px-3.5 py-1.5 rounded-full border border-[#292A31]">
            <Star className="w-4 h-4 text-[#F5B400] fill-[#F5B400]" />
            <span className="text-xs font-black text-white font-heading">
              {movie.rating ? Number(movie.rating).toFixed(1) : 'N/A'} / 10
            </span>
          </div>
        </div>

        {/* Add Review Form for logged in users */}
        {user ? (
          <ReviewForm onSubmit={handleAddReview} />
        ) : (
          <div className="bg-zinc-900/60 border border-[#292A31] rounded-2xl p-4 text-center text-xs text-zinc-400">
            <span>Want to submit an audience review? </span>
            <Link to="/login" className="text-[#E50914] font-bold hover:underline ml-1">
              Login to write a review
            </Link>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">No audience reviews yet. Be the first to leave a review!</p>
          ) : (
            reviews.map((r) => (
              <ReviewCard
                key={r._id}
                review={r}
                onEdit={(rev) => setEditingReview(rev)}
                onDelete={handleDeleteReview}
              />
            ))
          )}
        </div>
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <Modal
          isOpen={Boolean(editingReview)}
          onClose={() => setEditingReview(null)}
          title="Edit Review"
        >
          <ReviewForm
            initialData={editingReview}
            onSubmit={handleUpdateReview}
            onCancel={() => setEditingReview(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default MovieDetailPage;
