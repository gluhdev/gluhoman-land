import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, Waves, Users, Shield, Baby, ArrowRight, Droplets, Instagram } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';
import Link from 'next/link';
import InstagramFeed from '@/components/ui/InstagramFeed';

export const metadata: Metadata = {
  title: 'Аквапарк Глухомань - Водні розваги для всієї родини',
  description: 'Сучасний аквапарк у рекреаційному комплексі Глухомань. Водні гірки, басейни різних глибин, дитяча зона та багато іншого для незабутнього відпочинку.',
  keywords: 'аквапарк, глухомань, водні гірки, басейни, відпочинок, полтавська область, нижні млини, водні розваги',
  openGraph: {
    title: 'Аквапарк Глухомань - Водні розваги для всієї родини',
    description: 'Сучасний аквапарк із водними гірками, басейнами та дитячою зоною',
    type: 'website',
    locale: 'uk_UA',
  },
};

export default function AquaparkPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/akvapark.webp')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
            <Waves className="h-5 w-5" />
            Водні розваги
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Аквапарк
            <span className="block text-white/90">Глухомань</span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Сучасний аквапарк з водними гірками, басейнами різних глибин та безпечною дитячою зоною для незабутнього відпочинку всією родиною
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
              <MapPin className="mr-2 h-5 w-5" />
              Як дістатися
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Зони аквапарку
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Кожна зона створена для максимального комфорту та безпеки відвідувачів різного віку
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              {
                icon: Waves,
                title: "Водні гірки",
                description: "Захоплюючі гірки різного рівня складності для дорослих та підлітків",
                features: ["Швидкісні спуски", "Звивисті траси", "Безпечні покриття"]
              },
              {
                icon: Droplets,
                title: "Басейни",
                description: "Басейни різних глибин від дитячих до глибоководних для плавання",
                features: ["Мілководна зона", "Басейн для плавання", "Джакузі"]
              },
              {
                icon: Baby,
                title: "Дитяча зона",
                description: "Безпечна зона з малими гірочками та іграми спеціально для дітей",
                features: ["Мілкі басейнчики", "Міні гірки", "Водні іграшки"]
              },
              {
                icon: Users,
                title: "Зона відпочинку",
                description: "Комфортні лежаки, тіньові зони та кафе для відпочинку між купанням",
                features: ["Зручні лежаки", "Тіньові навіси", "Кафе та бар"]
              }
            ].map((zone, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl p-8 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 transition-all duration-700 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <zone.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                  {zone.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {zone.description}
                </p>
                
                <ul className="space-y-2">
                  {zone.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules and Safety */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-semibold mb-8">
                <Shield className="h-5 w-5" />
                Безпека та правила
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                Ваша безпека - 
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  наш пріоритет
                </span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Режим роботи</h3>
                    <p className="text-muted-foreground">Щоденно з 9:00 до 21:00, без вихідних</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Вікові обмеження</h3>
                    <p className="text-muted-foreground">Діти до 12 років лише у супроводі дорослих</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Рятувальна служба</h3>
                    <p className="text-muted-foreground">Професійні рятувальники постійно чергують</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div 
                className="aspect-square rounded-3xl bg-cover bg-center shadow-2xl"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=600&fit=crop')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Placeholder */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent/10 to-primary/10 text-accent rounded-full text-sm font-semibold mb-8">
              <Instagram className="h-5 w-5" />
              Наш Instagram
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Подивіться як весело
              </span>
              <br />
              у нашому аквапарку
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Стежте за нашими новинами та акціями в Instagram
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Підписатися в Instagram
            </Button>
          </div>
          
          {/* Instagram Feed будет добавлен позже */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

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
              Готові зануритися в світ
              <span className="block">водних пригод?</span>
            </h2>
            
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Зателефонуйте нам прямо зараз та дізнайтеся про актуальні ціни та акції
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Phone className="mr-2 h-5 w-5" />
                Зателефонувати зараз
              </Button>
              
              <Link href="/">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/50 text-white hover:bg-white/10 hover:border-white text-lg px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Всі послуги
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <InstagramFeed 
        username="akvapark.hotel.gluhoman"
        title="Instagram аквапарку"
        description="Найяскравіші моменти водних розваг та щастя наших відвідувачів"
        maxPosts={4}
      />
    </>
  );
}