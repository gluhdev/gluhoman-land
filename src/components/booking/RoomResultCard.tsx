"use client";

import { Building2, Check, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import RoomGallery from "@/components/booking/RoomGallery";
import { priceForGuests, formatUAH } from "@/lib/room-prices";
import type { RoomVM } from "@/lib/hotel-rooms";
import type { AvailabilityResult } from "@/app/actions/availability";

interface Props {
  room: RoomVM;
  hotel: string;
  hotelLabel: string;
  from?: string; // ISO
  to?: string; // ISO
  adults: number;
  children: number;
  availability?: AvailabilityResult; // undefined until dates chosen / fetched
  selected: boolean;
  onReserve: () => void;
}

const cardBase =
  "bg-white rounded-[2px] ring-1 ring-[#1a3d2e]/10 overflow-hidden";

const MAX_AMENITIES = 5;

function nightsBetween(from: string, to: string): number {
  return Math.max(
    1,
    Math.round((+new Date(to) - +new Date(from)) / 86400000),
  );
}

export default function RoomResultCard({
  room,
  hotelLabel,
  from,
  to,
  adults,
  children,
  availability,
  selected,
  onReserve,
}: Props) {
  const t = useTranslations("booking_page");

  const hasDates = Boolean(from && to);
  const nights = hasDates ? nightsBetween(from!, to!) : 1;
  const guests = adults + children;

  /** Slavic plural rule for nights (uk): 1 (not 11–14) → one; 2–4 (not 12–14) → few; else many. */
  const nightsLabel = (n: number): string => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return t("nights_one", { count: n });
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return t("nights_few", { count: n });
    }
    return t("nights_many", { count: n });
  };

  /** Ukrainian plural rule for guests: 1 (not 11–14) → one; 2–4 (not 12–14) → few; else many. */
  const pluralGuests = (n: number): string => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return t("guests_one");
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return t("guests_few");
    }
    return t("guests_many");
  };

  const perNight =
    hasDates && room.tiers ? priceForGuests(room.tiers, guests) : null;
  const hasStayTotal = typeof perNight === "number";

  // Per-occupancy tiers, sorted by guest count, for the price pills.
  const tierRows = room.tiers
    ? Object.entries(room.tiers)
        .map(([g, price]) => ({ guests: Number(g), price }))
        .sort((a, b) => a.guests - b.guests)
    : [];

  // Which pill matches the chosen guest count (highlight when dates are set).
  const activeTierGuests =
    hasStayTotal && tierRows.length
      ? tierRows.reduce((best, row) =>
          row.guests <= guests && row.guests >= best.guests ? row : best,
        tierRows[0]).guests
      : null;

  // Availability badge state (only meaningful when dates are chosen).
  const showAvailability = hasDates;
  const tracked = availability?.tracked ?? false;
  const soldOut = tracked && (availability?.available ?? 0) <= 0;
  const lastRoom = tracked && availability?.available === 1;

  const ctaDisabled = soldOut;

  const ctaClass = ctaDisabled
    ? "bg-[#1a3d2e]/15 text-[#1a3d2e]/40 cursor-not-allowed"
    : "bg-[#1a3d2e] text-[#f4ecd8] uppercase tracking-[0.14em] hover:bg-[#0f1f18] shadow-[0_10px_28px_-12px_rgba(15,31,24,0.5)] hover:shadow-[0_14px_32px_-12px_rgba(15,31,24,0.6)]";

  const visibleAmenities = room.amenities.slice(0, MAX_AMENITIES);
  const extraAmenities = room.amenities.length - visibleAmenities.length;

  const galleryImages = room.gallery.length > 0 ? room.gallery : [room.cover];

  return (
    <article
      id={`room-${room.slug}`}
      className={cardBase + (selected ? " ring-2 ring-[#1a3d2e]" : "")}
    >
      <div className="grid md:grid-cols-[minmax(0,22rem)_1fr] gap-0">
        {/* Gallery (top on mobile, left column on desktop).
            min-w-0: without it the single-column mobile grid item refuses to
            shrink below the gallery's min-content (the fixed-width thumbnail
            strip), overflowing the card and clipping the right arrow. */}
        <div className="md:p-3 min-w-0">
          <RoomGallery images={galleryImages} alt={room.name} />
        </div>

        {/* Details */}
        <div className="p-6 md:p-7 flex flex-col min-w-0">
          <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1a3d2e] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#e6d9b8]">
            <Building2 className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            {hotelLabel}
          </span>
          <h3 className="font-display text-2xl text-[#1a3d2e] leading-tight">
            {room.name}
          </h3>

          {room.tagline && (
            <p className="mt-1 font-display italic text-[15px] text-[#1a3d2e]/65 leading-snug">
              {room.tagline}
            </p>
          )}

          {room.capacity && (
            <p className="mt-3 flex items-center gap-2 text-[14px] text-[#0f1f18]/80">
              <Users
                className="w-4 h-4 text-[#1a3d2e] flex-shrink-0"
                strokeWidth={1.7}
              />
              <span>{room.capacity}</span>
            </p>
          )}

          {visibleAmenities.length > 0 && (
            <ul className="mt-4 space-y-2">
              {visibleAmenities.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[14px] text-[#0f1f18]/80"
                >
                  <Check
                    className="w-4 h-4 mt-0.5 text-[#1a3d2e] flex-shrink-0"
                    strokeWidth={1.7}
                  />
                  <span>{a}</span>
                </li>
              ))}
              {extraAmenities > 0 && (
                <li className="text-[13px] text-[#1a3d2e]/45 pl-[26px]">
                  +{extraAmenities}
                </li>
              )}
            </ul>
          )}

          {/* Availability badge */}
          {showAvailability && (
            <div className="mt-4">
              {availability === undefined ? (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-[#1a3d2e]/8 px-3 py-1 text-[12px] text-[#1a3d2e]/50"
                  aria-busy="true"
                >
                  …
                </span>
              ) : !tracked ? null : soldOut ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#c8102e]/12 px-3 py-1 text-[12px] font-medium text-[#c8102e]">
                  {t("sold_out")}
                </span>
              ) : lastRoom ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#c9a95c]/20 px-3 py-1 text-[12px] font-medium text-[#7a5d20]">
                  {t("last_room")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1a3d2e]/10 px-3 py-1 text-[12px] font-medium text-[#1a3d2e]">
                  {t("available")}
                </span>
              )}
            </div>
          )}

          {/* Price block */}
          <div className="mt-auto pt-5">
            {hasStayTotal ? (
              <>
                <p className="font-display text-3xl text-[#1a3d2e] leading-none">
                  {formatUAH(perNight! * nights)} грн
                </p>
                <p className="mt-1 text-[13px] text-[#0f1f18]/70">
                  {t("total_for_stay", { nights: nightsLabel(nights) })}
                </p>
                <p className="mt-0.5 text-[12px] text-[#1a3d2e]/55">
                  {formatUAH(perNight!)} грн {t("per_night")}
                </p>
              </>
            ) : room.tiers ? (
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl text-[#1a3d2e] leading-none">
                  {t("price_from")} {formatUAH(room.priceFrom!)} грн
                </span>
                <span className="text-[12px] text-[#1a3d2e]/55">
                  / {t("per_night")}
                </span>
              </p>
            ) : (
              <p className="font-display text-2xl text-[#1a3d2e] leading-none">
                {room.priceLabel}
              </p>
            )}

            {/* Per-occupancy pills */}
            {tierRows.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tierRows.map((row) => {
                  const active = row.guests === activeTierGuests;
                  return (
                    <span
                      key={row.guests}
                      className={`inline-flex items-center gap-1.5 rounded-full border border-[#1a3d2e]/12 bg-[#1a3d2e]/[0.03] px-3 py-1 text-[13px] text-[#1a3d2e]${
                        active ? " ring-2 ring-[#c9a95c]" : ""
                      }`}
                    >
                      {row.guests} {pluralGuests(row.guests)} ·{" "}
                      <span className="font-medium tabular-nums">
                        {formatUAH(row.price)} ₴
                      </span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-4 flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onReserve}
              disabled={ctaDisabled}
              className={`w-full sm:w-auto rounded-[2px] px-6 py-3 text-[15px] font-medium transition ${ctaClass}`}
            >
              {t("reserve")}
            </button>
            {!hasDates && (
              <span className="text-[12px] text-[#1a3d2e]/55 text-center sm:text-right">
                {t("change_dates_first")}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
