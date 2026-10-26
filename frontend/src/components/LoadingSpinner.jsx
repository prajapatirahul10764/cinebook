import React from 'react';
import { Loader2, Film } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading cinema experience...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[300px] space-y-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <Film className="w-5 h-5 text-red-500 absolute top-3.5 left-3.5" />
      </div>
      <p className="text-sm font-semibold text-zinc-400 animate-pulse font-heading tracking-wide">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

