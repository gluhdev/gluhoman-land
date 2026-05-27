"use client";

import { Calendar } from "lucide-react";
import { openBookingDialog } from "@/components/ui/BookingDialog";

interface Props {
  label: string;
  hotelSlug: "aquapark" | "central" | "cottages" | "brewery";
  roomCategorySlug: string;
  roomName: string;
  light?: boolean;
}

/**
 * Per-room "Забронювати" trigger used on /hotel/aquapark and /hotel/central
 * detail pages. Opens the shared BookingDialog pre-populated with hotel +
 * room context so the resulting submission carries `hotelSlug` and
 * `roomCategorySlug` to the server action — which then routes the Telegram
 * notification to the correct administrator's chat and stores the structured
 * data in the Booking record for the admin panel.
 */
export function HotelBookingTrigger({
  label,
  hotelSlug,
  roomCategorySlug,
  roomName,
  light = false,
}: Props) {
  const prefillComment = `Готель: ${labelFor(hotelSlug)} · Номер: ${roomName}.`;
  return (
    <button
      type="button"
      onClick={() =>
        openBookingDialog("hotel", {
          comment: prefillComment,
          hotelSlug,
          roomCategorySlug,
        })
      }
      className={`inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium tracking-wide transition-colors min-h-[44px] ${
        light
          ? "bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8]"
          : "bg-[#1a3d2e] text-[#f4ecd8] hover:bg-[#0f1f18]"
      }`}
    >
      <Calendar className="w-4 h-4" strokeWidth={2} />
      {label}
    </button>
  );
}

function labelFor(slug: Props["hotelSlug"]): string {
  switch (slug) {
    case "aquapark":
      return "Готель-Аквапарк";
    case "central":
      return "Центральний Готель";
    case "cottages":
      return "Будиночки";
    case "brewery":
      return "Корпус Броварні";
  }
}
