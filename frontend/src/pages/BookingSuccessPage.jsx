import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import TicketCard from '../components/TicketCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { CheckCircle2, Ticket, Home } from 'lucide-react';

const BookingSuccessPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get(`/bookings/${id}`);
      if (res.success) {
        setBooking(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch booking confirmation');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Generating your cinema ticket..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBooking} />;
  if (!booking) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-[#14141d] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white font-heading">BOOKING CONFIRMED ✓</h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Your seat reservation has been processed successfully. Present this digital ticket at the theatre entrance:
        </p>
      </div>

      {/* Ticket Card Component */}
      <TicketCard booking={booking} />

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 no-print">
        <Link
          to="/my-bookings"
          className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-zinc-800 flex items-center space-x-2 transition-all shadow-md"
        >
          <Ticket className="w-4 h-4 text-red-500" />
          <span>View My Bookings</span>
        </Link>
        <Link
          to="/"
          className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccessPage;

