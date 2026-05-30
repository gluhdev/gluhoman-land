"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import AvailabilityBar from "@/components/booking/AvailabilityBar";
import RoomResultCard from "@/components/booking/RoomResultCard";
import ReservePanel from "@/components/booking/ReservePanel";
import { checkAvailability, type AvailabilityResult } from "@/app/actions/availability";
import type { RoomVM, BookingHotelSlug } from "@/lib/hotel-rooms";

// Representative exterior/general photo per hotel (matches each hotel page hero).
const HOTEL_HERO: Record<string, string> = {
  aquapark: "/images/hotels/aquapark/exterior/1.jpg",
  central: "/images/hotels/central/1.jpg",
  brewery: "/images/hotels/central/49.jpg",
  cottages: "/images/cottages/yaga/1.jpg",
};

interface Props {
  hotels: { slug: string; label: string }[];
  hotel: BookingHotelSlug;
  rooms: RoomVM[];
  from?: string;
  to?: string;
  adults: number;
  children: number;
  initialRoom?: string;
  noRoomsLabel: string;
}

export default function RoomResults({
  hotels,
  hotel,
  rooms,
  from,
  to,
  adults,
  children,
  initialRoom,
  noRoomsLabel,
}: Props) {
  const t = useTranslations("booking_page");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialRoom ?? null,
  );

  const hotelLabel =
    hotels.find((h) => h.slug === hotel)?.label ?? "";
  // Representative hotel photo (exterior / general shot) — same images used as
  // the hero on each hotel's marketing page. NOT a room photo.
  const hotelImage = HOTEL_HERO[hotel] ?? rooms[0]?.cover;
  const hasDates = Boolean(from && to);
  const [avail, setAvail] = useState<Record<string, AvailabilityResult>>({});
  const [, startAvail] = useTransition();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const roomsRef = useRef<HTMLDivElement | null>(null);
  const datesMounted = useRef(false);

  // After the guest picks BOTH dates, smoothly scroll down to the room list
  // (skip the very first render so a deep-linked ?from&to doesn't auto-scroll).
  useEffect(() => {
    if (!datesMounted.current) {
      datesMounted.current = true;
      return;
    }
    if (from && to) {
      roomsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [from, to]);

  // NOTE: deliberately do NOT auto-scroll to the deep-linked room on mount —
  // the page must open from the top (choose dates first). The room is still
  // pre-selected via selectedSlug above.

  // Availability fetching: debounced, inside a transition, keyed on inputs.
  useEffect(() => {
    if (!from || !to) {
      setAvail({});
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      startAvail(async () => {
        const results = await Promise.all(
          rooms.map((r) => checkAvailability(hotel, r.slug, from, to)),
        );
        if (cancelled) return;
        const next: Record<string, AvailabilityResult> = {};
        rooms.forEach((r, i) => {
          next[r.slug] = results[i];
        });
        setAvail(next);
      });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hotel, from, to, rooms]);

  const handleReserve = (slug: string) => {
    setSelectedSlug(slug);
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div>
      <AvailabilityBar
        hotels={hotels}
        current={{ hotel, from, to, adults, children }}
        intro={{
          image: hotelImage,
          label: hotelLabel,
          description: t(`hotel_desc_${hotel}`),
          roomCount: rooms.length,
        }}
      />

      {rooms.length > 0 && (
        <div ref={roomsRef} className="mt-8 mb-4 scroll-mt-24">
          <h2 className="font-display text-2xl text-[#1a3d2e]">
            {t("choose_room")}
          </h2>
          <p className="mt-1 text-[14px] text-[#1a3d2e]/60">
            {hasDates ? t("rooms_for_dates") : t("rooms_pick_dates_hint")}
          </p>
        </div>
      )}

      {/* Full-width room list; the reserve form expands inline under the chosen room */}
      <div className="space-y-6">
        {rooms.length === 0 ? (
          <p className="rounded-[2px] bg-white p-8 text-center text-[#0f1f18]/70 ring-1 ring-[#1a3d2e]/10">
            {noRoomsLabel}
          </p>
        ) : (
          rooms.map((room) => (
            <div key={room.slug}>
              <RoomResultCard
                room={room}
                hotel={hotel}
                from={from}
                to={to}
                adults={adults}
                // eslint-disable-next-line react/no-children-prop
                children={children}
                availability={avail[room.slug]}
                selected={selectedSlug === room.slug}
                onReserve={() => handleReserve(room.slug)}
              />
              {selectedSlug === room.slug && (
                <div ref={panelRef} className="mt-4 scroll-mt-24">
                  <ReservePanel
                    room={room}
                    hotel={hotel}
                    from={from}
                    to={to}
                    adults={adults}
                    // eslint-disable-next-line react/no-children-prop
                    children={children}
                    onClose={() => setSelectedSlug(null)}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
