import React, { useState } from 'react';
import { Store, Star, Clock, MapPin, Sparkles, ArrowRight, Utensils, Search } from 'lucide-react';
import { Canteen, MenuItem } from '../types';

interface CanteensTabProps {
  canteens: Canteen[];
  menuItems: MenuItem[];
  onSelectCanteen: (canteenId: string) => void;
}

export const CanteensTab: React.FC<CanteensTabProps> = ({
  canteens,
  menuItems,
  onSelectCanteen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCanteens = canteens.filter((c) => {
    const matchName = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSub = c.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchName || matchSub || matchCat;
  });

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-display">
              Daftar 7 Stand Kantin Sekolah
            </h1>
            <p className="text-xs text-slate-500">
              Kantin resmi SMANSARA dengan hidangan higienis, lezat, dan terpercaya
            </p>
          </div>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-extrabold rounded-full self-start sm:self-auto font-display">
            7 Stand Aktif Hari Ini
          </span>
        </div>

        {/* Search Kantin */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama stand kantin (K-Space, Ramye, Sudut.mu...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-xs outline-none bg-slate-50/60"
          />
        </div>
      </div>

      {/* Canteen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCanteens.map((canteen) => {
          const canteenMenuCount = menuItems.filter((m) => m.canteenId === canteen.id).length;

          return (
            <div
              key={canteen.id}
              id={`canteen-card-${canteen.id}`}
              className="group bg-white rounded-3xl border border-slate-200/90 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={canteen.image}
                    alt={canteen.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-base shadow-sm">
                      {canteen.logo}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                      {canteen.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Buka ({canteen.openTime})</span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                    <div>
                      <h2 className="text-lg font-black font-display drop-shadow-md">
                        {canteen.name}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-amber-200 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{canteen.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold border border-white/10">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{canteen.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 font-medium line-clamp-2">
                    {canteen.subtitle}
                  </p>

                  {/* Promo Banner if any */}
                  {canteen.promo && (
                    <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/80 rounded-2xl p-2.5 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-extrabold text-rose-700 block font-display">
                          {canteen.promo.badge}
                        </span>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          {canteen.promo.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Metadata Chips */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Utensils className="w-3.5 h-3.5 text-orange-500" />
                      <span>{canteenMenuCount} Menu Tersedia</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Antrean ~{canteen.estimatedQueue}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  id={`btn-view-canteen-${canteen.id}`}
                  onClick={() => onSelectCanteen(canteen.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-orange-200 hover:border-orange-600 transition-all cursor-pointer font-display group-hover:bg-orange-600 group-hover:text-white"
                >
                  <span>Lihat Seluruh Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
