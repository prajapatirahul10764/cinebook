import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import RatingStars from '../../components/RatingStars';
import { MessageSquare, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/admin/reviews');
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Admin moderation: Delete this review?')) {
      try {
        const res = await API.delete(`/reviews/${id}`);
        if (res.success) {
          setSuccessMsg('Review deleted and movie average rating updated.');
          fetchReviews();
        }
      } catch (err) {
        alert(err.message || 'Failed to delete review');
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center space-x-3 border-b border-zinc-800/80 pb-6">
        <Link to="/admin" className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">Review Moderation</h1>
          <p className="text-sm text-zinc-400 font-normal">Monitor and delete inappropriate or spam audience reviews</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-2xl flex items-center space-x-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Fetching review listings..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchReviews} />
      ) : (
        <div className="bg-[#14141d] border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs font-semibold tracking-wider border-b border-zinc-800/80">
                <tr>
                  <th className="py-4.5 px-6">Movie</th>
                  <th className="py-4.5 px-6">Author</th>
                  <th className="py-4.5 px-6">Rating</th>
                  <th className="py-4.5 px-6">Comment</th>
                  <th className="py-4.5 px-6">Date</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-medium">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-white flex items-center space-x-3">
                      <img src={r.movie?.poster} alt={r.movie?.title} className="w-8 h-12 object-cover rounded-lg border border-zinc-800 shrink-0 shadow-md" />
                      <span className="font-heading">{r.movie?.title || 'Unknown Movie'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-white font-heading">{r.user?.name || 'Deleted User'}</p>
                      <p className="text-[10px] text-zinc-500">{r.user?.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <RatingStars rating={r.rating} size="w-3.5 h-3.5" showScore />
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-zinc-300">
                      "{r.comment}"
                    </td>
                    <td className="py-4 px-6 text-zinc-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Delete Review"
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
    </div>
  );
};

export default AdminReviews;
