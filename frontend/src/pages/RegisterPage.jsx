import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field inline errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength logic
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-zinc-800' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' };

    let score = 1;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setError('');

    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Please enter a valid email address.');
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

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
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
      await register(name.trim(), email.trim(), password);
      setSuccess(true);
    } catch (err) {
      if (err.message.includes('exists')) {
        setError('An account with this email already exists.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 sm:py-10 px-2 sm:px-4">
      <div className="w-full max-w-5xl bg-[#14141d] border border-zinc-800/90 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* LEFT SIDE: Cinematic Visual Hero (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 bg-gradient-to-br from-[#1c080b] via-[#0e0915] to-[#08090d] border-r border-zinc-800/80 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30 red-glow-sm">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-wider text-white font-heading">
              CINE<span className="text-red-600">BOOK</span>
            </span>
          </div>

          {/* Center Info */}
          <div className="relative z-10 space-y-6 my-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-600/10 border border-red-500/30 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join CineBook Club</span>
            </div>

            <h2 className="text-3xl font-black text-white font-heading leading-tight tracking-tight">
              Join CineBook<br />
              <span className="text-gradient">Start Booking Today.</span>
            </h2>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Book movies. Choose your seats. Share your reviews with fellow movie lovers across the globe.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs text-zinc-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Instant seat reservation & tickets</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-zinc-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Post & moderate verified audience reviews</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-zinc-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>100% Secure standard member access</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-4">
            Movie Ticket Booking & Review System
          </div>
        </div>

        {/* RIGHT SIDE: Form / Success View */}
        <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          {success ? (
            /* SUCCESS STATE VIEW */
            <div className="text-center space-y-6 py-8 my-auto animate-fade-in">
              <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl red-glow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white font-heading">
                  Account Created Successfully!
                </h2>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Welcome to CineBook. Your standard movie member account is active and ready to use.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all hover:scale-105 inline-flex items-center space-x-2 red-glow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>LOGIN TO CINEBOOK</span>
                </button>
              </div>
            </div>
          ) : (
            /* FORM VIEW */
            <>
              <div className="space-y-2 text-center sm:text-left">
                <div className="lg:hidden flex items-center justify-center space-x-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                    <Film className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-black tracking-wider text-white font-heading">
                    CINE<span className="text-red-600">BOOK</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Create Your CineBook Account
                </h1>
                <p className="text-sm text-zinc-400 font-normal">
                  Join CineBook and start booking your favourite movies.
                </p>
              </div>

              {error && (
                <div className="bg-red-600/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl text-sm text-center font-medium animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="John Doe"
                      autocomplete="name"
                      className={`w-full bg-zinc-900 text-white placeholder-zinc-500 pl-10 pr-4 py-3 rounded-2xl border ${
                        nameError ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-red-600'
                      } focus:outline-none text-sm sm:text-base font-normal transition-all`}
                      disabled={loading}
                    />
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5 sm:top-4" />
                  </div>
                  {nameError && (
                    <p className="text-red-400 text-sm font-normal mt-1.5 pl-1">{nameError}</p>
                  )}
                </div>

                {/* Email */}
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

                {/* Password & Strength */}
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
                      autocomplete="new-password"
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

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-normal">Password strength:</span>
                        <span className={`font-semibold ${
                          strength.label === 'Strong' ? 'text-emerald-400' :
                          strength.label === 'Medium' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (confirmPasswordError) setConfirmPasswordError('');
                      }}
                      placeholder="••••••••"
                      autocomplete="new-password"
                      className={`w-full bg-zinc-900 text-white placeholder-zinc-500 pl-10 pr-10 py-3 rounded-2xl border ${
                        confirmPasswordError ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-red-600'
                      } focus:outline-none text-sm sm:text-base font-normal transition-all`}
                      disabled={loading}
                    />
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5 sm:top-4" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3 sm:top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="text-red-400 text-sm font-normal mt-1.5 pl-1">{confirmPasswordError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2 red-glow-sm mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>CREATE ACCOUNT</span>
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-sm text-zinc-400 pt-4 border-t border-zinc-800/80 font-normal">
                <span>Already have an account?</span>
                <Link to="/login" className="text-red-500 font-semibold hover:underline">
                  Login
                </Link>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
