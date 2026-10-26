import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import { Building2, Plus, Edit2, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const AdminTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    screensInput: 'Screen 1, Screen 2'
  });

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/theatres');
      if (res.success) {
        setTheatres(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load theatres');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTheatre(null);
    setFormData({
      name: '',
      location: '',
      city: '',
      screensInput: 'Screen 1 (IMAX), Screen 2 (Gold)'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (theatre) => {
    setEditingTheatre(theatre);
    const screensText = theatre.screens
      ? theatre.screens.map(s => s.screenName).join(', ')
      : '';
    setFormData({
      name: theatre.name || '',
      location: theatre.location || '',
      city: theatre.city || '',
      screensInput: screensText
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccessMsg('');

      const screensArray = formData.screensInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => ({ screenName: s, totalSeats: 32 }));

      const payload = {
        name: formData.name,
        location: formData.location,
        city: formData.city,
        screens: screensArray
      };

      if (editingTheatre) {
        const res = await API.put(`/theatres/${editingTheatre._id}`, payload);
        if (res.success) {
          setSuccessMsg('Theatre updated successfully.');
          setIsModalOpen(false);
          fetchTheatres();
        }
      } else {
        const res = await API.post('/theatres', payload);
        if (res.success) {
          setSuccessMsg('Theatre added successfully.');
          setIsModalOpen(false);
          fetchTheatres();
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save theatre');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this theatre?')) {
      try {
        const res = await API.delete(`/theatres/${id}`);
        if (res.success) {
          setSuccessMsg('Theatre deleted successfully.');
          fetchTheatres();
        }
      } catch (err) {
        alert(err.message || 'Failed to delete theatre');
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">Theatre Management</h1>
            <p className="text-sm text-zinc-400 font-normal">Add, edit, or delete cinema locations and screens</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all hover:scale-105 red-glow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Theatre</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-2xl flex items-center space-x-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Fetching theatres..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchTheatres} />
      ) : (
        <div className="bg-[#14141d] border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs font-semibold tracking-wider border-b border-zinc-800/80">
                <tr>
                  <th className="py-4.5 px-6">Theatre Name</th>
                  <th className="py-4.5 px-6">Location</th>
                  <th className="py-4.5 px-6">City</th>
                  <th className="py-4.5 px-6">Screens</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-medium">
                {theatres.map((t) => (
                  <tr key={t._id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-white flex items-center space-x-2.5">
                      <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-heading">{t.name}</span>
                    </td>
                    <td className="py-4 px-6">{t.location}</td>
                    <td className="py-4 px-6 font-bold text-red-500">{t.city}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {t.screens?.map((s, idx) => (
                          <span key={idx} className="bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 px-2 py-0.5 rounded text-[11px] font-medium">
                            {s.screenName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(t)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit Theatre"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Delete Theatre"
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

      {/* Add / Edit Theatre Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTheatre ? 'Edit Theatre' : 'Add New Theatre'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Theatre Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. PVR ICON Infiniti Mall"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Andheri West"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Screen Names (comma-separated) *
            </label>
            <input
              type="text"
              value={formData.screensInput}
              onChange={(e) => setFormData({ ...formData, screensInput: e.target.value })}
              placeholder="Screen 1 (IMAX), Screen 2 (Gold)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-600 font-medium"
              required
            />
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
              {editingTheatre ? 'Save Changes' : 'Create Theatre'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTheatres;
