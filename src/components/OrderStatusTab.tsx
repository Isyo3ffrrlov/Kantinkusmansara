import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  AlertCircle,
  QrCode,
  Store,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Flame,
  Check,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatRupiah } from '../utils/format';

interface OrderStatusTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onSelectTab: (tab: 'beranda') => void;
}

export const OrderStatusTab: React.FC<OrderStatusTabProps> = ({
  orders,
  onUpdateOrderStatus,
  onSelectTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'aktif' | 'riwayat'>('aktif');

  const activeOrders = orders.filter((o) => o.status !== 'selesai');
  const historyOrders = orders.filter((o) => o.status === 'selesai');

  const statusSteps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      key: 'diterima',
      label: 'Pesanan Diterima',
      desc: 'Pesanan masuk ke sistem kasir kantin',
      icon: Clock,
    },
    {
      key: 'sedang_diproses',
      label: 'Sedang Diproses',
      desc: 'Pesanan dikonfirmasi oleh penjual',
      icon: ChefHat,
    },
    {
      key: 'sedang_disiapkan',
      label: 'Sedang Disiapkan',
      desc: 'Makanan/minuman sedang diracik & dimasak',
      icon: Flame,
    },
    {
      key: 'siap_diambil',
      label: 'Siap Diambil',
      desc: 'Silakan ambil di meja stand kantin',
      icon: PackageCheck,
    },
    {
      key: 'selesai',
      label: 'Pesanan Selesai',
      desc: 'Pesanan telah diterima & dinikmati',
      icon: CheckCircle2,
    },
  ];

  const getStatusIndex = (status: OrderStatus) => {
    if (status === 'menunggu_pembayaran') return 0;
    const idx = statusSteps.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'menunggu_pembayaran':
        return 'diterima';
      case 'diterima':
        return 'sedang_diproses';
      case 'sedang_diproses':
        return 'sedang_disiapkan';
      case 'sedang_disiapkan':
        return 'siap_diambil';
      case 'siap_diambil':
        return 'selesai';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Pelacakan Pesanan Kantin
          </h1>
          <p className="text-xs text-slate-500">
            Pantau status pesanan makananmu secara real-time tanpa antre
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
          <button
            id="tab-orders-active"
            onClick={() => setActiveSubTab('aktif')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-display ${
              activeSubTab === 'aktif'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aktif ({activeOrders.length})
          </button>
          <button
            id="tab-orders-history"
            onClick={() => setActiveSubTab('riwayat')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-display ${
              activeSubTab === 'riwayat'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Selesai ({historyOrders.length})
          </button>
        </div>
      </div>

      {/* ACTIVE ORDERS VIEW */}
      {activeSubTab === 'aktif' && (
        <div className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-2xl mb-3 text-orange-400">
                🍜
              </div>
              <h3 className="text-base font-bold text-slate-800 font-display">
                Belum Ada Pesanan Aktif
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Yuk pesan makanan lezat dari 7 kantin sekolah SMANSARA sekarang!
              </p>
              <button
                onClick={() => onSelectTab('beranda')}
                className="mt-4 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-colors cursor-pointer font-display"
              >
                Pesan Menu Sekarang
              </button>
            </div>
          ) : (
            activeOrders.map((order) => {
              const currentStepIdx = getStatusIndex(order.status);
              const nextStatus = getNextStatus(order.status);

              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
                >
                  {/* Top Bar Status Alert */}
                  <div
                    className={`p-4 text-white flex items-center justify-between ${
                      order.status === 'siap_diambil'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 animate-pulse'
                        : order.status === 'sedang_disiapkan'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600'
                        : 'bg-gradient-to-r from-orange-600 to-rose-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {order.status === 'siap_diambil' ? (
                        <PackageCheck className="w-5 h-5" />
                      ) : order.status === 'sedang_disiapkan' ? (
                        <ChefHat className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider block opacity-90">
                          Status Saat Ini
                        </span>
                        <span className="text-base font-extrabold font-display leading-none">
                          {order.status === 'siap_diambil'
                            ? '🎉 Makanan Siap Diambil di Stand!'
                            : order.status === 'sedang_disiapkan'
                            ? '🍳 Sedang Dimasak / Diracik'
                            : order.status === 'sedang_diproses'
                            ? '⏳ Dikonfirmasi & Masuk Antrean'
                            : '📦 Pesanan Diterima'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                        Kode Ambil
                      </span>
                      <span className="text-base sm:text-lg font-black font-display bg-white/20 px-2 py-0.5 rounded-lg border border-white/30">
                        {order.pickupCode}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Visual Stepper / Progress Bar */}
                    <div>
                      <div className="relative flex items-center justify-between">
                        {/* Connecting track */}
                        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full z-0">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{
                              width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%`,
                            }}
                          />
                        </div>

                        {/* Steps */}
                        {statusSteps.map((step, idx) => {
                          const isDone = idx < currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          const StepIcon = step.icon;

                          return (
                            <div
                              key={step.key}
                              className="relative z-10 flex flex-col items-center"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : isCurrent
                                    ? 'bg-orange-600 text-white ring-4 ring-orange-100 scale-110'
                                    : 'bg-white border-2 border-slate-200 text-slate-400'
                                }`}
                              >
                                {isDone ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : (
                                  <StepIcon className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <span
                                className={`text-[10px] font-bold mt-1.5 text-center leading-tight max-w-[65px] hidden sm:block ${
                                  isCurrent
                                    ? 'text-orange-600'
                                    : isDone
                                    ? 'text-emerald-700'
                                    : 'text-slate-400'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Current step detailed label on mobile */}
                      <div className="sm:hidden mt-3 text-center bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200/70">
                        <span className="text-xs font-bold text-orange-600">
                          Langkah {currentStepIdx + 1} dari 5: {statusSteps[currentStepIdx]?.label}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {statusSteps[currentStepIdx]?.desc}
                        </p>
                      </div>
                    </div>

                    {/* Order Details Accordion / Summary */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-3 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <div>
                          <span className="text-slate-500 block">Nomor Order</span>
                          <span className="font-extrabold text-slate-900 font-display">
                            {order.orderNumber}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 block">Waktu Pesan</span>
                          <span className="font-semibold text-slate-700">{order.createdAt}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 block">Menu Dipesan:</span>
                        {order.items.map((cartItem, i) => (
                          <div key={i} className="flex justify-between text-slate-700">
                            <div>
                              <span className="font-semibold">
                                {cartItem.quantity}x {cartItem.item.name}
                              </span>
                              <span className="text-[10px] text-slate-400 ml-1.5">
                                ({cartItem.item.canteenName})
                              </span>
                              {cartItem.notes && (
                                <p className="text-[11px] text-amber-700 italic">
                                  Catatan: {cartItem.notes}
                                </p>
                              )}
                            </div>
                            <span className="font-bold">
                              {formatRupiah(cartItem.item.price * cartItem.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-slate-600 font-semibold">Total Pembayaran ({order.paymentMethodName})</span>
                        <span className="font-black text-sm text-orange-600 font-display">
                          {formatRupiah(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Simulator Bar for rapid verification */}
                    <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-amber-900">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold block">Simulasi Alur Kantin:</span>
                          <span className="text-[11px] text-amber-700">
                            Majukan status pesanan untuk menguji notifikasi & pengambilan
                          </span>
                        </div>
                      </div>

                      {nextStatus && (
                        <button
                          id={`advance-status-${order.id}`}
                          onClick={() => onUpdateOrderStatus(order.id, nextStatus)}
                          className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer font-display"
                        >
                          <span>
                            {nextStatus === 'siap_diambil'
                              ? 'Set Siap Diambil 🔔'
                              : nextStatus === 'selesai'
                              ? 'Konfirmasi Selesai Ambil ✅'
                              : 'Lanjut ke Tahap Berikutnya ➡️'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* HISTORY ORDERS VIEW */}
      {activeSubTab === 'riwayat' && (
        <div className="space-y-3">
          {historyOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
              <p className="text-xs text-slate-500">Belum ada riwayat pesanan selesai.</p>
            </div>
          ) : (
            historyOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-display">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                      Selesai
                    </span>
                  </div>
                  <span className="text-slate-400">{order.createdAt}</span>
                </div>

                <div className="text-slate-600">
                  {order.items.map((i, idx) => (
                    <span key={idx}>
                      {i.quantity}x {i.item.name}
                      {idx < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 text-[11px]">{order.paymentMethodName}</span>
                  <span className="font-black text-slate-900 font-display text-sm">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
