import { Metadata } from 'next';
import VideoHero from '@/components/sections/VideoHero';
import { MAIN_SERVICES, ADDITIONAL_SERVICES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Star, ArrowRight, Sparkles } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';
import Link from 'next/link';
import LocationSection from '@/components/sections/LocationSection';
import GoogleReviews from '@/components/ui/GoogleReviews';
import InstagramFeed from '@/components/ui/InstagramFeed';
import ServiceButtons from '@/components/ui/ServiceButtons';

export const metadata: Metadata = {
  title: 'Глухомань - Ресторанно-готельний комплекс | Головна сторінка',
  description: 'Відпочинок для всієї родини в Глухомані: аквапарк, ресторан, готель, апітерапія, лазня, пейнтбол та багато інших послуг в серці природи України.',
  keywords: 'глухомань, відпочинок, аквапарк, ресторан, готель, україна, полтавська область, нижні млини',
};

export default function Home() {
  return (
    <>
      {/* Video Hero - Полноэкранный */}
      <VideoHero />

      {/* Главные услуги - Детальные блоки - СРАЗУ ПОД ВИДЕО */}
      <section id="services" className="relative py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Все для ідеального
              </span>
              <br />
              <span className="text-foreground">
                відпочинку
              </span>
            </h2>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Основні напрямки нашого ресторанно-готельного комплексу для незабутнього відпочинку всією родиною
            </p>
          </div>

          {/* Main Services Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {MAIN_SERVICES.map((service, index) => (
              <div 
                key={service.id}
                className="group relative"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-4 transition-all duration-700">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                  
                  {/* Hero Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: `url('${
                          service.id === 'aquapark' ? '/images/akvapark.webp' : 
                          service.id === 'restaurant' ? '/images/otel_gluhoman_photo31.jpg' : 
                          service.id === 'hotel' ? '/images/9.jpg' :
                          service.id === 'sauna' ? '/images/33.jpg' :
                          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
                        }')`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div className="relative z-10 p-8">
                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-6">
                      {service.id === 'aquapark' && [
                        '🌊  Басейни різних глибин',
                        '🎢  Водні гірки та атракціони', 
                        '🏖️  Зона відпочинку',
                        '👶  Дитяча зона безпеки'
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{feature}</span>
                        </div>
                      ))}
                      
                      {service.id === 'restaurant' && [
                        '🍽️  Традиційна українська кухня',
                        '🥘  Європейські страви',
                        '🎂  Банкетна зала',
                        '☕  Літнє кафе з терасою'
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{feature}</span>
                        </div>
                      ))}
                      
                      {service.id === 'hotel' && [
                        '🏨  Комфортні номери',
                        '🛏️  Різні категорії розміщення',
                        '🧴  Сучасні зручності',
                        '🌅  Вид на природу'
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{feature}</span>
                        </div>
                      ))}
                      
                      {service.id === 'sauna' && [
                        '🔥  Традиційна дровяна піч',
                        '💨  Справжній пар',
                        '🌿  Ароматерапія віниками',
                        '❄️  Контрастний душ'
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <ServiceButtons serviceHref={service.href} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* Плавный переход к дополнительным услугам */}
      <section className="relative bg-gradient-to-b from-muted/30 via-accent/5 to-background pt-24 pb-32">
        {/* Органичный переход от слайдера */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary/20 via-accent/10 to-transparent"></div>

        <div className="container relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header - Premium Typography */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent/10 to-primary/10 text-accent rounded-full text-sm font-semibold mb-8 backdrop-blur-sm border border-accent/20">
              <Sparkles className="h-5 w-5" />
              Додаткові послуги
            </div>
            
            <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Розширте свій
              </span>
              <br />
              <span className="text-foreground">
                відпочинок
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Унікальні послуги та активності для створення незабутніх вражень всією родиною
            </p>
          </div>

          {/* Premium Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
            {ADDITIONAL_SERVICES.slice(0, 4).map((service, index) => (
              <Link href={service.href} key={service.id}>
                <div 
                  className="group relative bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-white/20 hover:border-accent/30 rounded-3xl p-8 transition-all duration-700 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-3 cursor-pointer overflow-hidden"
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl" />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                  
                  <div className="relative z-10">
                    {/* Premium Icon */}
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      {service.id.includes('wedding') ? '💒' :
                       service.id.includes('sauna') ? '🛁' :
                       service.id.includes('paintball') ? '🎯' :
                       service.id.includes('horses') ? '🐎' :
                       service.id.includes('kids') ? '🎈' :
                       service.id.includes('bbq') ? '🔥' :
                       service.id.includes('apitherapy') ? '🐝' :
                       service.id.includes('brewery') ? '🍺' :
                       service.id.includes('zoo') ? '🦌' : '⭐'}
                    </div>

                    <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-2 text-accent font-semibold group-hover:gap-4 transition-all duration-300">
                      <span>Детальніше</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Remaining Services - Full Size Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {ADDITIONAL_SERVICES.slice(4).map((service, index) => (
              <Link href={service.href} key={service.id}>
                <div 
                  className="group relative bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-white/20 hover:border-accent/30 rounded-3xl p-8 transition-all duration-700 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-3 cursor-pointer overflow-hidden"
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl" />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                  
                  <div className="relative z-10">
                    {/* Premium Icon */}
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      {service.id.includes('wedding') ? '💒' :
                       service.id.includes('sauna') ? '🛁' :
                       service.id.includes('paintball') ? '🎯' :
                       service.id.includes('horses') ? '🐎' :
                       service.id.includes('kids') ? '🎈' :
                       service.id.includes('bbq') ? '🔥' :
                       service.id.includes('apitherapy') ? '🐝' :
                       service.id.includes('brewery') ? '🍺' :
                       service.id.includes('zoo') ? '🦌' : '⭐'}
                    </div>

                    <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-2 text-accent font-semibold group-hover:gap-4 transition-all duration-300">
                      <span>Детальніше</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Плавный переход к секции "О нас" */}
      <section className="relative py-8 bg-gradient-to-b from-background via-muted/10 to-muted/30 overflow-hidden">
        {/* Органичный переход от предыдущей секции */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background via-muted/5 to-transparent"></div>
        
        {/* Sophisticated Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl opacity-50" />
        
        <div className="container relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Content Side */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-semibold backdrop-blur-sm border border-primary/20">
                <Star className="h-5 w-5" />
                Про нас
              </div>
              
              <div className="space-y-6">
                <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Глухомань
                  </span>
                </h2>
                
                <div className="space-y-6 text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  <p>
                    Ресторанно-готельний комплекс <strong className="text-foreground">&quot;Глухомань&quot;</strong> розташований 
                    у мальовничій місцевості Полтавської області.
                  </p>
                  
                  <p>
                    Ми створили унікальне місце, де поєднуються активний відпочинок, комфортне проживання, 
                    вишукана кухня та оздоровчі процедури.
                  </p>
                  
                  <p className="text-foreground font-medium text-xl">
                    Наша місія — подарувати незабутні враження кожному гостю через якісний сервіс 
                    та щиру українську гостинність.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-accent/25 transition-all duration-300"
                  >
                    <Phone className="mr-3 h-5 w-5" />
                    {CONTACT_INFO.phone[0]}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300"
                  >
                    <MapPin className="mr-3 h-5 w-5" />
                    Як дістатися
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Side - Premium Cards */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: '15+', label: 'Років досвіду', icon: '🏆' },
                { number: '5000+', label: 'Задоволених гостей', icon: '❤️' },
                { number: '12+', label: 'Унікальних послуг', icon: '⭐' },
                { number: '24/7', label: 'Підтримка гостей', icon: '🛎️' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="group relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 text-center space-y-3">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <InstagramFeed 
        username="rgk_gluhoman"
        title="Слідкуйте за нашим життям"
        description="Ось що нового у Глухомані - найяскравіші моменти та свіжі новини з нашого ресторанно-готельного комплексу"
        maxPosts={3}
      />

      {/* Location Section */}
      <LocationSection />
    </>
  );
}
