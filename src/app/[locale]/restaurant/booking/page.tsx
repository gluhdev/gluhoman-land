import { getTranslations } from "next-intl/server";
import ServiceBookingForm from "@/components/booking/ServiceBookingForm";

export default async function RestaurantBookingPage() {
  const t = await getTranslations("ui.booking_dialog_services");
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container mx-auto px-4 lg:px-8 pt-28 md:pt-36 pb-16">
        <header className="text-center">
          <h1 className="font-display text-3xl lg:text-4xl text-[#1a3d2e]">
            {t("restaurant_label")}
          </h1>
          <p className="mt-2 text-[#0f1f18]/70 max-w-xl mx-auto">
            {t("restaurant_description")}
          </p>
        </header>
        <div className="mt-8">
          <ServiceBookingForm service="restaurant" />
        </div>
      </div>
    </main>
  );
}
