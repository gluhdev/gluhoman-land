'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, MessageCircle, Sparkles } from 'lucide-react';
import BookingForm from '@/components/ui/BookingForm';

export default function BookingSection() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      {/* Quick Booking CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-primary via-primary/95 to-accent overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
        
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-8">
              <Sparkles className="h-5 w-5" />
              Швидке бронювання
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              Забронюйте ваш
              <span className="block">ідеальний відпочинок</span>
            </h2>
            
            <p className="text-xl lg:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Оберіть послугу, вкажіть дати та кількість гостей - ми подбаємо про решту
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <Button 
                size="lg" 
                data-booking-trigger
                onClick={() => setIsBookingOpen(true)}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                <Calendar className="mr-3 h-6 w-6" />
                Забронювати онлайн
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 hover:border-white text-lg px-8 py-6 rounded-full backdrop-blur-sm transition-all duration-300 font-semibold"
                onClick={() => window.location.href = 'tel:+380501234567'}
              >
                <Phone className="mr-3 h-6 w-6" />
                Зателефонувати
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
              {[
                { number: "< 15 хв", label: "Час відповіді" },
                { number: "24/7", label: "Підтримка" },
                { number: "5000+", label: "Щасливих гостей" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold mb-2 text-white">
                    {stat.number}
                  </div>
                  <div className="text-white/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      <BookingForm 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}