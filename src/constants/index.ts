import { ContactInfo, ServiceCard } from '@/types';

export const CONTACT_INFO: ContactInfo = {
  phone: [
    '+38 053 264 8548',
    '+38 050 850 3355', 
    '+38 050 406 3555',
    '+38 066 007 6556'
  ],
  address: 'Україна, Полтавська область, с. Нижні Млини',
  workingHours: 'Щодня з 9:00 до 22:00'
};

export const MAIN_SERVICES: ServiceCard[] = [
  {
    id: 'aquapark',
    title: 'Аквапарк',
    description: 'Сучасний аквапарк з гірками та басейнами для всієї родини',
    image: '/placeholder-aquapark.jpg',
    href: '/aquapark',
    category: 'main'
  },
  {
    id: 'restaurant',
    title: 'Ресторан',
    description: 'Затишний ресторан з традиційною українською кухнею',
    image: '/placeholder-restaurant.jpg',
    href: '/restaurant',
    category: 'main'
  },
  {
    id: 'hotel',
    title: 'Готель',
    description: 'Комфортне проживання в серці природи',
    image: '/placeholder-hotel.jpg',
    href: '/hotel',
    category: 'main'
  },
  {
    id: 'sauna',
    title: 'Лазня на дровах',
    description: 'Традиційна українська лазня для повного розслаблення',
    image: '/placeholder-sauna.jpg',
    href: '/sauna',
    category: 'main'
  }
];

export const ADDITIONAL_SERVICES: ServiceCard[] = [
  {
    id: 'apitherapy',
    title: 'Апітерапія',
    description: 'Оздоровчі процедури з продуктами бджільництва',
    image: '/placeholder-apitherapy.jpg',
    href: '/other-services/apitherapy',
    category: 'additional'
  },
  {
    id: 'wedding',
    title: 'Виїзні весільні церемонії',
    description: 'Незабутні весільні церемонії на природі',
    image: '/placeholder-wedding.jpg',
    href: '/other-services/wedding',
    category: 'additional'
  },
  {
    id: 'paintball',
    title: 'Пейнтбол',
    description: 'Активний відпочинок для команд та друзів',
    image: '/placeholder-paintball.jpg',
    href: '/other-services/paintball',
    category: 'additional'
  },
  {
    id: 'horses',
    title: 'Прогулянки на конях',
    description: 'Романтичні прогулянки верхи на конях',
    image: '/placeholder-horses.jpg',
    href: '/other-services/horses',
    category: 'additional'
  },
  {
    id: 'kids-parties',
    title: 'Дитячі свята',
    description: 'Організація та проведення дитячих днів народження',
    image: '/placeholder-kids.jpg',
    href: '/other-services/kids-parties',
    category: 'additional'
  },
  {
    id: 'bbq-zone',
    title: 'Мангальна зона',
    description: 'Оренда обладнаної мангальної зони',
    image: '/placeholder-bbq.jpg',
    href: '/other-services/bbq-zone',
    category: 'additional'
  },
  {
    id: 'brewery-tour',
    title: 'Тур по пивоварні',
    description: 'Відвідайте нашу власну пивоварню де ми робимо своє краще крафтове пиво',
    image: '/placeholder-brewery.jpg',
    href: '/other-services/brewery-tour',
    category: 'additional'
  },
  {
    id: 'petting-zoo',
    title: 'Контактний зоопарк',
    description: 'Спілкування з дружніми тваринками для дітей та дорослих',
    image: '/placeholder-zoo.jpg',
    href: '/other-services/petting-zoo',
    category: 'additional'
  }
];

export const NAVIGATION = [
  { name: 'Головна', href: '/' },
  { name: 'Аквапарк', href: '/aquapark' },
  { name: 'Ресторан', href: '/restaurant' },
  { name: 'Готель', href: '/hotel' },
  { name: 'Лазня', href: '/sauna' },
  {
    name: 'Інші послуги',
    href: '#',
    children: ADDITIONAL_SERVICES.map(service => ({
      name: service.title,
      href: service.href
    }))
  }
];