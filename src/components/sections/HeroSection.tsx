import { Button } from '@/components/ui/button';
import { Phone, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  showCTA?: boolean;
}

export default function HeroSection({ 
  title, 
  subtitle, 
  description, 
  showCTA = true 
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-600 via-green-500 to-teal-600">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 container px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl font-medium opacity-90">
            {subtitle}
          </p>
          
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
            {description}
          </p>

          {showCTA && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6"
              >
                <Phone className="mr-2 h-5 w-5" />
                {CONTACT_INFO.phone[0]}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Як дістатися
              </Button>
            </div>
          )}

          {/* Quick Info */}
          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-sm opacity-80">
            <div className="flex items-center gap-2">
              <span>🏊‍♀️ Аквапарк</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🍽️ Ресторан</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏨 Готель</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌳 На природі</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-12 fill-background"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
}