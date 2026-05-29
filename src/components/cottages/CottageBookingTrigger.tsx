"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

interface Props {
  label: string;
  prefill: string;
  priceLabel?: string;
  cottageSlug?: string;
  roomName?: string;
  photoUrl?: string;
  light: boolean;
}

/**
 * Per-cottage "Забронювати" trigger. Links to the shared hotel-booking page,
 * preselecting the "cottages" hotel and (when known) the specific room so the
 * booking page opens already scoped to the cottage the guest is interested in.
 */
export function CottageBookingTrigger({ label, cottageSlug, light }: Props) {
  const href = cottageSlug
    ? `/hotel/booking?hotel=cottages&room=${encodeURIComponent(cottageSlug)}`
    : "/hotel/booking?hotel=cottages";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium tracking-wide transition-colors min-h-[44px] ${
        light
          ? "bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8]"
          : "bg-[#1a3d2e] text-[#f4ecd8] hover:bg-[#0f1f18]"
      }`}
    >
      <Calendar className="w-4 h-4" strokeWidth={2} />
      {label}
    </Link>
  );
}
