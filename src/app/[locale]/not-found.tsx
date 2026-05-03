import Link from "next/link";
import { Compass, Phone } from "lucide-react";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { CONTACT_INFO } from "@/constants";

export default function NotFound() {
  const phone = CONTACT_INFO.phone[0];
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <SurfaceCard
        variant="glass"
        padding="lg"
        className="max-w-xl w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-emerald-100/80 p-5">
            <Compass
              className="h-12 w-12 text-emerald-700"
              aria-hidden="true"
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Сторінку не знайдено
        </h1>
        <p className="text-base md:text-lg text-neutral-600 mb-8">
          Можливо, ви заблукали в нашій глухомані. Поверніться на головну або
          зателефонуйте нам.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-white font-medium shadow-md hover:bg-emerald-800 transition-colors"
          >
            На головну
          </Link>
          <a
            href={telHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-700 px-6 py-3 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {phone}
          </a>
        </div>
      </SurfaceCard>
    </main>
  );
}
