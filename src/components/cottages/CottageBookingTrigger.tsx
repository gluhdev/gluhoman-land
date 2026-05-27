"use client";

import { Calendar } from "lucide-react";
import { openBookingDialog } from "@/components/ui/BookingDialog";

interface Props {
  label: string;
  prefill: string;
  light: boolean;
}

/**
 * Per-cottage "Забронювати" trigger. Uses the shared hotel-booking flow
 * with a prefilled comment so the request that lands in Telegram already
 * names the cottage the guest is interested in.
 */
export function CottageBookingTrigger({ label, prefill, light }: Props) {
  return (
    <button
      type="button"
      onClick={() => openBookingDialog("hotel", { comment: prefill })}
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
