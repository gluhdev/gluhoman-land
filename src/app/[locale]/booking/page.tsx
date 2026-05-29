import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";
import { BedDouble, Waves, UtensilsCrossed, Flame } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("booking_hub");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

const CARDS = [
  {
    href: "/hotel/booking",
    icon: BedDouble,
    labelKey: "hotel_label" as const,
    descKey: "hotel_description" as const,
  },
  {
    href: "/aquapark/booking",
    icon: Waves,
    labelKey: "aquapark_label" as const,
    descKey: "aquapark_description" as const,
  },
  {
    href: "/restaurant/booking",
    icon: UtensilsCrossed,
    labelKey: "restaurant_label" as const,
    descKey: "restaurant_description" as const,
  },
  {
    href: "/sauna/booking",
    icon: Flame,
    labelKey: "sauna_label" as const,
    descKey: "sauna_description" as const,
  },
] as const;

export default async function BookingHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // locale may be needed by child pages; we await it defensively
  await params;

  const t = await getTranslations("booking_hub");
  const tServices = await getTranslations("ui.booking_dialog_services");

  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container mx-auto px-4 lg:px-8 pt-28 md:pt-36 pb-16">
        <header className="text-center">
          <h1 className="font-display text-3xl lg:text-4xl text-[#1a3d2e]">
            {t("title")}
          </h1>
          <p className="mt-3 text-[#0f1f18]/70 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto mt-10">
          {CARDS.map(({ href, icon: Icon, labelKey, descKey }) => (
            <Link
              key={href}
              href={href}
              className="block bg-white rounded-[2px] ring-1 ring-[#1a3d2e]/10 p-7 hover:ring-[#1a3d2e]/30 hover:shadow-md transition"
            >
              <Icon
                className="mb-4 text-[#c9a95c]"
                size={32}
                strokeWidth={1.5}
                aria-hidden
              />
              <p className="font-display text-xl text-[#1a3d2e]">
                {tServices(labelKey)}
              </p>
              <p className="mt-1 text-[14px] text-[#0f1f18]/70">
                {tServices(descKey)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
