// src/lib/reservation-notify.ts
import "server-only";
import { prisma } from "@/lib/prisma";
import type { BookingPayload, BookingService } from "@/app/actions/booking";

type ChannelName = "telegram" | "email";
interface ChannelResult { ok: boolean; channel: ChannelName; error?: string }

export const SERVICE_LABEL: Record<BookingService, string> = {
  hotel: "Готель", aquapark: "Аквапарк", restaurant: "Ресторан", sauna: "Лазня",
};
export const SERVICE_TO_DB: Record<BookingService, "HOTEL" | "AQUAPARK" | "RESTAURANT" | "SAUNA"> = {
  hotel: "HOTEL", aquapark: "AQUAPARK", restaurant: "RESTAURANT", sauna: "SAUNA",
};
const HOTEL_SLUG_LABEL: Record<NonNullable<BookingPayload["hotelSlug"]>, string> = {
  aquapark: "Готель-Аквапарк", central: "Центральний Готель",
  cottages: "Будиночки", brewery: "Корпус Броварні",
};
const ROOM_TYPE_LABEL: Record<NonNullable<BookingPayload["roomType"]>, string> = {
  standard: "Стандарт", family: "Сімейний", lux: "Люкс",
};
const TARIFF_LABEL: Record<NonNullable<BookingPayload["tariff"]>, string> = {
  full_day: "Повний день", half_day: "Пів дня",
};
const OCCASION_LABEL: Record<NonNullable<BookingPayload["occasion"]>, string> = {
  birthday: "День народження", business: "Бізнес-зустріч",
  romantic: "Романтична вечеря", casual: "Дружня зустріч", other: "Інше",
};
const PROGRAMME_LABEL: Record<NonNullable<BookingPayload["programme"]>, string> = {
  classic: "Класична", herbal: "Фіто", family: "Сімейна",
};
const SAUNA_SLOT_LABEL_UK: Record<string, string> = {
  morning: "Ранок 10:00–13:00", afternoon: "День 14:00–17:00", evening: "Вечір 18:00–22:00",
};

/** Service-specific fields flattened into the Booking.comment column. */
export function buildEnrichedComment(p: BookingPayload): string | null {
  const x: string[] = [];
  if (p.roomType) x.push(`Номер: ${ROOM_TYPE_LABEL[p.roomType]}`);
  if (p.adults != null) x.push(`Дорослих: ${p.adults}`);
  if (p.children != null) x.push(`Дітей: ${p.children}`);
  if (p.breakfast) x.push("Зі сніданком");
  if (p.tariff) x.push(`Тариф: ${TARIFF_LABEL[p.tariff]}`);
  if (p.adultsCount != null) x.push(`Дорослих: ${p.adultsCount}`);
  if (p.kidsCount != null) x.push(`Діти 3–12: ${p.kidsCount}`);
  if (p.toddlersCount != null) x.push(`До 3 років: ${p.toddlersCount}`);
  if (p.occasion) x.push(`Привід: ${OCCASION_LABEL[p.occasion]}`);
  if (p.dietary) x.push(`Дієта: ${p.dietary}`);
  if (p.programme) x.push(`Програма: ${PROGRAMME_LABEL[p.programme]}`);
  if (p.comment?.trim()) x.push(p.comment.trim());
  return x.length ? x.join(" · ") : null;
}

interface NotifyOpts { paid?: boolean; amount?: number }

function formatMessage(p: BookingPayload, bookingId: string, opts: NotifyOpts = {}): string {
  const header = opts.paid
    ? `✅ Оплачена бронь — ${SERVICE_LABEL[p.service]}`
    : `🌲 Нова заявка — ${SERVICE_LABEL[p.service]}`;
  const lines = [header, `🆔 #${bookingId.slice(0, 8)}`, `👤 ${p.name}`, `📞 ${p.phone}`];
  if (p.email) lines.push(`✉️ ${p.email}`);
  lines.push(`👥 Гостей: ${p.guests}`);
  if (p.hotelSlug) lines.push(`🏨 Готель: ${HOTEL_SLUG_LABEL[p.hotelSlug]}`);
  if (p.roomCategorySlug) lines.push(`🏷 Категорія: ${p.roomCategorySlug}`);
  if (p.service === "hotel") {
    lines.push(`📅 Заїзд: ${p.dateFrom}`);
    lines.push(`📅 Виїзд: ${p.dateTo}`);
    if (p.roomType) lines.push(`🛏 Номер: ${ROOM_TYPE_LABEL[p.roomType]}`);
    if (p.adults != null) lines.push(`👤 Дорослих: ${p.adults}`);
    if (p.children != null) lines.push(`🧒 Дітей: ${p.children}`);
    if (p.breakfast) lines.push(`🥐 Зі сніданком`);
  } else if (p.service === "restaurant") {
    lines.push(`📅 Дата: ${p.dateFrom}`);
    lines.push(`🕐 Час: ${p.time}`);
    if (p.occasion) lines.push(`🎉 Привід: ${OCCASION_LABEL[p.occasion]}`);
    if (p.dietary) lines.push(`🥗 Дієта: ${p.dietary}`);
  } else if (p.service === "aquapark") {
    lines.push(`📅 Дата: ${p.dateFrom}`);
    if (p.tariff) lines.push(`🎟 Тариф: ${TARIFF_LABEL[p.tariff]}`);
    if (p.adultsCount != null) lines.push(`👤 Дорослих: ${p.adultsCount}`);
    if (p.kidsCount != null) lines.push(`🧒 Діти 3–12: ${p.kidsCount}`);
    if (p.toddlersCount != null) lines.push(`👶 До 3 років: ${p.toddlersCount}`);
  } else if (p.service === "sauna") {
    lines.push(`📅 Дата: ${p.dateFrom}`);
    if (p.time) lines.push(`🕐 Час: ${SAUNA_SLOT_LABEL_UK[p.time] ?? p.time}`);
    if (p.programme) lines.push(`🌿 Програма: ${PROGRAMME_LABEL[p.programme]}`);
  }
  if (opts.amount) lines.push(`💳 Сума: ${opts.amount} грн`);
  if (p.comment) lines.push(`💬 ${p.comment}`);
  return lines.join("\n");
}

function chatIdForHotel(hotelSlug?: BookingPayload["hotelSlug"]): string | undefined {
  if (hotelSlug === "aquapark" && process.env.TELEGRAM_CHAT_ID_AQUAPARK) return process.env.TELEGRAM_CHAT_ID_AQUAPARK;
  if (hotelSlug === "central" && process.env.TELEGRAM_CHAT_ID_CENTRAL) return process.env.TELEGRAM_CHAT_ID_CENTRAL;
  if (hotelSlug === "cottages" && process.env.TELEGRAM_CHAT_ID_COTTAGES) return process.env.TELEGRAM_CHAT_ID_COTTAGES;
  if (hotelSlug === "brewery" && process.env.TELEGRAM_CHAT_ID_BREWERY) return process.env.TELEGRAM_CHAT_ID_BREWERY;
  return process.env.TELEGRAM_CHAT_ID;
}

async function sendTelegram(message: string, hotelSlug?: BookingPayload["hotelSlug"]): Promise<ChannelResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = chatIdForHotel(hotelSlug);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }), cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[reservation] Telegram error:", res.status, body);
      return { ok: false, channel: "telegram", error: `HTTP ${res.status}: ${body}` };
    }
    return { ok: true, channel: "telegram" };
  } catch (e) {
    console.error("[reservation] Telegram network error:", e);
    return { ok: false, channel: "telegram", error: e instanceof Error ? e.message : String(e) };
  }
}

async function sendEmail(payload: BookingPayload, message: string): Promise<ChannelResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_EMAIL_FROM;
  const to = process.env.BOOKING_EMAIL_TO;
  const subject = `Нова заявка — ${SERVICE_LABEL[payload.service]} — ${payload.name}`;
  const text = payload.email
    ? `${message}\n\nВідповідайте на цей лист, щоб зв'язатися з гостем.` : message;
  const body: Record<string, unknown> = {
    from, to: to!.split(",").map((s) => s.trim()).filter(Boolean), subject, text,
  };
  if (payload.email) body.reply_to = payload.email;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body), cache: "no-store",
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error("[reservation] Resend error:", res.status, errBody);
      return { ok: false, channel: "email", error: `HTTP ${res.status}: ${errBody}` };
    }
    return { ok: true, channel: "email" };
  } catch (e) {
    console.error("[reservation] Resend network error:", e);
    return { ok: false, channel: "email", error: e instanceof Error ? e.message : String(e) };
  }
}

export interface NotifyResult { anyOk: boolean; hadChannels: boolean }

/**
 * Send Telegram + email for a Booking and persist delivery status on the row.
 * Used by submitBooking (immediate) and markPaid('reservation') (on payment).
 */
export async function notifyReservation(
  payload: BookingPayload, bookingId: string, opts: NotifyOpts = {}
): Promise<NotifyResult> {
  const message = formatMessage(payload, bookingId, opts);
  const telegramConfigured = !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID;
  const emailConfigured =
    !!process.env.RESEND_API_KEY && !!process.env.BOOKING_EMAIL_FROM && !!process.env.BOOKING_EMAIL_TO;

  const channels: Promise<ChannelResult>[] = [];
  if (telegramConfigured) channels.push(sendTelegram(message, payload.hotelSlug));
  if (emailConfigured) channels.push(sendEmail(payload, message));

  if (channels.length === 0) {
    console.log(`[reservation] no channels configured — booking ${bookingId} stored only:\n${message}`);
    return { anyOk: false, hadChannels: false };
  }

  const results = await Promise.allSettled(channels);
  const find = (ch: ChannelName) =>
    results.find((r) => r.status === "fulfilled" && (r.value as ChannelResult).channel === ch) as
      | PromiseFulfilledResult<ChannelResult> | undefined;
  const tg = find("telegram"), em = find("email");

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        telegramStatus: tg ? (tg.value.ok ? "SENT" : "FAILED") : telegramConfigured ? "FAILED" : "PENDING",
        telegramError: tg ? tg.value.error || null : null,
        emailStatus: em ? (em.value.ok ? "SENT" : "FAILED") : emailConfigured ? "FAILED" : "PENDING",
        emailError: em ? em.value.error || null : null,
      },
    });
  } catch (e) {
    console.error("[reservation] failed to update delivery status:", e);
  }

  return { anyOk: results.some((r) => r.status === "fulfilled" && r.value.ok), hadChannels: true };
}
