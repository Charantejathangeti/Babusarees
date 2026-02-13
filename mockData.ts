
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Kanchipuram Pattu Silk Saree - Wedding Collection',
    category: 'Kanchipuram Silk Sarees',
    brand: 'Ramraj',
    fabric: 'Silk',
    retailPrice: 24500,
    offerPrice: 21999,
    wholesalePrice: 18500,
    stock: 12,
    rating: 4.8,
    reviewsCount: 124,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1594187042531-92b67f185966?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'A masterpiece of Kanchipuram craftsmanship featuring pure mulberry silk and authentic silver-gold zari. This wedding collection saree exhibits traditional temple motifs and a heavy pallu.',
    colors: ['Red', 'Green', 'Gold'],
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Pure Banarasi Soft Silk Saree - Royal Blue',
    category: 'Fancy Sarees',
    brand: 'Uathayam',
    fabric: 'Silk',
    retailPrice: 15800,
    offerPrice: 13500,
    wholesalePrice: 11200,
    stock: 8,
    rating: 4.5,
    reviewsCount: 89,
    images: [
      'https://images.unsplash.com/photo-1594187042531-92b67f185966?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Experience the grandeur of Banaras with this soft silk saree. Features intricate floral jaal work and a shimmering border that drapes elegantly for any festive occasion.',
    colors: ['Blue', 'Pink', 'Orange'],
    isFeatured: true,
    isBestSeller: false
  },
  {
    id: '3',
    name: 'Organic Handloom Cotton Saree - Pastel Series',
    category: 'Cotton Sarees',
    brand: 'Uathayam',
    fabric: 'Handloom',
    retailPrice: 3200,
    offerPrice: 2800,
    wholesalePrice: 2100,
    stock: 25,
    rating: 4.2,
    reviewsCount: 210,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469668-935102a9e55c?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Lightweight, breathable, and sustainably sourced. Our handloom cotton sarees are perfect for professional wear and daily elegance in tropical climates.',
    colors: ['Green', 'Blue', 'Peach'],
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: '4',
    name: 'Designer Party Wear Fancy Saree - Metallic Tint',
    category: 'Fancy Sarees',
    brand: 'Poombex',
    fabric: 'Fancy',
    retailPrice: 8900,
    offerPrice: 7200,
    wholesalePrice: 5800,
    stock: 15,
    rating: 3.9,
    reviewsCount: 45,
    images: [
      'https://images.unsplash.com/photo-1610030469668-935102a9e55c?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'A modern take on traditional silhouettes. This fancy saree features metallic thread work and a contemporary design perfect for evening galas.',
    colors: ['Grey', 'Gold'],
    isFeatured: false,
    isBestSeller: false
  },
  {
    id: '5',
    name: 'Pure Cotton Dhoti - Temple Border (Ramraj)',
    category: 'Dhoti & Towels',
    brand: 'Ramraj',
    fabric: 'Cotton',
    retailPrice: 1200,
    wholesalePrice: 850,
    stock: 150,
    rating: 4.9,
    reviewsCount: 560,
    images: [
      'https://images.unsplash.com/photo-1590736961141-865360975618?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'The classic Ramraj white dhoti with a spiritual temple gold border. Made from 100% fine cotton for comfort and tradition.',
    colors: ['White'],
    isFeatured: true,
    isBestSeller: true
  }
];
