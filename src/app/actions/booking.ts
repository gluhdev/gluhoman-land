"use server";

import { headers } from "next/headers";
import { CONTACT_INFO } from "@/constants";
import { prisma } from "@/lib/prisma";
import {
  SERVICE_TO_DB, buildEnrichedComment, notifyReservation,
} from "@/lib/reservation-notify";
import {
  suggestedReservationAmount,
  nightsBetween,
  resolvedMaxOccupancy,
} from "@/lib/room-config";
import { checkAvailability } from "./availability";

export type BookingService = "hotel" | "aquapark" | "restaurant" | "sauna";

export interface BookingPayload {
  service: BookingService;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  dateFrom: string;
  dateTo?: string;
  time?: string;
  comment?: string;

  // Hotel-specific
  roomType?: "standard" | "family" | "lux";
  adults?: number;
  children?: number;
  breakfast?: boolean;

  // Multi-hotel routing (set from /hotel/* and /cottages booking buttons)
  hotelSlug?: "aquapark" | "central" | "cottages" | "brewery";
  roomCategorySlug?: string;

  // Aquapark-specific
  adultsCount?: number;
  kidsCount?: number;
  toddlersCount?: number;
  tariff?: "full_day" | "half_day";

  // Restaurant-specific
  occasion?: "birthday" | "business" | "romantic" | "casual" | "other";
  dietary?: string;

  // Sauna-specific
  programme?: "classic" | "herbal" | "family";
}

export interface BookingResult {
  ok: boolean;
  message: string;
  bookingId?: string;
}

const SERVICE_LABEL: Record<BookingService, string> = {
  hotel: "Готель",
  aquapark: "Аквапарк",
  restaurant: "Ресторан",
  sauna: "Лазня",
};

function validate(p: BookingPayload): string | null {
  if (!p.service || !SERVICE_LABEL[p.service]) return "Оберіть послугу";
  if (!p.name || p.name.trim().length < 2) return "Введіть ім'я";
  if (!p.phone || p.phone.replace(/\D/g, "").length < 10)
    return "Введіть коректний телефон";
  if (!p.dateFrom) return "Оберіть дату";
  if (p.service === "hotel" && !p.dateTo) return "Оберіть дату виїзду";
  if (p.service === "hotel" && p.dateTo) {
    // Server-side date sanity: the client uses minDate, but the action trusts
    // raw ISO from the request body, so re-check here.
    const f = new Date(p.dateFrom);
    const t2 = new Date(p.dateTo);
    if (Number.isNaN(f.getTime()) || Number.isNaN(t2.getTime()))
      return "Невірні дати";
    if (t2 <= f) return "Дата виїзду має бути пізніше дати заїзду";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (f < today) return "Дата заїзду не може бути в минулому";
  }
  if (p.service === "restaurant" && !p.time) return "Оберіть час";
  if (p.service === "sauna" && !p.time) return "Оберіть час";
  if (!p.guests || p.guests < 1 || p.guests > 50)
    return "Кількість гостей від 1 до 50";
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
    return "Некоректний email";
  return null;
}

export async function submitBooking(payload: BookingPayload): Promise<BookingResult> {
  const error = validate(payload);
  if (error) return { ok: false, message: error };

  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") || null;
  const userAgent = headersList.get("user-agent") || null;

  let booking;
  try {
    booking = await prisma.booking.create({
      data: {
        service: SERVICE_TO_DB[payload.service],
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email?.trim() || null,
        guests: payload.guests,
        dateFrom: new Date(payload.dateFrom),
        dateTo: payload.service === "hotel" && payload.dateTo ? new Date(payload.dateTo) : null,
        time: payload.time || null,
        comment: buildEnrichedComment(payload),
        hotelSlug: payload.hotelSlug ?? null,
        roomCategorySlug: payload.roomCategorySlug ?? null,
        ipAddress, userAgent,
      },
    });
  } catch (e) {
    console.error("[booking] DB persist failed:", e);
    return { ok: false, message: `Технічна помилка. Зателефонуйте нам: ${CONTACT_INFO.phone[0]}` };
  }

  const { anyOk } = await notifyReservation(payload, booking.id);
  const ref = booking.id.slice(0, 8);
  return {
    ok: true, bookingId: booking.id,
    message: anyOk
      ? `Дякуємо! Заявку #${ref} прийнято. Ми зв'яжемося з вами найближчим часом.`
      : `Заявку #${ref} збережено. Зателефонуйте нам для підтвердження: ${CONTACT_INFO.phone[0]}`,
  };
}

export interface RoomReservationInput {
  hotelSlug: NonNullable<BookingPayload["hotelSlug"]>;
  roomCategorySlug: string;
  name: string;
  phone: string;
  email?: string;
  dateFrom: string; // ISO yyyy-mm-dd
  dateTo: string;   // ISO yyyy-mm-dd
  adults: number;
  children?: number;
  breakfast?: boolean;
  comment?: string;
}

export interface RoomReservationResult {
  ok: boolean;
  mode?: "pay" | "request";
  bookingId?: string;
  totalAmount?: number;
  message?: string;
  error?: string;
}

/**
 * Room booking with pay-to-confirm. If the room has a price, persist a PENDING
 * booking with totalAmount (NO notification yet — that fires on payment via
 * markPaid('reservation')) and return mode:'pay'. If the room is «за запитом»
 * (amount 0), fall back to submitBooking (immediate request + notify).
 */
export async function createRoomReservation(
  input: RoomReservationInput,
): Promise<RoomReservationResult> {
  const guests = input.adults + (input.children ?? 0);

  // Email is required for room reservations (guest confirmation is sent to it).
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    return { ok: false, error: "Введіть коректний email" };
  }

  const payload: BookingPayload = {
    service: "hotel",
    name: input.name, phone: input.phone, email: input.email,
    guests, dateFrom: input.dateFrom, dateTo: input.dateTo,
    adults: input.adults, children: input.children, breakfast: input.breakfast,
    hotelSlug: input.hotelSlug, roomCategorySlug: input.roomCategorySlug,
    comment: input.comment,
  };

  const error = validate(payload);
  if (error) return { ok: false, error };

  // Capacity guard: a room is only priced up to its max-occupancy tier, and the
  // client steppers (up to 10 adults + 6 children) can exceed it. Without this,
  // priceForGuests silently clamps an over-capacity party to the top-tier price
  // (undercharge + overbooking). Reject and point the guest to phone booking.
  const maxOccupancy = await resolvedMaxOccupancy(
    input.hotelSlug,
    input.roomCategorySlug,
  );
  if (maxOccupancy != null && guests > maxOccupancy) {
    return {
      ok: false,
      error: `Цей номер розрахований максимум на ${maxOccupancy} гостей. Для більшої компанії зателефонуйте нам: ${CONTACT_INFO.phone[0]}`,
    };
  }

  // Oversell guard: re-check live availability server-side. The client CTA
  // disable is advisory and races with concurrent bookings / stale tabs, so two
  // guests could otherwise both reserve the last room and both be charged.
  const avail = await checkAvailability(
    input.hotelSlug,
    input.roomCategorySlug,
    input.dateFrom,
    input.dateTo,
  );
  if (avail.tracked && avail.available <= 0) {
    return {
      ok: false,
      error:
        "На жаль, цей номер щойно зайняли на обрані дати. Оберіть інші дати або інший номер.",
    };
  }

  const nights = nightsBetween(new Date(input.dateFrom), new Date(input.dateTo));
  const amount = await suggestedReservationAmount(
    input.hotelSlug, input.roomCategorySlug, guests, nights,
  );

  // «За запитом» → request flow (immediate notify, no payment)
  if (!amount || amount <= 0) {
    const res = await submitBooking(payload);
    return {
      ok: res.ok, mode: "request", bookingId: res.bookingId,
      message: res.message, error: res.ok ? undefined : res.message,
    };
  }

  // Pay-to-confirm → persist PENDING with totalAmount, NO notify here.
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") || null;
  const userAgent = headersList.get("user-agent") || null;

  try {
    const booking = await prisma.booking.create({
      data: {
        service: "HOTEL",
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email?.trim() || null,
        guests,
        dateFrom: new Date(input.dateFrom),
        dateTo: new Date(input.dateTo),
        comment: buildEnrichedComment(payload),
        hotelSlug: input.hotelSlug,
        roomCategorySlug: input.roomCategorySlug,
        totalAmount: amount,
        paymentStatus: "unpaid",
        ipAddress, userAgent,
      },
    });
    return { ok: true, mode: "pay", bookingId: booking.id, totalAmount: amount };
  } catch (e) {
    console.error("[reservation] DB persist failed:", e);
    return { ok: false, error: `Технічна помилка. Зателефонуйте нам: ${CONTACT_INFO.phone[0]}` };
  }
}
