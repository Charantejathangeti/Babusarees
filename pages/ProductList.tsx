
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Product, SortOption, FilterState } from '../types';
import { CATEGORIES, BRANDS, Icons, LoadingSpinner } from '../constants';
import { ProductCard } from './Home';

interface ProductListProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, addToCart }) => {
  const { category: urlCategory } = useParams();
  const [sort, setSort] = useState<SortOption>('popularity');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState<FilterState>({
    category: urlCategory ? [urlCategory] : [],
    brand: [],
    fabric: [],
    priceRange: [0, 100000],
    color: []
  });

  const fetchProducts = useCallback(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, sort, searchTerm, fetchProducts]);

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = prev[type] as string[];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(v => v !== value) };
      }
      return { ...prev, [type]: [...current, value] };
    });
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filters.category.length === 0 || filters.category.includes(p.category);
      const matchBrand = filters.brand.length === 0 || filters.brand.includes(p.brand);
      const matchPrice = (p.offerPrice || p.retailPrice) >= filters.priceRange[0] && (p.offerPrice || p.retailPrice) <= filters.priceRange[1];
      return matchSearch && matchCat && matchBrand && matchPrice;
    });

    switch (sort) {
      case 'price-low': result.sort((a, b) => (a.offerPrice || a.retailPrice) - (b.offerPrice || b.retailPrice)); break;
      case 'price-high': result.sort((a, b) => (b.offerPrice || b.retailPrice) - (a.offerPrice || a.retailPrice)); break;
      case 'newest': result.sort((a, b) => parseInt(b.id) - parseInt(a.id)); break;
      default: break;
    }
    return result;
  }, [filters, sort, products, searchTerm]);

  return (
    <div className="max-w-full mx-auto px-1 py-1 bg-[#FDFBF7] min-h-screen">
      <div className="flex flex-row items-start gap-1">
        
        {/* FLIPKART STYLE SIDEBAR - Left Aligned & Fixed */}
        <aside className="w-56 flex-shrink-0 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto bg-white border border-stone-200 shadow-sm rounded-none z-10 p-3 flex flex-col gap-5 custom-scrollbar">
          <div className="flex justify-between items-center border-b border-stone-100 pb-1.5">
            <h3 className="font-black text-[9px] uppercase tracking-widest text-stone-800">FILTERS</h3>
            <button 
              onClick={() => {
                setFilters({ category: [], brand: [], fabric: [], priceRange: [0, 100000], color: [] });
                setSearchTerm('');
              }}
              className="text-[7px] font-black text-[#DAA520] hover:underline uppercase tracking-widest"
            >
              RESET
            </button>
          </div>

          {/* PRODUCT NAME FILTER */}
          <div className="space-y-2">
            <h4 className="text-[7px] font-black text-stone-400 uppercase tracking-[0.2em]">SEARCH NAME</h4>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 px-2 py-1.5 text-[9px] outline-none font-bold rounded-none focus:border-[#064E3B] placeholder:text-stone-300"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-300 scale-50">
                <Icons.Search />
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* BRAND CHECKBOXES */}
            <div>
              <h4 className="text-[7px] font-black mb-2 text-stone-400 uppercase tracking-[0.2em]">BRANDS</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {BRANDS.map(brand => (
                  <label key={brand} className="flex items-center group cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.brand.includes(brand)}
                      onChange={() => toggleFilter('brand', brand)}
                      className="w-2.5 h-2.5 rounded-none border-stone-300 text-[#064E3B] focus:ring-0 transition-all cursor-pointer"
                    />
                    <span className={`ml-2 text-[8px] font-bold transition-colors uppercase truncate ${filters.brand.includes(brand) ? 'text-[#064E3B]' : 'text-stone-500 group-hover:text-stone-900'}`}>
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* CATEGORY CHECKBOXES */}
            <div>
              <h4 className="text-[7px] font-black mb-2 text-stone-400 uppercase tracking-[0.2em]">DEPARTMENTS</h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center group cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.category.includes(cat)}
                      onChange={() => toggleFilter('category', cat)}
                      className="w-2.5 h-2.5 rounded-none border-stone-300 text-[#064E3B] focus:ring-0 transition-all cursor-pointer"
                    />
                    <span className={`ml-2 text-[8px] font-bold transition-colors uppercase truncate ${filters.category.includes(cat) ? 'text-[#064E3B]' : 'text-stone-500 group-hover:text-stone-900'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT GRID - Optimized for side-by-side density */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-row justify-between items-center mb-1.5 bg-white p-2 border border-stone-200 shadow-sm rounded-none">
            <div className="flex items-center gap-2">
               {searchTerm && (
                 <span className="bg-stone-50 border border-stone-100 px-2 py-0.5 text-[6px] font-black uppercase text-stone-400 flex items-center gap-1">
                   MATCH: "{searchTerm}" 
                   <button onClick={() => setSearchTerm('')} className="hover:text-red-500 scale-75 transition-colors"><Icons.X /></button>
                 </span>
               )}
               <p className="text-stone-300 text-[7px] font-black uppercase tracking-widest">
                {filteredProducts.length} PRODUCTS IN REGISTRY
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[6px] font-black text-stone-300 uppercase tracking-widest">ORDER:</span>
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-[7px] font-black uppercase tracking-widest border border-stone-100 rounded-none bg-stone-50 py-1 px-2 outline-none cursor-pointer hover:border-[#DAA520] transition-colors"
              >
                <option value="popularity">POPULARITY</option>
                <option value="newest">NEWEST</option>
                <option value="price-low">PRICE: LOW</option>
                <option value="price-high">PRICE: HIGH</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center"><LoadingSpinner /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-1.5">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-32 bg-white border border-stone-100 flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-stone-50 flex items-center justify-center rounded-full opacity-20">
                <Icons.Search />
              </div>
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest">ZERO MATCHES</h3>
              <p className="text-[7px] text-stone-400 mt-0.5 uppercase tracking-widest">ADJUST YOUR FILTER PARAMETERS</p>
              <button 
                onClick={() => { setSearchTerm(''); setFilters({ category: [], brand: [], fabric: [], priceRange: [0, 100000], color: [] }); }} 
                className="mt-4 text-[7px] font-black text-[#DAA520] border border-[#DAA520] px-4 py-1.5 hover:bg-[#DAA520] hover:text-stone-900 transition-all uppercase tracking-widest"
              >
                CLEAR REGISTRY
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
