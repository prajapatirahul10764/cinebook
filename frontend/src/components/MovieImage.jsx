import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';

const MovieImage = ({ src, alt, className, style, isBackdrop = false, title = 'Movie Poster' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state if src changes
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-500 border border-zinc-800/80 text-center p-4 select-none ${className}`}
        style={{ minHeight: isBackdrop ? '150px' : '220px', ...style }}
      >
        <Film className={`${isBackdrop ? 'w-12 h-12' : 'w-10 h-10'} mb-2 text-zinc-700`} />
        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">CINEBOOK</span>
        <span className="text-[10px] text-zinc-500 mt-1 max-w-[90%] truncate font-medium">{title}</span>
        <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1 font-semibold">
          {isBackdrop ? 'Backdrop Missing' : 'Poster Missing'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      style={style}
      loading="lazy"
    />
  );
};

export default MovieImage;
