import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock } from 'lucide-react';
import { CONTACT_INFO, NAVIGATION, ADDITIONAL_SERVICES } from '@/constants';

export default function Footer() {
  return (
    <footer className="bg-muted border-t">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image 
                src="/images/logo.png" 
                alt="Глухомань логотип" 
                width={160} 
                height={53}
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Ресторанно-готельний комплекс для незабутнього відпочинку всією родиною в серці природи.
            </p>
          </div>

          {/* Основні послуги */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Основні послуги</h3>
            <nav className="space-y-2">
              {NAVIGATION.filter(item => !item.children).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Додаткові послуги */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Додаткові послуги</h3>
            <nav className="space-y-2">
              {ADDITIONAL_SERVICES.slice(0, 5).map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {service.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Контактна інформація */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Контакти</h3>
            <div className="space-y-3">
              {/* Адреса */}
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {CONTACT_INFO.address}
                </span>
              </div>

              {/* Телефони */}
              <div className="space-y-1">
                {CONTACT_INFO.phone.map((phone) => (
                  <div key={phone} className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <a 
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                ))}
              </div>

              {/* Графік роботи */}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {CONTACT_INFO.workingHours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Нижня частина */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Глухомань. Усі права захищено.
          </p>
        </div>
      </div>
    </footer>
  );
}