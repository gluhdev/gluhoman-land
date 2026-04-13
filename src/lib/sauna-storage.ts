/**
 * Sauna slot storage — Prisma-backed (Phase 5).
 *
 * Strategy: virtual slots. We DO NOT pre-seed every possible date/time/sauna
 * combination. Instead:
 *  - For availability queries, compute the standard grid for a date and overlay
 *    any existing SaunaSlot rows to mark booked ones.
 *  - When user books, INSERT a SaunaSlot row (the @@unique constraint on
 *    (date, startTime, saunaType) prevents double-booking via DB).
 *
 * Numbers start at 7001.
 */

import { prisma } from '@/lib/prisma';
import {
  PaymentStatus,
  SAUNA_PRICE,
  SaunaSlot,
  SaunaSlotInput,
  SaunaSlotStatus,
  SaunaType,
  TIME_WINDOWS,
  VirtualSlot,
} from '@/types/sauna';

const STARTING_NUMBER = 7001;

export interface SaunaStorage {
  /** Returns a virtual grid for a given date — every standard window for both saunas. */
  getAvailability(date: string): Promise<VirtualSlot[]>;
  create(input: SaunaSlotInput): Promise<SaunaSlot>;
  get(id: string): Promise<SaunaSlot | null>;
  updatePayment(
    id: string,
    paymentStatus: PaymentStatus,
    options?: { status?: SaunaSlotStatus; paymentExternalId?: string }
  ): Promise<SaunaSlot | null>;
  updateStatus(id: string, status: SaunaSlotStatus): Promise<SaunaSlot | null>;
  list(filters?: { status?: SaunaSlotStatus; date?: string }): Promise<SaunaSlot[]>;
}

interface PrismaSaunaSlot {
  id: string;
  number: number;
  date: Date;
  startTime: string;
  endTime: string;
  saunaType: string;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  status: string;
  paymentStatus: string;
  total: number | null;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function toSlot(row: PrismaSaunaSlot): SaunaSlot {
  return {
    id: row.id,
    number: row.number,
    date: row.date.toISOString(),
    startTime: row.startTime,
    endTime: row.endTime,
    saunaType: row.saunaType as SaunaType,
    customerName: row.customerName ?? undefined,
    customerPhone: row.customerPhone ?? undefined,
    customerEmail: row.customerEmail ?? undefined,
    status: row.status as SaunaSlotStatus,
    paymentStatus: row.paymentStatus as PaymentStatus,
    total: row.total,
    comment: row.comment ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function createPrismaSaunaStorage(): SaunaStorage {
  return {
    async getAvailability(date) {
      const day = new Date(date);
      const next = new Date(day.getTime() + 86_400_000);

      const existing = await prisma.saunaSlot.findMany({
        where: {
          date: { gte: day, lt: next },
          status: { notIn: ['cancelled'] },
        },
      });

      const lookup = new Map<string, PrismaSaunaSlot>();
      for (const row of existing) {
        const key = `${row.startTime}|${row.saunaType}`;
        lookup.set(key, row as PrismaSaunaSlot);
      }

      const types: SaunaType[] = ['small', 'big'];
      const grid: VirtualSlot[] = [];

      for (const window of TIME_WINDOWS) {
        for (const type of types) {
          const key = `${window.start}|${type}`;
          const existingRow = lookup.get(key);
          let status: VirtualSlot['status'] = 'free';
          if (existingRow) {
            status = existingRow.status === 'paid' ? 'paid' : 'reserved';
          }
          grid.push({
            date,
            startTime: window.start,
            endTime: window.end,
            saunaType: type,
            status,
            price: SAUNA_PRICE[type],
          });
        }
      }

      return grid;
    },

    async create(input) {
      const total = SAUNA_PRICE[input.saunaType];
      // Check this exact slot is in our config (defensive)
      const window = TIME_WINDOWS.find((w) => w.start === input.startTime);
      if (!window || window.end !== input.endTime) {
        throw new Error('Невалідний часовий слот');
      }

      const result = await prisma.$transaction(async (tx) => {
        // Check uniqueness — DB constraint backs this up too
        const day = new Date(input.date);
        const next = new Date(day.getTime() + 86_400_000);
        const conflict = await tx.saunaSlot.findFirst({
          where: {
            date: { gte: day, lt: next },
            startTime: input.startTime,
            saunaType: input.saunaType,
            status: { notIn: ['cancelled'] },
          },
        });
        if (conflict) {
          throw new Error('Цей слот вже зайнято');
        }

        const max = await tx.saunaSlot.aggregate({ _max: { number: true } });
        const nextNum = (max._max.number ?? STARTING_NUMBER - 1) + 1;

        const created = await tx.saunaSlot.create({
          data: {
            number: nextNum,
            date: day,
            startTime: input.startTime,
            endTime: input.endTime,
            saunaType: input.saunaType,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail,
            status: 'reserved',
            paymentStatus: 'pending',
            total,
            comment: input.comment,
          },
        });
        return created;
      });

      return toSlot(result as unknown as PrismaSaunaSlot);
    },

    async get(id) {
      const row = await prisma.saunaSlot.findUnique({ where: { id } });
      return row ? toSlot(row as unknown as PrismaSaunaSlot) : null;
    },

    async updatePayment(id, paymentStatus, options = {}) {
      const updated = await prisma.saunaSlot.update({
        where: { id },
        data: {
          paymentStatus,
          status: options.status ?? (paymentStatus === 'paid' ? 'paid' : undefined),
        },
      });
      return toSlot(updated as unknown as PrismaSaunaSlot);
    },

    async updateStatus(id, status) {
      const updated = await prisma.saunaSlot.update({
        where: { id },
        data: { status },
      });
      return toSlot(updated as unknown as PrismaSaunaSlot);
    },

    async list(filters = {}) {
      const where: { status?: string; date?: { gte: Date; lt: Date } } = {};
      if (filters.status) where.status = filters.status;
      if (filters.date) {
        const d = new Date(filters.date);
        const next = new Date(d.getTime() + 86_400_000);
        where.date = { gte: d, lt: next };
      }
      const rows = await prisma.saunaSlot.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 200,
      });
      return rows.map((r) => toSlot(r as unknown as PrismaSaunaSlot));
    },
  };
}

export const saunaStorage: SaunaStorage = createPrismaSaunaStorage();
