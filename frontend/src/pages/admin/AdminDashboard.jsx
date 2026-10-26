import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Film, Building2, Calendar, Ticket, Users, MessageSquare, DollarSign, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/admin/dashboard-stats');
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating system metrics & revenue..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStats} />;
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Movies',
      value: stats.totalMovies,
      icon: Film,
      color: 'text-red-500 bg-red-600/10 border-red-500/30',
      link: '/admin/movies'
    },
    {
      title: 'Total Theatres',
      value: stats.totalTheatres,
      icon: Building2,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      link: '/admin/theatres'
    },
    {
      title: 'Scheduled Shows',
      value: stats.totalShows,
      icon: Calendar,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      link: '/admin/shows'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Ticket,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      link: '/admin/bookings'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      link: '/admin/users'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue}`,
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      link: '/admin/bookings'
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: MessageSquare,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      link: '/admin/reviews'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-normal">Manage movies, theatres, showtimes, user accounts & review moderation</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/movies"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 flex items-center space-x-1.5 transition-all red-glow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Movie</span>
          </Link>
          <Link
            to="/admin/shows"
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-sm font-semibold uppercase tracking-wider rounded-xl flex items-center space-x-1.5 border border-zinc-800 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-red-500" />
            <span>Schedule Show</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-[#14141d] border border-zinc-800/80 hover:border-zinc-700/80 rounded-3xl p-6 transition-all duration-200 hover:scale-[1.02] shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-4 group-hover:text-red-500 transition-colors">
                {card.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Admin Navigation Quick Tabs */}
      <div className="bg-[#14141d] border border-zinc-800/80 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-extrabold text-white font-heading">Management Portals</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Link to="/admin/movies" className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-xs font-bold text-zinc-300 hover:border-red-500 hover:text-white transition-all font-heading">
            Movies
          </Link>
          <Link to="/admin/theatres" className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-xs font-bold text-zinc-300 hover:border-red-500 hover:text-white transition-all font-heading">
            Theatres
          </Link>
          <Link to="/admin/shows" className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-xs font-bold text-zinc-300 hover:border-red-500 hover:text-white transition-all font-heading">
            Shows
          </Link>
          <Link to="/admin/bookings" className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-xs font-bold text-zinc-300 hover:border-red-500 hover:text-white transition-all font-heading">
            Bookings
          </Link>
          <Link to="/admin/users" className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-xs font-bold text-zinc-300 hover:border-red-500 hover:text-white transition-all font-heading">
            Users
          </Link>
          <Link to="/admin/reviews" className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-xs font-bold text-zinc-300 hover:border-red-500 hover:text-white transition-all font-heading">
            Reviews
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

