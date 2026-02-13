import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Icons, LoadingSpinner, BUSINESS_INFO } from '../constants';

interface HomeProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ products, addToCart }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <div className="h-[70vh] flex items-center justify-center"><LoadingSpinner /></div>;

  const featured = products.filter(p => p.isFeatured).slice(0, 12);

  const mainCategories = [
    { name: 'SILK SAREES', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', link: '/categories/Kanchipuram Silk Sarees' },
    { name: 'DHOOTIS', image: 'https://images.unsplash.com/photo-1590736961141-865360975618?auto=format&fit=crop&q=80&w=800', link: '/categories/Dhoti & Towels' },
    { name: 'INNERWEAR', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800', link: '/categories/Men’s Innerwear' },
  ];

  return (
    <div className="animate-in fade-in duration-700 bg-[#FDFBF7] overflow-x-hidden">
      {/* Hero Banner - Signature Deep Emerald Heritage Look */}
      <section className="relative min-h-[45vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#064E3B]">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1610030469668-935102a9e55c?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Background Texture" />
        </div>
        
        {/* Heritage Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10 py-16 flex flex-col items-center">
          <div className="mb-6">
            <span className="text-[10px] md:text-[12px] font-black text-[#DAA520] tracking-[0.6em] uppercase border-y border-[#DAA520]/40 py-2 px-6 mb-2 inline-block">Established 2019</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-6 serif text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
            BABU’S TEXTILES
          </h1>
          
          <div className="w-24 h-[2px] bg-[#DAA520] mb-8"></div>
          
          <p className="text-[10px] md:text-[14px] text-stone-200 italic font-bold tracking-[0.5em] uppercase opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed text-center">
            The Ultimate Destination for <span className="text-[#DAA520]">Authentic Tirupati Masterlooms</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/categories" className="bg-[#DAA520] hover:bg-[#B45309] text-stone-900 px-14 py-5 font-black transition-all shadow-2xl tracking-[0.2em] uppercase text-[10px] active:scale-95">
              SHOP COLLECTION
            </Link>
            <Link to="/wholesale" className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/30 px-14 py-5 font-black transition-all tracking-[0.2em] uppercase text-[10px] active:scale-95">
              WHOLESALE PORTAL
            </Link>
          </div>
        </div>
        
        {/* Decorative Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#DAA520] to-transparent opacity-40"></div>
      </section>

      {/* Featured Registry - Minimal Background with Branded Accent Lines */}
      <section className="py-20 bg-[#FDFBF7] relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 flex flex-col items-center relative">
            <div className="pt-6 pb-8 flex flex-col items-center">
              <h2 className="text-[20px] md:text-[28px] font-black text-stone-800 uppercase tracking-tighter serif text-center">BEST SELLING COLLECTIONS</h2>
              {/* Gold Decorative Line */}
              <div className="w-32 h-[1px] bg-[#DAA520] my-4"></div>
              <p className="text-[10px] md:text-[12px] font-black text-[#B45309] uppercase tracking-[0.5em] italic text-center w-full">Hand-verified master weaves</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid - Minimal with Striped Border Lines */}
      <section className="py-16 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
             <span className="text-[10px] font-black text-[#B45309] uppercase tracking-[0.6em] block mb-3">Heritage Categories</span>
             <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#064E3B] to-transparent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mainCategories.map((cat) => (
              <Link to={cat.link} key={cat.name} className="group relative h-[60px] md:h-[80px] overflow-hidden border-x border-stone-100 transition-all hover:-translate-y-1">
                <img src={cat.image} className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" alt={cat.name} />
                
                <div className="absolute inset-0 flex items-center justify-between px-8 z-10">
                  <h3 className="text-stone-800 text-[11px] md:text-[13px] font-black serif uppercase tracking-[0.3em]">{cat.name}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] text-[#064E3B] group-hover:text-[#B45309] transition-colors">EXPLORE</span>
                    <div className="h-[2px] w-6 bg-[#064E3B] group-hover:w-12 group-hover:bg-[#B45309] transition-all mt-1"></div>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-[1px] bg-[#064E3B]/10 group-hover:bg-[#064E3B]/40 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#064E3B]/10 group-hover:bg-[#064E3B]/40 transition-colors"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export const ProductCard: React.FC<{ 
  product: Product, 
  addToCart: (p: Product) => void,
}> = ({ product, addToCart }) => {
  const navigate = useNavigate();
  const currentPrice = product.offerPrice || product.retailPrice;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    navigate('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="group bg-white border border-stone-200 flex flex-col h-full transition-all hover:border-[#064E3B] hover:shadow-2xl active:scale-[0.99] relative shadow-sm">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-50 border-b border-stone-100 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        {product.offerPrice && (
          <div className="absolute top-2 left-2 bg-[#064E3B] text-white text-[7px] font-black px-2 py-1 uppercase tracking-widest shadow-sm">SALE</div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <div className="p-2 md:p-4 border-b border-stone-50 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1 gap-1">
               <span className="text-[7px] md:text-[8px] font-black text-[#B45309] uppercase tracking-tighter truncate">{product.brand}</span>
               <span className="text-[6px] md:text-[7px] font-bold text-stone-300 uppercase truncate">{product.category.split(' ')[0]}</span>
            </div>
            <Link to={`/product/${product.id}`} className="block">
              <h3 className="text-stone-800 text-[9px] md:text-[12px] font-bold uppercase leading-tight group-hover:text-[#064E3B] transition-colors line-clamp-2 min-h-[2.4em]">{product.name}</h3>
            </Link>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
             <div className="flex flex-col">
               <span className="text-[11px] md:text-[14px] font-black text-stone-900 tracking-tighter leading-none">₹{currentPrice.toLocaleString()}</span>
               {product.offerPrice && <span className="text-[7px] md:text-[9px] text-stone-400 line-through leading-none mt-1">₹{product.retailPrice.toLocaleString()}</span>}
             </div>
             <button 
               onClick={() => navigate(`/product/${product.id}`)} 
               className="text-[7px] font-black text-stone-300 hover:text-[#064E3B] transition-colors uppercase tracking-widest underline underline-offset-4"
             >
               INFO
             </button>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-stone-100">
          <button 
            onClick={handleAddToCart}
            className="bg-white text-stone-500 py-4 text-[8px] md:text-[9px] font-black uppercase tracking-tighter hover:bg-stone-50 transition-all border-r border-stone-100"
          >
            CART
          </button>
          <button 
            onClick={handleBuyNow}
            className="bg-[#064E3B] text-white py-4 text-[8px] md:text-[9px] font-black uppercase tracking-tighter hover:bg-[#B45309] transition-all"
          >
            BUY
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;