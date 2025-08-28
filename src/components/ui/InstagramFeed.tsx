'use client';

import { useState, useEffect } from 'react';
import { Instagram, ExternalLink, Heart, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  permalink: string;
}

interface InstagramFeedProps {
  username: string;
  title?: string;
  description?: string;
  maxPosts?: number;
}

// Реальные посты рекреационного комплекса (показываем только 3 последних)
const mockInstagramPosts: InstagramPost[] = [
  {
    id: '1',
    imageUrl: '/images/akvapark.webp',
    caption: '🌊 Відкриття аквапарку сезону 2024! Нові атракціони, оновлені басейни та море позитивних емоцій чекають на вас! Плануйте ваш ідеальний відпочинок вже зараз 🏖️ #Глухомань #Аквапарк2024 #НовийСезон #ПолтавськаОбласть #НижніМлини',
    likes: 234,
    comments: 18,
    timestamp: '2024-08-25T10:30:00Z',
    permalink: 'https://www.instagram.com/rgk_gluhoman/'
  },
  {
    id: '2',
    imageUrl: '/images/33.jpg',
    caption: '🔥 Традиційна українська лазня тепер працює щодня! Справжній пар на дровах, ароматні віники та повне розслаблення після активного дня. Бронювання по телефону 📞 #Лазня #УкраїнськіТрадиції #Релакс #Глухомань',
    likes: 156,
    comments: 23,
    timestamp: '2024-08-22T16:45:00Z',
    permalink: 'https://www.instagram.com/rgk_gluhoman/'
  },
  {
    id: '3',
    imageUrl: '/images/otel_gluhoman_photo31.jpg',
    caption: '🍽️ Нове літнє меню вже у нашому ресторані! Свіжі салати, ароматний борщ, домашні вареники та багато інших смачностей від шеф-кухаря. Відвідайте нас сьогодні! ✨ #НовеМеню #УкраїнськаКухня #Ресторан #Глухомань #СмачноЇсти',
    likes: 189,
    comments: 31,
    timestamp: '2024-08-20T12:15:00Z',
    permalink: 'https://www.instagram.com/rgk_gluhoman/'
  }
];

export default function InstagramFeed({ 
  username, 
  title = "Наш Instagram", 
  description = "Слідкуйте за нашими новинами та подіями", 
  maxPosts = 3 
}: InstagramFeedProps) {
  const [visiblePosts, setVisiblePosts] = useState(maxPosts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляция загрузки данных
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} хв тому`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} год тому`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} д тому`;
    
    return postTime.toLocaleDateString('uk-UA');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 w-48 bg-muted rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 w-96 bg-muted rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-64 bg-muted rounded mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/70 rounded-3xl p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-2xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 rounded-full text-sm font-semibold mb-8">
            <Instagram className="h-5 w-5" />
            @{username}
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {description}
          </p>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.open(`https://www.instagram.com/${username}/`, '_blank')}
            className="border-pink-200 text-pink-600 hover:bg-pink-50 px-8 py-3"
          >
            <Instagram className="mr-2 h-5 w-5" />
            Підписатися на @{username}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockInstagramPosts.slice(0, visiblePosts).map((post, index) => (
            <div 
              key={post.id}
              className="group relative bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{
                    backgroundImage: `url('${post.imageUrl}')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-6 text-white">
                    <div className="flex items-center gap-2">
                      <Heart className="h-6 w-6 fill-white" />
                      <span className="font-semibold">{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 fill-white" />
                      <span className="font-semibold">{formatNumber(post.comments)}</span>
                    </div>
                  </div>
                </div>

                {/* Instagram icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-pink-600" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Instagram className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">@{username}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(post.timestamp)}</p>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(post.permalink, '_blank')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{formatNumber(post.comments)}</span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(post.permalink, '_blank')}
                    className="text-pink-600 hover:text-pink-700 p-0 h-auto font-medium"
                  >
                    Переглянути
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-6">
          {visiblePosts < mockInstagramPosts.length && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisiblePosts(mockInstagramPosts.length)}
              className="px-8 py-3 text-lg hover:bg-pink-50 border-pink-200 text-pink-600"
            >
              Показати більше постів
            </Button>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.open(`https://www.instagram.com/${username}/`, '_blank')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
            >
              <Instagram className="mr-3 h-5 w-5" />
              Підписатися на Instagram
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open(`https://www.instagram.com/${username}/`, '_blank')}
              className="hover:bg-pink-50 border-pink-200 text-pink-600 px-8 py-3 text-lg"
            >
              <Eye className="mr-3 h-5 w-5" />
              Переглянути всі пости
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}