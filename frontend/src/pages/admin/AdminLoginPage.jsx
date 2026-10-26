import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Admin email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
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
      await adminLogin(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Access denied. Administrator account required.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#14141d] border border-amber-500/30 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top ambient highlight */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center mx-auto text-black shadow-lg shadow-amber-500/20 font-black">
            <ShieldCheck className="w-8 h-8 text-black" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest rounded-full mb-2">
              ADMIN CONTROL CENTER
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              CineBook Admin
            </h1>
            <p className="text-sm text-zinc-400 mt-1 font-normal">
              Secure administration portal
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-600/15 border border-red-500/40 text-red-300 p-3.5 rounded-2xl text-sm text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder="admin@cinebook.com"
                autocomplete="username"
                className={`w-full bg-zinc-900/90 text-white placeholder-zinc-500 pl-10 pr-4 py-3 rounded-2xl border ${
                  emailError ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-amber-500'
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
            <label className="block text-sm font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
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
                className={`w-full bg-zinc-900/90 text-white placeholder-zinc-500 pl-10 pr-10 py-3 rounded-2xl border ${
                  passwordError ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-amber-500'
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
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-sm sm:text-base uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-black" />
                <span>ADMIN LOGIN</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
          🔒 Encrypted Administrator Authentication Gateway
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
