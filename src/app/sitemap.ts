import type { MetadataRoute } from "next";
import { ADDITIONAL_SERVICES } from "@/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gluhoman.com.ua";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/aquapark",
    "/restaurant",
    "/hotel",
    "/sauna",
    "/menu",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const additional = ADDITIONAL_SERVICES.map((service) => ({
    url: `${SITE_URL}${service.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...additional];
}
