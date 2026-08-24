import React, { useState } from 'react';
import { X, Plus, Minus, Star, Clock, ShoppingBag, Store, Sparkles, MessageSquare } from 'lucide-react';
import { MenuItem } from '../types';
import { formatRupiah } from '../utils/format';

interface MenuDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, notes: string) => void;
}

export const MenuDetailModal: React.FC<MenuDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const isOutOfStock = !item.isAvailable || item.stock <= 0;
  const totalPrice = item.price * quantity;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(item, quantity, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Close Button Floating */}
        <button
          id="close-menu-detail-btn"
          onClick={onClose}
          aria-label="Tutup detail menu"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Realistic Food Photo */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Top Stall Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/50">
            <Store className="w-3.5 h-3.5 text-orange-600" />
            <span>{item.canteenName}</span>
          </div>

          {/* Bottom Info on Image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-orange-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs inline-block mb-1">
                {item.category === 'makanan' ? 'Makanan Berat' : item.category === 'minuman' ? 'Minuman' : 'Camilan & Dessert'}
              </span>
              <div className="flex items-center gap-2 text-white text-xs">
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{item.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Estimasi ~{item.prepTimeMinutes} menit</span>
                </div>
              </div>
            </div>

            {/* Stock Badge */}
            <div className="text-right">
              {isOutOfStock ? (
                <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm">
                  Stok Habis
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm">
                  Tersedia: {item.stock} porsi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                {item.name}
              </h2>
              {item.isPromo && item.promoTag && (
                <div className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  <Sparkles className="w-3 h-3" />
                  <span>{item.promoTag}</span>
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block">Harga Satuan</span>
              <span className="text-xl font-black text-orange-600 font-display">
                {formatRupiah(item.price)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Deskripsi Menu
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Jumlah Pesanan</span>
              <span className="text-xs text-slate-500">Maks. {item.stock} porsi</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-orange-200 shadow-2xs">
              <button
                id="qty-minus-btn"
                type="button"
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-black text-slate-900 text-base font-display">
                {quantity}
              </span>
              <button
                id="qty-plus-btn"
                type="button"
                disabled={quantity >= item.stock || isOutOfStock}
                onClick={() => setQuantity((q) => Math.min(item.stock, q + 1))}
                className="w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes for Seller */}
          <div>
            <label
              htmlFor="seller-notes-input"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
              <span>Catatan Tambahan untuk Penjual</span>
            </label>
            <input
              id="seller-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Jangan terlalu pedas, es dipisah, banyakin saus mayo..."
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm outline-none transition-all placeholder:text-slate-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Opsional (tidak ada biaya tambahan)</span>
              <span>{notes.length}/120</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA with dynamic total */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block leading-none">Total Pembayaran</span>
            <span className="text-xl font-black text-slate-900 font-display leading-tight">
              {formatRupiah(totalPrice)}
            </span>
          </div>

          <button
            id="add-to-cart-confirm-btn"
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`flex-1 py-3 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-display ${
              isOutOfStock
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white shadow-orange-600/25'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Menu Habis' : 'Tambah ke Keranjang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
