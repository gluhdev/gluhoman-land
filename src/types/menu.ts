export interface MenuItem {
  id: string;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  price: number;
  weight?: string;
  image?: string;
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  icon?: string;
  items: MenuItem[];
}

export interface Menu {
  categories: MenuCategory[];
}
