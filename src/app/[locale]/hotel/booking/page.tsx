import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getBookingHotels,
  getHotelRooms,
  type BookingHotelSlug,
} from "@/lib/hotel-rooms";
import RoomResults from "./RoomResults";

const HOTELS: BookingHotelSlug[] = ["aquapark", "central", "brewery", "cottages"];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("booking.hotel");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function HotelBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;

  const hotel = (
    HOTELS.includes(sp.hotel as BookingHotelSlug) ? sp.hotel : "central"
  ) as BookingHotelSlug;
  const room = typeof sp.room === "string" ? sp.room : undefined;
  const from = typeof sp.from === "string" ? sp.from : undefined;
  const to = typeof sp.to === "string" ? sp.to : undefined;
  const adults = Math.max(1, Number(sp.adults) || 2);
  const children = Math.max(0, Number(sp.children) || 0);

  const t = await getTranslations("booking_page");
  const tRoot = await getTranslations();

  // Localized hotel tab labels via the full dotted nameKey (resolves in uk + en).
  const hotels = getBookingHotels().map((h) => ({
    slug: h.slug,
    label: tRoot(h.nameKey),
  }));
  const rooms = await getHotelRooms(hotel, locale);

  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container mx-auto px-4 lg:px-8 pb-16">
        <header className="pt-28 pb-5 text-center">
          <h1 className="font-display text-3xl lg:text-4xl text-[#1a3d2e]">
            {t("title")}
          </h1>
          <p className="mt-2 text-[#0f1f18]/70 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>
        <Suspense>
          <RoomResults
            hotels={hotels}
            hotel={hotel}
            rooms={rooms}
            from={from}
            to={to}
            adults={adults}
            // children = number of child guests (a data prop), not React children
            // eslint-disable-next-line react/no-children-prop
            children={children}
            initialRoom={room}
            noRoomsLabel={t("no_rooms")}
          />
        </Suspense>
      </div>
    </main>
  );
}
