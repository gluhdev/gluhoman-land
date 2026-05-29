import { getTranslations } from "next-intl/server";
import ServiceBookingForm from "@/components/booking/ServiceBookingForm";

export default async function AquaparkBookingPage() {
  const t = await getTranslations("ui.booking_dialog_services");
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <header className="text-center">
          <h1 className="font-display text-3xl lg:text-4xl text-[#1a3d2e]">
            {t("aquapark_label")}
          </h1>
          <p className="mt-2 text-[#0f1f18]/70 max-w-xl mx-auto">
            {t("aquapark_description")}
          </p>
        </header>
        <div className="mt-8">
          <ServiceBookingForm service="aquapark" />
        </div>
      </div>
    </main>
  );
}
