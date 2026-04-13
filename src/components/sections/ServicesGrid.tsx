import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServiceCard as ServiceCardType } from '@/types';
import { ArrowRight } from 'lucide-react';

interface ServicesGridProps {
  services: ServiceCardType[];
  title: string;
  description?: string;
}

function ServiceCard({ service }: { service: ServiceCardType }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
          {/* Placeholder для изображения */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📸</div>
              <div className="text-sm">Фото послуги</div>
            </div>
          </div>
          
          {/* Overlay с кнопкой */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button variant="secondary" size="sm" className="shadow-lg">
              Дізнатися більше
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <CardTitle className="mb-2 text-xl">{service.title}</CardTitle>
        <CardDescription className="text-muted-foreground mb-4">
          {service.description}
        </CardDescription>
        
        <Link href={service.href}>
          <Button variant="outline" className="w-full group">
            Детальніше
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function ServicesGrid({ services, title, description }: ServicesGridProps) {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}