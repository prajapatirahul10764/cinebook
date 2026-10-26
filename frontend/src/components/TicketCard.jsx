import React from 'react';
import { Ticket, Printer, Calendar, Clock, MapPin, Film, Armchair, QrCode } from 'lucide-react';
import MovieImage from './MovieImage';

const TicketCard = ({ booking }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCancelled = booking.status === 'Cancelled';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="print-ticket-container bg-[#15161D] border border-[#292A31] rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Ticket Header Banner */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-600 p-6 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-wider">CINEBOOK DIGITAL TICKET</h2>
              <p className="text-xs sm:text-sm text-red-100 font-medium">Official E-Ticket Confirmation</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md ${
              isCancelled ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-500 text-zinc-950 font-bold'
            }`}>
              {booking.status}
            </span>
          </div>
        </div>

        {/* Ticket Content Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Movie Poster */}
          <div className="md:col-span-1">
            <MovieImage
              src={booking.movie?.poster}
              alt={booking.movie?.title}
              title={booking.movie?.title}
              className="w-full h-60 object-cover rounded-2xl border border-[#292A31] shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#E50914] uppercase tracking-widest">
                  BOOKING REFERENCE
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-widest font-mono mt-0.5">
                  {booking.bookingReference}
                </h3>
              </div>
              <div className="p-2 bg-zinc-900 rounded-xl border border-[#292A31] text-zinc-300 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-white" />
              </div>
            </div>

            <h4 className="text-xl sm:text-2xl font-bold text-white">
              {booking.movie?.title}
            </h4>

            <div className="grid grid-cols-2 gap-4 text-sm text-zinc-300 pt-3 border-t border-[#292A31]">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-[#E50914] shrink-0" />
                <div>
                  <p className="font-semibold text-white text-xs">{booking.theatre?.name}</p>
                  <p className="text-zinc-400 text-[10px]">{booking.theatre?.location}, {booking.theatre?.city}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Film className="w-4 h-4 text-[#F5B400] shrink-0" />
                <div>
                  <p className="text-zinc-400 text-[10px] font-medium">Screen</p>
                  <p className="font-semibold text-white text-xs">{booking.show?.screen || 'Screen 1'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-[#E50914] shrink-0" />
                <div>
                  <p className="text-zinc-400 text-[10px] font-medium">Date</p>
                  <p className="font-semibold text-white text-xs">{booking.show?.date}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[#E50914] shrink-0" />
                <div>
                  <p className="text-zinc-400 text-[10px] font-medium">Time</p>
                  <p className="font-semibold text-white text-xs">{booking.show?.time}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-[#292A31] flex items-center justify-between mt-4 shadow-inner">
              <div className="flex items-center space-x-3">
                <Armchair className="w-5 h-5 text-[#E50914]" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">SEATS RESERVED</p>
                  <p className="text-base sm:text-lg font-black text-white tracking-wider">
                    {booking.seats?.join(', ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">TOTAL AMOUNT</p>
                <p className="text-xl sm:text-2xl font-black text-[#E50914]">₹{booking.totalAmount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Footer Tear */}
        <div className="bg-zinc-950 px-8 py-4 border-t border-dashed border-[#292A31] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
          <span>Customer Name: <strong className="text-white">{booking.user?.name || 'Valued Guest'}</strong></span>
          <span className="font-mono text-xs text-zinc-500">Scan QR Code or Present Reference Code at Theatre Entry</span>
        </div>
      </div>

      {/* Print Action */}
      <div className="flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Printer className="w-4 h-4" />
          <span>Print E-Ticket</span>
        </button>
      </div>
    </div>
  );
};

export default TicketCard;

