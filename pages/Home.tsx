
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { CATEGORIES, BRANDS, Icons, LoadingSpinner, ErrorAlert } from '../constants';

interface HomeProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ products, addToCart }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div className="min-h-[80vh] flex items-center justify-center"><LoadingSpinner /></div>;

  const featured = products.filter(p => p.isFeatured);

  const mainCategories = [
    { name: 'SAREES', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', link: '/categories/Kanchipuram Silk Sarees' },
    { name: 'CLOTHS', image: 'https://images.unsplash.com/photo-1590736961141-865360975618?auto=format&fit=crop&q=80&w=800', link: '/categories/Dhoti & Towels' },
    { name: 'INNERWARES', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800', link: '/categories/Men’s Innerwear' },
  ];

  return (
    <div className="animate-in fade-in duration-500 bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="relative h-[25vh] flex items-center justify-center overflow-hidden bg-[#064E3B]">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1610030469668-935102a9e55c?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Silk background" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
          <h1 className="text-xl md:text-3xl font-black mb-1 serif text-white tracking-tight uppercase">
            BABU’S <span className="text-[#DAA520]">TEXTILES</span>
          </h1>
          <p className="text-[8px] text-stone-200 italic font-light tracking-[0.4em] uppercase opacity-60 mb-4">
            PREMIUM HANDLOOM HERITAGE
          </p>
          <Link to="/categories" className="inline-block bg-[#DAA520] hover:bg-[#B45309] text-stone-900 px-4 py-1.5 font-black transition-all shadow-md tracking-widest uppercase text-[7px] rounded-none">
            OPEN CATALOG
          </Link>
        </div>
      </section>

      {/* High Density Grid */}
      <section className="py-2 bg-white border-y border-stone-100">
        <div className="max-w-full mx-auto px-2">
          <div className="flex justify-between items-center mb-2 border-b border-stone-50 pb-1">
            <h2 className="text-[10px] font-black text-stone-800 uppercase tracking-widest">FEATURED COLLECTIONS</h2>
            <Link to="/categories" className="text-[#064E3B] text-[6px] font-black uppercase tracking-widest border border-[#064E3B] px-1.5 py-0.5 hover:bg-[#064E3B] hover:text-white transition-all">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {featured.slice(0, 16).map(product => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="py-4 max-w-full mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {mainCategories.map((cat) => (
            <Link to={cat.link} key={cat.name} className="group relative h-[120px] overflow-hidden border border-stone-200 rounded-none">
              <img src={cat.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={cat.name} />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center">
                <h3 className="text-white text-base font-bold serif mb-0.5 uppercase tracking-widest">{cat.name}</h3>
                <span className="text-[5px] font-black uppercase tracking-widest text-stone-300 border-t border-white/10 pt-0.5">EXPLORE</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export const ProductCard: React.FC<{ product: Product, addToCart: (p: Product) => void }> = ({ product, addToCart }) => {
  const currentPrice = product.offerPrice || product.retailPrice;
  const hasDiscount = !!product.offerPrice;

  return (
    <div className="group bg-white border border-stone-200 rounded-none overflow-hidden transition-all hover:border-[#DAA520] hover:shadow-sm flex flex-col h-full active:scale-[0.98]">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
        <Link to={`/product/${product.id}`}>
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        {hasDiscount && (
          <div className="absolute top-1 left-1 bg-emerald-800 text-white text-[5px] font-black px-1 py-0.5 uppercase tracking-tighter">
            SAVE
          </div>
        )}
      </div>
      <div className="p-1.5 flex flex-col flex-grow">
        <div className="text-[5px] uppercase font-black text-[#DAA520] tracking-widest mb-0.5">{product.brand}</div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-stone-800 text-[8px] font-bold uppercase leading-tight mb-1 group-hover:text-[#064E3B] line-clamp-2 h-[2.2em] overflow-hidden">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-stone-900">₹{currentPrice.toLocaleString()}</span>
            {hasDiscount && <span className="text-[6px] text-stone-300 line-through">₹{product.retailPrice.toLocaleString()}</span>}
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); addToCart(product); }} 
            className="text-stone-300 hover:text-[#064E3B] p-0.5 transition-all"
          >
            <Icons.Cart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
