export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  category: 'main' | 'additional';
}

export interface ContactInfo {
  phone: string[];
  address: string;
  workingHours: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  features: string[];
  images: string[];
  pricing?: {
    adult?: number;
    child?: number;
    description?: string;
  };
}