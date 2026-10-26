import React from 'react';
import MovieCard from './MovieCard';
import { Film } from 'lucide-react';

const MovieGrid = ({ movies, title, subtitle }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#14141d]/60 rounded-3xl border border-zinc-800/80 my-8">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 mb-4 shadow-inner">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white font-heading">No movies found</h3>
        <p className="text-sm text-zinc-400 max-w-md mt-2 leading-relaxed">
          We couldn't find any movies matching your current filters or search query. Try resetting your search or filter settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-7 bg-red-600 rounded-full inline-block shadow-sm shadow-red-600/50" />
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-wide font-heading">
                {title}
              </h2>
              {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Grid: 1 col on mobile, 2 on tablet, 3-4 on desktop, 5 on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;

