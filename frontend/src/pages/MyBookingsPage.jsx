import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TicketCard from '../components/TicketCard';
import Modal from '../components/Modal';
import { Ticket, Calendar, MapPin, Eye, XCircle } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/bookings/my');
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? Reserved seats will be released.')) {
      try {
        const res = await API.put(`/bookings/${bookingId}/cancel`);
        if (res.success) {
          fetchMyBookings();
        }
      } catch (err) {
        alert(err.message || 'Failed to cancel booking');
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading your ticket history..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMyBookings} />;

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-zinc-800/80 pb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          My Ticket Bookings
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 mt-1 font-normal">
          View your active movie reservations, print tickets, or cancel upcoming bookings.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-[#14141d] border border-zinc-800/80 rounded-3xl p-12 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-red-500 shadow-inner">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-heading">You have no bookings yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Ready for movie night? Explore our currently running movies and reserve your preferred seats.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-[#14141d] border border-zinc-800/80 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-zinc-700/80 transition-all shadow-xl"
            >
              {/* Left Details */}
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <img
                  src={b.movie?.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'}
                  alt={b.movie?.title}
                  className="w-16 h-24 object-cover rounded-2xl border border-zinc-800 shrink-0 shadow-md"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-red-500">
                      Ref: {b.bookingReference}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-heading">{b.movie?.title}</h3>

                  <div className="flex flex-wrap gap-4 text-xs text-zinc-400 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{b.theatre?.name}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-red-500" />
                      <span>{b.show?.date} at {b.show?.time}</span>
                    </span>
                  </div>

                  <div className="text-xs text-zinc-300 font-medium pt-1">
                    Seats: <span className="text-white font-bold">{b.seats?.join(', ')}</span> | Total Paid: <span className="text-red-500 font-bold font-heading">₹{b.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center space-x-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-zinc-800/80">
                <button
                  onClick={() => setSelectedTicket(b)}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-colors border border-zinc-800"
                >
                  <Eye className="w-4 h-4 text-red-500" />
                  <span>View Ticket</span>
                </button>

                {b.status === 'Confirmed' && (
                  <button
                    onClick={() => handleCancelBooking(b._id)}
                    className="px-4 py-2.5 bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600/20 text-xs font-bold rounded-xl flex items-center space-x-2 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Booking</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket Details (${selectedTicket.bookingReference})`}
        >
          <TicketCard booking={selectedTicket} />
        </Modal>
      )}
    </div>
  );
};

export default MyBookingsPage;

