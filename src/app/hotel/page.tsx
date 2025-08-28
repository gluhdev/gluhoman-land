import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Bed, Wifi, Car, Coffee, Star, ArrowRight, Bath, Tv, Wind, Users, BookOpen } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';
import BookingReviews from '@/components/ui/BookingReviews';

export const metadata: Metadata = {
  title: 'Готель Глухомань - Комфортне проживання серед природи',
  description: 'Готель Глухомань пропонує комфортні номери різних категорій з сучасними зручностями та чудовим видом на природу для ідеального відпочинку.',
  keywords: 'готель, глухомань, номери, проживання, відпочинок, полтавська область, нижні млини, booking',
  openGraph: {
    title: 'Готель Глухомань - Комфортне проживання серед природи',
    description: 'Комфортні номери з сучасними зручностями та видом на природу',
    type: 'website',
    locale: 'uk_UA',
  },
};

export default function HotelPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/9.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
            <Bed className="h-5 w-5" />
            Комфортне проживання
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Готель
            <span className="block text-white/90">Глухомань</span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Затишні номери з сучасними зручностями та неперевершеним видом на природу для вашого ідеального відпочинку
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Phone className="mr-2 h-5 w-5" />
              Забронювати номер
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/50 text-white hover:bg-white/10 hover:border-white text-lg px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Booking.com
            </Button>
          </div>
        </div>
      </section>

      {/* Room Types */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Типи номерів
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Від економ-класу до люкс номерів - знайдіть ідеальний варіант для вашого відпочинку
            </p>
          </div>

          <div className="space-y-16">
            {[
              {
                type: "Стандартний номер",
                price: "від 1200 грн/ніч",
                guests: "2 особи",
                size: "25 м²",
                image: "photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
                amenities: ["Двоспальне ліжко", "Приватна ванна кімната", "Wi-Fi", "Телевізор", "Кондиціонер", "Вид на сад"],
                description: "Затишний номер з усім необхідним для комфортного відпочинку пари або одного гостя."
              },
              {
                type: "Сімейний номер",
                price: "від 1800 грн/ніч",
                guests: "4 особи",
                size: "35 м²",
                image: "photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
                amenities: ["Двоспальне ліжко + диван", "Приватна ванна", "Wi-Fi", "Телевізор", "Міні-холодильник", "Тераса з видом"],
                description: "Просторий номер ідеально підходить для сімей з дітьми або компанії друзів."
              },
              {
                type: "Люкс номер",
                price: "від 2500 грн/ніч",
                guests: "2-3 особи",
                size: "45 м²",
                image: "photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
                amenities: ["Кінг-сайз ліжко", "Джакузі", "Wi-Fi", "Smart TV", "Міні-бар", "Панорамний вид", "Халати та капці"],
                description: "Розкішний номер з преміум зручностями для особливого та незабутнього відпочинку."
              }
            ].map((room, index) => (
              <div 
                key={index} 
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-2xl group">
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/${room.image}')`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-primary font-bold">
                        {room.price}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-semibold mb-6">
                    <Bed className="h-4 w-4" />
                    {room.type}
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                    {room.type}
                  </h3>
                  
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {room.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-sm font-semibold">{room.guests}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-sm font-semibold">{room.size}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-sm font-semibold">4.8/5</div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-semibold mb-4">Зручності номера:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {room.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Забронювати номер
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Amenities */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Зручності готелю
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { icon: Wifi, label: "Безкоштовний Wi-Fi" },
              { icon: Car, label: "Безкоштовна парковка" },
              { icon: Coffee, label: "Сніданок включено" },
              { icon: Bath, label: "SPA зона" },
              { icon: Tv, label: "Кабельне ТБ" },
              { icon: Wind, label: "Кондиціонер" },
              { icon: Users, label: "Обслуговування номерів" },
              { icon: MapPin, label: "Трансфер" },
              { icon: Star, label: "Консьєрж" },
              { icon: Phone, label: "24/7 рецепція" },
              { icon: BookOpen, label: "Бізнес-центр" },
              { icon: Bath, label: "Пральня" }
            ].map((amenity, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                  <amenity.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {amenity.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking.com Reviews */}
      <BookingReviews />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Готові забронювати
              <span className="block">ваш ідеальний номер?</span>
            </h2>
            
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Зателефонуйте нам або забронюйте онлайн через Booking.com прямо зараз
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Phone className="mr-2 h-5 w-5" />
                {CONTACT_INFO.phone[0]}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 hover:border-white text-lg px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Booking.com
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}