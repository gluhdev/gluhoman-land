import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, Waves, Users, Shield, Baby, Star, ArrowRight, Droplets, Sparkles, Thermometer, Wind, Timer } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Лазня на дровах Глухомань - Традиційна українська лазня',
  description: 'Традиційна українська лазня на дровах у рекреаційному комплексі Глухомань. Справжній пар, ароматерапія віниками та повне розслаблення.',
  keywords: 'лазня, глухомань, дровяна лазня, пар, віники, релакс, полтавська область, нижні млини, українська лазня',
  openGraph: {
    title: 'Лазня на дровах Глухомань - Традиційна українська лазня',
    description: 'Справжній пар, ароматерапія віниками та повне розслаблення',
    type: 'website',
    locale: 'uk_UA',
  },
};

export default function SaunaPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/33.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
            <Thermometer className="h-5 w-5" />
            Традиційна українська лазня
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Лазня
            <span className="block text-white/90">на дровах</span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Відчуйте силу справжнього пару та традиційних українських процедур для повного відновлення організму
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Phone className="mr-2 h-5 w-5" />
              Забронювати сеанс
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/50 text-white hover:bg-white/10 hover:border-white text-lg px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <Timer className="mr-2 h-5 w-5" />
              Розклад роботи
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Особливості нашої лазні
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Автентична українська лазня з дотриманням усіх традицій
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Thermometer,
                title: 'Дровяна піч',
                description: 'Справжня піч на березових дровах забезпечує правильний сухий жар та неповторну атмосферу'
              },
              {
                icon: Droplets,
                title: 'М\'який пар',
                description: 'Ідеальна вологість та температура для комфортного та корисного парування'
              },
              {
                icon: Sparkles,
                title: 'Ароматерапія',
                description: 'Використання натуральних віників з дуба, берези та трав для максимального ефекту'
              },
              {
                icon: Wind,
                title: 'Контрастні процедури',
                description: 'Обливання холодною водою та контрастний душ для загартування організму'
              },
              {
                icon: Timer,
                title: 'Індивідуальний підхід',
                description: 'Досвідчений банщик проконсультує щодо оптимального режиму парування'
              },
              {
                icon: Users,
                title: 'Компанія друзів',
                description: 'Простора парна до 8 осіб - ідеально для відпочинку компанією'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl p-8 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Procedures */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Лазні процедури
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Традиційні та сучасні методи оздоровлення
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {[
                {
                  title: 'Класичне парування',
                  description: 'Поступове підвищення температури з використанням березових віників для глибокого прогрівання',
                  duration: '45-60 хвилин',
                  temp: '70-80°C'
                },
                {
                  title: 'Ароматерапія',
                  description: 'Використання ефірних олій лаванди, евкаліпта та м\'яти для додаткового розслаблення',
                  duration: '30-40 хвилин',
                  temp: '60-70°C'
                },
                {
                  title: 'Масаж віниками',
                  description: 'Традиційний масаж дубовими та березовими віниками для покращення кровообігу',
                  duration: '20-30 хвилин',
                  temp: '75-85°C'
                }
              ].map((procedure, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold">{procedure.title}</h3>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span className="bg-primary/10 px-2 py-1 rounded">{procedure.duration}</span>
                      <span className="bg-accent/10 px-2 py-1 rounded">{procedure.temp}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{procedure.description}</p>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop')"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Schedule */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-8">Розклад та ціни</h2>
              
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">Режим роботи</h3>
                    </div>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Понеділок-Четвер:</strong> 12:00 - 22:00</p>
                    <p><strong>П&apos;ятниця-Неділя:</strong> 10:00 - 23:00</p>
                    <p className="text-primary font-semibold">Попереднє бронювання обов&apos;язкове</p>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Вартість послуг</h3>
                  <div className="space-y-3">
                    {[
                      { service: 'Сеанс парування (2 год)', price: '800 грн' },
                      { service: 'З банщиком (2 год)', price: '1200 грн' },
                      { service: 'Оренда на день', price: '3000 грн' },
                      { service: 'Віники (дуб/береза)', price: '150 грн' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.service}</span>
                        <span className="font-semibold text-accent">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-8">Правила відвідування</h2>
              
              <div className="space-y-4">
                {[
                  'Попереднє бронювання обовʼязкове за 24 години',
                  'Максимальна кількість відвідувачів - 8 осіб',
                  'Мінімальний вік відвідувачів - 16 років',
                  'При собі мати рушник та змінне взуття',
                  'Заборонено відвідування в нетверезому стані',
                  'Віники та ароматичні олії входять у вартість',
                  'Можливість замовлення додаткових послуг'
                ].map((rule, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-muted-foreground">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
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
              Готові відчути силу
              <span className="block">справжньої лазні?</span>
            </h2>
            
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Забронюйте сеанс прямо зараз та отримайте незабутні враження від традиційної української лазні
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Phone className="mr-2 h-5 w-5" />
                {CONTACT_INFO.phone[0]}
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
    </>
  );
}