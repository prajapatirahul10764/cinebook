import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const isUserAdmin = user.role === 'admin';

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      <div className="border-b border-zinc-800/80 pb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          User Profile
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 mt-1 font-normal">Your registered CineBook account & membership details</p>
      </div>

      <div className="bg-[#14141d] border border-zinc-800/90 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-4 pb-6 border-b border-zinc-800/80">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-zinc-900 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-red-600/30 red-glow-sm">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <span className={`inline-block px-3 py-0.5 mt-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isUserAdmin ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400' : 'bg-red-600/20 border border-red-500/30 text-red-400'
            }`}>
              {isUserAdmin ? 'Administrator' : 'Movie Lover / User'}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm text-zinc-300">
          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <User className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Full Name</p>
              <p className="font-semibold text-white text-base">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <Mail className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Email Address</p>
              <p className="font-semibold text-white text-base">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <Shield className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Account Type</p>
              <p className="font-semibold text-white text-base">
                {isUserAdmin ? 'Administrator' : 'Movie Lover / User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


