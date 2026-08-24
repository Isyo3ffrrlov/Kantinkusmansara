import React, { useState } from 'react';
import { X, QrCode, CreditCard, Wallet, Banknote, CheckCircle2, ArrowRight, ShieldCheck, Clock, Store, Copy, Check } from 'lucide-react';
import { CartItem, Order, PaymentMethodType, StudentProfile } from '../types';
import { formatRupiah, generateOrderNumber, generatePickupCode } from '../utils/format';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  cart: CartItem[];
  profile: StudentProfile;
  subtotal: number;
  discount: number;
  serviceFee: number;
  total: number;
  onClose: () => void;
  onPaymentSuccess: (order: Order, usedBalance: boolean, amountPaid: number) => void;
  onGoToOrders: () => void;
  onOpenTopUp: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  cart,
  profile,
  subtotal,
  discount,
  serviceFee,
  total,
  onClose,
  onPaymentSuccess,
  onGoToOrders,
  onOpenTopUp,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('saldo_kantinku');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const isBalanceSufficient = profile.balance >= total;

  const paymentOptions = [
    {
      id: 'saldo_kantinku' as PaymentMethodType,
      name: 'Saldo KantinKu (Kartu Siswa)',
      subtitle: `Sisa saldo: ${formatRupiah(profile.balance)}`,
      icon: CreditCard,
      badge: isBalanceSufficient ? 'Rekomendasi Cepat ⚡' : 'Saldo Kurang ⚠️',
      isInsufficient: !isBalanceSufficient,
      color: 'border-orange-500 bg-orange-50/40 text-orange-950',
    },
    {
      id: 'qris' as PaymentMethodType,
      name: 'QRIS All Payment',
      subtitle: 'BCA, Mandiri, BRI, BNI, Seabank, LinkAja',
      icon: QrCode,
      badge: 'Bebas Admin',
      color: 'border-blue-500 bg-blue-50/40 text-blue-950',
    },
    {
      id: 'gopay' as PaymentMethodType,
      name: 'GoPay / GoPay Later',
      subtitle: 'Pembayaran instan aplikasi Gojek',
      icon: Wallet,
      badge: 'E-Wallet',
      color: 'border-emerald-500 bg-emerald-50/40 text-emerald-950',
    },
    {
      id: 'ovo' as PaymentMethodType,
      name: 'OVO Cash',
      subtitle: 'Verifikasi via notifikasi OVO',
      icon: Wallet,
      badge: 'E-Wallet',
      color: 'border-purple-500 bg-purple-50/40 text-purple-950',
    },
    {
      id: 'dana' as PaymentMethodType,
      name: 'DANA Dompet Digital',
      subtitle: 'Bebas biaya admin transfer',
      icon: Wallet,
      badge: 'E-Wallet',
      color: 'border-sky-500 bg-sky-50/40 text-sky-950',
    },
    {
      id: 'tunai_kasir' as PaymentMethodType,
      name: 'Bayar Tunai di Kasir Kantin',
      subtitle: 'Tunjukkan nomor pesanan saat ambil makanan',
      icon: Banknote,
      badge: 'Cash',
      color: 'border-slate-400 bg-slate-50 text-slate-900',
    },
  ];

  const handleExecutePayment = () => {
    if (selectedMethod === 'saldo_kantinku' && !isBalanceSufficient) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const uniqueCanteens = Array.from(new Set(cart.map((c) => c.item.canteenName)));
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        pickupCode: generatePickupCode(),
        items: [...cart],
        subtotal,
        discount,
        serviceFee,
        total,
        paymentMethod: selectedMethod,
        paymentMethodName:
          paymentOptions.find((p) => p.id === selectedMethod)?.name || 'Digital Payment',
        isPaid: selectedMethod !== 'tunai_kasir',
        status: selectedMethod === 'tunai_kasir' ? 'menunggu_pembayaran' : 'sedang_diproses',
        createdAt: `${now.getDate()} Agt 2026, ${timeStr}`,
        estimatedPickupTime: '10-15 Menit (Jam Istirahat)',
        customerName: profile.name,
        customerClass: profile.className,
        canteenNames: uniqueCanteens,
      };

      setCompletedOrder(newOrder);
      setIsProcessing(false);
      onPaymentSuccess(newOrder, selectedMethod === 'saldo_kantinku', total);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }, 1200);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
          {/* Header Visual */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white text-center relative">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight">
              Pembayaran Berhasil!
            </h2>
            <p className="text-emerald-100 text-xs mt-1">
              Pesananmu sedang diteruskan ke dapur kantin sekolah SMANSARA.
            </p>
          </div>

          {/* Ticket Information */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {/* Pickup Code Card */}
            <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-dashed border-orange-300 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800">
                Kode Pengambilan Makanan
              </span>
              <div className="text-3xl font-black text-orange-600 my-1 font-display tracking-widest flex items-center justify-center gap-2">
                <span>{completedOrder.pickupCode}</span>
                <button
                  onClick={() => handleCopyCode(completedOrder.pickupCode)}
                  className="p-1 rounded-md bg-white hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs cursor-pointer"
                  title="Salin Kode"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Tunjukkan kode atau nomor pesanan ini di meja stand kantin.
              </p>
            </div>

            {/* Order Details List */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Nomor Pesanan</span>
                <span className="font-extrabold text-slate-900 font-display">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Kantin Tujuan</span>
                <span className="font-bold text-slate-800">
                  {completedOrder.canteenNames.join(', ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Metode Pembayaran</span>
                <span className="font-bold text-slate-800">
                  {completedOrder.paymentMethodName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Estimasi Siap Ambil</span>
                <span className="font-bold text-orange-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{completedOrder.estimatedPickupTime}</span>
                </span>
              </div>

              {/* Items in receipt */}
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block">Rincian Item:</span>
                {completedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-slate-600">
                    <span>
                      {i.quantity}x {i.item.name}
                    </span>
                    <span className="font-semibold">{formatRupiah(i.item.price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Total Dibayar</span>
                <span className="text-base text-orange-600 font-display">
                  {formatRupiah(completedOrder.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
            <button
              id="view-order-tracking-btn"
              onClick={onGoToOrders}
              className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 cursor-pointer font-display"
            >
              <span>Lacak Status Pesanan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="back-to-home-btn"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center cursor-pointer font-display"
            >
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PAYMENT SELECTION SCREEN
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Pilih Pembayaran Digital
            </h2>
            <p className="text-xs text-slate-500">
              Pilih metode transaksi cepat & aman
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Order Summary Pill */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-600 font-medium">Total yang harus dibayar</span>
              <div className="text-2xl font-black text-orange-600 font-display">
                {formatRupiah(total)}
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <span>{cart.reduce((a, b) => a + b.quantity, 0)} item pesanan</span>
            </div>
          </div>

          {/* Payment Options Grid */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Metode Pembayaran Tersedia
            </label>

            {paymentOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedMethod === opt.id;
              return (
                <div
                  key={opt.id}
                  id={`pay-method-${opt.id}`}
                  onClick={() => setSelectedMethod(opt.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50/50 shadow-sm ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 font-display">
                          {opt.name}
                        </span>
                        {opt.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              opt.isInsufficient
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block">{opt.subtitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {opt.id === 'saldo_kantinku' && opt.isInsufficient && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTopUp();
                        }}
                        className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                      >
                        Top Up
                      </button>
                    )}
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
                </div>
              );
            })}
          </div>

          {/* QRIS preview simulator if QRIS selected */}
          {selectedMethod === 'qris' && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl text-center space-y-2 animate-in fade-in">
              <div className="inline-block bg-white p-2 rounded-xl">
                {/* SVG mock QRIS code */}
                <div className="w-36 h-36 bg-slate-900 rounded-lg flex flex-col items-center justify-center p-2 text-white">
                  <QrCode className="w-24 h-24 text-white stroke-1" />
                  <span className="text-[9px] font-mono tracking-widest text-slate-300">QRIS-SMANSARA</span>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                NMID: ID10202688192 • KantinKu SMANSARA
              </p>
              <p className="text-[11px] text-amber-300 font-medium">
                Klik tombol "Konfirmasi & Bayar" di bawah untuk simulasi scan instan.
              </p>
            </div>
          )}

          {/* Safe security footer */}
          <div className="flex items-center gap-2 text-slate-500 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Transaksi terenkripsi aman dan terhubung otomatis dengan sistem kasir kantin.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            id="confirm-payment-btn"
            disabled={isProcessing || (selectedMethod === 'saldo_kantinku' && !isBalanceSufficient)}
            onClick={handleExecutePayment}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-display ${
              isProcessing
                ? 'bg-slate-400 text-white cursor-wait'
                : selectedMethod === 'saldo_kantinku' && !isBalanceSufficient
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses Pembayaran Digital...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Konfirmasi & Bayar ({formatRupiah(total)})</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
