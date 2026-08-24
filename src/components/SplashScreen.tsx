import React from 'react';
import { Sparkles, ArrowRight, Utensils, Zap, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-orange-950/95 text-white p-4 sm:p-6 overflow-y-auto w-full min-h-screen animate-in fade-in duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-orange-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container constrained to max-w-sm and full viewport height */}
      <div className="w-full max-w-sm flex flex-col items-center justify-between min-h-[92vh] py-2 z-10">
        {/* Top Header Tag */}
        <div className="w-full flex justify-between items-center pt-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 text-xs font-semibold text-orange-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kantin Resmi SMANSARA</span>
          </div>
          <button
            id="splash-skip-btn"
            onClick={onDismiss}
            className="text-xs text-slate-300 hover:text-white font-medium transition-colors cursor-pointer px-3 py-1 rounded-full hover:bg-white/10"
          >
            Lewati
          </button>
        </div>

        {/* Center Visual & Branding */}
        <div className="w-full flex flex-col items-center text-center my-auto py-3">
          {/* Realistic Food Showcase Image Card */}
          <div className="relative mb-4 sm:mb-5 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                alt="KantinKu SMANSARA Makanan Lezat"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
              
              {/* Floating Badges on Image */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1 shadow-sm">
                <span>🔥 7 Stand Kantin</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-orange-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Bebas Antre</span>
              </div>
            </div>
          </div>

          {/* App Title & Slogan */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-bold uppercase tracking-wider">
              <span>APLIKASI PEMESANAN MAKANAN</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display flex items-center justify-center">
              <span>Kantin</span>
              <span className="ml-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white text-3xl sm:text-4xl shadow-md">
                Ku
              </span>
            </h1>
            <p className="text-base sm:text-lg font-bold text-amber-200/95 font-display pt-0.5">
              “Pesan Mudah, Makan Lebih Cepat!”
            </p>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
              Pesan menu favorit dari 7 kantin sekolah, bayar instan pakai Saldo Siswa & QRIS, ambil tanpa antre.
            </p>
          </div>

          {/* Features highlight pills */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4 text-slate-300">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center text-center">
              <Utensils className="w-4 h-4 text-orange-400 mb-1" />
              <span className="text-[10px] font-semibold">50+ Menu Lezat</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center text-center">
              <Zap className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[10px] font-semibold">Siap Ambil Cepat</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] font-semibold">Dompet Digital</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="w-full pb-2">
          <button
            id="splash-get-started-btn"
            onClick={onDismiss}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 active:scale-[0.98] transition-all cursor-pointer font-display"
          >
            <span>Mulai Pesan Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

