import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sync state with URL search params when they change (e.g. from navbar genres link)
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    const genreParam = searchParams.get('genre') || '';
    const languageParam = searchParams.get('language') || '';
    const ratingParam = searchParams.get('rating') || '';
    const statusParam = searchParams.get('status') || '';
    const sortParam = searchParams.get('sort') || '';

    setSearchQuery(searchParam);
    setGenre(genreParam);
    setLanguage(languageParam);
    setRating(ratingParam);
    setStatus(statusParam);
    setSort(sortParam);
  }, [searchParams]);

  useEffect(() => {
    fetchMovies();
  }, [searchQuery, genre, language, rating, status, sort]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (genre) params.genre = genre;
      if (language) params.language = language;
      if (rating) params.rating = rating;
      if (status) params.status = status;
      if (sort) params.sort = sort;

      // Sync URL
      setSearchParams(params);

      const res = await API.get('/movies', { params });
      if (res.success) {
        setMovies(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setGenre('');
    setLanguage('');
    setRating('');
    setStatus('');
    setSort('');
    setSearchParams({});
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Title */}
      <div className="border-b border-[#292A31] pb-4">
        <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-black text-white tracking-tight leading-tight uppercase font-heading">
          Explore Movies
        </h1>
        <p className="text-sm text-zinc-400 mt-1.5 font-normal leading-relaxed">
          Discover your next cinematic experience. Filter by genre, language, status, and rating.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search movies by title, description, genre, language..."
        />

        <FilterBar
          selectedGenre={genre}
          setSelectedGenre={setGenre}
          selectedLanguage={language}
          setSelectedLanguage={setLanguage}
          selectedRating={rating}
          setSelectedRating={setRating}
          selectedStatus={status}
          setSelectedStatus={setStatus}
          sortBy={sort}
          setSortBy={setSort}
          onReset={handleResetFilters}
        />
      </div>

      {/* Grid Content */}
      {loading ? (
        <LoadingSpinner message="Filtering movies..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchMovies} />
      ) : (
        <MovieGrid
          movies={movies}
          title={`All Movies (${movies.length})`}
          subtitle="Browse currently showing, popular, top rated, or upcoming movies"
        />
      )}
    </div>
  );
};

export default MoviesPage;
