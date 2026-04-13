export interface MenuItem {
  id: string;
  name: string;
  description?: string;
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
