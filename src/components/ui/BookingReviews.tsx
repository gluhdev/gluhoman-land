'use client';

import { useState } from 'react';
import { Star, User, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingReview {
  id: string;
  author: string;
  country: string;
  rating: number;
  text: string;
  date: string;
  title: string;
  positivePoints: string;
  negativePoints?: string;
  roomType: string;
}

// Mock data для демонстрации (в реальном проекте данные будут получены через API Booking.com)
const mockBookingReviews: BookingReview[] = [
  {
    id: '1',
    author: 'Ольга',
    country: 'Україна',
    rating: 9.2,
    title: 'Чудовий відпочинок для всієї родини',
    text: 'Прекрасне місце для відпочинку з дітьми. Аквапарк сучасний, номери комфортні.',
    positivePoints: 'Чисті номери, привітний персонал, смачні сніданки, відмінний аквапарк',
    negativePoints: 'Нічого критичного не помітили',
    date: '2024-01-20',
    roomType: 'Сімейний номер'
  },
  {
    id: '2',
    author: 'Андрій',
    country: 'Україна',
    rating: 8.8,
    title: 'Відмінне співвідношення ціна-якість',
    text: 'Затишний готель з гарним розташуванням. Персонал дуже доброзичливий.',
    positivePoints: 'Гарна територія, зручне розташування, якісне харчування',
    negativePoints: 'Wi-Fi міг би бути швидшим',
    date: '2024-01-15',
    roomType: 'Стандартний номер'
  },
  {
    id: '3',
    author: 'Марина',
    country: 'Україна',
    rating: 9.5,
    title: 'Ідеально для романтичного відпочинку',
    text: 'Провели медовий місяць - все було на найвищому рівні!',
    positivePoints: 'Романтична атмосфера, приватність, чудовий ресторан, SPA-процедури',
    date: '2024-01-10',
    roomType: 'Люкс'
  },
  {
    id: '4',
    author: 'Дмитро',
    country: 'Україна',
    rating: 8.6,
    title: 'Гарне місце для корпоративного відпочинку',
    text: 'Організували тімбілдинг для колективу - все пройшло відмінно.',
    positivePoints: 'Професійна організація заходів, просторі зали, різноманітні активності',
    negativePoints: 'Парковка могла б бути більшою',
    date: '2024-01-05',
    roomType: 'Стандартний номер'
  }
];

export default function BookingReviews() {
  const [visibleReviews, setVisibleReviews] = useState(2);
  
  const averageRating = mockBookingReviews.reduce((sum, review) => sum + review.rating, 0) / mockBookingReviews.length;
  const totalReviews = mockBookingReviews.length;

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-green-600 bg-green-50';
    if (rating >= 8) return 'text-blue-600 bg-blue-50';
    if (rating >= 7) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getRatingText = (rating: number) => {
    if (rating >= 9) return 'Чудово';
    if (rating >= 8) return 'Дуже добре';
    if (rating >= 7) return 'Добре';
    return 'Задовільно';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 rounded-full text-sm font-semibold mb-8">
            <MapPin className="h-5 w-5" />
            Booking.com відгуки
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Що кажуть гості на Booking.com
            </span>
          </h2>
          
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className={`px-6 py-3 rounded-2xl font-bold text-2xl ${getRatingColor(averageRating)}`}>
              {averageRating.toFixed(1)}
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {getRatingText(averageRating)}
              </div>
              <div className="text-sm text-muted-foreground">
                {totalReviews} відгуків
              </div>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Автентичні відгуки від гостей, які забронювали наш готель через Booking.com
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {mockBookingReviews.slice(0, visibleReviews).map((review) => (
            <div 
              key={review.id}
              className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left side - Author info and rating */}
                <div className="lg:w-1/3">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{review.author}</h4>
                      <p className="text-sm text-muted-foreground mb-2">🇺🇦 {review.country}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`inline-block px-4 py-2 rounded-xl font-bold text-lg ${getRatingColor(review.rating)} mb-3`}>
                    {review.rating}
                  </div>
                  
                  <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    📱 {review.roomType}
                  </div>
                </div>

                {/* Right side - Review content */}
                <div className="lg:w-2/3">
                  <h3 className="text-xl font-bold mb-3 text-primary">
                    {review.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {review.text}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-green-700">Позитивні моменти</span>
                      </div>
                      <p className="text-sm text-green-700">
                        {review.positivePoints}
                      </p>
                    </div>
                    
                    {review.negativePoints && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-orange-700">Що можна покращити</span>
                        </div>
                        <p className="text-sm text-orange-700">
                          {review.negativePoints}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-6">
          {visibleReviews < mockBookingReviews.length && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleReviews(mockBookingReviews.length)}
              className="px-8 py-3 text-lg hover:bg-primary/10"
            >
              Показати всі відгуки ({mockBookingReviews.length})
            </Button>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.open('https://www.booking.com/hotel/ua/gluhoman.uk.html', '_blank')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              <MapPin className="mr-3 h-5 w-5" />
              Переглянути на Booking.com
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open('https://www.booking.com/hotel/ua/gluhoman.uk.html', '_blank')}
              className="hover:bg-blue-50 border-blue-200 text-blue-600 px-8 py-3 text-lg"
            >
              <ExternalLink className="mr-3 h-5 w-5" />
              Забронювати на Booking.com
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}