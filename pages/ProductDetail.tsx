
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { Icons, LoadingSpinner, ErrorAlert } from '../constants';

interface ProductDetailProps {
  products: Product[];
  addToCart: (product: Product, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const found = products.find(p => p.id === id);
    
    setTimeout(() => {
      if (!found) {
        setError("Registry record not found.");
        setIsLoading(false);
      } else {
        setProduct(found);
        setIsLoading(false);
      }
    }, 400);
  }, [id, products]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <ErrorAlert message={error} />
        <Link to="/categories" className="mt-8 text-[10px] font-black uppercase tracking-widest text-[#064E3B] underline">Back to Catalog</Link>
      </div>
    );
  }

  if (!product) return null;

  const currentPrice = product.offerPrice || product.retailPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in bg-[#FDFBF7]">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Product Visual - Compact & Boxy */}
        <div className="lg:w-1/2">
          <div className="aspect-[1/1] bg-white border border-stone-200 overflow-hidden shadow-sm">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-square border border-stone-200 cursor-pointer overflow-hidden">
                <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform" alt="Thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:w-1/2">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#B45309] mb-4">{product.brand} Registry</div>
          <h1 className="text-4xl font-bold text-stone-800 mb-6 serif tracking-tight leading-tight">{product.name}</h1>
          
          <div className="mb-8">
            <span className="text-3xl font-black text-[#064E3B]">₹{currentPrice.toLocaleString()}</span>
            {product.offerPrice && (
              <span className="text-lg text-stone-300 line-through ml-4">₹{product.retailPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="text-stone-600 text-sm leading-relaxed mb-10 italic">
            "{product.description}"
          </div>

          <div className="space-y-6 mb-12">
            <div>
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Availability</h4>
              <p className="text-xs font-bold text-[#064E3B]">{product.stock} Units in Warehouse</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Fabric Grade</h4>
              <p className="text-xs font-bold text-stone-800">{product.fabric}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-stone-100">
            <div className="flex items-center border border-stone-200 bg-white">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-6 py-4 hover:bg-stone-50 text-stone-800">-</button>
              <span className="px-6 py-4 min-w-[3rem] text-center font-black text-lg">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-6 py-4 hover:bg-stone-50 text-stone-800">+</button>
            </div>
            <button 
              onClick={() => addToCart(product, quantity)}
              className="flex-grow bg-[#064E3B] hover:bg-[#043327] text-white font-black py-4 px-10 transition-all shadow-lg tracking-widest uppercase text-xs"
            >
              COMMIT TO CART
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-12 border-t border-stone-100">
        <div className="max-w-3xl">
          <div className="flex gap-10 border-b border-stone-100 mb-8">
            {['details', 'care', 'shipping'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-[#064E3B] border-b-2 border-[#064E3B]' : 'text-stone-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-stone-500 text-sm leading-relaxed">
            {activeTab === 'details' && <p>{product.description}</p>}
            {activeTab === 'care' && <p>Hand wash separately in cold water with mild detergent. Do not bleach. Dry in shade.</p>}
            {activeTab === 'shipping' && <p>Secured white-glove shipping within 3-5 business days across the country.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
