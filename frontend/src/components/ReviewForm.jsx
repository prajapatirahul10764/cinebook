import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import { Send } from 'lucide-react';

const ReviewForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [rating, setRating] = useState(initialData ? initialData.rating : 5);
  const [comment, setComment] = useState(initialData ? initialData.comment : '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating);
      setComment(initialData.comment);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Review comment cannot be empty.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a star rating.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({ rating, comment: comment.trim() });
      if (!initialData) {
        setComment('');
        setRating(5);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#14141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white font-heading">
          {initialData ? 'Edit Your Review' : 'Write an Audience Review'}
        </h3>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-2">Your Rating</label>
        <RatingStars rating={rating} interactive={true} onRatingChange={setRating} size="w-6 h-6" showScore />
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-2">Your Review Comments</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of the story, acting, direction, and music?"
          className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600 text-sm font-medium transition-all"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Submitting...' : initialData ? 'Update Review' : 'Post Review'}</span>
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;

