// Shared status-change seam — the single path that BOTH the web admin and the
// Telegram bot call to transition an entity's status. It owns: load → hotel-scope
// auth → idempotency guard → mutate via the EXISTING storage mutator → notify
// (operator always; guest on confirm/cancel). This keeps the two surfaces from
// ever diverging and gives status changes the notifications that previously only
// fired on payment (markPaid).
import { prisma } from "@/lib/prisma";
import { orderStorage } from "@/lib/order-storage";
import { saunaStorage } from "@/lib/sauna-storage";
import { aquaparkStorage } from "@/lib/aquapark-storage";
import { bookingStorage } from "@/lib/booking-storage";
import type { PaymentType } from "@/lib/payment-router";
import {
  notifyStatusChange,
  type ManagedEntity,
} from "@/lib/status-notify";

export type StatusAction =
  | "confirm"
  | "cancel"
  | "preparing"
  | "delivering"
  | "complete"
  | "refund";

// Semantic action → the concrete status string of each entity's own enum.
// A type missing from an action's map means that action is not valid for it.
const ACTION_STATUS: Record<StatusAction, Partial<Record<PaymentType, string>>> =
  {
    confirm: {
      order: "CONFIRMED",
      sauna: "paid",
      hotel: "confirmed",
      reservation: "CONFIRMED",
    },
    cancel: {
      order: "CANCELLED",
      sauna: "cancelled",
      aquapark: "cancelled",
      hotel: "cancelled",
      reservation: "CANCELLED",
    },
    preparing: { order: "PREPARING" },
    delivering: { order: "DELIVERING" },
    complete: {
      order: "COMPLETED",
      sauna: "completed",
      hotel: "completed",
      reservation: "COMPLETED",
    },
    refund: { aquapark: "refunded" },
  };

/** Native status string for a semantic action, or undefined if not applicable. */
export function actionToStatus(
  type: PaymentType,
  action: StatusAction,
): string | undefined {
  return ACTION_STATUS[action]?.[type];
}

/** Reverse lookup: the semantic action that yields this native status (for
 *  callers — like the existing status routes — that pass a raw status string). */
export function statusToAction(
  type: PaymentType,
  status: string,
): StatusAction | undefined {
  for (const action of Object.keys(ACTION_STATUS) as StatusAction[]) {
    if (ACTION_STATUS[action]?.[type] === status) return action;
  }
  return undefined;
}

export interface ChangeCtx {
  /** Actor's hotel scope: null/undefined = super-admin; a slug locks to that hotel. */
  hotelSlug?: string | null;
  /** Send the guest a confirm/cancel email when true. */
  notifyGuest?: boolean;
  /** Free-form actor id for logs (chat id / user id). */
  actor?: string;
}

export interface ChangeResult {
  ok: boolean;
  alreadyDone?: boolean;
  status?: string;
  ref?: string;
  error?: string;
}

/** Load an entity into the normalised ManagedEntity shape (or null if missing). */
async function load(
  type: PaymentType,
  id: string,
): Promise<ManagedEntity | null> {
  switch (type) {
    case "order": {
      const o = await orderStorage.get(id);
      return o
        ? {
            type,
            id,
            ref: `№${o.number}`,
            status: o.status,
            guestName: o.customerName,
            hotelSlug: null,
            total: o.total,
          }
        : null;
    }
    case "sauna": {
      const s = await saunaStorage.get(id);
      return s
        ? {
            type,
            id,
            ref: `№${s.number}`,
            status: s.status,
            guestEmail: s.customerEmail ?? null,
            guestName: s.customerName,
            hotelSlug: null,
            total: s.total,
          }
        : null;
    }
    case "aquapark": {
      const t = await aquaparkStorage.get(id);
      return t
        ? {
            type,
            id,
            ref: `№${t.number}`,
            status: t.status,
            guestEmail: t.customerEmail ?? null,
            guestName: t.customerName,
            hotelSlug: null,
            total: t.total,
          }
        : null;
    }
    case "hotel": {
      const b = await bookingStorage.get(id);
      return b
        ? {
            type,
            id,
            ref: `№${b.number}`,
            status: b.status,
            guestEmail: b.customerEmail ?? null,
            guestName: b.customerName,
            hotelSlug: null,
          }
        : null;
    }
    case "reservation": {
      const b = await prisma.booking.findUnique({ where: { id } });
      return b
        ? {
            type,
            id,
            ref: `#${b.id.slice(0, 8)}`,
            status: b.status,
            guestEmail: b.email,
            guestName: b.name,
            hotelSlug: b.hotelSlug,
            total: b.totalAmount,
          }
        : null;
    }
    default:
      return null;
  }
}

/** Apply the new status via the entity's existing mutator. */
async function mutate(
  type: PaymentType,
  id: string,
  status: string,
): Promise<void> {
  switch (type) {
    case "order":
      await orderStorage.updateStatus(
        id,
        status as Parameters<typeof orderStorage.updateStatus>[1],
      );
      return;
    case "sauna":
      await saunaStorage.updateStatus(
        id,
        status as Parameters<typeof saunaStorage.updateStatus>[1],
      );
      return;
    case "aquapark":
      await aquaparkStorage.updateStatus(
        id,
        status as Parameters<typeof aquaparkStorage.updateStatus>[1],
      );
      return;
    case "hotel":
      await bookingStorage.updateStatus(
        id,
        status as Parameters<typeof bookingStorage.updateStatus>[1],
      );
      return;
    case "reservation":
      await prisma.booking.update({
        where: { id },
        // BookingStatus enum; cast since callers pass the resolved string.
        data: { status: status as never },
      });
      return;
  }
}

/**
 * Transition an entity to `targetStatus` (the entity's native status string).
 * Idempotent: re-running with the same target is a no-op + no duplicate notify.
 * Use actionToStatus() to derive targetStatus from a semantic action.
 */
export async function changeStatus(
  type: PaymentType,
  id: string,
  targetStatus: string,
  ctx: ChangeCtx = {},
  action?: StatusAction,
): Promise<ChangeResult> {
  const act = action ?? statusToAction(type, targetStatus);
  const ent = await load(type, id);
  if (!ent) return { ok: false, error: "Не знайдено" };

  // Hotel-scope: only enforceable where the entity carries a hotelSlug.
  if (ctx.hotelSlug && ent.hotelSlug && ent.hotelSlug !== ctx.hotelSlug) {
    return { ok: false, error: "Немає доступу до цього готелю" };
  }

  // Idempotency — skip the write AND the notification if already in target.
  if (ent.status === targetStatus) {
    return { ok: true, alreadyDone: true, status: targetStatus, ref: ent.ref };
  }

  try {
    await mutate(type, id, targetStatus);
  } catch (e) {
    console.error("[status-service] mutate failed", type, id, e);
    return { ok: false, error: "Помилка оновлення" };
  }

  // Fire-and-forget notification with the post-change status.
  notifyStatusChange(
    { ...ent, status: targetStatus },
    act,
    { notifyGuest: ctx.notifyGuest },
  ).catch(() => {});

  return { ok: true, status: targetStatus, ref: ent.ref };
}
