export type ItemCategory = 'makanan' | 'minuman' | 'snack';

export type CanteenCategory = 'Makanan Berat' | 'Bakery & Dessert' | 'Street Food & Gorengan' | 'Korean & Dimsum' | 'Jajanan Tradisional';

export interface MenuItem {
  id: string;
  canteenId: string;
  canteenName: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: ItemCategory;
  image: string;
  description: string;
  isAvailable: boolean;
  stock: number;
  rating: number;
  isPopular?: boolean;
  isPromo?: boolean;
  promoTag?: string;
  prepTimeMinutes: number;
}

export interface Canteen {
  id: string;
  name: string;
  subtitle: string;
  category: CanteenCategory;
  rating: number;
  reviewCount: number;
  image: string;
  logo: string;
  color: string;
  promo?: {
    title: string;
    description: string;
    badge: string;
    discountPercent?: number;
  };
  openTime: string;
  location: string;
  isOpen: boolean;
  estimatedQueue: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes: string;
}

export type OrderStatus =
  | 'menunggu_pembayaran'
  | 'diterima'
  | 'sedang_diproses'
  | 'sedang_disiapkan'
  | 'siap_diambil'
  | 'selesai';

export type PaymentMethodType =
  | 'saldo_kantinku'
  | 'qris'
  | 'gopay'
  | 'ovo'
  | 'dana'
  | 'shopeepay'
  | 'va_bca'
  | 'va_bri'
  | 'va_mandiri'
  | 'tunai_kasir';

export interface Order {
  id: string;
  orderNumber: string;
  pickupCode: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  serviceFee: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentMethodName: string;
  isPaid: boolean;
  status: OrderStatus;
  createdAt: string;
  estimatedPickupTime: string;
  customerName: string;
  customerClass: string;
  canteenNames: string[];
}

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'purchase';
  title: string;
  amount: number;
  timestamp: string;
  paymentMethod: string;
  status: 'Berhasil' | 'Menunggu' | 'Gagal';
  orderId?: string;
}

export interface StudentProfile {
  name: string;
  studentId: string;
  maskedId: string;
  className: string;
  nisn: string;
  balance: number;
  cardStatus: 'Aktif' | 'Nonaktif' | 'Diblokir';
  avatar: string;
  email: string;
  role: 'siswa' | 'guru' | 'petugas';
}

export type ActiveTab = 'beranda' | 'kantin' | 'pesanan' | 'topup' | 'profil';
