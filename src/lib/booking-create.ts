// Shared booking-creation core, called by BOTH the web admin server action
// (createManualBooking, which adds session auth) and the Telegram bot /book flow
// (which authorizes via TELEGRAM_ADMIN_CHAT_IDS). Lives in a plain lib — NOT a
// 'use server' file — so it is never exposed as an unauthenticated RPC endpoint;
// every caller authorizes first and passes the resolved hotelSlug.
import { prisma } from "@/lib/prisma";

export interface BookingCreateInput {
  hotelSlug?: string;
  roomCategorySlug: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  dateFrom: string; // ISO yyyy-mm-dd
  dateTo?: string;
  comment?: string;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export async function createBookingCore(
  input: BookingCreateInput,
  hotelSlug: string,
): Promise<{ ok: boolean; error?: string; id?: string }> {
  const name = input.name.trim();
  const phone = input.phone.trim();
  if (!name) return { ok: false, error: "Вкажіть ім'я гостя" };
  if (!phone) return { ok: false, error: "Вкажіть телефон" };
  if (!input.roomCategorySlug) return { ok: false, error: "Оберіть номер" };

  const dateFrom = new Date(input.dateFrom);
  if (Number.isNaN(dateFrom.getTime()))
    return { ok: false, error: "Невірна дата заїзду" };
  let dateTo: Date | null = null;
  if (input.dateTo) {
    const d = new Date(input.dateTo);
    if (Number.isNaN(d.getTime()))
      return { ok: false, error: "Невірна дата виїзду" };
    if (d <= dateFrom)
      return { ok: false, error: "Дата виїзду має бути пізніше заїзду" };
    dateTo = d;
  }

  const guests =
    Number.isFinite(input.guests) && input.guests > 0
      ? Math.trunc(input.guests)
      : 1;
  const status = (
    ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const
  ).includes(input.status as never)
    ? input.status!
    : "CONFIRMED";

  const note = ["Ручне бронювання (адмін)", input.comment?.trim()]
    .filter(Boolean)
    .join(" · ");

  try {
    const booking = await prisma.booking.create({
      data: {
        service: "HOTEL",
        status,
        name,
        phone,
        email: input.email?.trim() || null,
        guests,
        dateFrom,
        dateTo,
        comment: note,
        hotelSlug,
        roomCategorySlug: input.roomCategorySlug,
        telegramStatus: "SENT",
        emailStatus: "SENT",
      },
    });
    return { ok: true, id: booking.id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Помилка створення",
    };
  }
}
