import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Mail, Lock, Eye, EyeOff, LogIn, Ticket, Star, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Field-level inline errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, sessionExpiredMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || location.state?.from || '/';

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must contain at least 6 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      const loggedUser = await login(email.trim(), password);
      
      if (loggedUser?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 sm:py-10 px-2 sm:px-4">
      <div className="w-full max-w-5xl bg-[#14141d] border border-zinc-800/90 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* LEFT SIDE: Cinematic Visual Hero (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-10 bg-gradient-to-br from-[#1a080c] via-[#0d0914] to-[#08090d] border-r border-zinc-800/80 overflow-hidden">
          {/* Background Ambient Glow & Visual Elements */}
          <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30 red-glow-sm">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-wider text-white font-heading">
              CINE<span className="text-red-600">BOOK</span>
            </span>
          </div>

          {/* Center Cinematic Feature Text */}
          <div className="relative z-10 space-y-6 my-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-600/10 border border-red-500/30 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>Premium Movie Experience</span>
            </div>
            
            <h2 className="text-3xl xl:text-4xl font-black text-white font-heading leading-tight tracking-tight">
              Your movie.<br />
              Your seat.<br />
              <span className="text-gradient">Your experience.</span>
            </h2>

            <p className="text-xs xl:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Reserve tickets for upcoming blockbusters, select your preferred multiplex seats, and share authentic reviews with the community.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl flex items-center space-x-3">
                <Ticket className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Instant E-Ticket</p>
                  <p className="text-[10px] text-zinc-400">Zero wait time</p>
                </div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Secure Access</p>
                  <p className="text-[10px] text-zinc-400">JWT Protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Quote */}
          <div className="relative z-10 text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-4">
            © 2026 CineBook Media. Premium Cinema Ticketing Platform.
          </div>
        </div>

        {/* RIGHT SIDE: Login Card */}
        <div className="col-span-1 lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="lg:hidden flex items-center justify-center space-x-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-wider text-white font-heading">
                CINE<span className="text-red-600">BOOK</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-zinc-400 font-normal">
              Login to continue booking movies and reviewing your favourite films.
            </p>
          </div>

          {/* Expired Session Notice */}
          {sessionExpiredMessage && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3.5 rounded-2xl text-sm text-center font-medium">
              {sessionExpiredMessage}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-600/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl text-sm text-center font-medium animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="name@example.com"
                  autocomplete="email"
                  className={`w-full bg-zinc-900 text-white placeholder-zinc-500 pl-10 pr-4 py-3 rounded-2xl border ${
                    emailError ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-red-600'
                  } focus:outline-none text-sm sm:text-base font-normal transition-all`}
                  disabled={loading}
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5 sm:top-4" />
              </div>
              {emailError && (
                <p className="text-red-400 text-sm font-normal mt-1.5 pl-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="••••••••"
                  autocomplete="current-password"
                  className={`w-full bg-zinc-900 text-white placeholder-zinc-500 pl-10 pr-10 py-3 rounded-2xl border ${
                    passwordError ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-red-600'
                  } focus:outline-none text-sm sm:text-base font-normal transition-all`}
                  disabled={loading}
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5 sm:top-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 sm:top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm font-normal mt-1.5 pl-1">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2 red-glow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>LOGIN</span>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-sm text-zinc-400 pt-4 border-t border-zinc-800/80 font-normal">
            <span>Don't have an account?</span>
            <Link to="/register" className="text-red-500 font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
