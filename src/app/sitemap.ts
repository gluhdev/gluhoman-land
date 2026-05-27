import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gluhoman.com.ua";

const STATIC_ROUTES = [
  "",
  "/aquapark",
  "/restaurant",
  "/hotel",
  "/hotel/aquapark",
  "/hotel/central",
  "/cottages",
  "/conference-hall",
  "/sauna",
  "/menu",
  "/gallery",
  "/privacy",
  "/terms",
];

const OTHER_SERVICE_ROUTES = [
  "/other-services/apitherapy",
  "/other-services/wedding",
  "/other-services/paintball",
  "/other-services/horses",
  "/other-services/kids-parties",
  "/other-services/bbq-zone",
  "/other-services/brewery-tour",
  "/other-services/petting-zoo",
];

const ALL_ROUTES = [...STATIC_ROUTES, ...OTHER_SERVICE_ROUTES];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ALL_ROUTES.flatMap((path) => {
    const ukUrl = `${BASE}${path || "/"}`;
    const enUrl = `${BASE}/en${path}`;
    const alternates = { languages: { uk: ukUrl, en: enUrl } };

    const isOtherService = path.startsWith("/other-services");
    const changeFrequency: "weekly" | "monthly" = isOtherService
      ? "monthly"
      : "weekly";
    const priority = path === "" ? 1 : isOtherService ? 0.5 : 0.8;

    return [
      { url: ukUrl, alternates, lastModified: now, changeFrequency, priority },
      { url: enUrl, alternates, lastModified: now, changeFrequency, priority },
    ];
  });
}
