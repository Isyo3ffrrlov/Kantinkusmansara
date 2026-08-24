import React, { useState } from 'react';
import { X, Store, ChefHat, CheckCircle2, Clock, Flame, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { MenuItem, Order, OrderStatus } from '../types';
import { formatRupiah } from '../utils/format';

interface StaffModalProps {
  orders: Order[];
  menuItems: MenuItem[];
  onClose: () => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onToggleStock: (menuId: string) => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  orders,
  menuItems,
  onClose,
  onUpdateOrderStatus,
  onToggleStock,
}) => {
  const [activeView, setActiveView] = useState<'pesanan' | 'stok'>('pesanan');
  const [selectedCanteenFilter, setSelectedCanteenFilter] = useState<string>('all');

  const incomingOrders = orders.filter((o) => o.status !== 'selesai');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-lg shadow-sm">
              👨‍🍳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-display text-white">
                  Dapur Petugas Kantin SMANSARA
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-300 text-[10px] font-bold rounded-md">
                  Staff Live POS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola pesanan masuk & status stok menu kantin secara real-time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setActiveView('pesanan')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-display ${
              activeView === 'pesanan'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Pesanan Masuk ({incomingOrders.length})
          </button>
          <button
            onClick={() => setActiveView('stok')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-display ${
              activeView === 'stok'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Kelola Stok Menu
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {activeView === 'pesanan' ? (
            incomingOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <ChefHat className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-sm text-slate-700 font-display">
                  Tidak Ada Antrean Pesanan
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Semua pesanan kantin telah selesai diproses & disajikan.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomingOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 font-display">
                            {ord.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded">
                            {ord.pickupCode}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          Pemesan: <strong>{ord.customerName}</strong> ({ord.customerClass})
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
                          {ord.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            <strong>{i.quantity}x</strong> {i.item.name}
                            {i.notes && (
                              <span className="text-rose-600 italic block text-[11px]">
                                Note: {i.notes}
                              </span>
                            )}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {formatRupiah(i.item.price * i.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ord.status === 'diterima' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'sedang_diproses')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Terima & Proses Pesanan
                        </button>
                      )}
                      {(ord.status === 'sedang_diproses' || ord.status === 'menunggu_pembayaran') && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'sedang_disiapkan')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Mulai Masak / Siapkan
                        </button>
                      )}
                      {ord.status === 'sedang_disiapkan' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'siap_diambil')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Siap Diambil Siswa 🔔
                        </button>
                      )}
                      {ord.status === 'siap_diambil' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'selesai')}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Serahkan & Selesaikan Pesanan ✅
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-2">
                Klik tombol toggle untuk mengubah ketersediaan menu (Tersedia / Menu Sedang Habis):
              </p>
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-200"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-[11px] text-slate-500">
                        {item.canteenName} • {formatRupiah(item.price)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleStock(item.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      item.isAvailable && item.stock > 0
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                  >
                    {item.isAvailable && item.stock > 0 ? 'Tersedia' : 'Menu Habis'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
