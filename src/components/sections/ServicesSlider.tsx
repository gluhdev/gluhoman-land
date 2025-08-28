'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ServiceCard as ServiceCardType } from '@/types';

interface ServicesSliderProps {
  services: ServiceCardType[];
}

function ServiceSlide({ service, isActive }: { service: ServiceCardType; isActive: boolean }) {
  return (
    <div className="relative flex-shrink-0 w-full h-[70vh] min-h-[500px]">
      {/* Фоновое изображение */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/${
            service.id === 'aquapark' ? 'photo-1571902943202-507ec2618e8f?w=1200&h=800&fit=crop' : 
            service.id === 'restaurant' ? 'photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop' : 
            service.id === 'hotel' ? 'photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop' :
            'photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'
          }')`
        }}
      />
      
      {/* Темный оверлей */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Градиентный оверлей */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Контент */}
      <div className="relative z-10 h-full flex items-end justify-center px-6 lg:px-12 pb-20">
        <div className="text-center text-white">
          {/* Единственная кнопка */}
          <div className={`transition-all duration-700 ${isActive ? 'translate-y-0 opacity-100 animate-fade-in-up' : 'translate-y-4 opacity-80'}`}>
            <Button 
              size="lg" 
              className="bg-white/90 text-primary hover:bg-white hover:scale-105 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
            >
              Дізнатися більше
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSlider({ services }: ServicesSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true 
  }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {services.map((service, index) => (
            <ServiceSlide 
              key={service.id} 
              service={service} 
              isActive={index === selectedIndex}
            />
          ))}
        </div>
      </div>

      {/* Навигационные кнопки */}
      <button
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Индикаторы внизу */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>

      {/* Плавный градиентный переход снизу */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/80 via-background/20 to-transparent"></div>
    </section>
  );
}