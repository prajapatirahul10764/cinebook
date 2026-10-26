import React from 'react';
import { Ticket, ShieldCheck } from 'lucide-react';

const BookingSummary = ({ movie, theatre, show, selectedSeats = [], onConfirm, loading }) => {
  const pricePerSeat = show ? show.price : 0;
  const totalAmount = selectedSeats.length * pricePerSeat;

  return (
    <div className="bg-[#15161D] border border-[#292A31] rounded-3xl p-6 space-y-6 shadow-2xl sticky top-24">
      <h3 className="text-lg font-bold text-white flex items-center space-x-2.5 border-b border-[#292A31] pb-4 font-heading uppercase tracking-wide">
        <Ticket className="w-5 h-5 text-[#E50914]" />
        <span>Booking Summary</span>
      </h3>

      {/* Show Information */}
      <div className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
        <div className="flex justify-between">
          <span className="text-zinc-400 font-normal">Movie:</span>
          <span className="font-semibold text-white max-w-[180px] truncate">{movie?.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400 font-normal">Theatre:</span>
          <span className="font-semibold text-zinc-200">{theatre?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400 font-normal">Date & Time:</span>
          <span className="font-semibold text-[#E50914]">{show?.date} at {show?.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400 font-normal">Screen:</span>
          <span className="font-semibold text-zinc-200">{show?.screen}</span>
        </div>
      </div>

      <hr className="border-[#292A31]" />

      {/* Seat & Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
          <span className="text-zinc-400 font-normal">Selected Seats ({selectedSeats.length}):</span>
          <span className="font-semibold text-white max-w-[160px] truncate text-right">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
          <span className="text-zinc-400 font-normal">Price per ticket:</span>
          <span className="font-semibold text-zinc-300">₹{pricePerSeat}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[#292A31] text-xs font-black uppercase tracking-wider text-white">
          <span>Total Amount:</span>
          <span className="text-2xl text-[#E50914] font-black">₹{totalAmount}</span>
        </div>
      </div>

      {/* Payment Guarantee */}
      <div className="bg-zinc-900/40 rounded-2xl p-3 border border-[#292A31] flex items-center space-x-2 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Instant Confirmation. Guaranteed reserved seats.</span>
      </div>

      {/* Submit Button */}
      <button
        disabled={selectedSeats.length === 0 || loading}
        onClick={onConfirm}
        className="w-full py-4 bg-[#E50914] hover:bg-[#b80710] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#E50914]/30 transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 red-glow-sm cursor-pointer"
      >
        {loading ? 'Processing Ticket...' : 'CONFIRM BOOKING'}
      </button>
    </div>
  );
};

export default BookingSummary;

