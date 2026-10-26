import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import TicketCard from '../../components/TicketCard';
import Modal from '../../components/Modal';
import { Ticket, Search, Eye, XCircle, ArrowLeft } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/bookings/all');
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Admin action: Are you sure you want to cancel this booking?')) {
      try {
        const res = await API.put(`/bookings/${id}/cancel`);
        if (res.success) {
          fetchAllBookings();
        }
      } catch (err) {
        alert(err.message || 'Failed to cancel booking');
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    const q = search.toLowerCase();
    return (
      (b.bookingReference && b.bookingReference.toLowerCase().includes(q)) ||
      (b.user?.name && b.user.name.toLowerCase().includes(q)) ||
      (b.user?.email && b.user.email.toLowerCase().includes(q)) ||
      (b.movie?.title && b.movie.title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div className="flex items-center space-x-3">
          <Link to="/admin" className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">All Customer Bookings</h1>
            <p className="text-sm text-zinc-400 font-normal">View and audit all ticket reservations across the platform</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ref, customer or movie..."
            className="w-full bg-zinc-900 text-zinc-100 text-sm pl-9 pr-3 py-2.5 rounded-full border border-zinc-800 focus:outline-none focus:border-red-600 font-normal"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching customer bookings..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchAllBookings} />
      ) : (
        <div className="bg-[#14141d] border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs font-semibold tracking-wider border-b border-zinc-800/80">
                <tr>
                  <th className="py-4.5 px-6">Reference</th>
                  <th className="py-4.5 px-6">Customer</th>
                  <th className="py-4.5 px-6">Movie</th>
                  <th className="py-4.5 px-6">Theatre</th>
                  <th className="py-4.5 px-6">Seats</th>
                  <th className="py-4.5 px-6">Total Paid</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-normal">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-red-500">{b.bookingReference}</td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-white">{b.user?.name || 'Deleted User'}</p>
                      <p className="text-xs text-zinc-400 font-normal">{b.user?.email}</p>
                    </td>
                    <td className="py-4 px-6 font-bold text-white">{b.movie?.title}</td>
                    <td className="py-4 px-6">{b.theatre?.name} ({b.theatre?.city})</td>
                    <td className="py-4 px-6 font-bold text-emerald-400">{b.seats?.join(', ')}</td>
                    <td className="py-4 px-6 font-black text-white font-heading">₹{b.totalAmount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedTicket(b)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        title="View Ticket"
                      >
                        <Eye className="w-4 h-4 text-red-500" />
                      </button>
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => handleCancel(b._id)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket Preview (${selectedTicket.bookingReference})`}
        >
          <TicketCard booking={selectedTicket} />
        </Modal>
      )}
    </div>
  );
};

export default AdminBookings;
