'use client';

import { useState, useEffect } from 'react';
import { CalendarCheck, MessageCircle, Phone, ChevronUp, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONTACT_INFO } from '@/constants';
import { openBookingDialog } from '@/components/ui/BookingDialog';

const phoneDigits = CONTACT_INFO.phone[0].replace(/\D/g, '');

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      // Hide the floating button on the hero (first ~80% of viewport)
      setShowFab(window.scrollY > window.innerHeight * 0.8);
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactOptions = [
    {
      icon: CalendarCheck,
      label: 'Забронювати',
      action: () => { openBookingDialog(); },
      className: 'bg-primary hover:bg-primary/90',
      delay: 0
    },
    {
      icon: Phone,
      label: 'Зателефонувати',
      action: () => { window.location.href = `tel:+${phoneDigits}`; },
      className: 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90',
      delay: 50
    },
    {
      icon: MessageCircle,
      label: 'Написати в WhatsApp',
      action: () => window.open(`https://wa.me/${phoneDigits}?text=${encodeURIComponent('Вітаю! Хочу забронювати у Глухомань.')}`, '_blank'),
      className: 'bg-green-500 hover:bg-green-600',
      delay: 100
    },
    {
      icon: Send,
      label: 'Написати в Telegram',
      action: () => window.open('https://t.me/gluhoman_ukraine', '_blank'),
      className: 'bg-blue-500 hover:bg-blue-600',
      delay: 200
    }
  ];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-opacity duration-500 ${showFab ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      aria-hidden={!showFab}
    >
      {/* Contact Options */}
      {showContactOptions && (
        <div className="flex flex-col gap-3 items-end">
          {contactOptions.map((option, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 transform transition-all duration-300 ${
                showContactOptions 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-8 opacity-0'
              }`}
              style={{ 
                animationDelay: `${option.delay}ms`,
                transitionDelay: showContactOptions ? `${option.delay}ms` : '0ms'
              }}
            >
              {/* Label */}
              <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                {option.label}
              </div>
              
              {/* Button */}
              <Button
                size="lg"
                className={`w-14 h-14 rounded-full ${option.className} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 p-0`}
                onClick={option.action}
              >
                <option.icon className="h-6 w-6" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main Contact Button */}
      <Button
        size="lg"
        className={`w-16 h-16 rounded-full text-white shadow-2xl hover:shadow-3xl transition-all duration-300 p-0 ${
          showContactOptions 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
        }`}
        onClick={() => setShowContactOptions(!showContactOptions)}
        title={showContactOptions ? 'Закрити' : 'Зв\'язатися з нами'}
      >
        {showContactOptions ? (
          <X className="h-6 w-6" />
        ) : (
          <Phone className="h-6 w-6" />
        )}
      </Button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          size="lg"
          variant="outline"
          className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm border-2 border-primary/20 hover:bg-white hover:border-primary/40 text-primary shadow-2xl hover:shadow-3xl transition-all duration-300 p-0"
          onClick={scrollToTop}
          title="Вгору"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}