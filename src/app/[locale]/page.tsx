import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import HeroSlider from "@/components/sections/HeroSlider";
import HomeStory from "@/components/sections/HomeStory";
import HomeServices from "@/components/sections/HomeServices";
import HomeFeatures from "@/components/sections/HomeFeatures";
import HomeGallery from "@/components/sections/HomeGallery";
import HomeLocation from "@/components/sections/HomeLocation";
import HomeReviews from "@/components/sections/HomeReviews";
import HomeBookingCta from "@/components/sections/HomeBookingCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'layout' });
  return {
    title: t('home_meta_title'),
    description: t('home_meta_description'),
    keywords: t('home_meta_keywords'),
  };
}

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
