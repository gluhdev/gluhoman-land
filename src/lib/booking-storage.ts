/**
 * Hotel booking storage — Prisma-backed (Phase 3).
 *
 * Handles availability checking via date-overlap query, sequential numbers
 * starting at 5001 (so we don't collide visually with order numbers).
 */

import { prisma } from '@/lib/prisma';
import {
  HotelBooking,
  HotelBookingInput,
  HotelBookingStatus,
  HotelRoom,
  PaymentStatus,
  getNights,
} from '@/types/booking';

const STARTING_NUMBER = 5001;

export interface BookingStorage {
  listRooms(activeOnly?: boolean): Promise<HotelRoom[]>;
  getRoom(id: string): Promise<HotelRoom | null>;
  /** Returns true if the room is free for the entire [checkIn, checkOut) window */
  isAvailable(roomId: string, checkIn: string, checkOut: string): Promise<boolean>;
  /** Returns rooms available for the entire window */
  findAvailableRooms(checkIn: string, checkOut: string, guests: number): Promise<HotelRoom[]>;
  create(input: HotelBookingInput): Promise<HotelBooking>;
  get(id: string): Promise<HotelBooking | null>;
  updatePayment(
    id: string,
    paymentStatus: PaymentStatus,
    options?: { status?: HotelBookingStatus; paymentExternalId?: string }
  ): Promise<HotelBooking | null>;
  updateStatus(id: string, status: HotelBookingStatus): Promise<HotelBooking | null>;
  list(filters?: { status?: HotelBookingStatus }): Promise<HotelBooking[]>;
}

interface PrismaRoom {
  id: string;
  number: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  description: string | null;
  images: string | null;
  active: boolean;
}

interface PrismaBooking {
  id: string;
  number: number;
  roomId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  total: number;
  status: string;
  paymentStatus: string;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  room?: {
    id: string;
    number: string;
    type: string;
    pricePerNight: number;
  };
}

function toRoom(row: PrismaRoom): HotelRoom {
  return {
    id: row.id,
    number: row.number,
    type: row.type,
    capacity: row.capacity,
    pricePerNight: row.pricePerNight,
    description: row.description,
    images: row.images ? JSON.parse(row.images) : [],
    active: row.active,
  };
}

function toBooking(row: PrismaBooking): HotelBooking {
  return {
    id: row.id,
    number: row.number,
    roomId: row.roomId,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail ?? undefined,
    checkIn: row.checkIn.toISOString(),
    checkOut: row.checkOut.toISOString(),
    guests: row.guests,
    total: row.total,
    status: row.status as HotelBookingStatus,
    paymentStatus: row.paymentStatus as PaymentStatus,
    comment: row.comment ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    room: row.room
      ? {
          id: row.room.id,
          number: row.room.number,
          type: row.room.type,
          pricePerNight: row.room.pricePerNight,
        }
      : undefined,
  };
}

function createPrismaBookingStorage(): BookingStorage {
  return {
    async listRooms(activeOnly = true) {
      const rows = await prisma.hotelRoom.findMany({
        where: activeOnly ? { active: true } : {},
        orderBy: [{ pricePerNight: 'asc' }, { number: 'asc' }],
      });
      return rows.map((r) => toRoom(r as PrismaRoom));
    },

    async getRoom(id) {
      const row = await prisma.hotelRoom.findUnique({ where: { id } });
      return row ? toRoom(row as PrismaRoom) : null;
    },

    async isAvailable(roomId, checkIn, checkOut) {
      const ci = new Date(checkIn);
      const co = new Date(checkOut);
      // Find any conflicting booking — overlap rule: existing.checkIn < new.checkOut AND existing.checkOut > new.checkIn
      const conflict = await prisma.hotelBooking.findFirst({
        where: {
          roomId,
          status: { notIn: ['cancelled', 'completed'] },
          checkIn: { lt: co },
          checkOut: { gt: ci },
        },
      });
      return conflict === null;
    },

    async findAvailableRooms(checkIn, checkOut, guests) {
      const ci = new Date(checkIn);
      const co = new Date(checkOut);
      // Get all active rooms that fit the guests
      const rooms = await prisma.hotelRoom.findMany({
        where: { active: true, capacity: { gte: guests } },
        orderBy: { pricePerNight: 'asc' },
      });
      // For each, check overlap
      const available: HotelRoom[] = [];
      for (const room of rooms) {
        const conflict = await prisma.hotelBooking.findFirst({
          where: {
            roomId: room.id,
            status: { notIn: ['cancelled', 'completed'] },
            checkIn: { lt: co },
            checkOut: { gt: ci },
          },
        });
        if (!conflict) {
          available.push(toRoom(room as PrismaRoom));
        }
      }
      return available;
    },

    async create(input) {
      // Server-side recalc total = nights × pricePerNight
      const room = await prisma.hotelRoom.findUnique({ where: { id: input.roomId } });
      if (!room) throw new Error('Кімната не знайдена');
      const nights = getNights(input.checkIn, input.checkOut);
      if (nights < 1) throw new Error('Мінімум 1 ніч');
      const total = nights * room.pricePerNight;

      const result = await prisma.$transaction(async (tx) => {
        // Re-check availability inside the transaction
        const conflict = await tx.hotelBooking.findFirst({
          where: {
            roomId: input.roomId,
            status: { notIn: ['cancelled', 'completed'] },
            checkIn: { lt: new Date(input.checkOut) },
            checkOut: { gt: new Date(input.checkIn) },
          },
        });
        if (conflict) throw new Error('Кімната вже зайнята на ці дати');

        const max = await tx.hotelBooking.aggregate({ _max: { number: true } });
        const next = (max._max.number ?? STARTING_NUMBER - 1) + 1;

        const created = await tx.hotelBooking.create({
          data: {
            number: next,
            roomId: input.roomId,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail,
            checkIn: new Date(input.checkIn),
            checkOut: new Date(input.checkOut),
            guests: input.guests,
            total,
            status: 'pending',
            paymentStatus: 'pending',
            comment: input.comment,
          },
          include: { room: true },
        });
        return created;
      });

      return toBooking(result as unknown as PrismaBooking);
    },

    async get(id) {
      const row = await prisma.hotelBooking.findUnique({
        where: { id },
        include: { room: true },
      });
      return row ? toBooking(row as unknown as PrismaBooking) : null;
    },

    async updatePayment(id, paymentStatus, options = {}) {
      const updated = await prisma.hotelBooking.update({
        where: { id },
        data: {
          paymentStatus,
          status: options.status ?? (paymentStatus === 'paid' ? 'paid' : undefined),
        },
        include: { room: true },
      });
      return toBooking(updated as unknown as PrismaBooking);
    },

    async updateStatus(id, status) {
      const updated = await prisma.hotelBooking.update({
        where: { id },
        data: { status },
        include: { room: true },
      });
      return toBooking(updated as unknown as PrismaBooking);
    },

    async list(filters = {}) {
      const where: { status?: string } = {};
      if (filters.status) where.status = filters.status;
      const rows = await prisma.hotelBooking.findMany({
        where,
        include: { room: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      });
      return rows.map((r) => toBooking(r as unknown as PrismaBooking));
    },
  };
}

export const bookingStorage: BookingStorage = createPrismaBookingStorage();
