import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import { Film, Plus, Edit2, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import MovieImage from '../../components/MovieImage';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: '2h 15m',
    releaseDate: new Date().toISOString().split('T')[0],
    poster: '',
    backdrop: '',
    trailerUrl: '',
    director: '',
    cast: '',
    certification: 'UA',
    status: ['NOW_SHOWING'],
    featured: false,
    rating: 8.0
  });

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

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      description: '',
      genre: 'Action, Sci-Fi',
      language: 'English',
      duration: '2h 15m',
      releaseDate: new Date().toISOString().split('T')[0],
      poster: '',
      backdrop: '',
      trailerUrl: '',
      director: '',
      cast: '',
      certification: 'UA',
      status: ['NOW_SHOWING'],
      featured: false,
      rating: 8.0
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      description: movie.description || '',
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || '',
      language: movie.language || 'English',
      duration: movie.duration || '2h 15m',
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
      poster: movie.poster || '',
      backdrop: movie.backdrop || '',
      trailerUrl: movie.trailerUrl || movie.trailer || '',
      director: movie.director || '',
      cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast || '',
      certification: movie.certification || 'UA',
      status: Array.isArray(movie.status) ? movie.status : ['NOW_SHOWING'],
      featured: movie.featured === true,
      rating: movie.rating || 8.0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccessMsg('');

      const submissionData = {
        ...formData,
        rating: Number(formData.rating)
      };

      if (editingMovie) {
        const res = await API.put(`/movies/${editingMovie._id}`, submissionData);
        if (res.success) {
          setSuccessMsg('Movie updated successfully.');
          setIsModalOpen(false);
          fetchMovies();
        }
      } else {
        const res = await API.post('/movies', submissionData);
        if (res.success) {
          setSuccessMsg('Movie added successfully.');
          setIsModalOpen(false);
          fetchMovies();
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save movie');
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const res = await API.delete(`/movies/${movieId}`);
        if (res.success) {
          setSuccessMsg('Movie deleted successfully.');
          fetchMovies();
        }
      } catch (err) {
        alert(err.message || 'Failed to delete movie');
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#292A31] pb-6">
        <div className="flex items-center space-x-3">
          <Link to="/admin" className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-[#292A31] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase font-heading">
              Movie Catalog
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">Add, edit, or delete cinema release titles</p>
          </div>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#E50914]/30 flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Movie</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-2xl text-xs flex items-center space-x-2 font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Movies Data Table */}
      {loading ? (
        <LoadingSpinner message="Fetching movie catalog..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchMovies} />
      ) : (
        <div className="bg-[#15161D] border border-[#292A31] rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-black tracking-widest border-b border-[#292A31]">
                <tr>
                  <th className="py-4.5 px-6">Movie</th>
                  <th className="py-4.5 px-6">Genre</th>
                  <th className="py-4.5 px-6">Language</th>
                  <th className="py-4.5 px-6">Duration</th>
                  <th className="py-4.5 px-6">Rating</th>
                  <th className="py-4.5 px-6">Status Categories</th>
                  <th className="py-4.5 px-6 text-right font-heading">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292A31] font-medium text-xs">
                {movies.map((m) => (
                  <tr key={m._id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-white flex items-center space-x-3">
                      <div className="w-10 h-14 shrink-0 bg-zinc-950 border border-[#292A31] rounded-lg overflow-hidden">
                        <MovieImage src={m.poster} alt={m.title} title={m.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm sm:text-base leading-tight">{m.title}</p>
                        <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">{new Date(m.releaseDate).getFullYear()} • {m.certification || 'UA'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-400">
                      {Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}
                    </td>
                    <td className="py-4 px-6 font-black text-[#E50914] uppercase tracking-wider">{m.language}</td>
                    <td className="py-4 px-6 text-zinc-400 font-bold">{m.duration}</td>
                    <td className="py-4 px-6 font-black text-[#F5B400]">★ {m.rating ? Number(m.rating).toFixed(1) : 'N/A'}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {m.status && m.status.map(s => (
                          <span key={s} className="bg-zinc-900 text-zinc-400 border border-[#292A31] text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                            {s.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(m)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg border border-transparent hover:border-[#292A31] transition-all cursor-pointer"
                        title="Edit Movie"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="p-2 text-zinc-400 hover:text-[#E50914] hover:bg-zinc-900 rounded-lg border border-transparent hover:border-[#292A31] transition-all cursor-pointer"
                        title="Delete Movie"
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

      {/* Add / Edit Movie Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMovie ? 'Edit Movie Details' : 'Add New Movie'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Language *</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder="English"
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Description *</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Genre (comma-separated) *</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="Action, Sci-Fi"
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Director</label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                placeholder="Christopher Nolan"
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Cast (comma-separated)</label>
            <input
              type="text"
              value={formData.cast}
              onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
              placeholder="Leonardo DiCaprio, Tom Hardy"
              className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Duration (e.g. 2h 49m) *</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="2h 49m"
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Release Date *</label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Certification</label>
              <select
                value={formData.certification}
                onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold cursor-pointer"
              >
                <option value="U">U (General)</option>
                <option value="UA">UA (Parental Guidance)</option>
                <option value="A">A (Adults Only)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Poster Image URL *</label>
              <input
                type="url"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                placeholder="https://..."
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Backdrop Image URL (16:9)</label>
              <input
                type="url"
                value={formData.backdrop}
                onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                placeholder="https://..."
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Trailer YouTube URL</label>
              <input
                type="url"
                value={formData.trailerUrl}
                onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 font-heading">Seeded Rating (out of 10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                placeholder="8.5"
                className="w-full bg-zinc-900 border border-[#292A31] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50914] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5 font-heading">Status / Categories</label>
            <div className="flex flex-wrap gap-4 bg-zinc-950 p-3 rounded-xl border border-[#292A31]">
              {['NOW_SHOWING', 'UPCOMING', 'POPULAR', 'TOP_RATED', 'FEATURED'].map((cat) => {
                const isChecked = formData.status.includes(cat);
                return (
                  <label key={cat} className="flex items-center space-x-2 text-xs font-bold text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        let newStatusList = [...formData.status];
                        if (e.target.checked) {
                          newStatusList.push(cat);
                        } else {
                          newStatusList = newStatusList.filter(s => s !== cat);
                        }
                        setFormData({ ...formData, status: newStatusList });
                      }}
                      className="accent-[#E50914] cursor-pointer"
                    />
                    <span>{cat.replace('_', ' ')}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="accent-[#E50914] cursor-pointer"
            />
            <label htmlFor="featured" className="text-xs font-semibold text-[#A1A1AA] cursor-pointer">
              Mark as Featured Banner Movie
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#292A31]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#E50914]/30 transition-all cursor-pointer"
            >
              {editingMovie ? 'Save Changes' : 'Create Movie'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMovies;
