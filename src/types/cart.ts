/**
 * Cart and Order types — used by both client (cart store, drawer, checkout)
 * and server (API routes, storage). Keep this file in sync with the future
 * Prisma schema in `prisma/schema.prisma`.
 *
 * IMPORTANT: All prices are integers in UAH (грн). The source menu.json
 * stores whole-UAH integers (no kopecks needed). LiqPay also accepts
 * decimal UAH directly so no conversion needed.
 */

/** Format integer UAH as "1 234 ₴" */
export const formatPrice = (uah: number): string => {
  return `${Math.round(uah).toLocaleString('uk-UA').replace(/,/g, ' ')} ₴`;
};

// ─── Business rules ───
/** Мінімальна сума замовлення (грн) */
export const MIN_ORDER = 500;
/** Фіксована вартість доставки (грн) */
export const DELIVERY_FEE = 100;
/** Поріг безкоштовної доставки (грн) */
export const FREE_DELIVERY_THRESHOLD = 2000;

// ─── Cart (client side) ───
export interface CartItem {
  /** Stable id from menu (slug or original id) */
  menuItemId: string;
  /** Snapshot of name at the time of adding */
  name: string;
  /** Price in UAH (грн), integer */
  price: number;
  /** Optional image URL */
  image?: string;
  /** Optional weight string for display */
  weight?: string;
  /** Quantity (≥ 1) */
  quantity: number;
}

// ─── Order (server / storage) ───
export type OrderStatus =
  | 'PENDING' // створено, очікує оплати
  | 'PAID' // оплачено
  | 'CONFIRMED' // підтверджено кухнею
  | 'PREPARING' // готується
  | 'DELIVERING' // в дорозі
  | 'COMPLETED' // виконано
  | 'CANCELLED';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type DeliveryType = 'delivery' | 'pickup';

export interface OrderItem {
  menuItemId: string;
  name: string;
  /** UAH (грн) */
  price: number;
  quantity: number;
}

export interface OrderInput {
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  address?: string;
  /** ISO datetime if scheduled, otherwise null = ASAP */
  scheduledAt?: string | null;
  comment?: string;
  items: OrderItem[];
  /** UAH */
  subtotal: number;
  /** UAH */
  deliveryFee: number;
  /** UAH */
  total: number;
}

export interface Order extends OrderInput {
  id: string;
  /** Human-readable sequential number */
  number: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  /** ISO timestamp */
  createdAt: string;
  /** ISO timestamp */
  updatedAt: string;
  /** Optional payment external id (LiqPay payment_id) */
  paymentExternalId?: string | null;
}
