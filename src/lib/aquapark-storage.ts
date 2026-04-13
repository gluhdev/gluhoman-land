/**
 * Aquapark ticket storage — Prisma-backed (Phase 4).
 *
 * Numbers start at 9001 (so they don't visually collide with orders/bookings).
 * Generates a unique QR code on creation; the code is the public ticket id
 * embedded as a URL the scanner can hit.
 */

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import {
  AquaparkTariff,
  AquaparkTicket,
  AquaparkTicketInput,
  AquaparkTicketStatus,
  PaymentStatus,
} from '@/types/aquapark';

const STARTING_NUMBER = 9001;

export interface AquaparkStorage {
  listTariffs(activeOnly?: boolean): Promise<AquaparkTariff[]>;
  getTariff(id: string): Promise<AquaparkTariff | null>;
  create(input: AquaparkTicketInput): Promise<AquaparkTicket>;
  get(id: string): Promise<AquaparkTicket | null>;
  getByQr(qr: string): Promise<AquaparkTicket | null>;
  updatePayment(
    id: string,
    paymentStatus: PaymentStatus,
    options?: { status?: AquaparkTicketStatus; paymentExternalId?: string }
  ): Promise<AquaparkTicket | null>;
  updateStatus(id: string, status: AquaparkTicketStatus): Promise<AquaparkTicket | null>;
  list(filters?: { status?: AquaparkTicketStatus; date?: string }): Promise<AquaparkTicket[]>;
}

interface PrismaTariff {
  id: string;
  name: string;
  price: number;
  description: string | null;
  active: boolean;
}

interface PrismaTicket {
  id: string;
  number: number;
  date: Date;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  total: number;
  status: string;
  paymentStatus: string;
  qrCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    tariffId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

function toTariff(row: PrismaTariff): AquaparkTariff {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    active: row.active,
  };
}

function toTicket(row: PrismaTicket): AquaparkTicket {
  return {
    id: row.id,
    number: row.number,
    date: row.date.toISOString(),
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail ?? undefined,
    total: row.total,
    status: row.status as AquaparkTicketStatus,
    paymentStatus: row.paymentStatus as PaymentStatus,
    qrCode: row.qrCode,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    items: row.items.map((i) => ({
      id: i.id,
      tariffId: i.tariffId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  };
}

function generateQr(): string {
  // 16 chars URL-safe random, prefixed for visibility in logs
  return `gluh-aqua-${crypto.randomBytes(8).toString('base64url')}`;
}

function createPrismaAquaparkStorage(): AquaparkStorage {
  return {
    async listTariffs(activeOnly = true) {
      const rows = await prisma.aquaparkTariff.findMany({
        where: activeOnly ? { active: true } : {},
        orderBy: { price: 'asc' },
      });
      return rows.map((r) => toTariff(r as PrismaTariff));
    },

    async getTariff(id) {
      const row = await prisma.aquaparkTariff.findUnique({ where: { id } });
      return row ? toTariff(row as PrismaTariff) : null;
    },

    async create(input) {
      // Server-side: load tariffs to compute prices and validate
      const tariffIds = input.items.map((i) => i.tariffId);
      const tariffs = await prisma.aquaparkTariff.findMany({
        where: { id: { in: tariffIds }, active: true },
      });
      if (tariffs.length !== new Set(tariffIds).size) {
        throw new Error('Один з обраних тарифів недоступний');
      }
      const tariffMap = new Map(tariffs.map((t) => [t.id, t]));

      const itemsToCreate = input.items.map((i) => {
        const t = tariffMap.get(i.tariffId)!;
        return {
          tariffId: t.id,
          name: t.name,
          price: t.price,
          quantity: i.quantity,
        };
      });

      const total = itemsToCreate.reduce((sum, i) => sum + i.price * i.quantity, 0);
      if (total <= 0) throw new Error('Сума має бути більше 0');

      const result = await prisma.$transaction(async (tx) => {
        const max = await tx.aquaparkTicket.aggregate({ _max: { number: true } });
        const next = (max._max.number ?? STARTING_NUMBER - 1) + 1;
        const qr = generateQr();

        const created = await tx.aquaparkTicket.create({
          data: {
            number: next,
            date: new Date(input.date),
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail,
            total,
            status: 'pending',
            paymentStatus: 'pending',
            qrCode: qr,
            items: { create: itemsToCreate },
          },
          include: { items: true },
        });
        return created;
      });

      return toTicket(result as unknown as PrismaTicket);
    },

    async get(id) {
      const row = await prisma.aquaparkTicket.findUnique({
        where: { id },
        include: { items: true },
      });
      return row ? toTicket(row as unknown as PrismaTicket) : null;
    },

    async getByQr(qr) {
      const row = await prisma.aquaparkTicket.findUnique({
        where: { qrCode: qr },
        include: { items: true },
      });
      return row ? toTicket(row as unknown as PrismaTicket) : null;
    },

    async updatePayment(id, paymentStatus, options = {}) {
      const updated = await prisma.aquaparkTicket.update({
        where: { id },
        data: {
          paymentStatus,
          status: options.status ?? (paymentStatus === 'paid' ? 'paid' : undefined),
        },
        include: { items: true },
      });
      return toTicket(updated as unknown as PrismaTicket);
    },

    async updateStatus(id, status) {
      const updated = await prisma.aquaparkTicket.update({
        where: { id },
        data: { status },
        include: { items: true },
      });
      return toTicket(updated as unknown as PrismaTicket);
    },

    async list(filters = {}) {
      const where: { status?: string; date?: { gte: Date; lt: Date } } = {};
      if (filters.status) where.status = filters.status;
      if (filters.date) {
        const d = new Date(filters.date);
        const next = new Date(d.getTime() + 86_400_000);
        where.date = { gte: d, lt: next };
      }
      const rows = await prisma.aquaparkTicket.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      });
      return rows.map((r) => toTicket(r as unknown as PrismaTicket));
    },
  };
}

export const aquaparkStorage: AquaparkStorage = createPrismaAquaparkStorage();
