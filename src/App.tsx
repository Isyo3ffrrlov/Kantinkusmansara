import React, { useState, useEffect } from 'react';
import {
  allMenuItems,
  canteens,
  initialStudentProfile,
  initialTransactions,
  mockInitialOrders,
} from './data/canteenData';
import {
  ActiveTab,
  CartItem,
  MenuItem,
  Order,
  OrderStatus,
  StudentProfile,
  WalletTransaction,
} from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { HomeTab } from './components/HomeTab';
import { CanteensTab } from './components/CanteensTab';
import { OrderStatusTab } from './components/OrderStatusTab';
import { TopUpTab } from './components/TopUpTab';
import { ProfileTab } from './components/ProfileTab';
import { MenuDetailModal } from './components/MenuDetailModal';
import { CartModal } from './components/CartModal';
import { PaymentModal } from './components/PaymentModal';
import { StaffModal } from './components/StaffModal';
import { ShareAppModal } from './components/ShareAppModal';
import { HelpModal } from './components/HelpModal';
import { Sparkles, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatRupiah } from './utils/format';

export const App: React.FC = () => {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');

  // User Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('kantinku_profile');
    return saved ? JSON.parse(saved) : initialStudentProfile;
  });

  // Menu items and Stock
  const [menuItems, setMenuItems] = useState<MenuItem[]>(allMenuItems);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kantinku_orders');
    return saved ? JSON.parse(saved) : mockInitialOrders;
  });

  // Transactions State
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('kantinku_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Modals State
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    subtotal: number;
    discount: number;
    serviceFee: number;
    total: number;
  }>({ subtotal: 0, discount: 0, serviceFee: 0, total: 0 });

  // Filter on Home
  const [selectedCanteenFilter, setSelectedCanteenFilter] = useState<string | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kantinku_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('kantinku_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kantinku_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Cart total items count
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'selesai').length;

  // Add Item to Cart
  const handleAddToCart = (item: MenuItem, quantity: number = 1, notes: string = '') => {
    if (!item.isAvailable || item.stock <= 0) {
      showToast('Maaf, menu sedang habis!', 'warn');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (c) => c.item.id === item.id && c.notes === notes
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(item.stock, newQty),
        };
        return updated;
      } else {
        return [...prevCart, { item, quantity, notes }];
      }
    });

    showToast(`+${quantity} ${item.name} ditambahkan ke keranjang!`, 'success');
  };

  // Quick Add from Menu Card
  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(item, 1, '');
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    setCart((prev) => {
      const updated = [...prev];
      if (quantity <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index] = { ...updated[index], quantity };
      return updated;
    });
  };

  // Remove Cart Item
  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item dihapus dari keranjang', 'info');
  };

  // Clear Cart
  const handleClearCart = () => {
    setCart([]);
    showToast('Keranjang telah dikosongkan', 'info');
  };

  // Proceed to payment from Cart
  const handleProceedToPayment = (
    subtotal: number,
    discount: number,
    serviceFee: number,
    total: number
  ) => {
    setPaymentData({ subtotal, discount, serviceFee, total });
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  // Successful Payment Handler
  const handlePaymentSuccess = (newOrder: Order, usedBalance: boolean, amountPaid: number) => {
    // Add new order
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart
    setCart([]);

    // If paid via Saldo KantinKu, deduct balance and record transaction
    if (usedBalance) {
      setProfile((prev) => ({
        ...prev,
        balance: Math.max(0, prev.balance - amountPaid),
      }));

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
      const newTrx: WalletTransaction = {
        id: `TRX-${Date.now().toString().slice(-4)}`,
        type: 'purchase',
        title: `Pembelian Makanan (${newOrder.canteenNames[0] || 'Kantin'})`,
        amount: amountPaid,
        timestamp: `${now.getDate()} Agt 2026, ${timeStr}`,
        paymentMethod: 'Saldo KantinKu',
        status: 'Berhasil',
        orderId: newOrder.orderNumber,
      };

      setTransactions((prev) => [newTrx, ...prev]);
    }

    showToast(`Pesanan ${newOrder.orderNumber} berhasil dibuat!`, 'success');
  };

  // Top Up Success Handler
  const handleTopUpSuccess = (amount: number, paymentMethodName: string) => {
    setProfile((prev) => ({
      ...prev,
      balance: prev.balance + amount,
    }));

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const newTrx: WalletTransaction = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      type: 'topup',
      title: 'Top Up Saldo KantinKu',
      amount: amount,
      timestamp: `${now.getDate()} Agt 2026, ${timeStr}`,
      paymentMethod: paymentMethodName,
      status: 'Berhasil',
    };

    setTransactions((prev) => [newTrx, ...prev]);
    showToast(`Top up +${formatRupiah(amount)} berhasil ditambahkan ke kartu!`, 'success');
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, status: nextStatus };
        }
        return ord;
      })
    );

    if (nextStatus === 'siap_diambil') {
      showToast('🔔 Pesananmu sudah SIAP DIAMBIL di meja stand kantin!', 'success');
    } else if (nextStatus === 'selesai') {
      showToast('✅ Pesanan selesai. Selamat menikmati hidangan!', 'info');
    } else {
      showToast(`Status pesanan diperbarui ke: ${nextStatus.replace('_', ' ')}`, 'info');
    }
  };

  // Toggle Stock Availability
  const handleToggleStock = (menuId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === menuId) {
          const nextAvail = !item.isAvailable;
          return {
            ...item,
            isAvailable: nextAvail,
            stock: nextAvail ? (item.stock > 0 ? item.stock : 15) : 0,
          };
        }
        return item;
      })
    );
    showToast('Ketersediaan menu diperbarui', 'info');
  };

  // Select Canteen from Canteens Tab
  const handleSelectCanteen = (canteenId: string) => {
    setSelectedCanteenFilter(canteenId);
    setActiveTab('beranda');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Splash Screen Component */}
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}

      {/* 2. Top Navigation Bar */}
      <Navbar
        profile={profile}
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTopUp={() => setActiveTab('topup')}
        onOpenStaffModal={() => setIsStaffModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        onGoToHome={() => {
          setSelectedCanteenFilter(null);
          setActiveTab('beranda');
        }}
      />

      {/* 3. Toast Notifications Popup */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm w-[90%] pointer-events-none">
          <div
            className={`p-3.5 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-slate-900/95 text-white border-emerald-500/50'
                : toast.type === 'warn'
                ? 'bg-rose-900/95 text-white border-rose-500/50'
                : 'bg-slate-900/95 text-white border-slate-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toast.type === 'warn' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <Bell className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <span className="text-xs font-bold font-display">{toast.message}</span>
          </div>
        </div>
      )}

      {/* 4. Main Tab Router Views */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'beranda' && (
          <HomeTab
            profile={profile}
            canteens={canteens}
            menuItems={menuItems}
            selectedCanteenId={selectedCanteenFilter}
            onSelectCanteenFilter={(id) => setSelectedCanteenFilter(id)}
            onSelectMenuItem={(item) => setSelectedDetailItem(item)}
            onQuickAdd={handleQuickAdd}
            onOpenTopUp={() => setActiveTab('topup')}
            onGoToCanteens={() => setActiveTab('kantin')}
          />
        )}

        {activeTab === 'kantin' && (
          <CanteensTab
            canteens={canteens}
            menuItems={menuItems}
            onSelectCanteen={handleSelectCanteen}
          />
        )}

        {activeTab === 'pesanan' && (
          <OrderStatusTab
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'topup' && (
          <TopUpTab
            profile={profile}
            transactions={transactions}
            onTopUpSuccess={handleTopUpSuccess}
          />
        )}

        {activeTab === 'profil' && (
          <ProfileTab
            profile={profile}
            orders={orders}
            onOpenTopUp={() => setActiveTab('topup')}
            onOpenStaffModal={() => setIsStaffModalOpen(true)}
            onOpenHelpModal={() => setIsHelpModalOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onUpdateRole={(role) => setProfile((p) => ({ ...p, role }))}
          />
        )}
      </main>

      {/* 5. Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeOrdersCount={activeOrdersCount}
      />

      {/* 6. Modals */}
      {/* Menu Detail Modal */}
      {selectedDetailItem && (
        <MenuDetailModal
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <CartModal
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {/* Payment Modal */}
      {isPaymentOpen && (
        <PaymentModal
          cart={cart}
          profile={profile}
          subtotal={paymentData.subtotal}
          discount={paymentData.discount}
          serviceFee={paymentData.serviceFee}
          total={paymentData.total}
          onClose={() => setIsPaymentOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onGoToOrders={() => {
            setIsPaymentOpen(false);
            setActiveTab('pesanan');
          }}
          onOpenTopUp={() => {
            setIsPaymentOpen(false);
            setActiveTab('topup');
          }}
        />
      )}

      {/* Staff Kitchen POS Modal */}
      {isStaffModalOpen && (
        <StaffModal
          orders={orders}
          menuItems={menuItems}
          onClose={() => setIsStaffModalOpen(false)}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onToggleStock={handleToggleStock}
        />
      )}

      {/* Share App Modal */}
      {isShareModalOpen && (
        <ShareAppModal
          onClose={() => setIsShareModalOpen(false)}
          onShowToast={showToast}
        />
      )}

      {/* Help & Contact Modal */}
      {isHelpModalOpen && (
        <HelpModal
          onClose={() => setIsHelpModalOpen(false)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />
      )}
    </div>
  );
};

export default App;
