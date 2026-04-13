import { Metadata } from "next";
import HeroSlider from "@/components/sections/HeroSlider";
import HomeStory from "@/components/sections/HomeStory";
import HomeServices from "@/components/sections/HomeServices";
import HomeFeatures from "@/components/sections/HomeFeatures";
import HomeGallery from "@/components/sections/HomeGallery";
import HomeLocation from "@/components/sections/HomeLocation";
import HomeReviews from "@/components/sections/HomeReviews";
import HomeBookingCta from "@/components/sections/HomeBookingCta";

export const metadata: Metadata = {
  title: "Глухомань — Рекреаційний комплекс на Полтавщині",
  description:
    "Готель, аквапарк, ресторан та лазня на дровах у селі Нижні Млини. Тихий відпочинок серед природи для всієї родини.",
  keywords:
    "глухомань, відпочинок, аквапарк, ресторан, готель, лазня, полтавщина, нижні млини",
};

export default function Home() {
  return (
    <div className="bg-[#faf6ec]">
      <HeroSlider />
      <HomeStory />
      <HomeFeatures />
      <HomeServices />
      <HomeGallery />
      <HomeLocation />
      <HomeReviews />
      <HomeBookingCta />
    </div>
  );
}
