'use client';

import { useState, useEffect } from 'react';
import { Star, User, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

// Mock data для демонстрации (в реальном проекте будет использоваться Google Places API)
const mockReviews: GoogleReview[] = [
  {
    id: '1',
    author: 'Олександра К.',
    rating: 5,
    text: 'Чудове місце для відпочинку з родиною! Аквапарк супер, діти в захваті. Готель комфортний, персонал привітний. Обов\'язково повернемося!',
    date: '2024-01-15',
  },
  {
    id: '2',
    author: 'Дмитро П.',
    rating: 5,
    text: 'Відмінний ресторан з смачною кухнею. Атмосфера затишна, обслуговування на високому рівні. Рекомендую!',
    date: '2024-01-10',
  },
  {
    id: '3',
    author: 'Марина С.',
    rating: 4,
    text: 'Гарне місце в оточенні природи. Номери чисті, аквапарк сучасний. Єдиний мінус - далеко від міста, але це навіть плюс для тих, хто шукає спокій.',
    date: '2024-01-08',
  },
  {
    id: '4',
    author: 'Андрій М.',
    rating: 5,
    text: 'Провели новорічні свята - все було на найвищому рівні! Банкетний зал просторий, кухня смачна, анімація для дітей супер.',
    date: '2024-01-02',
  },
  {
    id: '5',
    author: 'Тетяна В.',
    rating: 5,
    text: 'Чудовий комплекс для корпоративних заходів. Організація на рівні, їжа смачна, умови відмінні. Дякуємо команді!',
    date: '2023-12-28',
  },
];

export default function GoogleReviews() {
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const avg = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
    setAverageRating(Math.round(avg * 10) / 10);
  }, []);

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full text-sm font-semibold mb-8">
            <MapPin className="h-5 w-5" />
            Google Reviews
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Що кажуть наші гості
            </span>
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            {renderStars(Math.floor(averageRating), 'lg')}
            <span className="text-3xl font-bold text-primary">{averageRating}</span>
            <span className="text-muted-foreground">з {mockReviews.length} відгуків</span>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Відгуки реальних гостей про наш ресторанно-готельний комплекс
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          {mockReviews.slice(0, visibleReviews).map((review) => (
            <div 
              key={review.id}
              className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  <User className="h-6 w-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{review.author}</h4>
                      <div className="flex items-center gap-3">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {review.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-6">
          {visibleReviews < mockReviews.length && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleReviews(mockReviews.length)}
              className="px-8 py-3 text-lg hover:bg-primary/10"
            >
              Показати всі відгуки ({mockReviews.length})
            </Button>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.open('https://maps.app.goo.gl/bsaffsLLqKj8VUJUA', '_blank')}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 text-lg"
            >
              <MapPin className="mr-3 h-5 w-5" />
              Переглянути на Google Maps
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open('https://maps.app.goo.gl/bsaffsLLqKj8VUJUA', '_blank')}
              className="hover:bg-primary/10 px-8 py-3 text-lg"
            >
              <ExternalLink className="mr-3 h-5 w-5" />
              Залишити відгук
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}