import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const GENRES = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'];

const STATUSES = [
  { value: 'NOW_SHOWING', label: 'Now Showing' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'POPULAR', label: 'Popular' },
  { value: 'TOP_RATED', label: 'Top Rated' },
  { value: 'FEATURED', label: 'Featured' }
];

const SORTS = [
  { value: 'rating', label: 'Rating (High to Low)' },
  { value: 'releaseDate', label: 'Release Date (New to Old)' },
  { value: 'title', label: 'Title (A-Z)' }
];

const FilterBar = ({
  selectedGenre,
  setSelectedGenre,
  selectedLanguage,
  setSelectedLanguage,
  selectedRating,
  setSelectedRating,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  onReset
}) => {
  const hasActiveFilters = selectedGenre || selectedLanguage || selectedRating || selectedStatus || sortBy;

  return (
    <div className="bg-[#15161D] border border-[#292A31] rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#292A31]">
        <div className="flex items-center space-x-2 text-white font-bold text-sm uppercase tracking-wider font-heading">
          <Filter className="w-4 h-4 text-[#E50914]" />
          <span>Filter & Sort Movies</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 text-xs text-[#E50914] hover:text-[#b80710] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Genre Selector */}
        <div>
          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 font-heading">Genre</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-100 border border-[#292A31] rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#E50914] cursor-pointer"
          >
            <option value="">All Genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Language Selector */}
        <div>
          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 font-heading">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-100 border border-[#292A31] rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#E50914] cursor-pointer"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Rating Selector */}
        <div>
          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 font-heading">Min Rating</label>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-100 border border-[#292A31] rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#E50914] cursor-pointer"
          >
            <option value="">Any Rating</option>
            <option value="8.5">★ 8.5 & above</option>
            <option value="8.0">★ 8.0 & above</option>
            <option value="7.5">★ 7.5 & above</option>
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 font-heading">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-100 border border-[#292A31] rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#E50914] cursor-pointer"
          >
            <option value="">All Categories</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div>
          <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 font-heading">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-100 border border-[#292A31] rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#E50914] cursor-pointer"
          >
            <option value="">Default (Newest)</option>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
