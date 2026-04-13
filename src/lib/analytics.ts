type EventName =
  | "booking_opened"
  | "booking_submitted"
  | "booking_failed"
  | "phone_clicked"
  | "telegram_clicked"
  | "whatsapp_clicked"
  | "lightbox_opened"
  | "font_changed";

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (name: string, options?: { props?: EventProps }) => void;
  }
}

export function trackEvent(name: EventName, props?: EventProps): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  window.plausible(name, props ? { props } : undefined);
}
