/**
 * Order storage — Prisma-backed implementation (Phase 2).
 *
 * Replaced the Phase 1 file-based JSON store with a real database.
 * The OrderStorage interface stays the same so API routes don't change.
 *
 * Sequential `number` is computed as max(number) + 1 within a transaction.
 * Starting number is 1001 (so the first order looks like a "real" business id).
 */

import { prisma } from '@/lib/prisma';
import { Order, OrderInput, OrderStatus, PaymentStatus } from '@/types/cart';

const STARTING_NUMBER = 1001;

export interface OrderStorage {
  create(input: OrderInput): Promise<Order>;
  get(id: string): Promise<Order | null>;
  updatePayment(
    id: string,
    paymentStatus: PaymentStatus,
    options?: { paymentExternalId?: string; status?: OrderStatus }
  ): Promise<Order | null>;
  list(filters?: { status?: OrderStatus; paymentStatus?: PaymentStatus }): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}

interface PrismaOrderRow {
  id: string;
  number: number;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  address: string | null;
  scheduledAt: Date | null;
  comment: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentExternalId: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    menuItemId: string | null;
    name: string;
    price: number;
    quantity: number;
  }>;
}

function toOrder(row: PrismaOrderRow): Order {
  return {
    id: row.id,
    number: row.number,
    status: row.status as OrderStatus,
    paymentStatus: row.paymentStatus as PaymentStatus,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    deliveryType: row.deliveryType as 'delivery' | 'pickup',
    address: row.address ?? undefined,
    scheduledAt: row.scheduledAt ? row.scheduledAt.toISOString() : null,
    comment: row.comment ?? undefined,
    subtotal: row.subtotal,
    deliveryFee: row.deliveryFee,
    total: row.total,
    items: row.items.map((i) => ({
      menuItemId: i.menuItemId ?? '',
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    paymentExternalId: row.paymentExternalId ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function createPrismaStorage(): OrderStorage {
  return {
    async create(input: OrderInput): Promise<Order> {
      const result = await prisma.$transaction(async (tx) => {
        // Find next sequential number
        const max = await tx.order.aggregate({ _max: { number: true } });
        const next = (max._max.number ?? STARTING_NUMBER - 1) + 1;

        const created = await tx.order.create({
          data: {
            number: next,
            status: 'PENDING',
            paymentStatus: 'pending',
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            deliveryType: input.deliveryType,
            address: input.address,
            scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
            comment: input.comment,
            subtotal: input.subtotal,
            deliveryFee: input.deliveryFee,
            total: input.total,
            items: {
              create: input.items.map((i) => ({
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                // menuItemId is optional in schema — leave unset if external
                menuItemId: undefined,
              })),
            },
          },
          include: { items: true },
        });
        return created;
      });
      return toOrder(result as unknown as PrismaOrderRow);
    },

    async get(id: string): Promise<Order | null> {
      const row = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });
      return row ? toOrder(row as unknown as PrismaOrderRow) : null;
    },

    async updatePayment(id, paymentStatus, options = {}) {
      const updated = await prisma.order.update({
        where: { id },
        data: {
          paymentStatus,
          status: options.status ?? (paymentStatus === 'paid' ? 'PAID' : undefined),
          paymentExternalId: options.paymentExternalId,
        },
        include: { items: true },
      });
      return toOrder(updated as unknown as PrismaOrderRow);
    },

    async updateStatus(id, status) {
      const updated = await prisma.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      });
      return toOrder(updated as unknown as PrismaOrderRow);
    },

    async list(filters = {}) {
      const where: { status?: string; paymentStatus?: string } = {};
      if (filters.status) where.status = filters.status;
      if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;

      const rows = await prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      });
      return rows.map((r) => toOrder(r as unknown as PrismaOrderRow));
    },
  };
}

export const orderStorage: OrderStorage = createPrismaStorage();
