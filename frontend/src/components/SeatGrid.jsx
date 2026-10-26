import React from 'react';
import { Monitor } from 'lucide-react';

const ROWS = ['A', 'B', 'C', 'D'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

const SeatGrid = ({ bookedSeats = [], selectedSeats = [], onSeatClick }) => {
  const isBooked = (seatCode) => bookedSeats.includes(seatCode);
  const isSelected = (seatCode) => selectedSeats.includes(seatCode);

  return (
    <div className="bg-[#15161D] border border-[#292A31] rounded-3xl p-6 sm:p-8 flex flex-col items-center space-y-8 shadow-2xl">
      {/* Curved Screen Visual */}
      <div className="w-full max-w-lg flex flex-col items-center space-y-3">
        <div className="w-full cinema-screen" />
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-zinc-400 font-heading">
          <Monitor className="w-4 h-4 text-[#E50914]" />
          <span>SCREEN THIS WAY</span>
        </div>
      </div>

      {/* Seat Matrix Grid */}
      <div className="grid gap-3 sm:gap-4 my-4 overflow-x-auto max-w-full pb-2">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center space-x-2.5 sm:space-x-3">
            <span className="w-6 text-center text-xs font-bold text-zinc-500 font-heading">{row}</span>
            <div className="grid grid-cols-8 gap-2 sm:gap-3">
              {COLS.map((col) => {
                const seatCode = `${row}${col}`;
                const booked = isBooked(seatCode);
                const selected = isSelected(seatCode);

                return (
                  <button
                    key={seatCode}
                    disabled={booked}
                    onClick={() => onSeatClick(seatCode)}
                    title={booked ? `Seat ${seatCode} (Booked)` : `Seat ${seatCode}`}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center font-heading cursor-pointer ${
                      booked
                        ? 'bg-zinc-900 border border-[#292A31] text-zinc-600 cursor-not-allowed opacity-50'
                        : selected
                        ? 'bg-[#E50914] border border-[#b80710] text-white shadow-lg shadow-[#E50914]/50 scale-102 font-extrabold red-glow-sm'
                        : 'bg-zinc-800/80 border border-[#292A31] text-zinc-300 hover:border-[#E50914]/60 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {seatCode}
                  </button>
                );
              })}
            </div>
            <span className="w-6 text-center text-xs font-bold text-zinc-500 font-heading">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend Indicator */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 pt-4 border-t border-[#292A31] w-full font-bold uppercase tracking-wider">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-md bg-zinc-800 border border-[#292A31]"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-md bg-[#E50914] border border-[#b80710] red-glow-sm"></div>
          <span>Selected ({selectedSeats.length})</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-md bg-zinc-900 border border-[#292A31] text-zinc-600"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;

