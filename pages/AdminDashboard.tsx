
import React, { useState, useEffect, useMemo } from 'react';
import { Icons, LoadingSpinner, CATEGORIES, BRANDS, FABRICS, BUSINESS_INFO } from '../constants';
import { Product, User, Order } from '../types';
import { useNavigate } from 'react-router-dom';

interface AdminDashboardProps {
  user: User | null;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  brands: string[];
  setBrands: React.Dispatch<React.SetStateAction<string[]>>;
  businessInfo: any;
  setBusinessInfo: React.Dispatch<React.SetStateAction<any>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, products, setProducts, brands, setBrands, businessInfo, setBusinessInfo }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-1', customerName: 'Rajesh Kumar', date: '2024-03-20', total: 15400, status: 'PENDING', items: [{ productName: 'Silk Saree', quantity: 1, price: 15400 }] },
    { id: 'ORD-2', customerName: 'Suresh Textiles', date: '2024-03-19', total: 45000, status: 'DELIVERED', items: [{ productName: 'Premium Cotton', quantity: 15, price: 3000 }] },
  ]);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/auth');
      return;
    }
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const stats = useMemo(() => {
    const revenue = orders.filter(o => o.status === 'DELIVERED').reduce((acc, o) => acc + o.total, 0);
    const confirmed = orders.filter(o => o.status === 'DELIVERED').length;
    const pending = orders.filter(o => o.status === 'PENDING').length;
    const lowStock = products.filter(p => p.stock < 10).length;
    const totalOrders = orders.length;
    return { revenue, confirmed, pending, lowStock, totalOrders };
  }, [orders, products]);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(false);
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData: Partial<Product> = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      brand: formData.get('brand') as string,
      fabric: formData.get('fabric') as string,
      retailPrice: Number(formData.get('retailPrice')),
      offerPrice: Number(formData.get('offerPrice')) || undefined,
      wholesalePrice: Number(formData.get('wholesalePrice')),
      stock: Number(formData.get('stock')),
      description: formData.get('description') as string,
      images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(s => s),
      colors: (formData.get('colors') as string).split(',').map(s => s.trim()).filter(s => s),
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...editingProduct, ...productData } as Product : p));
      triggerNotification('Registry Updated');
    } else {
      const newProduct: Product = {
        ...productData,
        id: `PRD-${Date.now()}`,
        rating: 0,
        reviewsCount: 0
      } as Product;
      setProducts(prev => [newProduct, ...prev]);
      triggerNotification('Product Added');
    }
    handleCloseModal();
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Remove from registry?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      triggerNotification('Product Removed');
    }
  };

  const downloadInvoice = (order: Order) => {
    const manifest = `🏛️ BABU'S TEXTILES\nID: ${order.id}\nCustomer: ${order.customerName}\nTotal: ₹${order.total.toLocaleString()}`;
    const blob = new Blob([manifest], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BT_${order.id}.txt`;
    link.click();
    triggerNotification('Invoice Saved');
  };

  const confirmOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'DELIVERED' } : o));
    triggerNotification('Order Updated');
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#F9F6F0]"><LoadingSpinner /></div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8F9FA] text-stone-900 overflow-hidden w-full">
      {notification && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] bg-[#064E3B] text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-lg animate-in slide-in-from-top">
          {notification}
        </div>
      )}

      <aside className="hidden md:flex w-12 lg:w-32 bg-[#064E3B] text-white flex-col flex-shrink-0 sticky top-0 h-screen z-40 shadow-xl">
        <div className="p-3 text-center border-b border-white/5">
          <div className="text-base font-black serif tracking-tighter">BT</div>
        </div>
        <nav className="flex-grow py-1">
          {[
            { id: 'dashboard', icon: <Icons.Dashboard />, label: 'HOME' },
            { id: 'inventory', icon: <Icons.Inventory />, label: 'ITEMS' },
            { id: 'orders', icon: <Icons.Orders />, label: 'ORDERS' },
            { id: 'settings', icon: <Icons.Settings />, label: 'ADDRESS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex flex-col items-center justify-center gap-1 px-1 py-3 transition-all ${activeTab === tab.id ? 'bg-white/10 text-white border-l-2 border-[#DAA520]' : 'text-stone-400 hover:bg-white/5'}`}
            >
              <span className="scale-75">{tab.icon}</span>
              <span className="text-[7px] font-black tracking-widest uppercase">{tab.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => navigate('/auth')} className="p-3 border-t border-white/5 text-stone-500 hover:text-white flex justify-center">
          <Icons.LogOut />
        </button>
      </aside>

      <nav className="md:hidden sticky top-[90px] z-[90] bg-[#064E3B] flex overflow-x-auto no-scrollbar border-b border-white/10 w-full shrink-0">
        {['dashboard', 'inventory', 'orders', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 min-w-[25%] flex items-center justify-center py-2.5 text-[7px] font-black tracking-widest uppercase transition-all ${activeTab === tab ? 'bg-white/10 text-white border-b-2 border-[#DAA520]' : 'text-stone-400'}`}
          >
            {tab === 'settings' ? 'ADDRESS' : tab}
          </button>
        ))}
      </nav>

      <main className="flex-grow flex flex-col min-w-0 h-full overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between gap-4 sticky top-0 z-50">
           <div className="flex items-center gap-4 flex-grow max-w-xl">
             <div className="relative w-full">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 scale-75"><Icons.Search /></span>
               <input 
                 type="text" 
                 placeholder="Search registry by name, category, or brand..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-stone-50 border border-stone-200 pl-10 pr-10 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#064E3B] focus:bg-white transition-all rounded-sm shadow-inner"
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-500 scale-75">
                   <Icons.X />
                 </button>
               )}
             </div>
           </div>
           <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
               <span className="text-[8px] font-black text-stone-800 uppercase tracking-tighter leading-none">{user?.name}</span>
               <span className="text-[6px] font-bold text-[#DAA520] uppercase tracking-widest leading-none mt-1">Heritage Admin</span>
             </div>
             <div className="w-8 h-8 bg-stone-100 border border-stone-200 flex items-center justify-center rounded-sm">
                <Icons.User />
             </div>
           </div>
        </header>

        <div className="p-2 md:p-4 pb-20 md:pb-4 flex flex-col flex-grow">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-base font-black serif uppercase tracking-tight leading-none min-w-max">
              {activeTab === 'settings' ? 'ADDRESS REGISTRY' : activeTab === 'inventory' ? 'ITEM REGISTRY' : activeTab}
            </h1>
            {activeTab === 'inventory' && (
              <button onClick={() => handleOpenModal()} className="bg-[#064E3B] text-white px-3 py-1.5 text-[8px] font-black uppercase tracking-widest hover:bg-[#B45309] flex items-center gap-1 flex-shrink-0 shadow-sm">
                <Icons.Plus /> ADD NEW
              </button>
            )}
          </div>

          {searchQuery && activeTab !== 'inventory' && (
            <div className="mb-4 p-2 bg-emerald-50 border border-emerald-100 flex items-center justify-between">
              <span className="text-[8px] font-black text-[#064E3B] uppercase tracking-widest">
                Currently Filtering results for "{searchQuery}"
              </span>
              <button onClick={() => setActiveTab('inventory')} className="text-[7px] font-black text-stone-400 uppercase hover:underline">
                View in Inventory
              </button>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  { label: 'SALES', value: `₹${stats.revenue.toLocaleString()}`, color: 'text-[#064E3B]' },
                  { label: 'ORDERS', value: stats.totalOrders, color: 'text-stone-800' },
                  { label: 'PENDING', value: stats.pending, color: 'text-[#B45309]' },
                  { label: 'LOW STOCK', value: stats.lowStock, color: stats.lowStock > 0 ? 'text-red-600' : 'text-stone-400' },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-2 border border-stone-200 flex flex-col justify-between min-w-0 shadow-sm">
                    <div className="text-[6px] font-black text-stone-400 uppercase tracking-widest truncate">{s.label}</div>
                    <div className={`text-sm font-black tracking-tighter ${s.color} leading-none mt-1 truncate`}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-3 border border-stone-200 overflow-hidden shadow-sm">
                <h3 className="text-[7px] font-black uppercase tracking-widest text-stone-800 mb-2 border-b border-stone-100 pb-1">Live Trend</h3>
                <div className="h-20 w-full flex items-end justify-between gap-0.5 min-w-0 overflow-hidden">
                  {[45, 75, 55, 95, 80, 100, 90, 65, 85, 40, 60, 80, 50, 70, 90, 40, 60, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#064E3B]/10 relative h-full">
                      <div className="absolute bottom-0 left-0 right-0 bg-[#064E3B]" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="bg-white border border-stone-200 overflow-x-auto no-scrollbar rounded-none shadow-sm">
                <table className="w-full text-left min-w-[700px] border-collapse">
                  <thead className="bg-stone-50 text-[6px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                    <tr>
                      <th className="px-2 py-2 whitespace-nowrap">Product Details</th>
                      <th className="px-2 py-2 whitespace-nowrap">Department</th>
                      <th className="px-2 py-2 text-center whitespace-nowrap">Retail</th>
                      <th className="px-2 py-2 text-center whitespace-nowrap">Wholesale</th>
                      <th className="px-2 py-2 text-center whitespace-nowrap">Stock</th>
                      <th className="px-2 py-2 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="px-2 py-1.5">
                            <div className="flex items-center gap-2 max-w-[200px]">
                              <img src={p.images[0]} className="w-6 h-8 object-cover border border-stone-100 flex-shrink-0" alt="" />
                              <div className="min-w-0">
                                <p className="text-[8px] font-black text-stone-800 uppercase leading-none truncate">{p.name}</p>
                                <p className="text-[5px] text-stone-300 font-bold uppercase mt-0.5 truncate">{p.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-1.5 text-[7px] font-bold text-stone-400 uppercase whitespace-nowrap">{p.category.split(' ')[0]}</td>
                          <td className="px-2 py-1.5 text-center text-[8px] font-black text-stone-900 whitespace-nowrap">₹{p.retailPrice.toLocaleString()}</td>
                          <td className="px-2 py-1.5 text-center text-[8px] font-black text-[#064E3B] whitespace-nowrap">₹{p.wholesalePrice.toLocaleString()}</td>
                          <td className="px-2 py-1.5 text-center whitespace-nowrap">
                            <span className={`px-1 py-0.5 text-[6px] font-black uppercase ${p.stock < 10 ? 'text-red-600' : 'text-emerald-900'}`}>
                              {p.stock} QTY
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => handleOpenModal(p)} className="p-1 text-stone-400 hover:text-[#064E3B]"><Icons.Edit /></button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-1 text-stone-200 hover:text-red-600"><Icons.Trash /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-20 text-center text-[10px] font-black text-stone-300 uppercase tracking-widest italic">
                          No items found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white border border-stone-200 overflow-x-auto no-scrollbar rounded-none shadow-sm animate-in fade-in duration-200">
              <table className="w-full text-left min-w-[500px] border-collapse">
                <thead className="bg-stone-50 text-[6px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                  <tr>
                    <th className="px-2 py-2 whitespace-nowrap">Manifest ID</th>
                    <th className="px-2 py-2 whitespace-nowrap">Client</th>
                    <th className="px-2 py-2 whitespace-nowrap">Value</th>
                    <th className="px-2 py-2 text-center whitespace-nowrap">Status</th>
                    <th className="px-2 py-2 text-right whitespace-nowrap">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50 text-[8px] font-black">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-stone-50/50">
                      <td className="px-2 py-1.5 uppercase text-[#064E3B] whitespace-nowrap">{order.id}</td>
                      <td className="px-2 py-1.5 uppercase truncate max-w-[120px] whitespace-nowrap">{order.customerName}</td>
                      <td className="px-2 py-1.5 whitespace-nowrap">₹{order.total.toLocaleString()}</td>
                      <td className="px-2 py-1.5 text-center whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 border text-[6px] uppercase tracking-widest ${order.status === 'DELIVERED' ? 'border-[#064E3B] text-[#064E3B]' : 'border-[#B45309] text-[#B45309]'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1">
                          {order.status === 'PENDING' && (
                            <button onClick={() => confirmOrder(order.id)} className="text-[6px] font-black bg-[#DAA520] text-white px-2 py-1 hover:bg-[#B45309]">SHIP</button>
                          )}
                          <button onClick={() => downloadInvoice(order)} className="text-[6px] font-black bg-stone-800 text-white px-2 py-1 hover:bg-black">INV</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-md space-y-3 animate-in fade-in duration-200">
               <div className="bg-white p-4 border border-stone-200 shadow-sm rounded-sm">
                  <h3 className="text-[7px] font-black uppercase tracking-widest text-stone-800 mb-3 pb-1.5 border-b border-stone-100">OFFICIAL ADDRESS REGISTRY</h3>
                  <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); triggerNotification('Saved'); }}>
                    <div>
                      <label className="text-[6px] font-black text-stone-400 uppercase tracking-widest block mb-0.5">Showroom Location</label>
                      <textarea defaultValue={BUSINESS_INFO.address} className="w-full bg-stone-50 border border-stone-100 p-2 text-[10px] font-bold outline-none focus:border-[#064E3B]" rows={2} />
                    </div>
                    <div>
                      <label className="text-[6px] font-black text-stone-400 uppercase tracking-widest block mb-0.5">Tax Identifier (GSTIN)</label>
                      <input defaultValue={BUSINESS_INFO.gstin} className="w-full bg-stone-50 border border-stone-100 p-2 text-[10px] font-black outline-none focus:border-[#064E3B] uppercase" />
                    </div>
                    <button type="submit" className="w-full bg-[#064E3B] text-white py-2.5 text-[8px] font-black uppercase tracking-widest shadow-md hover:bg-[#B45309] transition-all">COMMIT CHANGES</button>
                  </form>
               </div>
            </div>
          )}
        </div>
      </main>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-2 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl rounded-sm">
            <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h2 className="text-xs font-black serif uppercase tracking-tight">{editingProduct ? 'Edit Weave Registry' : 'New Heritage Item'}</h2>
              </div>
              <button onClick={handleCloseModal} className="p-1 hover:bg-stone-50 rounded-full transition-colors"><Icons.X /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-[6px] font-black text-stone-400 uppercase tracking-widest mb-1">Official Name</label>
                  <input name="name" required defaultValue={editingProduct?.name} className="w-full bg-stone-50 border border-stone-100 p-2.5 text-[10px] font-black outline-none focus:border-[#064E3B]" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[6px] font-black text-stone-400 uppercase tracking-widest mb-1">Dept</label>
                    <select name="category" defaultValue={editingProduct?.category} className="w-full bg-stone-50 border border-stone-100 p-2.5 text-[9px] font-black outline-none uppercase cursor-pointer">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.split(' ')[0]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[6px] font-black text-stone-400 uppercase tracking-widest mb-1">Brand</label>
                    <select name="brand" defaultValue={editingProduct?.brand} className="w-full bg-stone-50 border border-stone-100 p-2.5 text-[9px] font-black outline-none uppercase cursor-pointer">
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[6px] font-black text-stone-400 uppercase tracking-widest mb-1">Retail</label>
                    <input name="retailPrice" type="number" required defaultValue={editingProduct?.retailPrice} className="w-full bg-stone-50 border border-stone-100 p-2.5 text-[10px] font-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[6px] font-black text-stone-400 uppercase tracking-widest mb-1">Whsle</label>
                    <input name="wholesalePrice" type="number" required defaultValue={editingProduct?.wholesalePrice} className="w-full bg-stone-50 border border-stone-100 p-2.5 text-[10px] font-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[6px] font-black text-stone-400 uppercase tracking-widest mb-1">Stock</label>
                    <input name="stock" type="number" required defaultValue={editingProduct?.stock} className="w-full bg-stone-50 border border-stone-100 p-2.5 text-[10px] font-black outline-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[6px] font-black text-stone-400 uppercase tracking-widest mb-1">Description</label>
                  <textarea name="description" required defaultValue={editingProduct?.description} className="w-full bg-stone-50 border border-stone-100 p-2.5 text-[9px] font-medium outline-none" rows={3} />
                </div>
                <div>
                  <label className="block text-[6px] font-black text-stone-400 uppercase tracking-widest mb-1">Image URL</label>
                  <textarea name="images" required defaultValue={editingProduct?.images.join(', ')} className="w-full bg-stone-50 border border-stone-100 p-2.5 text-[9px] font-medium outline-none" rows={2} />
                </div>
                <div className="pt-2 border-t border-stone-100 flex gap-2">
                  <button type="button" onClick={handleCloseModal} className="flex-1 py-2.5 text-[8px] font-black uppercase tracking-widest text-stone-400 border border-stone-100 hover:bg-stone-50">EXIT</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#064E3B] text-white text-[8px] font-black uppercase tracking-widest shadow-md hover:bg-[#B45309] transition-all">SAVE ENTRY</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
