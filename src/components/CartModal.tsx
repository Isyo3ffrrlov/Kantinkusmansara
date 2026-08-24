import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck, Store, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { formatRupiah } from '../utils/format';

interface CartModalProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToPayment: (subtotal: number, discount: number, serviceFee: number, total: number) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToPayment,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
  const serviceFee = 0; // Rp 0 free service for SMANSARA students!
  const total = Math.max(0, subtotal - appliedDiscount + serviceFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'SMANSARA' || code === 'HEMAT5K') {
      const discount = Math.min(5000, subtotal);
      setAppliedDiscount(discount);
      setPromoMessage({ text: 'Voucher Pelajar Hemat Rp 5.000 berhasil diterapkan!' });
    } else if (code === 'SPACE15' || code === 'MONDAY') {
      const discount = Math.round(subtotal * 0.15);
      setAppliedDiscount(discount);
      setPromoMessage({ text: 'Diskon 15% Space-Out berhasil diterapkan!' });
    } else {
      setAppliedDiscount(0);
      setPromoMessage({ text: 'Kode promo tidak valid atau telah kadaluarsa', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-600 text-white shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Keranjang Pesanan
              </h2>
              <p className="text-xs text-slate-500">
                {cart.length} jenis item pesanan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                Hapus Semua
              </button>
            )}
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-3xl mb-3 text-orange-400">
                🛒
              </div>
              <h3 className="text-base font-bold text-slate-800 font-display">
                Keranjangmu masih kosong
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Yuk pilih makanan atau minuman lezat dari 7 kantin sekolah SMANSARA!
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-colors cursor-pointer font-display"
              >
                Lihat Menu Sekarang
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                {cart.map((cartItem, idx) => (
                  <div
                    key={`${cartItem.item.id}-${idx}`}
                    className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex gap-3 items-center justify-between"
                  >
                    {/* Item Image */}
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-200"
                    />

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-100/70 px-1.5 py-0.2 rounded">
                          {cartItem.item.canteenName.replace('Kantin ', '')}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate font-display mt-0.5">
                        {cartItem.item.name}
                      </h4>
                      <div className="text-xs font-extrabold text-orange-600 font-display">
                        {formatRupiah(cartItem.item.price)}
                      </div>
                      {cartItem.notes && (
                        <p className="text-[11px] text-slate-500 italic truncate mt-0.5">
                          "{cartItem.notes}"
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                        <button
                          onClick={() => {
                            if (cartItem.quantity > 1) {
                              onUpdateQuantity(idx, cartItem.quantity - 1);
                            } else {
                              onRemoveItem(idx);
                            }
                          }}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {cartItem.quantity === 1 ? (
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900 font-display">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                          disabled={cartItem.quantity >= cartItem.item.stock}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Kode Promo (cth: SMANSARA)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase font-bold tracking-wider rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer font-display"
                  >
                    Terapkan
                  </button>
                </form>
                {promoMessage && (
                  <p
                    className={`text-xs mt-2 font-medium flex items-center gap-1 ${
                      promoMessage.isError ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{promoMessage.text}</span>
                  </p>
                )}
              </div>

              {/* Order Cost Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} item)</span>
                  <span className="font-bold text-slate-900">{formatRupiah(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Diskon Promo Siswa</span>
                    <span>-{formatRupiah(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Biaya Layanan & Kemasan</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">GRATIS</span>
                  </span>
                  <span className="font-bold text-emerald-600">Rp 0</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-900">
                  <span className="font-extrabold text-sm">Total Pembayaran</span>
                  <span className="font-black text-base sm:text-lg text-orange-600 font-display">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pesanan akan diteruskan langsung ke dapur kantin tujuan setelah pembayaran dikonfirmasi.</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block leading-none">Total Tagihan</span>
              <span className="text-xl font-black text-slate-900 font-display">
                {formatRupiah(total)}
              </span>
            </div>

            <button
              id="proceed-to-payment-btn"
              onClick={() => onProceedToPayment(subtotal, appliedDiscount, serviceFee, total)}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 active:scale-[0.98] transition-all cursor-pointer font-display"
            >
              <span>Lanjut Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
