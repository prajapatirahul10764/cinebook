import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, maxRating = 5, interactive = false, onRatingChange, size = 'w-5 h-5', showScore = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${
              interactive ? 'cursor-pointer transform hover:scale-125 transition-transform' : 'cursor-default'
            } focus:outline-none p-0.5`}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={`${size} ${
                isFilled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-zinc-700 fill-zinc-800/80'
              } transition-all duration-150`}
            />
          </button>
        );
      })}
      {showScore && (
        <span className="text-sm font-bold text-amber-400 ml-1.5 font-heading">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;

