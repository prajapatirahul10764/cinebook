import React from 'react';
import RatingStars from './RatingStars';
import { User, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user && (user._id === review.user?._id || user._id === review.user);
  const isAdmin = user && user.role === 'admin';
  const canModify = isOwner || isAdmin;

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <div className="bg-[#14141d] border border-zinc-800/80 rounded-2xl p-5 space-y-3 relative group hover:border-zinc-700/80 transition-all shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-zinc-900 border border-red-500/40 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {review.user?.name ? review.user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-base font-semibold text-white">
                {review.user?.name || 'Verified Moviegoer'}
              </h4>
              <CheckCircle2 className="w-4 h-4 text-red-500" title="Verified Audience" />
            </div>
            <span className="text-sm text-zinc-400">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <RatingStars rating={review.rating} size="w-4 h-4" showScore />

          {canModify && (
            <div className="flex items-center space-x-1 pl-2">
              {isOwner && onEdit && (
                <button
                  onClick={() => onEdit(review)}
                  title="Edit Review"
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(review._id)}
                  title="Delete Review"
                  className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-base text-zinc-300 leading-relaxed pt-1 font-normal">
        "{review.comment}"
      </p>
    </div>
  );
};

export default ReviewCard;

