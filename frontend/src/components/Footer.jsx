import React from 'react';
import { Film, Heart, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#08080c] border-t border-zinc-800/80 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-700 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white tracking-wider font-heading">
              CINE<span className="text-red-600">BOOK</span>
            </span>
          </Link>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Your ultimate destination for booking movie tickets online and exploring verified audience reviews. Experience cinema like never before.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-base tracking-wider uppercase mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm font-normal">
            <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
            <li><Link to="/movies" className="hover:text-red-500 transition-colors">Explore Movies</Link></li>
            <li><Link to="/my-bookings" className="hover:text-red-500 transition-colors">My Bookings</Link></li>
            <li><Link to="/profile" className="hover:text-red-500 transition-colors">User Profile</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold text-base tracking-wider uppercase mb-4">Popular Genres</h4>
          <ul className="space-y-2.5 text-sm font-normal">
            <li><Link to="/movies?genre=Action" className="hover:text-red-500 transition-colors">Action & Adventure</Link></li>
            <li><Link to="/movies?genre=Sci-Fi" className="hover:text-red-500 transition-colors">Sci-Fi & Fantasy</Link></li>
            <li><Link to="/movies?genre=Drama" className="hover:text-red-500 transition-colors">Drama & Romance</Link></li>
            <li><Link to="/movies?genre=Thriller" className="hover:text-red-500 transition-colors">Thriller & Horror</Link></li>
          </ul>
        </div>

        {/* Project Notice */}
        <div>
          <h4 className="text-white font-semibold text-base tracking-wider uppercase mb-4">About CineBook</h4>
          <p className="text-sm text-zinc-400 font-normal leading-relaxed bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/60">
            CineBook is a full-stack MERN cinema platform built for online movie ticket booking and verified audience reviews. Real-time seat reservation, dynamic showtimes & ratings.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 font-normal">
        <p>© 2026 CineBook Systems. All rights reserved.</p>
        <p className="flex items-center space-x-1.5 mt-2 sm:mt-0">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>for cinema enthusiasts</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

