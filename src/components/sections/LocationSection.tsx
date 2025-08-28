'use client';

import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, Phone, Car, Bus } from 'lucide-react';

export default function LocationSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-semibold mb-8">
            <MapPin className="h-5 w-5" />
            Наше розташування
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Як нас знайти
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ми розташовані в мальовничому куточку Полтавської області, в оточенні природи
          </p>
        </div>

        <div className="grid lg:grid-cols-1 gap-8 items-start">
          {/* Google Maps Embed */}
          <div className="w-full">
            <div className="relative h-[300px] rounded-3xl overflow-hidden shadow-2xl bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2593.456789123456!2d34.57929!3d49.54594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDMyJzQ1LjQiTiAzNMKwMzQnNDUuNCJF!5e0!3m2!1suk!2sua!4v1640000000000!5m2!1suk!2sua"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Глухомань - Нижні Млини, Полтавська область"
              />
            </div>
            
          </div>

          {/* Contact Information and Transportation in one row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Контакти</h3>
                  <div className="space-y-1 mb-3 text-sm">
                    <a href="tel:+380532648548" className="block text-muted-foreground hover:text-primary transition-colors">
                      📞 +38 053 264 8548
                    </a>
                    <a href="tel:+380508503355" className="block text-muted-foreground hover:text-primary transition-colors">
                      📞 +38 050 850 3355
                    </a>
                    <a href="tel:+380504063555" className="block text-muted-foreground hover:text-primary transition-colors">
                      📞 +38 050 406 3555
                    </a>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-xs"
                    onClick={() => window.location.href = 'tel:+380532648548'}
                  >
                    <Phone className="mr-1 h-3 w-3" />
                    Зателефонувати
                  </Button>
                </div>
              </div>
            </div>

            {/* Transportation */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Як дістатися</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Car className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">На автомобілі</p>
                        <p className="text-xs text-muted-foreground">Безкоштовна парковка на території комплексу</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bus className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Громадський транспорт</p>
                        <p className="text-xs text-muted-foreground">Організовуємо трансфер за попереднім замовленням</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address and Working Hours - отдельная строка под картой и контактами */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Address */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Адреса</h3>
                <p className="text-muted-foreground mb-3 text-sm">
                  Полтавська область, Україна
                  <br />
                  с. Нижні Млини
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('Полтавська область, с. Нижні Млини')}
                  className="hover:bg-primary/10 text-xs"
                >
                  Скопіювати адресу
                </Button>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Режим роботи</h3>
                <div className="space-y-1 text-muted-foreground text-sm">
                  <p><strong>Готель:</strong> Цілодобово</p>
                  <p><strong>Ресторан:</strong> 08:00 - 23:00</p>
                  <p><strong>Аквапарк:</strong> 09:00 - 21:00</p>
                  <p><strong>Лазня:</strong> 12:00 - 22:00</p>
                  <p className="text-primary font-semibold">Без вихідних</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}