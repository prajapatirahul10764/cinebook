import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import { Calendar, Plus, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    movie: '',
    theatre: '',
    screen: 'Screen 1',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    price: 250,
    totalSeats: 32
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        API.get('/shows'),
        API.get('/movies'),
        API.get('/theatres')
      ]);

      if (showsRes.success) setShows(showsRes.data);
      if (moviesRes.success) setMovies(moviesRes.data);
      if (theatresRes.success) setTheatres(theatresRes.data);

      if (moviesRes.data.length > 0) setFormData(prev => ({ ...prev, movie: moviesRes.data[0]._id }));
      if (theatresRes.data.length > 0) setFormData(prev => ({ ...prev, theatre: theatresRes.data[0]._id }));
    } catch (err) {
      setError(err.message || 'Failed to load show schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccessMsg('');

      const res = await API.post('/shows', formData);
      if (res.success) {
        setSuccessMsg('Show scheduled successfully.');
        setIsModalOpen(false);
        fetchInitialData();
      }
    } catch (err) {
      setError(err.message || 'Failed to schedule show');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel and delete this show schedule?')) {
      try {
        const res = await API.delete(`/shows/${id}`);
        if (res.success) {
          setSuccessMsg('Show deleted successfully.');
          fetchInitialData();
        }
      } catch (err) {
        alert(err.message || 'Failed to delete show');
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div className="flex items-center space-x-3">
          <Link to="/admin" className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">Show Scheduling</h1>
            <p className="text-sm text-zinc-400 font-normal">Map movies to theatre screens, dates, timings & ticket prices</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all hover:scale-105 red-glow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Show</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-2xl flex items-center space-x-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Fetching show schedules..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchInitialData} />
      ) : (
        <div className="bg-[#14141d] border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs font-semibold tracking-wider border-b border-zinc-800/80">
                <tr>
                  <th className="py-4.5 px-6">Movie</th>
                  <th className="py-4.5 px-6">Theatre</th>
                  <th className="py-4.5 px-6">Screen</th>
                  <th className="py-4.5 px-6">Date & Time</th>
                  <th className="py-4.5 px-6">Ticket Price</th>
                  <th className="py-4.5 px-6">Available Seats</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-normal">
                {shows.map((s) => (
                  <tr key={s._id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">
                      {s.movie?.title || 'Unknown Movie'}
                    </td>
                    <td className="py-4 px-6">{s.theatre?.name || 'Unknown Theatre'}</td>
                    <td className="py-4 px-6 font-mono text-zinc-400">{s.screen}</td>
                    <td className="py-4 px-6 font-bold text-red-500">
                      {s.date} at {s.time}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">₹{s.price}</td>
                    <td className="py-4 px-6 text-emerald-400 font-bold">
                      {s.availableSeats} / {s.totalSeats}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Delete Show"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Show Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Movie Show"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Select Movie *</label>
            <select
              value={formData.movie}
              onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
              required
            >
              {movies.map(m => (
                <option key={m._id} value={m._id}>{m.title} ({m.language})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Select Theatre *</label>
            <select
              value={formData.theatre}
              onChange={(e) => setFormData({ ...formData, theatre: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
              required
            >
              {theatres.map(t => (
                <option key={t._id} value={t._id}>{t.name} - {t.city}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Screen Name *</label>
              <input
                type="text"
                value={formData.screen}
                onChange={(e) => setFormData({ ...formData, screen: e.target.value })}
                placeholder="Screen 1 (IMAX)"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Ticket Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Show Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Show Time *</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="18:30"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all"
            >
              Confirm Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminShows;
