"use client";

import Link from "next/link";
import { Check, ArrowRight, Home, Phone } from "lucide-react";
import { CONTACT_INFO } from "@/constants";

export function SaunaSuccessClient({ slotId }: { slotId: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e6d9b8] mb-8">
        <Check className="w-10 h-10 text-[#0f1f18]" strokeWidth={1.5} />
      </div>

      <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-3">
        Бронювання прийнято
      </p>
      <h1 className="font-display text-5xl md:text-6xl text-[#1a3d2e] leading-[0.9] mb-6">
        Дякуємо!
        <span className="block italic text-[#1a3d2e]/70 text-4xl md:text-5xl mt-2">
          чекаємо на вас
        </span>
      </h1>

      <p className="text-lg text-[#0f1f18]/75 leading-relaxed mb-8 max-w-lg mx-auto">
        Ваш час заброньовано. Ми підготуємо лазню заздалегідь — натопимо чан,
        заваримо трав&apos;яні збори і чекатимемо на вас.
      </p>

      {slotId ? (
        <p className="font-mono text-sm text-[#1a3d2e] bg-[#f4ecd8] border border-[#e6d9b8] px-4 py-3 inline-block mb-10">
          № бронювання: <span className="font-semibold">{slotId}</span>
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={`tel:+${CONTACT_INFO.phone[0].replace(/\D/g, "")}`}
          className="inline-flex items-center justify-center gap-3 bg-[#1a3d2e] text-[#f4ecd8] px-8 py-4 font-medium tracking-wide hover:bg-[#0f1f18] transition"
        >
          <Phone className="w-4 h-4" />
          {CONTACT_INFO.phone[0]}
        </a>
        <Link
          href="/sauna"
          className="inline-flex items-center justify-center gap-3 border border-[#1a3d2e] text-[#1a3d2e] px-8 py-4 font-medium tracking-wide hover:bg-[#1a3d2e] hover:text-[#f4ecd8] transition"
        >
          <ArrowRight className="w-4 h-4" />
          До лазні
        </Link>
      </div>
    </div>
  );
}
