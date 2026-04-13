/**
 * HotelBooking types — analogous to src/types/cart.ts for orders.
 * All money values in UAH (грн), integer.
 */

export type HotelBookingStatus =
  | 'pending'    // Just created, awaiting payment
  | 'paid'       // Payment confirmed
  | 'confirmed'  // Hotel confirmed reservation
  | 'completed'  // Guest checked out
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface HotelRoom {
  id: string;
  number: string;
  type: string; // "standard" | "lux" | "family"
  capacity: number;
  pricePerNight: number; // грн
  description?: string | null;
  images: string[];
  active: boolean;
}

export interface HotelBookingInput {
  roomId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  /** ISO date string (YYYY-MM-DD) */
  checkIn: string;
  /** ISO date string (YYYY-MM-DD) */
  checkOut: string;
  guests: number;
  comment?: string;
}

export interface HotelBooking extends HotelBookingInput {
  id: string;
  number: number;
  status: HotelBookingStatus;
  paymentStatus: PaymentStatus;
  total: number;
  paymentExternalId?: string | null;
  createdAt: string;
  updatedAt: string;
  /** Hydrated room snapshot (for display) */
  room?: {
    id: string;
    number: string;
    type: string;
    pricePerNight: number;
  };
}

/** Number of nights between two ISO dates (exclusive of checkout) */
export function getNights(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export const ROOM_TYPE_LABEL: Record<string, string> = {
  standard: 'Стандарт',
  lux: 'Люкс',
  family: 'Сімейний',
  suite: 'Cвіт',
};
