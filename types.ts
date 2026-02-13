
export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  fabric: string;
  retailPrice: number;
  offerPrice?: number;
  wholesalePrice: number;
  stock: number;
  images: string[];
  description: string;
  colors: string[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'PENDING' | 'DELIVERED' | 'CANCELLED';
  items: { productName: string; quantity: number; price: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'RETAIL' | 'WHOLESALE' | 'ADMIN';
}

export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest' | 'popularity' | 'rating';

export interface FilterState {
  category: string[];
  brand: string[];
  fabric: string[];
  priceRange: [number, number];
  color: string[];
  rating: number | null;
  availability: 'in-stock' | 'all';
}
