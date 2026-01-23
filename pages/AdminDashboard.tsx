
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Icons, LoadingSpinner, CATEGORIES, BRANDS, FABRICS } from '../constants';
import { Product, User, Order } from '../types';
import { useNavigate } from 'react-router-dom';

interface AdminDashboardProps {
  user: User | null;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  businessInfo: any;
  setBusinessInfo: React.Dispatch<React.SetStateAction<any>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, products, setProducts, businessInfo, setBusinessInfo }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders' | 'settings'>('dashboard');
  const [chartMode, setChartMode] = useState<'day' | 'month' | 'year'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  // State for editing business info
  const [tempBusinessInfo, setTempBusinessInfo] = useState({ ...businessInfo });

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '', 
    category: CATEGORIES[0], 
    brand: BRANDS[0], 
    fabric: FABRICS[0],
    retailPrice: 0, 
    offerPrice: 0,
    wholesalePrice: 0, 
    stock: 0, 
    images: [''], 
    description: '',
    colors: ['Heritage Pure Silk']
  });

  const checkAuth = useCallback(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/auth');
      return;
    }
    setTimeout(() => setIsLoading(false), 300);
  }, [user, navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const stats = useMemo(() => {
    const revenue = orders.filter(o => o.status === 'DELIVERED').reduce((acc, o) => acc + o.total, 0);
    const confirmed = orders.filter(o => o.status === 'DELIVERED').length;
    const pending = orders.filter(o => o.status === 'PENDING').length;
    return { revenue, totalOrders: orders.length, confirmed, pending, activeSKUs: products.length };
  }, [orders, products]);

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductFormData({ ...p });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productFormData } as Product : p));
    } else {
      const newP = { 
        ...productFormData, 
        id: `BT-${Date.now()}`, 
        isFeatured: false, 
        isBestSeller: false 
      } as Product;
      setProducts(prev => [newP, ...prev]);
    }
    setIsProductModalOpen(false);
  };

  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessInfo(tempBusinessInfo);
    alert('Business Registry Updated Successfully');
  };

  const addImageField = () => {
    setProductFormData(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const updateImageField = (index: number, value: string) => {
    const updated = [...(productFormData.images || [])];
    updated[index] = value;
    setProductFormData(prev => ({ ...prev, images: updated }));
  };

  const removeImageField = (index: number) => {
    setProductFormData(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const images = [...(productFormData.images || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
    setProductFormData(prev => ({ ...prev, images }));
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-stone-900">
      {/* SIDEBAR */}
      <aside className="w-48 bg-[#064E3B] text-white flex flex-col fixed h-full z-40 border-r border-black/10 shadow-xl">
        <div className="p-4 border-b border-white/5 text-center">
          <div className="w-10 h-10 bg-[#B45309] mx-auto flex items-center justify-center font-black text-white italic text-lg mb-2 rounded-none">B</div>
          <span className="text-[7px] font-black tracking-widest uppercase opacity-60">MASTER TERMINAL</span>
        </div>
        <nav className="flex-grow">
          {['dashboard', 'inventory', 'orders', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-[8px] font-black tracking-widest transition-all ${activeTab === tab ? 'bg-white/10 text-white border-l-4 border-[#B45309]' : 'text-stone-400 hover:bg-white/5'}`}
            >
              <span className="uppercase">{tab}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => navigate('/auth')} className="p-4 text-stone-500 hover:text-red-400 text-[8px] font-black tracking-widest border-t border-white/5 uppercase">LOGOUT</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow ml-48 p-6 bg-[#FDFBF7]">
        <div className="max-w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-xl font-black serif uppercase tracking-tight">{activeTab}</h1>
              <p className="text-[7px] font-black text-[#B45309] uppercase tracking-[0.3em]">Babu's Textile Registry Control Panel</p>
            </div>
            <div className="flex items-center gap-4">
              {activeTab === 'inventory' && (
                <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="bg-[#064E3B] text-white px-4 py-2 text-[8px] font-black tracking-widest hover:bg-[#B45309] border-none shadow-md">
                  + ADD PRODUCT
                </button>
              )}
              <div className="w-8 h-8 bg-[#064E3B] flex items-center justify-center text-white text-[10px] font-black rounded-none shadow-sm">AD</div>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'WEBSITE REVENUE', value: `₹${stats.revenue.toLocaleString()}`, color: 'text-[#064E3B]' },
                  { label: 'TOTAL ORDERS', value: stats.totalOrders, color: 'text-stone-800' },
                  { label: 'CONFIRMED', value: stats.confirmed, color: 'text-stone-800' },
                  { label: 'PENDING', value: stats.pending, color: 'text-[#B45309]' },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-4 border border-stone-200 shadow-sm hover:border-[#B45309] transition-all">
                    <span className="text-[7px] font-black text-stone-300 uppercase tracking-widest block mb-1">{s.label}</span>
                    <div className={`text-xl font-black tracking-tighter ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 border border-stone-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-800">PERFORMANCE SPECTRUM</h3>
                  <div className="flex border border-stone-200">
                    {['day', 'month', 'year'].map(m => (
                      <button key={m} onClick={() => setChartMode(m as any)} className={`px-4 py-1 text-[7px] font-black uppercase tracking-widest ${chartMode === m ? 'bg-[#064E3B] text-white' : 'text-stone-400'}`}>{m}</button>
                    ))}
                  </div>
                </div>
                <div className="h-24 flex items-end gap-1 px-1 border-b border-stone-100">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-grow bg-[#064E3B]/5 h-full relative group">
                      <div className="absolute bottom-0 left-0 w-full bg-[#B45309] transition-all duration-700 group-hover:bg-[#064E3B]" style={{ height: stats.revenue > 0 ? `${(Math.random() * 80) + 10}%` : '5%' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-white p-3 border border-stone-200 shadow-sm flex justify-between items-center">
                <div className="relative w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 scale-75"><Icons.Search /></span>
                  <input 
                    type="text" 
                    placeholder="Search by SKU/Name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 rounded-none pl-10 pr-4 py-2 text-[9px] font-bold outline-none"
                  />
                </div>
                <div className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Showing {products.length} Records</div>
              </div>

              <div className="bg-white border border-stone-200 shadow-sm overflow-hidden">
                <table className="w-full text-left table-auto">
                  <thead className="bg-stone-50 text-[7px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-200">
                    <tr>
                      <th className="px-4 py-3 border-r border-stone-100">SKU IDENTITY</th>
                      <th className="px-4 py-3 border-r border-stone-100">CATEGORY</th>
                      <th className="px-4 py-3 border-r border-stone-100">BRAND</th>
                      <th className="px-4 py-3 border-r border-stone-100 text-center">MRP (₹)</th>
                      <th className="px-4 py-3 border-r border-stone-100 text-center">OFFER (₹)</th>
                      <th className="px-4 py-3 border-r border-stone-100 text-center">STOCK</th>
                      <th className="px-4 py-3 text-right">OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                      <tr key={p.id} className="hover:bg-stone-50 transition-all group">
                        <td className="px-4 py-2 text-[9px] font-black text-stone-800 uppercase border-r border-stone-100">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt="" className="w-6 h-8 object-cover border border-stone-200 grayscale group-hover:grayscale-0" />
                            {p.name}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-[8px] font-black text-stone-500 uppercase border-r border-stone-100">{p.category}</td>
                        <td className="px-4 py-2 text-[8px] font-black text-stone-500 uppercase border-r border-stone-100">{p.brand}</td>
                        <td className="px-4 py-2 font-black text-stone-400 line-through text-[9px] border-r border-stone-100 text-center">₹{p.retailPrice.toLocaleString()}</td>
                        <td className="px-4 py-2 font-black text-[#064E3B] text-[10px] border-r border-stone-100 text-center">₹{(p.offerPrice || p.retailPrice).toLocaleString()}</td>
                        <td className="px-4 py-2 border-r border-stone-100 text-center">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 border ${p.stock < 10 ? 'border-red-200 text-red-500 bg-red-50' : 'border-emerald-200 text-emerald-600 bg-emerald-50'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100">
                            <button onClick={() => handleEditProduct(p)} className="p-1 text-stone-400 hover:text-[#064E3B] border border-transparent hover:border-stone-200 transition-all"><Icons.Edit /></button>
                            <button onClick={() => { if(confirm('Delete Registry Record?')) setProducts(prev => prev.filter(x => x.id !== p.id)) }} className="p-1 text-stone-400 hover:text-red-500 border border-transparent hover:border-stone-200 transition-all"><Icons.Trash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-white p-8 border border-stone-200 shadow-sm">
                <h2 className="text-xl font-black serif uppercase tracking-tight mb-6 border-b border-stone-100 pb-2">Business Registry Setup</h2>
                <form onSubmit={handleSaveBusinessInfo} className="space-y-6">
                  <div>
                    <label className="text-[8px] font-black text-stone-400 uppercase mb-1 block">OFFICIAL BUSINESS ADDRESS</label>
                    <textarea 
                      required 
                      value={tempBusinessInfo.address} 
                      onChange={(e) => setTempBusinessInfo({...tempBusinessInfo, address: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 p-3 text-[10px] font-bold outline-none rounded-none focus:border-[#B45309]" 
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-black text-stone-400 uppercase mb-1 block">GSTIN NUMBER</label>
                      <input 
                        required 
                        value={tempBusinessInfo.gstin} 
                        onChange={(e) => setTempBusinessInfo({...tempBusinessInfo, gstin: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-200 p-3 text-[10px] font-bold outline-none rounded-none focus:border-[#B45309]" 
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-stone-400 uppercase mb-1 block">PRIMARY CONTACT</label>
                      <input 
                        required 
                        value={tempBusinessInfo.contact[0]} 
                        onChange={(e) => {
                          const newContacts = [...tempBusinessInfo.contact];
                          newContacts[0] = e.target.value;
                          setTempBusinessInfo({...tempBusinessInfo, contact: newContacts});
                        }}
                        className="w-full bg-stone-50 border border-stone-200 p-3 text-[10px] font-bold outline-none rounded-none focus:border-[#B45309]" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-stone-400 uppercase mb-1 block">SECONDARY CONTACT</label>
                    <input 
                      value={tempBusinessInfo.contact[1] || ''} 
                      onChange={(e) => {
                        const newContacts = [...tempBusinessInfo.contact];
                        newContacts[1] = e.target.value;
                        setTempBusinessInfo({...tempBusinessInfo, contact: newContacts});
                      }}
                      className="w-full bg-stone-50 border border-stone-200 p-3 text-[10px] font-bold outline-none rounded-none focus:border-[#B45309]" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#064E3B] text-white py-3 text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-[#B45309] transition-all">
                    UPDATE REGISTRY INFORMATION
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] bg-stone-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none w-full max-w-xl shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#064E3B] text-white flex justify-between items-center">
              <h2 className="text-[10px] font-black uppercase tracking-widest">{editingProduct ? 'EDIT PRODUCT' : 'NEW REGISTRY ENTRY'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-white hover:text-stone-300 transition-all"><Icons.X /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[7px] font-black text-stone-400 uppercase mb-1 block">FULL PRODUCT NAME</label>
                  <input required value={productFormData.name} onChange={e => setProductFormData({...productFormData, name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 p-2 text-[10px] font-bold outline-none rounded-none focus:border-[#B45309]" />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <label className="text-[7px] font-black text-stone-400 uppercase block">IMAGE REPOSITORY (URLS)</label>
                  {(productFormData.images || []).map((url, idx) => (
                    <div key={idx} className="flex gap-1">
                      <input value={url} onChange={e => updateImageField(idx, e.target.value)} className="flex-grow bg-stone-50 border border-stone-200 p-2 text-[9px] outline-none rounded-none focus:border-[#B45309]" placeholder="https://..." />
                      <button type="button" onClick={() => moveImage(idx, 'up')} className="px-2 border border-stone-200 hover:bg-stone-50 text-[9px] transition-colors">↑</button>
                      <button type="button" onClick={() => moveImage(idx, 'down')} className="px-2 border border-stone-200 hover:bg-stone-50 text-[9px] transition-colors">↓</button>
                      <button type="button" onClick={() => removeImageField(idx)} className="px-2 bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all"><Icons.Trash /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addImageField} className="w-full py-1.5 border border-dashed border-stone-300 text-[7px] font-black uppercase text-stone-400 hover:border-[#064E3B] hover:text-[#064E3B] transition-all">+ ADD NEW IMAGE FIELD</button>
                </div>

                <div>
                  <label className="text-[7px] font-black text-stone-400 uppercase mb-1 block">SIGNATURE BRAND</label>
                  <select value={productFormData.brand} onChange={e => setProductFormData({...productFormData, brand: e.target.value})} className="w-full bg-stone-50 border border-stone-200 p-2 text-[9px] font-black uppercase outline-none focus:border-[#B45309]">
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[7px] font-black text-stone-400 uppercase mb-1 block">DEPARTMENT</label>
                  <select value={productFormData.category} onChange={e => setProductFormData({...productFormData, category: e.target.value})} className="w-full bg-stone-50 border border-stone-200 p-2 text-[9px] font-black uppercase outline-none focus:border-[#B45309]">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[7px] font-black text-stone-400 uppercase mb-1 block">MRP (₹)</label>
                  <input type="number" required value={productFormData.retailPrice} onChange={e => setProductFormData({...productFormData, retailPrice: +e.target.value})} className="w-full bg-stone-50 border border-stone-200 p-2 text-[9px] font-black outline-none focus:border-[#B45309]" />
                </div>

                <div>
                  <label className="text-[7px] font-black text-stone-400 uppercase mb-1 block">OFFER PRICE (₹)</label>
                  <input type="number" value={productFormData.offerPrice} onChange={e => setProductFormData({...productFormData, offerPrice: +e.target.value})} className="w-full bg-stone-50 border border-stone-200 p-2 text-[9px] font-black text-[#064E3B] outline-none focus:border-[#B45309]" />
                </div>

                <div>
                  <label className="text-[7px] font-black text-stone-400 uppercase mb-1 block">STOCK UNITS</label>
                  <input type="number" required value={productFormData.stock} onChange={e => setProductFormData({...productFormData, stock: +e.target.value})} className="w-full bg-stone-50 border border-stone-200 p-2 text-[9px] font-black outline-none focus:border-[#B45309]" />
                </div>

                <div>
                  <label className="text-[7px] font-black text-stone-400 uppercase mb-1 block">FABRIC GRADE</label>
                  <select value={productFormData.fabric} onChange={e => setProductFormData({...productFormData, fabric: e.target.value})} className="w-full bg-stone-50 border border-stone-200 p-2 text-[9px] font-black uppercase outline-none focus:border-[#B45309]">
                    {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[7px] font-black text-stone-400 uppercase mb-1 block">ARTISAN DESCRIPTION</label>
                  <textarea required value={productFormData.description} onChange={e => setProductFormData({...productFormData, description: e.target.value})} className="w-full bg-stone-50 border border-stone-200 p-2 text-[10px] font-medium outline-none focus:border-[#B45309] rounded-none" rows={3} />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 border border-stone-200 text-stone-400 py-3 text-[8px] font-black uppercase tracking-widest hover:text-red-500 rounded-none transition-colors">DISCARD</button>
                <button type="submit" className="flex-1 bg-[#064E3B] text-white py-3 text-[8px] font-black uppercase tracking-widest shadow-lg hover:bg-[#B45309] transition-all rounded-none">COMMIT TO REGISTRY</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
