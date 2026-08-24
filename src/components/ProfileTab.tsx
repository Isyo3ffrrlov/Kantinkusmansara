import React, { useState } from 'react';
import {
  User,
  CreditCard,
  History,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  School,
  Store,
  CheckCircle2,
  Lock,
  Share2,
  Globe,
  ExternalLink,
  MessageCircle,
  Copy,
} from 'lucide-react';
import { Order, StudentProfile } from '../types';
import { formatRupiah } from '../utils/format';

interface ProfileTabProps {
  profile: StudentProfile;
  orders: Order[];
  onOpenTopUp: () => void;
  onOpenStaffModal?: () => void;
  onOpenHelpModal?: () => void;
  onOpenShareModal?: () => void;
  onUpdateRole: (role: 'siswa' | 'guru' | 'petugas') => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  orders,
  onOpenTopUp,
  onOpenStaffModal,
  onOpenHelpModal,
  onOpenShareModal,
  onUpdateRole,
}) => {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [pinProtection, setPinProtection] = useState(true);

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Header Profile Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-orange-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Avatar with status */}
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-400/60 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900">
              <CheckCircle2 className="w-3 h-3" />
            </span>
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-black font-display text-white">
                {profile.name}
              </h2>
              <span className="px-2.5 py-0.5 bg-orange-500/30 border border-orange-400/40 text-orange-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {profile.role.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-amber-200/90 font-semibold flex items-center justify-center sm:justify-start gap-1">
              <School className="w-3.5 h-3.5" />
              <span>{profile.className}</span>
            </p>

            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-slate-300">
              <span>NISN: <strong className="text-white font-mono">{profile.nisn}</strong></span>
              <span>ID: <strong className="text-white font-mono">{profile.maskedId}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Card Balance Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-medium text-slate-400 block">
              Saldo Kartu KantinKu
            </span>
            <span className="text-xl font-black text-amber-400 font-display">
              {formatRupiah(profile.balance)}
            </span>
          </div>

          <button
            onClick={onOpenTopUp}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer font-display"
          >
            Top Up Saldo
          </button>
        </div>
      </div>

      {/* Bagikan Link Aplikasi Quick Card */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-rose-500/10 p-4 sm:p-5 rounded-3xl border border-orange-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-600/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 font-display">
              Tautan & Link Aplikasi KantinKu
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Bagikan link aplikasi ke sesama teman siswa & guru SMANSARA
            </p>
          </div>
        </div>

        <button
          id="profile-share-link-btn"
          onClick={onOpenShareModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-display shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>Salin / Bagikan Link</span>
        </button>
      </div>

      {/* Switch Role Simulator for Demo */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-sm text-slate-900 font-display">
              Simulasi Profil Pengguna
            </h3>
          </div>
          <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
            Prototype Demo
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['siswa', 'guru', 'petugas'] as const).map((r) => (
            <button
              key={r}
              onClick={() => onUpdateRole(r)}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer font-display ${
                profile.role === r
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r === 'petugas' ? 'Petugas Kantin' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Account Settings List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {/* Notifikasi Pesanan */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block font-display">
                Notifikasi Pesanan Real-Time
              </span>
              <span className="text-[11px] text-slate-400">
                Pemberitahuan saat makanan siap diambil
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notificationEnabled}
            onChange={(e) => setNotificationEnabled(e.target.checked)}
            className="w-4 h-4 accent-orange-600 cursor-pointer"
          />
        </div>

        {/* Keamanan PIN */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block font-display">
                PIN Transaksi Siswa
              </span>
              <span className="text-[11px] text-slate-400">
                Wajibkan verifikasi 6 digit PIN saat bayar
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={pinProtection}
            onChange={(e) => setPinProtection(e.target.checked)}
            className="w-4 h-4 accent-orange-600 cursor-pointer"
          />
        </div>

        {/* Bantuan & FAQ */}
        <div
          id="profile-help-btn"
          onClick={onOpenHelpModal}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block font-display">
                Pusat Bantuan & Kebijakan Kantin
              </span>
              <span className="text-[11px] text-slate-400">
                Panduan pemesanan, jam buka & kontak stand
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Website Resmi Sekolah */}
        <a
          id="profile-school-link"
          href="https://sman1jepara.sch.id"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block font-display">
                Website Resmi SMAN 1 Jepara
              </span>
              <span className="text-[11px] text-slate-400">
                Informasi & agenda sekolah di sman1jepara.sch.id
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>

        {/* WhatsApp Pengelola */}
        <a
          id="profile-wa-link"
          href="https://wa.me/6281223456789?text=Halo%20Pengelola%20Kantin%20SMANSARA,%20saya%20ingin%20bertanya%20seputar%20KantinKu"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block font-display">
                WhatsApp Pengelola Kantin
              </span>
              <span className="text-[11px] text-slate-400">
                Layanan bantuan cepat jika pesanan terkendala
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>
      </div>

      {/* School Footer info */}
      <div className="text-center text-xs text-slate-400 space-y-1">
        <p className="font-bold text-slate-600">KantinKu v2.4 • SMAN 1 Jepara</p>
        <p>Aplikasi Pemesanan Makanan Resmi Terintegrasi Sekolah</p>
      </div>
    </div>
  );
};
