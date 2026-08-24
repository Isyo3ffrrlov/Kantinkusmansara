import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  MessageCircle,
  Globe,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface ShareAppModalProps {
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warn') => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ onClose, onShowToast }) => {
  const [copied, setCopied] = useState(false);
  
  // Safe resolution of the current web app link
  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://kantinku-smansara.app';
  
  const shareTitle = 'KantinKu - Pemesanan Makanan Kantin SMAN 1 Jepara';
  const shareText = `Halo! Yuk pesan makanan & minuman di 7 stand Kantin SMANSARA lebih cepat dan tanpa antre pakai aplikasi KantinKu:\n${currentAppUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentAppUrl);
      setCopied(true);
      onShowToast('Link aplikasi berhasil disalin ke clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentAppUrl,
        });
        onShowToast('Aplikasi berhasil dibagikan!', 'success');
      } catch (err) {
        // user cancelled or share unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-sm">
              🔗
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">
                Bagikan Link Aplikasi
              </h2>
              <p className="text-xs text-orange-100 font-medium">
                Akses KantinKu SMANSARA dari HP & Laptop
              </p>
            </div>
          </div>

          <button
            id="close-share-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* QR Code Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center space-y-3">
            <div className="inline-block bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-36 h-36 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2 text-white">
                <QrCode className="w-24 h-24 text-white stroke-1" />
                <span className="text-[9px] font-mono tracking-widest text-amber-300">KANTINKU-SMANSARA</span>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block font-display">
                Scan QR Code untuk Membuka Aplikasi
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bisa dibuka langsung melalui browser Google Chrome / Safari siswa
              </p>
            </div>
          </div>

          {/* URL Input Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Tautan / URL Aplikasi
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pl-3">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                readOnly
                value={currentAppUrl}
                className="w-full text-xs font-mono text-slate-700 bg-transparent outline-none truncate"
              />
              <button
                id="copy-app-link-btn"
                onClick={handleCopyLink}
                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer font-display"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              id="share-whatsapp-btn"
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-display"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Kirim via WhatsApp</span>
            </a>

            <button
              id="native-share-btn"
              onClick={handleNativeShare}
              className="py-3 px-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-display"
            >
              <Share2 className="w-4 h-4 text-orange-600" />
              <span>Bagikan Lainnya</span>
            </button>
          </div>

          {/* Extra info */}
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Simpan link ini ke layar utama (Add to Home Screen) di HP Android / iOS untuk pengalaman seperti aplikasi native!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
