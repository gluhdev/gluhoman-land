/**
 * Sauna types — analogous to /types/cart.ts and /types/booking.ts.
 * All money values in UAH (грн), integer.
 */

export type SaunaType = 'small' | 'big';

export type SaunaSlotStatus =
  | 'free'
  | 'reserved' // booked, awaiting payment
  | 'paid'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

/** Configuration: standard time windows offered every day. 2-hour slots. */
export const TIME_WINDOWS: Array<{ start: string; end: string }> = [
  { start: '10:00', end: '12:00' },
  { start: '12:00', end: '14:00' },
  { start: '14:00', end: '16:00' },
  { start: '16:00', end: '18:00' },
  { start: '18:00', end: '20:00' },
  { start: '20:00', end: '22:00' },
  { start: '22:00', end: '24:00' },
];

/** Price per slot (2 hours) — based on src/app/sauna/page.tsx (900 грн/год × 2 = 1800) */
export const SAUNA_PRICE: Record<SaunaType, number> = {
  small: 1800,
  big: 1800,
};

export const SAUNA_TYPE_LABEL: Record<SaunaType, string> = {
  small: 'Мала лазня',
  big: 'Велика лазня',
};

export interface SaunaSlotInput {
  date: string; // YYYY-MM-DD
  startTime: string; // "18:00"
  endTime: string; // "20:00"
  saunaType: SaunaType;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  comment?: string;
}

export interface SaunaSlot {
  id: string;
  number: number;
  date: string; // ISO datetime
  startTime: string;
  endTime: string;
  saunaType: SaunaType;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  status: SaunaSlotStatus;
  paymentStatus: PaymentStatus;
  total?: number | null;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

/** Virtual slot for availability grid (not yet in DB). */
export interface VirtualSlot {
  date: string;
  startTime: string;
  endTime: string;
  saunaType: SaunaType;
  status: 'free' | 'reserved' | 'paid';
  price: number;
}
