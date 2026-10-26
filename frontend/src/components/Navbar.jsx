import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, User, LogOut, Ticket, ShieldAlert, Menu, X, Home, Compass, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGenresOpen, setMobileGenresOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const genres = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Thriller'];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#292A31] bg-[#08090D]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E50914] via-[#E50914] to-rose-500 flex items-center justify-center shadow-lg shadow-[#E50914]/25 group-hover:scale-105 transition-transform duration-300">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-wider text-white font-heading">
              CINE<span className="text-[#E50914]">BOOK</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-6 relative">
            <input
              type="text"
              placeholder="Search movies, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 pl-10 pr-4 py-2 rounded-full border border-[#292A31] focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] text-xs transition-all duration-200"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-3" />
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1.5 text-xs uppercase tracking-wider font-bold transition-colors duration-200 relative py-1 hover:text-white ${
                isActive('/') ? 'text-[#E50914]' : 'text-zinc-400'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>

            <Link
              to="/movies"
              className={`flex items-center space-x-1.5 text-xs uppercase tracking-wider font-bold transition-colors duration-200 relative py-1 hover:text-white ${
                isActive('/movies') ? 'text-[#E50914]' : 'text-zinc-400'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies</span>
            </Link>

            {/* Genres Hover Dropdown */}
            <div className="relative group/genre py-1">
              <button className="flex items-center space-x-1.5 text-xs uppercase tracking-wider font-bold text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer">
                <Compass className="w-3.5 h-3.5" />
                <span>Genres</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute left-0 mt-2 w-44 bg-[#15161D] border border-[#292A31] rounded-xl shadow-2xl opacity-0 invisible group-hover/genre:opacity-100 group-hover/genre:visible transition-all duration-200 z-50 p-2 space-y-0.5">
                {genres.map((g) => (
                  <Link
                    key={g}
                    to={`/movies?genre=${g}`}
                    className="block px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            </div>

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className={`flex items-center space-x-1.5 text-xs uppercase tracking-wider font-bold transition-colors duration-200 relative py-1 hover:text-white ${
                    isActive('/my-bookings') ? 'text-[#E50914]' : 'text-zinc-400'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>My Bookings</span>
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[#F5B400] text-[10px] uppercase tracking-wider font-black hover:bg-amber-500/20 transition-all shadow-sm"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Profile & Logout */}
                <div className="flex items-center space-x-3 pl-4 border-l border-[#292A31]">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E50914] to-zinc-900 border border-[#E50914]/40 flex items-center justify-center text-white font-black text-xs shadow-md uppercase">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-bold max-w-[80px] truncate">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-zinc-400 hover:text-[#E50914] hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2.5 pl-4 border-l border-[#292A31]">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-[#E50914] hover:bg-[#b80710] text-white rounded-full shadow-lg shadow-[#E50914]/30 transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#08090D] border-b border-[#292A31] px-4 pt-2 pb-6 space-y-4 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="relative mt-2">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 pl-10 pr-4 py-2 rounded-full border border-[#292A31] focus:outline-none focus:border-[#E50914] text-xs"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-3" />
          </form>

          <div className="flex flex-col space-y-2 pt-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 text-xs uppercase tracking-wider font-bold py-2 ${
                isActive('/') ? 'text-[#E50914]' : 'text-zinc-300'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/movies"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 text-xs uppercase tracking-wider font-bold py-2 ${
                isActive('/movies') ? 'text-[#E50914]' : 'text-zinc-300'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Movies</span>
            </Link>

            {/* Mobile Genres Accordion */}
            <div className="space-y-1">
              <button
                onClick={() => setMobileGenresOpen(!mobileGenresOpen)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-bold py-2 text-zinc-300 focus:outline-none"
              >
                <div className="flex items-center space-x-2.5">
                  <Compass className="w-4 h-4" />
                  <span>Genres</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileGenresOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileGenresOpen && (
                <div className="pl-6 grid grid-cols-2 gap-2 pb-2">
                  {genres.map((g) => (
                    <Link
                      key={g}
                      to={`/movies?genre=${g}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-bold text-zinc-400 py-1 hover:text-white"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 text-xs uppercase tracking-wider font-bold py-2 ${
                    isActive('/my-bookings') ? 'text-[#E50914]' : 'text-zinc-300'
                  }`}
                >
                  <Ticket className="w-4 h-4 text-[#E50914]" />
                  <span>My Bookings</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#F5B400] flex items-center space-x-2.5 text-xs uppercase tracking-wider font-bold py-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 text-xs uppercase tracking-wider font-bold py-2 ${
                    isActive('/profile') ? 'text-[#E50914]' : 'text-zinc-300'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile ({user.name})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-[#E50914] flex items-center space-x-2.5 text-xs uppercase tracking-wider font-bold py-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 border border-[#292A31] rounded-full"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-black uppercase tracking-widest bg-[#E50914] text-white rounded-full shadow-lg shadow-[#E50914]/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
