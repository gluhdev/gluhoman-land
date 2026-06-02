// Status-change notifications + the shared inline-keyboard builder.
//
// Two responsibilities, both reused by the web admin AND the Telegram bot:
//  1. notifyStatusChange() — tell operators (always) and the guest (on
//     confirm/cancel, if configured) that an item's status changed.
//  2. buildActionKeyboard() — the inline approve/cancel buttons appended to the
//     "new booking/order" operator notifications so they're actionable in chat.
//
// Kept separate from the per-entity *-notify.ts "new X" builders on purpose:
// those announce creation; this announces a transition.
import type { PaymentType } from "@/lib/payment-router";
import type { StatusAction } from "@/lib/status-service";

/** Normalised view of any managed entity, enough to notify about it. */
export interface ManagedEntity {
  type: PaymentType;
  id: string;
  ref: string; // human reference, e.g. "№123" or "#ab12cd34"
  status: string;
  guestEmail?: string | null;
  guestName?: string | null;
  hotelSlug?: string | null;
  total?: number | null;
}

const ACTION_LABEL: Record<StatusAction, string> = {
  confirm: "Підтверджено ✅",
  cancel: "Скасовано ✖️",
  preparing: "Готується 👨‍🍳",
  delivering: "В дорозі 🚗",
  complete: "Виконано ✔️",
  refund: "Повернення ♻️",
};

const TYPE_LABEL: Record<PaymentType, string> = {
  order: "Замовлення",
  reservation: "Бронювання",
  hotel: "Бронювання (готель)",
  sauna: "Лазня",
  aquapark: "Аквапарк",
};

/** Operator chat for an entity — per-hotel routing for hotel bookings, else the
 *  default chat. Mirrors reservation-notify's chatIdForHotel intent. */
function operatorChatId(hotelSlug?: string | null): string | undefined {
  if (hotelSlug) {
    const perHotel =
      process.env[`TELEGRAM_CHAT_ID_${hotelSlug.toUpperCase()}`];
    if (perHotel) return perHotel;
  }
  return process.env.TELEGRAM_CHAT_ID;
}

async function sendOperatorTelegram(text: string, hotelSlug?: string | null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = operatorChatId(hotelSlug);
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch (e) {
    console.error("[status-notify] operator telegram failed", e);
  }
}

async function sendGuestEmail(
  to: string,
  subject: string,
  text: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_EMAIL_FROM;
  if (!apiKey || !from) return; // not configured — skip silently
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
  } catch (e) {
    console.error("[status-notify] guest email failed", e);
  }
}

/** Notify operators (always) and the guest (on confirm/cancel when notifyGuest)
 *  about a status transition. Fire-and-forget, never throws. */
export async function notifyStatusChange(
  ent: ManagedEntity,
  action: StatusAction | undefined,
  opts: { notifyGuest?: boolean } = {},
): Promise<void> {
  const label = (action && ACTION_LABEL[action]) || ent.status;
  const typeLabel = TYPE_LABEL[ent.type] ?? ent.type;

  await sendOperatorTelegram(
    `🔄 <b>${typeLabel} ${ent.ref}</b> — ${label}`,
    ent.hotelSlug,
  );

  if (
    opts.notifyGuest &&
    ent.guestEmail &&
    (action === "confirm" || action === "cancel")
  ) {
    const confirmed = action === "confirm";
    await sendGuestEmail(
      ent.guestEmail,
      confirmed
        ? "Бронювання підтверджено — Глухомань"
        : "Бронювання скасовано — Глухомань",
      confirmed
        ? `Вітаємо${ent.guestName ? `, ${ent.guestName}` : ""}!\n\nВаше бронювання ${ent.ref} підтверджено. Чекаємо на вас у «Глухомані».`
        : `Доброго дня${ent.guestName ? `, ${ent.guestName}` : ""}.\n\nВаше бронювання ${ent.ref} було скасовано. Якщо це помилка — будь ласка, зв'яжіться з нами.`,
    );
  }
}

/** Inline approve/cancel keyboard for the "new X" operator notifications.
 *  callback_data = "{action}:{entity}:{id}" (cuid keeps it < 64 bytes). */
export function buildActionKeyboard(
  type: PaymentType,
  id: string,
): { inline_keyboard: { text: string; callback_data: string }[][] } | undefined {
  const btn = (text: string, action: StatusAction) => ({
    text,
    callback_data: `${action}:${type}:${id}`,
  });
  switch (type) {
    case "order":
      return {
        inline_keyboard: [
          [btn("✅ Підтвердити", "confirm"), btn("✖️ Скасувати", "cancel")],
        ],
      };
    case "sauna":
    case "hotel":
    case "reservation":
      return {
        inline_keyboard: [
          [btn("✅ Підтвердити", "confirm"), btn("✖️ Скасувати", "cancel")],
        ],
      };
    case "aquapark":
      return {
        inline_keyboard: [
          [btn("✖️ Скасувати", "cancel"), btn("♻️ Повернення", "refund")],
        ],
      };
    default:
      return undefined;
  }
}
