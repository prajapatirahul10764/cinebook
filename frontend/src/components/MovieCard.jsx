import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';
import MovieImage from './MovieImage';

const MovieCard = ({ movie }) => {
  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : '';

  return (
    <div className="group bg-[#15161D] rounded-2xl overflow-hidden border border-[#292A31] hover:border-[#E50914]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#E50914]/10 flex flex-col h-full relative">
      {/* Poster Container with 2:3 aspect ratio */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-950">
        <MovieImage
          src={movie.poster}
          alt={movie.title}
          title={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient shadow overlay at top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#15161D] via-transparent to-black/40 opacity-90" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#F5B400]/30 flex items-center space-x-1 shadow-md">
          <Star className="w-3.5 h-3.5 text-[#F5B400] fill-[#F5B400]" />
          <span className="text-xs font-black text-[#F5B400]">
            {movie.rating ? Number(movie.rating).toFixed(1) : 'N/A'}
          </span>
        </div>

        {/* Language Badge */}
        {movie.language && (
          <div className="absolute top-3 left-3 bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
            {movie.language}
          </div>
        )}

        {/* Hover action reveal overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <Link
            to={`/movies/${movie._id}`}
            className="w-full text-center py-2.5 px-4 bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#E50914]/30 flex items-center justify-center space-x-2 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets</span>
          </Link>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#15161D]">
        <div>
          <Link to={`/movies/${movie._id}`}>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#E50914] transition-colors line-clamp-1">
              {movie.title}
            </h3>
          </Link>

          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genre && movie.genre.slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md border border-[#292A31]"
              >
                {g}
              </span>
            ))}
            {movie.genre && movie.genre.length > 2 && (
              <span className="text-[10px] font-bold bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded-md border border-[#292A31]">
                +{movie.genre.length - 2}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#292A31] text-xs text-zinc-400 font-medium">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>{movie.duration}</span>
          </div>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

