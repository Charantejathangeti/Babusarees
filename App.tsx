
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Product, CartItem, User } from './types';
import { MOCK_PRODUCTS } from './mockData';
import { Icons, CATEGORIES, COLORS, BUSINESS_INFO as INITIAL_BUSINESS_INFO } from './constants';

// --- Pages ---
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

// --- Protected Route Component ---
const ProtectedAdminRoute: React.FC<{ user: User | null, children: React.ReactNode }> = ({ user, children }) => {
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// --- Components ---
const Header: React.FC<{ 
  cartCount: number, 
  user: User | null, 
  onLogout: () => void,
  businessInfo: typeof INITIAL_BUSINESS_INFO 
}> = ({ cartCount, user, onLogout, businessInfo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-stone-100">
      <div className="bg-[#064E3B] text-white py-2 px-4 text-center text-[10px] font-bold tracking-[0.25em] uppercase">
        AUTHENTIC SOUTH INDIAN HERITAGE | GSTIN: {businessInfo.gstin}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex flex-col items-center group">
            <span className="text-2xl font-bold tracking-tight text-[#064E3B] serif group-hover:scale-105 transition-transform">BABU’S TEXTILES</span>
            <span className="text-[9px] tracking-[0.3em] uppercase font-black text-[#B45309]">Tirupati Heritage</span>
          </Link>

          <nav className="hidden lg:flex space-x-10">
            {['Home', 'Categories', 'Wholesale', 'About', 'Contact'].map((item) => {
              const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
              const isActive = location.pathname === path || (path === '/categories' && location.pathname.startsWith('/categories'));
              return (
                <Link 
                  key={item} 
                  to={path}
                  className={`text-[11px] font-black uppercase tracking-widest transition-all hover:text-[#064E3B] ${isActive ? 'text-[#064E3B] border-b-2 border-[#064E3B] pb-1' : 'text-stone-400'}`}
                >
                  {item}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-6">
            <Link to="/auth" className="text-stone-600 hover:text-[#064E3B] flex items-center gap-2 group">
              <div className="p-2 bg-stone-50 rounded-full group-hover:bg-[#064E3B] group-hover:text-white transition-all">
                <Icons.User />
              </div>
              {user && (
                <div className="hidden md:flex flex-col items-start leading-none">
                  <span className="text-[10px] font-black uppercase tracking-tighter">{user.name.split(' ')[0]}</span>
                  <span className="text-[8px] text-[#B45309] font-bold">{user.role}</span>
                </div>
              )}
            </Link>
            
            {user?.role === 'ADMIN' && (
              <div className="flex items-center gap-4 border-l border-stone-100 pl-6">
                <Link to="/admin" className="p-2 bg-emerald-50 text-[#064E3B] rounded-full hover:bg-[#064E3B] hover:text-white transition-all shadow-sm">
                   <Icons.Dashboard />
                </Link>
                <button onClick={onLogout} className="text-[9px] font-black text-red-600 hover:underline uppercase tracking-widest">Logout</button>
              </div>
            )}

            <Link to="/cart" className="text-stone-600 hover:text-[#064E3B] relative group">
              <div className="p-2 bg-stone-50 rounded-full group-hover:bg-[#064E3B] group-hover:text-white transition-all">
                <Icons.Cart />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B45309] text-white text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white">
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
        <div className="lg:hidden bg-white border-t border-stone-100 p-6 absolute w-full left-0 animate-in slide-in-from-top duration-300 shadow-2xl">
          <nav className="flex flex-col space-y-6">
            {['Home', 'Categories', 'Wholesale', 'About', 'Contact'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-sm font-black uppercase tracking-[0.2em] text-stone-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.2em] text-[#B45309]">Admin Dashboard</Link>
            )}
            {user && (
               <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-sm font-black uppercase tracking-[0.2em] text-red-600 text-left">Logout Account</button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC<{ businessInfo: typeof INITIAL_BUSINESS_INFO }> = ({ businessInfo }) => (
  <footer className="bg-[#031d16] text-white border-t-2 border-[#B45309]">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
        
        {/* BRAND COLUMN */}
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold serif tracking-tight text-white uppercase">BABU’S TEXTILES</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B45309]">Legacy Since 1978</p>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-300 font-medium italic max-w-xs mx-auto md:mx-0">
            Preserving the spiritual essence of South Indian handlooms through master craftsmanship and generational heritage.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            {['Home', 'Categories', 'Wholesale', 'Contact'].map(item => (
              <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-[#B45309] transition-colors">{item}</Link>
            ))}
          </div>
        </div>

        {/* SHOWROOM COLUMN - CONSOLIDATED ADDRESS */}
        <div className="flex flex-col gap-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B45309] border-b border-white/10 pb-2 inline-block">Heritage Showroom</h4>
          <div className="space-y-6">
            {/* Address forced to one line on larger screens, normal on mobile for readability */}
            <p className="text-sm md:text-base serif font-semibold text-white leading-snug whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis">
              {businessInfo.address}
            </p>
            <div className="pt-2">
               <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-1">Authorized Registry ID</p>
               <p className="text-xs font-bold text-stone-200 tracking-wider">{businessInfo.gstin}</p>
            </div>
          </div>
        </div>

        {/* CONTACT COLUMN - ENHANCED VISIBILITY */}
        <div className="flex flex-col gap-6 md:items-end md:text-right">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B45309] border-b border-white/10 pb-2 inline-block">Direct Contact</h4>
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Heritage Helpline</p>
              {businessInfo.contact.map(num => (
                <a key={num} href={`tel:${num.replace(/\s/g, '')}`} className="block text-xl font-bold text-white hover:text-[#B45309] transition-colors serif tracking-tight">
                  {num}
                </a>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Electronic Mail</p>
              <a href="mailto:care@babustextiles.com" className="text-sm font-bold text-stone-200 hover:text-[#B45309] transition-colors underline decoration-stone-700 underline-offset-4">care@babustextiles.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500">
          © 2024 Babu’s Textiles Heritage Terminal. All Rights Reserved.
        </p>
        <div className="flex items-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[9px] font-black tracking-widest uppercase text-stone-400">Secured Heritage Gateway</span>
           </div>
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-stone-300">VISA</span>
              <span className="text-[10px] font-black text-stone-300">UPI</span>
              <span className="text-[10px] font-black text-stone-300">RUPAY</span>
           </div>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [businessInfo, setBusinessInfo] = useState(INITIAL_BUSINESS_INFO);

  // Restore session
  useEffect(() => {
    const savedUser = localStorage.getItem('bt_user_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('bt_user_session', JSON.stringify(u));
    } else {
      localStorage.removeItem('bt_user_session');
    }
  };

  const handleLogout = () => {
    handleSetUser(null);
    window.location.hash = '#/auth';
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
        <Header cartCount={cartCount} user={user} onLogout={handleLogout} businessInfo={businessInfo} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
            <Route path="/categories" element={<ProductList products={products} addToCart={addToCart} />} />
            <Route path="/categories/:category" element={<ProductList products={products} addToCart={addToCart} />} />
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
                  <AdminDashboard user={user} products={products} setProducts={setProducts} businessInfo={businessInfo} setBusinessInfo={setBusinessInfo} />
                </ProtectedAdminRoute>
              } 
            />
          </Routes>
        </main>
        <Footer businessInfo={businessInfo} />
      </div>
    </HashRouter>
  );
}
