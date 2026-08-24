import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Building2,
  Wallet,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { StudentProfile, WalletTransaction } from '../types';
import { formatRupiah } from '../utils/format';
import confetti from 'canvas-confetti';

interface TopUpTabProps {
  profile: StudentProfile;
  transactions: WalletTransaction[];
  onTopUpSuccess: (amount: number, paymentMethod: string) => void;
}

export const TopUpTab: React.FC<TopUpTabProps> = ({
  profile,
  transactions,
  onTopUpSuccess,
}) => {
  // Step navigation: 1 = Digital Card View, 2 = Nominal & Method Selection, 3 = Confirmation / Success View
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedNominal, setSelectedNominal] = useState<number>(50000);
  const [customNominal, setCustomNominal] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('qris');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastTopUpAmount, setLastTopUpAmount] = useState<number>(0);
  const [lastPaymentMethodName, setLastPaymentMethodName] = useState<string>('');
  const [copiedVA, setCopiedVA] = useState<boolean>(false);

  const presetNominals = [10000, 20000, 50000, 100000];

  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS Instan',
      category: 'QRIS',
      icon: QrCode,
      desc: 'Scan dari BCA, Mandiri, GoPay, OVO, Dana, LinkAja',
      badge: 'Paling Cepat ⚡',
    },
    {
      id: 'gopay',
      name: 'GoPay',
      category: 'E-Wallet',
      icon: Wallet,
      desc: 'Notifikasi otomatis aplikasi Gojek',
      badge: 'E-Wallet',
    },
    {
      id: 'ovo',
      name: 'OVO Cash',
      category: 'E-Wallet',
      icon: Wallet,
      desc: 'Verifikasi instan via OVO',
      badge: 'E-Wallet',
    },
    {
      id: 'dana',
      name: 'DANA Dompet Digital',
      category: 'E-Wallet',
      icon: Wallet,
      desc: 'Bebas biaya admin top up',
      badge: 'E-Wallet',
    },
    {
      id: 'va_bca',
      name: 'BCA Virtual Account',
      category: 'Transfer Bank / VA',
      icon: Building2,
      desc: 'VA: 88029 08129823481',
      badge: 'Auto Konfirmasi',
    },
    {
      id: 'va_bri',
      name: 'BRI Virtual Account (BRIVA)',
      category: 'Transfer Bank / VA',
      icon: Building2,
      desc: 'VA: 12903 08129823481',
      badge: 'Auto Konfirmasi',
    },
    {
      id: 'va_mandiri',
      name: 'Mandiri Livin Virtual Account',
      category: 'Transfer Bank / VA',
      icon: Building2,
      desc: 'VA: 89012 08129823481',
      badge: 'Auto Konfirmasi',
    },
  ];

  const getEffectiveNominal = () => {
    if (isCustom) {
      const parsed = parseInt(customNominal.replace(/\D/g, ''), 10);
      return isNaN(parsed) || parsed < 5000 ? 5000 : parsed;
    }
    return selectedNominal;
  };

  const handleProceedPayment = () => {
    const finalAmount = getEffectiveNominal();
    const methodObj = paymentMethods.find((m) => m.id === selectedMethod);
    const methodName = methodObj ? methodObj.name : 'QRIS Digital';

    setIsProcessing(true);

    setTimeout(() => {
      onTopUpSuccess(finalAmount, methodName);
      setLastTopUpAmount(finalAmount);
      setLastPaymentMethodName(methodName);
      setIsProcessing(false);
      setCurrentStep(3);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    }, 1200);
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText('8802908129823481');
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* ================= STEP 1: KARTU DIGITAL & RINGKASAN SALDO ================= */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Title */}
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display">
              Kartu Digital & Saldo Siswa
            </h1>
            <p className="text-xs text-slate-500">
              Gunakan kartu digital SMANSARA untuk pembayaran cepat di semua stand kantin
            </p>
          </div>

          {/* Modern Digital Card */}
          <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br from-slate-900 via-orange-950 to-orange-900 border border-orange-500/30">
            {/* Ambient metallic sheen patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-52 sm:h-56">
              {/* Card Top Row */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                    🍱
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase text-amber-300 font-display block">
                      SMAN 1 JEPARA (SMANSARA)
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">
                      Smart Canteen Student Card
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Status: {profile.cardStatus}</span>
                </div>
              </div>

              {/* Card Chip & RFID Visual */}
              <div className="flex items-center gap-3 my-2">
                <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-inner flex items-center justify-center">
                  <div className="w-7 h-5 border border-amber-700/40 rounded-xs grid grid-cols-2 gap-0.5 opacity-60" />
                </div>
                <div className="text-[11px] text-slate-300 font-mono tracking-widest">
                  RFID / NFC ENABLED
                </div>
              </div>

              {/* Card Bottom Details */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                    Nama Siswa
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white font-display">
                    {profile.name}
                  </span>
                  <span className="text-xs text-amber-200/80 font-mono block mt-0.5">
                    {profile.maskedId}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                    Saldo Saat Ini
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-display">
                    {formatRupiah(profile.balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Prominent Main Action Button */}
          <button
            id="topup-main-btn"
            onClick={() => setCurrentStep(2)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 hover:from-orange-700 hover:to-amber-600 text-white font-black text-base flex items-center justify-center gap-2.5 shadow-lg shadow-orange-600/30 active:scale-[0.99] transition-all cursor-pointer font-display"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Top Up Saldo Sekarang</span>
          </button>

          {/* Quick shortcuts / features info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 text-center shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-slate-900 block">Aman & Terlindungi</span>
              <span className="text-[10px] text-slate-400">PIN & ID Siswa</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 text-center shadow-2xs">
              <QrCode className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-slate-900 block">QRIS Otomatis</span>
              <span className="text-[10px] text-slate-400">Bebas Biaya Admin</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 text-center shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-slate-900 block">Diskon Spesial</span>
              <span className="text-[10px] text-slate-400">Cashback Kantin</span>
            </div>
          </div>

          {/* Transaksi Terakhir (Recent Transactions) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-sm text-slate-900 font-display">
                  Transaksi Terakhir
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Riwayat Digital</span>
            </div>

            <div className="space-y-2.5">
              {transactions.map((trx) => {
                const isPositive = trx.type === 'topup';
                return (
                  <div
                    key={trx.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-900 block font-display">
                          {trx.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {trx.timestamp} • {trx.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-extrabold font-display block ${
                          isPositive ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {isPositive ? `+${formatRupiah(trx.amount)}` : `-${formatRupiah(trx.amount)}`}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {trx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: PILIH NOMINAL & METODE PEMBAYARAN ================= */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Back Navigation Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Top Up Saldo KantinKu
              </h2>
              <p className="text-xs text-slate-500">
                Pilih jumlah saldo dan saluran pembayaran
              </p>
            </div>
          </div>

          {/* 1. Pilih Nominal Saldo */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Pilih Nominal Pengisian
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {presetNominals.map((amount) => {
                const isSelected = !isCustom && selectedNominal === amount;
                return (
                  <button
                    key={amount}
                    id={`nominal-btn-${amount}`}
                    type="button"
                    onClick={() => {
                      setSelectedNominal(amount);
                      setIsCustom(false);
                    }}
                    className={`py-3 px-3 rounded-2xl border-2 font-black text-sm transition-all cursor-pointer font-display ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    {formatRupiah(amount)}
                  </button>
                );
              })}
            </div>

            {/* Custom Nominal Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`text-xs font-bold transition-colors cursor-pointer mb-2 flex items-center gap-1 ${
                  isCustom ? 'text-orange-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Atau Masukkan Nominal Lainnya:</span>
              </button>

              {isCustom && (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    placeholder="Contoh: 75000"
                    value={customNominal}
                    onChange={(e) => setCustomNominal(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 font-extrabold text-slate-900 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 2. Pilih Metode Pembayaran Digital */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. Pilih Metode Pembayaran Digital
            </label>

            <div className="space-y-2.5">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <div
                    key={method.id}
                    id={`topup-method-${method.id}`}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 font-display">
                            {method.name}
                          </span>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                            {method.badge}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block">{method.desc}</span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-orange-600 bg-orange-600'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action: Lanjutkan Pembayaran */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs text-slate-400 block leading-none">Total Top Up</span>
              <span className="text-xl font-black text-orange-600 font-display">
                {formatRupiah(getEffectiveNominal())}
              </span>
            </div>

            <button
              id="continue-topup-pay-btn"
              disabled={isProcessing}
              onClick={handleProceedPayment}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 active:scale-[0.98] transition-all cursor-pointer font-display"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses Top Up...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Lanjutkan Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: TOP UP SELESAI & BUKTI TRANSAKSI ================= */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden text-center">
            {/* Header Success visual */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-black font-display tracking-tight">
                Top Up Berhasil!
              </h2>
              <p className="text-emerald-100 text-xs mt-1">
                Saldo kartu digital siswa SMANSARA berhasil ditambahkan
              </p>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-4 text-left">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200 text-center">
                <span className="text-xs text-slate-600 font-semibold block">
                  Nominal Top Up Berhasil
                </span>
                <span className="text-3xl font-black text-orange-600 font-display my-1 block">
                  +{formatRupiah(lastTopUpAmount)}
                </span>
                <span className="text-xs text-slate-500">
                  Saldo Baru:{' '}
                  <strong className="text-slate-900 font-display">
                    {formatRupiah(profile.balance)}
                  </strong>
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Metode Pembayaran</span>
                  <span className="font-bold text-slate-900">{lastPaymentMethodName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Nama Siswa</span>
                  <span className="font-bold text-slate-900">{profile.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">ID Siswa</span>
                  <span className="font-mono text-slate-900">{profile.maskedId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Waktu Transaksi</span>
                  <span className="font-semibold text-slate-900">
                    24 Agt 2026, {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="topup-finish-btn"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 cursor-pointer font-display"
                >
                  <span>Kembali ke Kartu & Saldo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
