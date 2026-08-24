import React from 'react';
import { Home, Store, Clock, Wallet, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeOrdersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  activeOrdersCount = 0,
}) => {
  const navItems = [
    { id: 'beranda' as ActiveTab, label: 'Beranda', icon: Home },
    { id: 'kantin' as ActiveTab, label: 'Kantin', icon: Store },
    { id: 'pesanan' as ActiveTab, label: 'Pesanan', icon: Clock, badge: activeOrdersCount },
    { id: 'topup' as ActiveTab, label: 'Top Up', icon: Wallet },
    { id: 'profil' as ActiveTab, label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md md:max-w-lg mx-auto px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-orange-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-orange-100/80 text-orange-600' : 'text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 font-display">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
