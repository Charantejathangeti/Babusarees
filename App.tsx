import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Product, CartItem, User } from './types';
import { MOCK_PRODUCTS } from './mockData';
import { Icons, CATEGORIES, BRANDS as INITIAL_BRANDS, COLORS, BUSINESS_INFO as INITIAL_BUSINESS_INFO } from './constants';

// --- Components ---
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Wholesale from './pages/Wholesale';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AIStylist from './components/AIStylist';

// --- Protected Route ---
const ProtectedAdminRoute: React.FC<{ user: User | null, children: React.ReactNode }> = ({ user, children }) => {
  if (!user || user.role !== 'ADMIN') return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

// --- Header ---
const Header: React.FC<{ 
  cartCount: number, 
  user: User | null, 
  onLogout: () => void,
  businessInfo: typeof INITIAL_BUSINESS_INFO 
}> = ({ cartCount, user, onLogout, businessInfo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Catalog', path: '/categories' },
    { label: 'Wholesale', path: '/wholesale' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-stone-100 w-full shadow-sm">
      <div className="bg-[#064E3B] text-white py-1.5 px-4 text-center text-[9px] font-black tracking-[0.3em] uppercase">
        GSTIN: {businessInfo.gstin} | AUTHENTIC TIRUPATI HERITAGE
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex flex-col items-center group shrink-0">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-[#064E3B] serif group-hover:scale-105 transition-transform uppercase">BABU’S TEXTILES</span>
            <span className="text-[8px] tracking-[0.4em] uppercase font-black text-[#B45309]">Masterlooms</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link 
                key={item.label} 
                to={item.path}
                className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-[#064E3B] ${location.pathname === item.path ? 'text-[#064E3B] border-b-2 border-[#064E3B] pb-1' : 'text-stone-400'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4 md:space-x-6">
            <Link to="/auth" className="flex items-center gap-2 group p-2 hover:bg-stone-50 transition-all rounded-full border border-transparent hover:border-stone-100">
              <Icons.User />
              <div className="flex flex-col">
                <span className="hidden lg:block text-[8px] font-black uppercase tracking-widest leading-none">
                  {user ? user.name.split(' ')[0] : 'Member'}
                </span>
                {user?.role === 'ADMIN' && <span className="hidden lg:block text-[6px] font-bold text-[#B45309] uppercase tracking-widest mt-0.5">Admin</span>}
              </div>
            </Link>
            
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="p-2.5 bg-emerald-50 text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-all rounded-full hidden sm:flex items-center justify-center">
                 <Icons.Dashboard />
              </Link>
            )}

            <Link to="/cart" className="relative p-2 hover:bg-stone-50 rounded-full transition-all">
              <Icons.Cart />
              {cartCount > 0 && (
                <span className="absolute -top-0 -right-0 bg-[#B45309] text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button className="lg:hidden text-stone-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 p-8 absolute w-full left-0 shadow-2xl animate-in slide-in-from-top duration-300 z-[110]">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((item) => (
              <Link key={item.label} to={item.path} className="text-xs font-black uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>{item.label}</Link>
            ))}
            {user?.role === 'ADMIN' && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase text-[#B45309]">Admin Terminal</Link>}
            {user ? (
              <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-xs font-black uppercase text-red-600 text-left">Logout Account</button>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase text-[#064E3B]">Login to Registry</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

// --- Ultra Compact Green Footer with Horizontal Links ---
const Footer: React.FC<{ businessInfo: typeof INITIAL_BUSINESS_INFO }> = ({ businessInfo }) => (
  <footer className="bg-[#064E3B] text-white w-full mt-auto">
    <div className="border-b border-white/5 py-3">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-x-12 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px]">⭐</span>
          <div className="flex flex-col">
            <span className="text-[7px] font-black uppercase tracking-widest text-white leading-none">100% AUTHENTIC HANDLOOM</span>
            <span className="text-[6px] font-bold uppercase tracking-widest text-[#DAA520]/60 leading-tight">Verified Heritage Registry</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px]">💎</span>
          <div className="flex flex-col">
            <span className="text-[7px] font-black uppercase tracking-widest text-white leading-none">QUALITY ASSURED FABRICS</span>
            <span className="text-[6px] font-bold uppercase tracking-widest text-[#DAA520]/60 leading-tight">Triple-Grade Yarns</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px]">🤝</span>
          <div className="flex flex-col">
            <span className="text-[7px] font-black uppercase tracking-widest text-white leading-none">TRUSTED SINCE 2019</span>
            <span className="text-[6px] font-bold uppercase tracking-widest text-[#DAA520]/60 leading-tight">Direct Weaver Partners</span>
          </div>
        </div>
      </div>
    </div>

    <div className="py-4 bg-black/10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black serif text-[#DAA520] uppercase tracking-tighter">BABU’S TEXTILES</span>
          <span className="text-white/10 text-[10px]">|</span>
          <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">GSTIN: {businessInfo.gstin}</span>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
          <Link to="/" className="text-[7px] font-black text-white/50 hover:text-[#DAA520] uppercase tracking-widest transition-all">Home</Link>
          <Link to="/categories" className="text-[7px] font-black text-white/50 hover:text-[#DAA520] uppercase tracking-widest transition-all">Catalog</Link>
          <Link to="/wholesale" className="text-[7px] font-black text-white/50 hover:text-[#DAA520] uppercase tracking-widest transition-all">Wholesale</Link>
          <Link to="/about" className="text-[7px] font-black text-white/50 hover:text-[#DAA520] uppercase tracking-widest transition-all">Legacy</Link>
          <Link to="/contact" className="text-[7px] font-black text-white/50 hover:text-[#DAA520] uppercase tracking-widest transition-all">Contact</Link>
          <Link to="/auth" className="text-[7px] font-black text-white/50 hover:text-[#DAA520] uppercase tracking-widest transition-all">Login</Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">© 2024 MASTERLOOMS</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [brands, setBrands] = useState<string[]>(INITIAL_BRANDS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [businessInfo, setBusinessInfo] = useState(INITIAL_BUSINESS_INFO);

  useEffect(() => {
    const savedUser = localStorage.getItem('bt_user_session');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('bt_user_session', JSON.stringify(u));
    else localStorage.removeItem('bt_user_session');
  };

  const handleLogout = () => {
    handleSetUser(null);
    window.location.hash = '#/auth';
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#F9F6F0] w-full overflow-x-hidden">
        <Header cartCount={cartCount} user={user} onLogout={handleLogout} businessInfo={businessInfo} />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
            <Route path="/categories" element={<ProductList products={products} brands={brands} addToCart={addToCart} />} />
            <Route path="/categories/:category" element={<ProductList products={products} brands={brands} addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} user={user} />} />
            <Route path="/auth" element={<Auth setUser={handleSetUser} />} />
            <Route path="/wholesale" element={<Wholesale businessInfo={businessInfo} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact businessInfo={businessInfo} />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute user={user}>
                  <AdminDashboard user={user} products={products} setProducts={setProducts} brands={brands} setBrands={setBrands} businessInfo={businessInfo} setBusinessInfo={setBusinessInfo} />
                </ProtectedAdminRoute>
              } 
            />
          </Routes>
        </main>
        <Footer businessInfo={businessInfo} />
        <AIStylist products={products} />
      </div>
    </HashRouter>
  );
}