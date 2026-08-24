import React from 'react';
import { ShoppingBag, Share2, HelpCircle, Store, CreditCard, ChevronRight } from 'lucide-react';
import { StudentProfile } from '../types';
import { formatRupiah } from '../utils/format';

interface NavbarProps {
  profile: StudentProfile;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTopUp: () => void;
  onOpenStaffModal?: () => void;
  onOpenShareModal?: () => void;
  onOpenHelpModal?: () => void;
  onGoToHome?: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  cartCount,
  onOpenCart,
  onOpenTopUp,
  onOpenStaffModal,
  onOpenShareModal,
  onOpenHelpModal,
  onGoToHome,
  unreadCount = 1,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & School Logo */}
        <div
          onClick={onGoToHome}
          className="flex items-center gap-3 cursor-pointer select-none group"
          title="Kembali ke Beranda"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 text-xl font-black font-display group-hover:scale-105 transition-transform">
            🍱
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent font-display">
                KantinKu
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">
                SMANSARA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none">
              Pesan Cepat Bebas Antre
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Balance Button */}
          <button
            id="navbar-balance-btn"
            onClick={onOpenTopUp}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200/70 rounded-full transition-all text-left shadow-2xs group cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-xs">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] text-slate-500 font-semibold block leading-none">Saldo Kartu</span>
              <span className="text-xs font-bold text-orange-950 font-display leading-tight">
                {formatRupiah(profile.balance)}
              </span>
            </div>
            <span className="sm:hidden text-xs font-bold text-orange-950 font-display">
              {formatRupiah(profile.balance)}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Share App Link Button */}
          {onOpenShareModal && (
            <button
              id="navbar-share-app-btn"
              onClick={onOpenShareModal}
              title="Bagikan Link Aplikasi"
              aria-label="Bagikan Link Aplikasi"
              className="p-2 rounded-full text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors border border-slate-200/80 cursor-pointer flex items-center justify-center"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Help Button */}
          {onOpenHelpModal && (
            <button
              id="navbar-help-btn"
              onClick={onOpenHelpModal}
              title="Pusat Bantuan & Kontak"
              aria-label="Pusat Bantuan"
              className="p-2 rounded-full text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors border border-slate-200/80 cursor-pointer hidden sm:flex items-center justify-center"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          {/* Petugas Mode button */}
          {onOpenStaffModal && (
            <button
              id="navbar-staff-btn"
              onClick={onOpenStaffModal}
              title="Mode Petugas Kantin"
              className="p-2 rounded-full text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors relative border border-slate-200/80 cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5"
            >
              <Store className="w-4 h-4 text-orange-500" />
              <span>Dapur Kantin</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            id="navbar-cart-btn"
            onClick={onOpenCart}
            aria-label="Keranjang Belanja"
            className="relative p-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white transition-transform active:scale-95 shadow-md shadow-orange-600/25 flex items-center justify-center cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
