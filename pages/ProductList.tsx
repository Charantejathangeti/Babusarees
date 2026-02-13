
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, SortOption, FilterState } from '../types';
import { CATEGORIES, BRANDS, FABRICS, Icons, LoadingSpinner } from '../constants';
import { ProductCard } from './Home';

interface ProductListProps {
  products: Product[];
  brands: string[];
  addToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, brands, addToCart }) => {
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortOption>('relevance');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const initialFilters: FilterState = {
    category: urlCategory ? [urlCategory] : [],
    brand: [],
    fabric: [],
    priceRange: [0, 50000],
    color: [],
    rating: null,
    availability: 'all'
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [filters, sort, searchTerm]);

  // Fix: Added type assertion to bypass strict union indexing check which caused 'any' to 'never' assignment error
  const toggleFilter = (type: keyof FilterState, value: any) => {
    setFilters(prev => {
      const current = prev[type];
      if (Array.isArray(current)) {
        const arr = current as any[];
        if (arr.includes(value)) {
          return { ...prev, [type]: arr.filter(v => v !== value) };
        }
        return { ...prev, [type]: [...arr, value] };
      }
      return { ...prev, [type]: value === current ? null : value };
    });
  };

  const clearAllFilters = () => setFilters(initialFilters);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const currentPrice = p.offerPrice || p.retailPrice;
      const matchSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filters.category.length === 0 || filters.category.includes(p.category);
      const matchBrand = filters.brand.length === 0 || filters.brand.includes(p.brand);
      const matchFabric = filters.fabric.length === 0 || filters.fabric.includes(p.fabric);
      const matchPrice = currentPrice >= filters.priceRange[0] && currentPrice <= filters.priceRange[1];
      const matchColor = filters.color.length === 0 || p.colors.some(c => filters.color.includes(c));
      const matchRating = !filters.rating || p.rating >= filters.rating;
      const matchAvailability = filters.availability === 'all' || p.stock > 0;
      
      return matchSearch && matchCat && matchBrand && matchFabric && matchPrice && matchColor && matchRating && matchAvailability;
    });

    switch (sort) {
      case 'price-low': result.sort((a, b) => (a.offerPrice || a.retailPrice) - (b.offerPrice || b.retailPrice)); break;
      case 'price-high': result.sort((a, b) => (b.offerPrice || b.retailPrice) - (a.offerPrice || a.retailPrice)); break;
      case 'newest': result.sort((a, b) => parseInt(b.id) - parseInt(a.id)); break;
      case 'popularity': result.sort((a, b) => b.reviewsCount - a.reviewsCount); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [filters, sort, products, searchTerm]);

  // Available Filter Options
  const colors = Array.from(new Set(products.flatMap(p => p.colors)));
  const pricePresets = [
    { label: 'Under ₹1,000', range: [0, 1000] },
    { label: '₹1,000 - ₹5,000', range: [1000, 5000] },
    { label: '₹5,000 - ₹15,000', range: [5000, 15000] },
    { label: 'Above ₹15,000', range: [15000, 100000] },
  ];

  const activeChips = useMemo(() => {
    const chips: { type: keyof FilterState, value: any, label: string }[] = [];
    filters.category.forEach(v => chips.push({ type: 'category', value: v, label: v }));
    filters.brand.forEach(v => chips.push({ type: 'brand', value: v, label: v }));
    filters.fabric.forEach(v => chips.push({ type: 'fabric', value: v, label: v }));
    filters.color.forEach(v => chips.push({ type: 'color', value: v, label: v }));
    if (filters.rating) chips.push({ type: 'rating', value: filters.rating, label: `${filters.rating}★ & Above` });
    return chips;
  }, [filters]);

  const FilterPanelContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4 border-b lg:hidden">
        <h3 className="font-black text-xs uppercase tracking-widest">Filters</h3>
        <button onClick={() => setIsFilterOpen(false)} className="p-2"><Icons.X /></button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {/* PRICE RANGE */}
        <div>
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Price Range</h4>
          <div className="space-y-2">
            {pricePresets.map(preset => (
              <label key={preset.label} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="priceRange"
                  checked={filters.priceRange[0] === preset.range[0] && filters.priceRange[1] === preset.range[1]}
                  onChange={() => setFilters({ ...filters, priceRange: preset.range as [number, number] })}
                  className="w-4 h-4 text-[#064E3B] focus:ring-0"
                />
                <span className="text-[11px] font-bold text-stone-600 group-hover:text-stone-900 uppercase">{preset.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Departments</h4>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={filters.category.includes(cat)}
                  onChange={() => toggleFilter('category', cat)}
                  className="w-4 h-4 text-[#064E3B] rounded-none focus:ring-0"
                />
                <span className={`text-[11px] font-bold uppercase ${filters.category.includes(cat) ? 'text-[#064E3B]' : 'text-stone-600'}`}>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* BRANDS */}
        <div>
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Brands</h4>
          <div className="space-y-2">
            {BRANDS.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={filters.brand.includes(brand)}
                  onChange={() => toggleFilter('brand', brand)}
                  className="w-4 h-4 text-[#064E3B] rounded-none focus:ring-0"
                />
                <span className={`text-[11px] font-bold uppercase ${filters.brand.includes(brand) ? 'text-[#064E3B]' : 'text-stone-600'}`}>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* FABRIC */}
        <div>
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Fabric</h4>
          <div className="space-y-2">
            {FABRICS.map(f => (
              <label key={f} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={filters.fabric.includes(f)}
                  onChange={() => toggleFilter('fabric', f)}
                  className="w-4 h-4 text-[#064E3B] rounded-none focus:ring-0"
                />
                <span className={`text-[11px] font-bold uppercase ${filters.fabric.includes(f) ? 'text-[#064E3B]' : 'text-stone-600'}`}>{f}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RATINGS */}
        <div>
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Customer Ratings</h4>
          <div className="space-y-2">
            {[4, 3, 2].map(r => (
              <label key={r} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="rating"
                  checked={filters.rating === r}
                  onChange={() => setFilters({ ...filters, rating: r })}
                  className="w-4 h-4 text-[#064E3B] focus:ring-0"
                />
                <span className="text-[11px] font-bold text-stone-600 group-hover:text-stone-900 uppercase">{r}★ & Above</span>
              </label>
            ))}
          </div>
        </div>

        {/* COLORS */}
        <div>
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Colors</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button 
                key={color}
                onClick={() => toggleFilter('color', color)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase border transition-all ${filters.color.includes(color) ? 'bg-[#064E3B] text-white border-[#064E3B]' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t flex gap-2 lg:hidden">
        <button onClick={clearAllFilters} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest border border-stone-200 text-stone-500">Clear All</button>
        <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-3 bg-[#064E3B] text-white text-[10px] font-black uppercase tracking-widest">Apply</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Search Header */}
      <div className="bg-white border-b border-stone-100 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="relative flex-grow max-w-2xl">
            <input 
              type="text" 
              placeholder="Search in Babu's Registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-[#064E3B] transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 scale-90"><Icons.Search /></span>
          </div>
          <p className="hidden md:block text-[10px] font-black text-stone-300 uppercase tracking-widest">{filteredProducts.length} Items Found</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 h-[calc(100vh-140px)] sticky top-[140px] border-r border-stone-100 shrink-0">
          <FilterPanelContent />
        </aside>

        {/* Content Area */}
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          {/* Top Bar - Sorting & Chips */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold serif uppercase tracking-tight text-stone-800">
                  {urlCategory || 'All Products'}
                </h1>
                <p className="lg:hidden text-[9px] font-black text-stone-400 uppercase tracking-widest">{filteredProducts.length} Results</p>
              </div>

              {/* Desktop Sorting */}
              <div className="hidden lg:flex items-center gap-6">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sort By:</span>
                {[
                  { id: 'relevance', label: 'Relevance' },
                  { id: 'popularity', label: 'Popularity' },
                  { id: 'price-low', label: 'Price: Low-High' },
                  { id: 'price-high', label: 'Price: High-Low' },
                  { id: 'rating', label: 'Rating' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setSort(opt.id as SortOption)}
                    className={`text-[10px] font-black uppercase tracking-widest transition-all ${sort === opt.id ? 'text-[#064E3B] border-b-2 border-[#064E3B] pb-1' : 'text-stone-300 hover:text-stone-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest mr-2">Filters:</span>
                {activeChips.map(chip => (
                  <div key={`${chip.type}-${chip.value}`} className="bg-emerald-50 border border-emerald-100 px-2 py-1 flex items-center gap-2 group">
                    <span className="text-[9px] font-black text-[#064E3B] uppercase tracking-tighter">{chip.label}</span>
                    <button onClick={() => toggleFilter(chip.type, chip.value)} className="text-[#064E3B] hover:text-red-600 scale-75 transition-colors">
                      <Icons.X />
                    </button>
                  </div>
                ))}
                <button onClick={clearAllFilters} className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:underline ml-2">Clear All</button>
              </div>
            )}
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="py-32 flex justify-center"><LoadingSpinner /></div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white border border-stone-100 flex flex-col items-center">
              <div className="w-20 h-20 bg-stone-50 text-stone-200 rounded-full flex items-center justify-center mb-6 scale-75">
                <Icons.Search />
              </div>
              <h2 className="text-2xl font-bold serif text-stone-800 uppercase tracking-tight">No Matches in Registry</h2>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2 italic">Try adjusting your filters or search terms.</p>
              <button onClick={clearAllFilters} className="mt-8 bg-[#064E3B] text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl">Reset All Filters</button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 grid grid-cols-2 h-16 z-[150] shadow-2xl">
        <button 
          onClick={() => setIsSortOpen(true)}
          className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-stone-100 hover:bg-stone-50 transition-all"
        >
          <Icons.ChevronDown /> Sort
        </button>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition-all"
        >
          <Icons.Menu /> Filter {activeChips.length > 0 && `(${activeChips.length})`}
        </button>
      </div>

      {/* MOBILE FILTER MODAL */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="absolute inset-x-0 bottom-0 h-[85vh] bg-white rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
            <FilterPanelContent />
          </div>
        </div>
      )}

      {/* MOBILE SORT MODAL */}
      {isSortOpen && (
        <div className="lg:hidden fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSortOpen(false)}>
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300 p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="font-black text-xs uppercase tracking-widest">Sort By</h3>
              <button onClick={() => setIsSortOpen(false)} className="p-2"><Icons.X /></button>
            </div>
            <div className="space-y-4 pb-8">
              {[
                { id: 'relevance', label: 'Relevance' },
                { id: 'popularity', label: 'Popularity' },
                { id: 'price-low', label: 'Price: Low to High' },
                { id: 'price-high', label: 'Price: High to Low' },
                { id: 'rating', label: 'Customer Rating' }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => { setSort(opt.id as SortOption); setIsSortOpen(false); }}
                  className={`w-full text-left py-4 text-xs font-bold uppercase tracking-widest flex justify-between items-center ${sort === opt.id ? 'text-[#064E3B]' : 'text-stone-500'}`}
                >
                  {opt.label}
                  {sort === opt.id && <div className="w-2 h-2 bg-[#064E3B] rounded-full"></div>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
