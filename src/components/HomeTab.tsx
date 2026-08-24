import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Flame,
  Star,
  ChevronRight,
  Filter,
  UtensilsCrossed,
  Coffee,
  Cookie,
  Store,
  Tag,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Canteen, MenuItem, StudentProfile } from '../types';
import { MenuCard } from './MenuCard';
import { formatRupiah } from '../utils/format';

interface HomeTabProps {
  profile: StudentProfile;
  canteens: Canteen[];
  menuItems: MenuItem[];
  selectedCanteenId: string | null;
  onSelectCanteenFilter: (canteenId: string | null) => void;
  onSelectMenuItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
  onOpenTopUp: () => void;
  onGoToCanteens: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  profile,
  canteens,
  menuItems,
  selectedCanteenId,
  onSelectCanteenFilter,
  onSelectMenuItem,
  onQuickAdd,
  onOpenTopUp,
  onGoToCanteens,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'makanan' | 'minuman' | 'snack'>('all');
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Promo Banners
  const promoBanners = [
    {
      id: 'promo-1',
      title: 'Monday Space-Out 🪐',
      subtitle: 'Diskon 15% semua menu Pasta & Burger di Kantin K-Space khusus hari Senin!',
      code: 'SPACE15',
      color: 'from-amber-600 to-orange-600',
      bgGlow: 'bg-orange-500/20',
      canteenId: 'k-space',
    },
    {
      id: 'promo-2',
      title: 'Rame-Rame ke Ramye 🍜',
      subtitle: 'Beli 3 porsi mi/nasi goreng varian apa saja, GRATIS 1 porsi Es Teh Jumbo!',
      code: 'RAMERAME',
      color: 'from-red-600 to-rose-600',
      bgGlow: 'bg-rose-500/20',
      canteenId: 'ramye',
    },
    {
      id: 'promo-3',
      title: 'Nyam-Nyam Happy Hour 🌶️',
      subtitle: 'Pukul 14.00 - 15.00 WIB, tebus murah Es Jeruk Peras cuma Rp 3.000!',
      code: 'HAPPY3K',
      color: 'from-orange-600 to-amber-700',
      bgGlow: 'bg-amber-500/20',
      canteenId: 'nyam',
    },
  ];

  // Popular items
  const popularItems = useMemo(() => {
    return menuItems.filter((m) => m.isPopular);
  }, [menuItems]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Search query
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.canteenName.toLowerCase().includes(searchQuery.toLowerCase());

      // Canteen filter
      const matchCanteen = !selectedCanteenId || item.canteenId === selectedCanteenId;

      // Category filter
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;

      return matchSearch && matchCanteen && matchCategory;
    });
  }, [menuItems, searchQuery, selectedCanteenId, selectedCategory]);

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* 1. Hero Greeting Bar */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-orange-600/15">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                🍱 SMANSARA Smart Canteen
              </span>
              <span className="text-xs text-amber-200">Kantin Resmi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight">
              Hai warga SMANSARA 👋
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 mt-0.5 font-medium">
              Mau makan apa hari ini, <span className="font-bold text-white">{profile.name.split(' ')[0]}</span>? Pesan sekarang tanpa antre di jam istirahat!
            </p>
          </div>

          {/* Quick Balance card on greeting */}
          <div
            onClick={onOpenTopUp}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-orange-600 flex items-center justify-center font-bold text-sm shadow-sm">
              💳
            </div>
            <div>
              <span className="text-[10px] text-amber-100 uppercase tracking-wider block font-semibold">
                Saldo Kartu Siswa
              </span>
              <span className="text-base font-black text-white font-display">
                {formatRupiah(profile.balance)}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/70 ml-1" />
          </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="main-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari makanan, minuman, atau camilan favoritmu..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs focus:border-orange-500 focus:ring-3 focus:ring-orange-100 text-sm outline-none transition-all placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Reset
          </button>
        )}
      </div>

      {/* 3. Promo Banner Carousel */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h3 className="font-extrabold text-sm text-slate-900 font-display">
              Promo Spesial Hari Ini 🔥
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Hemat S.d 20%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {promoBanners.map((promo) => (
            <div
              key={promo.id}
              onClick={() => onSelectCanteenFilter(promo.canteenId)}
              className={`p-4 rounded-3xl bg-gradient-to-br ${promo.color} text-white shadow-md hover:scale-[1.02] transition-transform duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="inline-block px-2.5 py-0.5 bg-black/30 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider mb-2 border border-white/20">
                  KODE: {promo.code}
                </div>
                <h4 className="font-black text-sm sm:text-base font-display leading-snug">
                  {promo.title}
                </h4>
                <p className="text-xs text-white/90 mt-1 leading-relaxed line-clamp-2">
                  {promo.subtitle}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-amber-200">
                <span>Lihat Stand Kantin</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Kategori 7 Kantin Filter Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Store className="w-4 h-4 text-orange-600" />
            <h3 className="font-extrabold text-sm text-slate-900 font-display">
              Pilih Stand Kantin
            </h3>
          </div>
          <button
            onClick={onGoToCanteens}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer font-display"
          >
            <span>Semua 7 Stand</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            id="filter-canteen-all"
            onClick={() => onSelectCanteenFilter(null)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer font-display flex items-center gap-1.5 ${
              selectedCanteenId === null
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Semua Stand ({menuItems.length})</span>
          </button>

          {canteens.map((c) => {
            const isSelected = selectedCanteenId === c.id;
            return (
              <button
                key={c.id}
                id={`filter-canteen-${c.id}`}
                onClick={() => onSelectCanteenFilter(isSelected ? null : c.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer font-display flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{c.logo}</span>
                <span>{c.name.replace('Kantin ', '')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tabs: Makanan Berat / Minuman / Snack */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all' as const, label: 'Semua Kategori', icon: Filter },
          { id: 'makanan' as const, label: 'Makanan Berat', icon: UtensilsCrossed },
          { id: 'minuman' as const, label: 'Minuman Segar', icon: Coffee },
          { id: 'snack' as const, label: 'Snack & Dessert', icon: Cookie },
        ].map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-display flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Menu Populer (Bestsellers) - Shown when no search query */}
      {!searchQuery && selectedCanteenId === null && selectedCategory === 'all' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <h3 className="font-extrabold text-sm text-slate-900 font-display">
                Menu Paling Populer (Favorit Siswa)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Banyak Dipesan</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {popularItems.slice(0, 4).map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onSelect={onSelectMenuItem}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </div>
      )}

      {/* 6. Daftar Seluruh Menu */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 font-display">
              {selectedCanteenId
                ? `Menu ${canteens.find((c) => c.id === selectedCanteenId)?.name || 'Kantin'}`
                : 'Daftar Seluruh Menu Kantin'}
            </h3>
            <p className="text-xs text-slate-400">
              Menampilkan {filteredItems.length} menu makanan & minuman lezat
            </p>
          </div>

          {selectedCanteenId && (
            <button
              onClick={() => onSelectCanteenFilter(null)}
              className="text-xs text-orange-600 font-bold hover:underline cursor-pointer font-display"
            >
              Tampilkan Semua Kantin
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 text-slate-400">
              🔍
            </div>
            <h4 className="font-bold text-sm text-slate-800 font-display">
              Menu tidak ditemukan
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Coba cari dengan kata kunci lain atau pilih kategori stand kantin yang berbeda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCanteenFilter(null);
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer font-display"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onSelect={onSelectMenuItem}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
