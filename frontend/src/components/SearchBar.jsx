import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, placeholder = "Search movies, genres, language..." }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#14141d] text-white placeholder-zinc-500 pl-11 pr-10 py-3.5 rounded-full border border-zinc-800 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm shadow-xl transition-all font-medium"
      />
      <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-3.5" />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-3.5 text-zinc-400 hover:text-white focus:outline-none transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

