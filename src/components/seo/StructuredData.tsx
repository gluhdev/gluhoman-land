import Script from "next/script";
import { CONTACT_INFO } from "@/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gluhoman.com.ua";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Глухомань",
    description:
      "Рекреаційний комплекс «Глухомань» — аквапарк, готель, ресторан, лазня та інші послуги в селі Нижні Млини, Полтавська область.",
    url: SITE_URL,
    telephone: CONTACT_INFO.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
      addressRegion: "Полтавська область",
      addressLocality: "с. Нижні Млини",
      streetAddress: CONTACT_INFO.address,
    },
    openingHours: "Mo-Su 09:00-22:00",
    priceRange: "$$",
    image: `${SITE_URL}/images/akvapark.webp`,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Аквапарк" },
      { "@type": "LocationFeatureSpecification", name: "Готель" },
      { "@type": "LocationFeatureSpecification", name: "Ресторан" },
      { "@type": "LocationFeatureSpecification", name: "Лазня на дровах" },
      { "@type": "LocationFeatureSpecification", name: "Безкоштовний Wi-Fi" },
      { "@type": "LocationFeatureSpecification", name: "Парковка" },
    ],
  };

  return (
    <Script
      id="ld-localbusiness"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(data)}
    </Script>
  );
}
