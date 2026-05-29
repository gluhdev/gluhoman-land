"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import AvailabilityBar from "@/components/booking/AvailabilityBar";
import RoomResultCard from "@/components/booking/RoomResultCard";
import ReservePanel from "@/components/booking/ReservePanel";
import { checkAvailability, type AvailabilityResult } from "@/app/actions/availability";
import type { RoomVM, BookingHotelSlug } from "@/lib/hotel-rooms";

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
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialRoom ?? null,
  );
  const [avail, setAvail] = useState<Record<string, AvailabilityResult>>({});
  const [, startAvail] = useTransition();
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Scroll the initial room into view on mount (guarded).
  useEffect(() => {
    if (!initialRoom) return;
    document
      .getElementById(`room-${initialRoom}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.slug === selectedSlug) ?? null,
    [rooms, selectedSlug],
  );

  const handleReserve = (slug: string) => {
    setSelectedSlug(slug);
    // Bring the reserve panel into view (matters on mobile where it stacks).
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const panel = selectedRoom ? (
    <div ref={panelRef} className="lg:sticky lg:top-24">
      <ReservePanel
        room={selectedRoom}
        hotel={hotel}
        from={from}
        to={to}
        adults={adults}
        // children = number of child guests (a data prop), not React children
        // eslint-disable-next-line react/no-children-prop
        children={children}
        onClose={() => setSelectedSlug(null)}
      />
    </div>
  ) : null;

  return (
    <div>
      <AvailabilityBar
        hotels={hotels}
        current={{ hotel, from, to, adults, children }}
      />

      <div className="mt-6 lg:grid lg:grid-cols-[1fr_22rem] lg:gap-6">
        {/* Room list */}
        <div className="space-y-6">
          {rooms.length === 0 ? (
            <p className="rounded-[2px] bg-white p-8 text-center text-[#0f1f18]/70 ring-1 ring-[#1a3d2e]/10">
              {noRoomsLabel}
            </p>
          ) : (
            rooms.map((room) => (
              <RoomResultCard
                key={room.slug}
                room={room}
                hotel={hotel}
                from={from}
                to={to}
                adults={adults}
                // children = number of child guests (a data prop), not React children
                // eslint-disable-next-line react/no-children-prop
                children={children}
                availability={avail[room.slug]}
                selected={selectedSlug === room.slug}
                onReserve={() => handleReserve(room.slug)}
              />
            ))
          )}
        </div>

        {/* Reserve panel — right column on desktop */}
        {panel && <div className="mt-6 lg:mt-0">{panel}</div>}
      </div>
    </div>
  );
}
