import { Metadata } from 'next';
import { SaunaFromClientFull } from '@/components/sections/SaunaFromClientFull';

export const metadata: Metadata = {
  title: 'Лазня на дровах Глухомань — Чани, віники та масажі під Полтавою',
  description:
    'Лазня на дровах у комплексі «Глухомань»: чани з карпатськими травами, дубові та бамбукові віники, масажі, кімнати відпочинку з самоварами. Традиційне українське СПА під Полтавою.',
  openGraph: {
    title: 'Лазня на дровах Глухомань — Тіло та дух',
    description:
      'Чани на дровах, віники, масажі та кімнати відпочинку з самоварами у комплексі «Глухомань».',
    type: 'website',
    locale: 'uk_UA',
    images: [
      {
        url: '/og-sauna.jpg',
        width: 1200,
        height: 630,
        alt: 'Лазня на дровах Глухомань',
      },
    ],
  },
};

export default function SaunaPage() {
  return <SaunaFromClientFull />;
}
