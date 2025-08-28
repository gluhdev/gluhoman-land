import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Phone, Clock, ChefHat, Users, Star, ArrowRight, Heart, Utensils, Coffee, Instagram, Wine } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ресторан Глухомань - Українська кухня та європейські страви',
  description: 'Ресторан у комплексі Глухомань пропонує традиційну українську кухню, європейські страви та затишну атмосферу для сімейних обідів та урочистих подій.',
  keywords: 'ресторан, глухомань, українська кухня, європейські страви, банкети, полтавська область, нижні млини',
  openGraph: {
    title: 'Ресторан Глухомань - Українська кухня та європейські страви',
    description: 'Традиційна українська кухня, європейські страви та затишна атмосфера',
    type: 'website',
    locale: 'uk_UA',
  },
};

export default function RestaurantPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
            <ChefHat className="h-5 w-5" />
            Кулінарні шедеври
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Ресторан
            <span className="block text-white/90">Глухомань</span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Автентична українська кухня, вишукані європейські страви та затишна атмосфера для незабутніх кулінарних вражень
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Phone className="mr-2 h-5 w-5" />
              Забронювати столик
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/50 text-white hover:bg-white/10 hover:border-white text-lg px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <Utensils className="mr-2 h-5 w-5" />
              Переглянути меню
            </Button>
          </div>
        </div>
      </section>

      {/* Cuisine Features */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Наша кухня
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Поєднання традиційних українських рецептів з сучасними кулінарними технологіями
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Українська кухня",
                description: "Автентичні страви за старовинними рецептами наших бабусь",
                dishes: ["Борщ з пампушками", "Вареники з картоплею", "Котлета по-київськи", "Сало з часником"]
              },
              {
                icon: Wine,
                title: "Європейська кухня",
                description: "Вишукані страви європейської кухні від досвідчених шеф-кухарів",
                dishes: ["Стейки на грилі", "Паста карбонара", "Рибні делікатеси", "Європейські десерти"]
              },
              {
                icon: Coffee,
                title: "Літнє кафе",
                description: "Затишна тераса з видом на природу для легких сніданків та кави",
                dishes: ["Свіжа випічка", "Ароматна кава", "Літні коктейлі", "Легкі закуски"]
              }
            ].map((cuisine, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl p-8 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 transition-all duration-700 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <cuisine.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                  {cuisine.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {cuisine.description}
                </p>
                
                <ul className="space-y-2">
                  {cuisine.dishes.map((dish, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      <span>{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Features */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div 
                className="aspect-square rounded-3xl bg-cover bg-center shadow-2xl"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl"></div>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-semibold mb-8">
                <Users className="h-5 w-5" />
                Особливі події
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                Банкетна зала для
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ваших свят
                </span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Весілля та урочистості</h3>
                    <p className="text-muted-foreground">Організовуємо незабутні весільні банкети до 100 осіб</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Корпоративні заходи</h3>
                    <p className="text-muted-foreground">Ідеальне місце для ділових обідів та корпоративів</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Дні народження</h3>
                    <p className="text-muted-foreground">Святкуйте особливі моменти у затишній атмосфері</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Working Hours & Info */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Режим роботи</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Понеділок - П&apos;ятниця: 11:00 - 23:00</p>
                <p>Субота - Неділя: 10:00 - 24:00</p>
                <p className="text-primary font-semibold">Бронювання до 22:00</p>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Місткість</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Основна зала: до 80 осіб</p>
                <p>Банкетна зала: до 100 осіб</p>
                <p>Літня тераса: до 40 осіб</p>
                <p className="text-primary font-semibold">Всього: 220 місць</p>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                <ChefHat className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Кухня</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Українська традиційна</p>
                <p>Європейська сучасна</p>
                <p>Дитяче меню</p>
                <p className="text-primary font-semibold">Веган опції</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section - Placeholder */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent/10 to-primary/10 text-accent rounded-full text-sm font-semibold mb-8">
              <Instagram className="h-5 w-5" />
              Наші страви в Instagram
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Смачні моменти
              </span>
              <br />
              нашого ресторану
            </h2>
          </div>
          
          {/* Instagram Feed будет добавлен позже */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
              Готові скуштувати наші
              <span className="block">кулінарні шедеври?</span>
            </h2>
            
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Забронюйте столик прямо зараз та насолоджуйтесь неповторним смаком наших страв
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Phone className="mr-2 h-5 w-5" />
                Забронювати столик
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