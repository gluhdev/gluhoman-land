import { getTranslations } from "next-intl/server";
import { priceTiers, priceFrom, formatUAH } from "@/lib/room-prices";

export async function RoomPrice({
  hotelSlug,
  slug,
  locale,
  fallback,
  light = false,
}: {
  hotelSlug: string;
  slug: string;
  locale: string;
  fallback: string;
  /** Cream palette for dark (deep-green) backgrounds, e.g. cottage blocks. */
  light?: boolean;
}) {
  const tiers = priceTiers(hotelSlug, slug);
  const t = await getTranslations({
    locale,
    namespace: "ui.booking_dialog_hotel",
  });

  if (!tiers) {
    return (
      <p
        className={`font-display text-[15px] ${
          light ? "text-[#e6d9b8]/80" : "text-[#1a3d2e]/70"
        }`}
      >
        {fallback}
      </p>
    );
  }

  const from = priceFrom(tiers)!;
  const counts = Object.keys(tiers)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-[11px] uppercase tracking-[0.2em] ${
            light ? "text-[#e6d9b8]/70" : "text-[#1a3d2e]/55"
          }`}
        >
          {t("price_from")}
        </span>
        <span
          className={`font-display text-[30px] leading-none font-semibold tabular-nums ${
            light ? "text-[#f4ecd8]" : "text-[#1a3d2e]"
          }`}
        >
          {formatUAH(from)}
        </span>
        <span
          className={`text-[13px] ${
            light ? "text-[#e6d9b8]/75" : "text-[#1a3d2e]/60"
          }`}
        >
          {t("price_per_night")}
        </span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {counts.map((c) => (
          <li
            key={c}
            className={`flex items-baseline gap-1.5 rounded-full border px-3 py-1 ${
              light
                ? "border-[#e6d9b8]/20 bg-[#f4ecd8]/[0.06]"
                : "border-[#1a3d2e]/12 bg-[#1a3d2e]/[0.03]"
            }`}
          >
            <span
              className={`text-[12px] ${
                light ? "text-[#e6d9b8]/75" : "text-[#1a3d2e]/60"
              }`}
            >
              {t("guests_count", { count: c })}
            </span>
            <span
              className={`text-[13px] font-semibold tabular-nums ${
                light ? "text-[#f4ecd8]" : "text-[#0f1f18]"
              }`}
            >
              {formatUAH(tiers[c])}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
