import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import SeatGrid from '../components/SeatGrid';
import BookingSummary from '../components/BookingSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const BookingPage = () => {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const showId = searchParams.get('showId');
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (!showId) {
      setError('No showtime selected. Please go back and select a showtime.');
      setLoading(false);
      return;
    }
    fetchShowData();
  }, [showId]);

  const fetchShowData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get(`/shows/${showId}`);
      if (res.success) {
        setShow(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load show details');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatCode) => {
    setBookingError('');
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) return;

    try {
      setBookingLoading(true);
      setBookingError('');

      const res = await API.post('/bookings', {
        showId: show._id,
        seats: selectedSeats
      });

      if (res.success && res.data) {
        navigate(`/booking/success/${res.data._id}`);
      }
    } catch (err) {
      setBookingError(err.message || 'One or more selected seats are no longer available. Please select different seats.');
      // Refresh seat status from backend
      fetchShowData();
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading interactive seat layout..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchShowData} />;
  if (!show) return null;

  return (
    <div className="space-y-8 pb-16">
      {/* Header back button */}
      <div className="flex items-center space-x-4 border-b border-zinc-800/80 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white">{show.movie?.title}</h1>
          <p className="text-sm text-zinc-400 font-normal mt-0.5">
            {show.theatre?.name} ({show.theatre?.city}) • <span className="text-red-500 font-semibold">{show.date} at {show.time}</span> • {show.screen}
          </p>
        </div>
      </div>

      {/* Booking error alert */}
      {bookingError && (
        <div className="bg-red-600/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center space-x-3 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{bookingError}</span>
        </div>
      )}

      {/* Main Grid & Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Visual Seat Matrix */}
        <div className="lg:col-span-2">
          <SeatGrid
            bookedSeats={show.bookedSeats || []}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
          />
        </div>

        {/* Real-time Order Summary */}
        <div className="lg:col-span-1">
          <BookingSummary
            movie={show.movie}
            theatre={show.theatre}
            show={show}
            selectedSeats={selectedSeats}
            onConfirm={handleConfirmBooking}
            loading={bookingLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

