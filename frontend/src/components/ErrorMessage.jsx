import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = "We couldn't connect to CineBook. Please check your connection and try again.", onRetry }) => {
  return (
    <div className="bg-[#14141d] border border-red-500/30 rounded-3xl p-8 text-center max-w-md mx-auto my-12 space-y-4 shadow-2xl relative overflow-hidden">
      <div className="w-16 h-16 rounded-2xl bg-red-600/15 text-red-500 flex items-center justify-center mx-auto border border-red-500/30 red-glow-sm">
        <WifiOff className="w-8 h-8" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-xl font-extrabold text-white font-heading">Something went wrong</h3>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 inline-flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 red-glow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;


