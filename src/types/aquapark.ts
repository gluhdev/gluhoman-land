/**
 * Aquapark types — analogous to src/types/cart.ts and src/types/booking.ts.
 * All money values in UAH (грн), integer.
 */

export type AquaparkTicketStatus =
  | 'pending'    // created, awaiting payment
  | 'paid'       // payment confirmed, QR generated
  | 'used'       // scanned at entrance
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface AquaparkTariff {
  id: string;
  name: string;
  price: number; // грн
  description?: string | null;
  active: boolean;
}

export interface AquaparkTicketItemInput {
  tariffId: string;
  quantity: number;
}

export interface AquaparkTicketItem extends AquaparkTicketItemInput {
  id?: string;
  name: string;
  price: number;
}

export interface AquaparkTicketInput {
  date: string; // ISO date YYYY-MM-DD
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: AquaparkTicketItemInput[];
}

export interface AquaparkTicket {
  id: string;
  number: number;
  date: string; // ISO datetime
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: AquaparkTicketItem[];
  total: number; // грн
  status: AquaparkTicketStatus;
  paymentStatus: PaymentStatus;
  qrCode?: string | null;
  createdAt: string;
  updatedAt: string;
}
