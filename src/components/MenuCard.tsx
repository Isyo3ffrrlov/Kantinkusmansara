import React from 'react';
import { Plus, Star, Clock, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { formatRupiah } from '../utils/format';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect, onQuickAdd }) => {
  const isOutOfStock = !item.isAvailable || item.stock <= 0;

  return (
    <div
      id={`menu-card-${item.id}`}
      onClick={() => onSelect(item)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            isOutOfStock ? 'grayscale contrast-75' : ''
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Canteen Tag */}
        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/20">
          {item.canteenName.replace('Kantin ', '')}
        </div>

        {/* Promo or Popular Badge */}
        {item.isPromo && item.promoTag ? (
          <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs animate-pulse">
            🔥 {item.promoTag}
          </div>
        ) : item.isPopular ? (
          <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-white" />
            <span>Favorit</span>
          </div>
        ) : null}

        {/* Stock / Out of Stock Banner */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-2xs flex flex-col items-center justify-center text-white p-2">
            <AlertCircle className="w-5 h-5 text-rose-400 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
              Menu Sedang Habis
            </span>
          </div>
        ) : item.stock <= 5 ? (
          <div className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Sisa {item.stock} porsi
          </div>
        ) : null}

        {/* Prep time badge */}
        {!isOutOfStock && (
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>~{item.prepTimeMinutes} mnt</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider">
              {item.category === 'makanan' ? 'Makanan Berat' : item.category === 'minuman' ? 'Minuman Dingin' : 'Snack & Dessert'}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors font-display">
            {item.name}
          </h3>

          <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block leading-none">Harga</span>
            <span className="text-sm font-extrabold text-orange-600 font-display">
              {formatRupiah(item.price)}
            </span>
          </div>

          <button
            id={`btn-add-${item.id}`}
            disabled={isOutOfStock}
            onClick={(e) => onQuickAdd(item, e)}
            aria-label={`Tambah ${item.name} ke keranjang`}
            className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white active:scale-95 border border-orange-200 hover:border-orange-600 shadow-2xs'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
