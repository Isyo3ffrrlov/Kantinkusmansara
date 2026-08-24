import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Clock,
  MapPin,
  ShieldCheck,
  Building,
  School,
  Share2,
} from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
  onOpenShareModal: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose, onOpenShareModal }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara memesan makanan di KantinKu?',
      a: 'Pilih menu makanan atau minuman dari 7 stand kantin yang tersedia di beranda atau tab Kantin, masukkan ke keranjang belanja, tentukan catatan pesanan, lalu lakukan pembayaran digital (Saldo Kartu Siswa, QRIS, atau E-Wallet). Setelah sukses, Anda akan menerima Kode Ambil untuk ditunjukkan di meja kantin.',
    },
    {
      q: 'Bagaimana cara mengisi (top up) Saldo KantinKu?',
      a: 'Buka tab "Top Up", pilih nominal pengisian (mulai dari Rp 10.000), lalu pilih saluran pembayaran seperti QRIS instan, GoPay, OVO, DANA, atau Transfer Virtual Account BCA/BRI/Mandiri. Saldo akan otomatis bertambah secara instan.',
    },
    {
      q: 'Kapan pesanan saya bisa diambil?',
      a: 'Setiap stand kantin memiliki estimasi waktu masak 3-10 menit. Anda dapat memantau status pesanan secara real-time pada tab "Pesanan". Ambil makanan saat status berubah menjadi "Siap Diambil di Stand".',
    },
    {
      q: 'Apakah bisa bayar tunai (cash) di tempat?',
      a: 'Bisa! Pada halaman pembayaran, pilih opsi "Bayar Tunai di Kasir Kantin". Tunjukkan nomor pesanan Anda kepada penjual saat jam istirahat untuk membayar.',
    },
    {
      q: 'Apa yang harus dilakukan jika pesanan salah atau stok habis?',
      a: 'Hubungi petugas stand kantin terkait secara langsung di lorong kantin sekolah atau hubungi Layanan Bantuan Kantin SMANSARA melalui kontak WhatsApp pengelola.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-sm">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">
                Pusat Bantuan & Kontak
              </h2>
              <p className="text-xs text-orange-100 font-medium">
                Panduan Resmi Kantin SMAN 1 Jepara
              </p>
            </div>
          </div>

          <button
            id="close-help-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Quick Action Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              id="help-wa-contact-link"
              href="https://wa.me/6281223456789?text=Halo%20Pengelola%20Kantin%20SMANSARA,%20saya%20ingin%20bertanya%20tentang%20pesanan%20KantinKu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center gap-3 transition-colors group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-emerald-950 block font-display">
                  WhatsApp Pengelola
                </span>
                <span className="text-[11px] text-emerald-700 block truncate">
                  +62 812-2345-6789
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              id="help-school-website-link"
              href="https://sman1jepara.sch.id"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl flex items-center gap-3 transition-colors group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <School className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-blue-950 block font-display">
                  Website SMANSARA
                </span>
                <span className="text-[11px] text-blue-700 block truncate">
                  sman1jepara.sch.id
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Operational Hours & School Location */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800 font-display">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Jam Operasional Kantin Sekolah:</span>
            </div>
            <p className="pl-6 text-[11px] text-slate-600">
              Senin - Jumat: <strong>07.00 - 15.30 WIB</strong> (Pelayanan aktif pada Jam Istirahat 1 & Jam Istirahat 2)
            </p>
            <div className="flex items-center gap-2 font-bold text-slate-800 font-display pt-1">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Lokasi Kantin:</span>
            </div>
            <p className="pl-6 text-[11px] text-slate-600">
              Kompleks Kantin Utama SMAN 1 Jepara, Jl. Jendral Urip Sumoharjo No.2, Jepara, Jawa Tengah
            </p>
          </div>

          {/* Share App Link Banner */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block font-display">
                Bagikan Aplikasi ke Teman
              </span>
              <span className="text-[11px] text-slate-500">
                Dapatkan link & QR code aplikasi KantinKu
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenShareModal();
              }}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer font-display shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Salin Link</span>
            </button>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 font-display">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-900 font-display">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-orange-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
