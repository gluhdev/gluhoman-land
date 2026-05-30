import Link from "next/link";
import { Calendar } from "lucide-react";

interface Props {
  label: string;
  hotelSlug: "aquapark" | "central" | "cottages" | "brewery";
  roomCategorySlug: string;
  // Retained for call-site compatibility (no longer used for navigation); cleaned up in a later phase.
  roomName?: string;
  priceLabel?: string;
  photoUrl?: string;
  light?: boolean;
}

/**
 * Per-room "Забронювати" trigger used on /hotel/aquapark, /hotel/central,
 * /hotel/brewery, and /cottages detail pages.
 * Navigates to the full booking page pre-seeded with hotel + room context
 * via query params, replacing the previous modal-based flow.
 */
export function HotelBookingTrigger({
  label,
  hotelSlug,
  roomCategorySlug,
  light = false,
}: Props) {
  return (
    <Link
      href={`/hotel/booking?hotel=${hotelSlug}&room=${roomCategorySlug}`}
      className={`inline-flex items-center justify-center gap-2.5 rounded-[2px] px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 min-h-[48px] ${
        light
          ? "bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8]"
          : "bg-[#1a3d2e] text-[#f4ecd8] shadow-[0_10px_28px_-12px_rgba(15,31,24,0.5)] hover:bg-[#0f1f18] hover:shadow-[0_14px_32px_-12px_rgba(15,31,24,0.6)]"
      }`}
    >
      <Calendar className="w-4 h-4" strokeWidth={2} />
      {label}
    </Link>
  );
}
