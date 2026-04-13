"use server";

import { headers } from "next/headers";
import { CONTACT_INFO } from "@/constants";
import { prisma } from "@/lib/prisma";

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

type ChannelName = "telegram" | "email";

interface ChannelResult {
  ok: boolean;
  channel: ChannelName;
  error?: string;
}

const SERVICE_LABEL: Record<BookingService, string> = {
  hotel: "Готель",
  aquapark: "Аквапарк",
  restaurant: "Ресторан",
  sauna: "Лазня",
};

const SERVICE_TO_DB: Record<BookingService, "HOTEL" | "AQUAPARK" | "RESTAURANT" | "SAUNA"> = {
  hotel: "HOTEL",
  aquapark: "AQUAPARK",
  restaurant: "RESTAURANT",
  sauna: "SAUNA",
};

const ROOM_TYPE_LABEL: Record<NonNullable<BookingPayload["roomType"]>, string> = {
  standard: "Стандарт",
  family: "Сімейний",
  lux: "Люкс",
};

const TARIFF_LABEL: Record<NonNullable<BookingPayload["tariff"]>, string> = {
  full_day: "Повний день",
  half_day: "Пів дня",
};

const OCCASION_LABEL: Record<NonNullable<BookingPayload["occasion"]>, string> = {
  birthday: "День народження",
  business: "Бізнес-зустріч",
  romantic: "Романтична вечеря",
  casual: "Дружня зустріч",
  other: "Інше",
};

const PROGRAMME_LABEL: Record<NonNullable<BookingPayload["programme"]>, string> = {
  classic: "Класична",
  herbal: "Фіто",
  family: "Сімейна",
};

function validate(p: BookingPayload): string | null {
  if (!p.service || !SERVICE_LABEL[p.service]) return "Оберіть послугу";
  if (!p.name || p.name.trim().length < 2) return "Введіть ім'я";
  if (!p.phone || p.phone.replace(/\D/g, "").length < 10)
    return "Введіть коректний телефон";
  if (!p.dateFrom) return "Оберіть дату";
  if (p.service === "hotel" && !p.dateTo) return "Оберіть дату виїзду";
  if (p.service === "restaurant" && !p.time) return "Оберіть час";
  if (p.service === "sauna" && !p.time) return "Оберіть час";
  if (!p.guests || p.guests < 1 || p.guests > 50)
    return "Кількість гостей від 1 до 50";
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
    return "Некоректний email";
  return null;
}

function formatMessage(p: BookingPayload, bookingId: string): string {
  const lines = [
    `🌲 Нова заявка — ${SERVICE_LABEL[p.service]}`,
    `🆔 #${bookingId.slice(0, 8)}`,
    `👤 ${p.name}`,
    `📞 ${p.phone}`,
  ];
  if (p.email) lines.push(`✉️ ${p.email}`);
  lines.push(`👥 Гостей: ${p.guests}`);
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
    if (p.time) lines.push(`🕐 Час: ${p.time}`);
    if (p.programme) lines.push(`🌿 Програма: ${PROGRAMME_LABEL[p.programme]}`);
  }
  if (p.comment) lines.push(`💬 ${p.comment}`);
  return lines.join("\n");
}

async function sendTelegram(message: string): Promise<ChannelResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
        cache: "no-store",
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("[booking] Telegram error:", res.status, body);
      return {
        ok: false,
        channel: "telegram",
        error: `HTTP ${res.status}: ${body}`,
      };
    }
    return { ok: true, channel: "telegram" };
  } catch (e) {
    console.error("[booking] Telegram network error:", e);
    return {
      ok: false,
      channel: "telegram",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function sendEmail(
  payload: BookingPayload,
  message: string
): Promise<ChannelResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_EMAIL_FROM;
  const to = process.env.BOOKING_EMAIL_TO;
  const subject = `Нова заявка — ${SERVICE_LABEL[payload.service]} — ${payload.name}`;
  const text = payload.email
    ? `${message}\n\nВідповідайте на цей лист, щоб зв'язатися з гостем.`
    : message;

  const body: Record<string, unknown> = {
    from,
    to: to!
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    subject,
    text,
  };
  if (payload.email) body.reply_to = payload.email;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error("[booking] Resend error:", res.status, errBody);
      return {
        ok: false,
        channel: "email",
        error: `HTTP ${res.status}: ${errBody}`,
      };
    }
    return { ok: true, channel: "email" };
  } catch (e) {
    console.error("[booking] Resend network error:", e);
    return {
      ok: false,
      channel: "email",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function submitBooking(
  payload: BookingPayload
): Promise<BookingResult> {
  const error = validate(payload);
  if (error) return { ok: false, message: error };

  // Capture request metadata for audit
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    null;
  const userAgent = headersList.get("user-agent") || null;

  // Build enriched comment that captures service-specific fields so they
  // aren't lost when stored in the legacy Booking table.
  const extraLines: string[] = [];
  if (payload.roomType) extraLines.push(`Номер: ${ROOM_TYPE_LABEL[payload.roomType]}`);
  if (payload.adults != null) extraLines.push(`Дорослих: ${payload.adults}`);
  if (payload.children != null) extraLines.push(`Дітей: ${payload.children}`);
  if (payload.breakfast) extraLines.push("Зі сніданком");
  if (payload.tariff) extraLines.push(`Тариф: ${TARIFF_LABEL[payload.tariff]}`);
  if (payload.adultsCount != null) extraLines.push(`Дорослих: ${payload.adultsCount}`);
  if (payload.kidsCount != null) extraLines.push(`Діти 3–12: ${payload.kidsCount}`);
  if (payload.toddlersCount != null) extraLines.push(`До 3 років: ${payload.toddlersCount}`);
  if (payload.occasion) extraLines.push(`Привід: ${OCCASION_LABEL[payload.occasion]}`);
  if (payload.dietary) extraLines.push(`Дієта: ${payload.dietary}`);
  if (payload.programme) extraLines.push(`Програма: ${PROGRAMME_LABEL[payload.programme]}`);
  if (payload.comment?.trim()) extraLines.push(payload.comment.trim());
  const enrichedComment = extraLines.length > 0 ? extraLines.join(" · ") : null;

  // 1. Persist FIRST — even if all delivery channels fail, we have the booking
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
        dateTo:
          payload.service === "hotel" && payload.dateTo
            ? new Date(payload.dateTo)
            : null,
        time: payload.time || null,
        comment: enrichedComment,
        ipAddress,
        userAgent,
      },
    });
  } catch (e) {
    console.error("[booking] DB persist failed:", e);
    return {
      ok: false,
      message: `Технічна помилка. Зателефонуйте нам: ${CONTACT_INFO.phone[0]}`,
    };
  }

  // 2. Format & dispatch notification channels in parallel
  const message = formatMessage(payload, booking.id);

  const telegramConfigured =
    !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID;
  const emailConfigured =
    !!process.env.RESEND_API_KEY &&
    !!process.env.BOOKING_EMAIL_FROM &&
    !!process.env.BOOKING_EMAIL_TO;

  const channels: Promise<ChannelResult>[] = [];
  if (telegramConfigured) channels.push(sendTelegram(message));
  if (emailConfigured) channels.push(sendEmail(payload, message));

  if (channels.length === 0) {
    console.log(
      `[booking] no delivery channels configured — booking ${booking.id} stored only:\n${message}`
    );
    return {
      ok: true,
      bookingId: booking.id,
      message: `Заявку #${booking.id.slice(0, 8)} прийнято. Ми зв'яжемося з вами за номером ${CONTACT_INFO.phone[0]}.`,
    };
  }

  const results = await Promise.allSettled(channels);

  // 3. Update booking with delivery status (best-effort, non-blocking failure)
  const tgResult = results.find((r, i) => {
    return (
      r.status === "fulfilled" &&
      (r.value as ChannelResult).channel === "telegram"
    );
  });
  const emailResult = results.find((r, i) => {
    return (
      r.status === "fulfilled" &&
      (r.value as ChannelResult).channel === "email"
    );
  });

  try {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        telegramStatus:
          tgResult && tgResult.status === "fulfilled"
            ? (tgResult.value as ChannelResult).ok
              ? "SENT"
              : "FAILED"
            : telegramConfigured
            ? "FAILED"
            : "PENDING",
        telegramError:
          tgResult && tgResult.status === "fulfilled"
            ? (tgResult.value as ChannelResult).error || null
            : null,
        emailStatus:
          emailResult && emailResult.status === "fulfilled"
            ? (emailResult.value as ChannelResult).ok
              ? "SENT"
              : "FAILED"
            : emailConfigured
            ? "FAILED"
            : "PENDING",
        emailError:
          emailResult && emailResult.status === "fulfilled"
            ? (emailResult.value as ChannelResult).error || null
            : null,
      },
    });
  } catch (e) {
    console.error("[booking] failed to update delivery status:", e);
  }

  const anyOk = results.some(
    (r) => r.status === "fulfilled" && r.value.ok
  );

  if (anyOk) {
    return {
      ok: true,
      bookingId: booking.id,
      message: `Дякуємо! Заявку #${booking.id.slice(0, 8)} прийнято. Ми зв'яжемося з вами найближчим часом.`,
    };
  }

  // Booking is in DB but no channels worked. Still ok=true so user knows we have it.
  console.error("[booking] all channels failed for booking", booking.id, results);
  return {
    ok: true,
    bookingId: booking.id,
    message: `Заявку #${booking.id.slice(0, 8)} збережено. Зателефонуйте нам для підтвердження: ${CONTACT_INFO.phone[0]}`,
  };
}
