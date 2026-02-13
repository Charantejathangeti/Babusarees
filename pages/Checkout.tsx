
import React, { useState } from 'react';
import { CartItem, User } from '../types';
import { Icons, BUSINESS_INFO } from '../constants';

interface CheckoutProps {
  cart: CartItem[];
  user: User | null;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, user }) => {
  const [step, setStep] = useState(1);
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + ((item.offerPrice || item.retailPrice) * item.quantity), 0);
  const shipping = 150; 
  const total = subtotal + shipping;

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    setShippingDetails({
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      pincode: formData.get('pincode') as string,
      phone: formData.get('phone') as string || '',
    });
    setStep(2);
  };

  const generateWhatsAppLink = () => {
    let contactNumber = BUSINESS_INFO.contact[0].replace(/\s/g, '');
    if (contactNumber.length === 10) contactNumber = '91' + contactNumber;
    
    const itemSummary = cart.map(item => `✨ *${item.name}* (Qty: ${item.quantity}) - ₹${((item.offerPrice || item.retailPrice) * item.quantity).toLocaleString()}`).join('%0A');
    
    const message = `🏛️ *NEW HERITAGE ORDER MANIFEST*%0A%0A` +
      `👤 *Customer:* ${shippingDetails.firstName} ${shippingDetails.lastName}%0A` +
      `📍 *Address:* ${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.pincode}%0A` +
      `📞 *Phone:* ${shippingDetails.phone}%0A%0A` +
      `📜 *Order Details:*%0A${itemSummary}%0A%0A` +
      `💰 *Subtotal:* ₹${subtotal.toLocaleString()}%0A` +
      `🚚 *Shipping:* ₹${shipping.toLocaleString()}%0A` +
      `💎 *TOTAL PAYABLE:* ₹${total.toLocaleString()}%0A%0A` +
      `Please verify this manifest and provide payment instructions. Thank you!`;

    return `https://wa.me/${contactNumber}?text=${message}`;
  };

  const handleWhatsAppConfirm = () => {
    const url = generateWhatsAppLink();
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 bg-[#FDFBF7]">
      <div className="lg:w-2/3">
        {/* Step Progress */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {['Information', 'Shipping', 'Confirmation'].map((s, idx) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${step > idx ? 'bg-emerald-900 text-white' : step === idx + 1 ? 'bg-[#064E3B] text-white' : 'bg-stone-200 text-stone-500'}`}>
                {step > idx ? '✓' : idx + 1}
              </div>
              <span className={`ml-2 text-[10px] font-black uppercase tracking-widest ${step === idx + 1 ? 'text-stone-900' : 'text-stone-400'}`}>{s}</span>
              {idx < 2 && <div className="w-12 h-[2px] bg-stone-100 mx-4"></div>}
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-none border border-stone-200 shadow-sm">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-2xl font-bold serif mb-8 uppercase text-stone-800 tracking-tight">Delivery Registry</h2>
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleInfoSubmit}>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">First Name</label>
                  <input name="firstName" type="text" required defaultValue={shippingDetails.firstName} className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] font-bold outline-none focus:border-[#064E3B]" placeholder="First Name" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Last Name</label>
                  <input name="lastName" type="text" required defaultValue={shippingDetails.lastName} className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] font-bold outline-none focus:border-[#064E3B]" placeholder="Last Name" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Full Delivery Address</label>
                  <input name="address" type="text" required defaultValue={shippingDetails.address} className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] font-bold outline-none focus:border-[#064E3B]" placeholder="Street, Locality, House No." />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">City / District</label>
                  <input name="city" type="text" required defaultValue={shippingDetails.city} className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] font-bold outline-none focus:border-[#064E3B]" placeholder="City" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Pincode</label>
                  <input name="pincode" type="text" required defaultValue={shippingDetails.pincode} className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] font-bold outline-none focus:border-[#064E3B]" placeholder="6 Digit Code" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Contact Number</label>
                  <input name="phone" type="tel" required defaultValue={shippingDetails.phone} className="w-full bg-stone-50 border border-stone-100 p-4 text-[11px] font-bold outline-none focus:border-[#064E3B]" placeholder="10 Digit Mobile" />
                </div>
                <button type="submit" className="sm:col-span-2 bg-[#064E3B] text-white py-5 font-black shadow-xl uppercase tracking-[0.2em] text-[10px] hover:bg-[#B45309] transition-all active:scale-95">CONTINUE TO SHIPPING</button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-2xl font-bold serif mb-8 uppercase text-stone-800 tracking-tight">Shipping Method</h2>
              <div className="space-y-4 mb-10">
                <label className="flex items-center justify-between p-6 border-2 border-[#064E3B] bg-emerald-50/30 cursor-pointer transition-all">
                  <div className="flex items-center">
                    <input type="radio" checked readOnly className="text-[#064E3B] focus:ring-[#064E3B]" />
                    <div className="ml-4">
                      <p className="font-black text-stone-800 text-[11px] uppercase tracking-widest">Standard Professional Delivery</p>
                      <p className="text-[10px] text-stone-500 font-medium italic">Verified heritage transport within 3-5 days</p>
                    </div>
                  </div>
                  <span className="font-black text-[#064E3B] text-sm">₹150</span>
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setStep(1)} className="sm:flex-1 bg-stone-100 text-stone-500 py-5 font-black uppercase text-[10px] tracking-widest hover:bg-stone-200 transition-all border border-stone-200">BACK</button>
                <button onClick={() => setStep(3)} className="sm:flex-1 bg-[#064E3B] text-white py-5 font-black uppercase tracking-widest hover:bg-[#B45309] transition-all shadow-xl">PROCEED TO CONFIRM</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 text-center py-10">
               <div className="w-20 h-20 bg-emerald-50 text-[#064E3B] rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                 <span className="text-3xl">🏛️</span>
               </div>
               <h2 className="text-3xl font-bold serif text-stone-800 mb-4 uppercase tracking-tight">Confirm Order Manifest</h2>
               <p className="text-stone-500 italic max-w-md mx-auto mb-10 text-sm">Your selection from the master registry is ready. Finalize your purchase via our secured WhatsApp gateway.</p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button onClick={() => setStep(2)} className="px-10 py-4 border border-stone-200 text-stone-400 font-black uppercase text-[10px] tracking-widest hover:bg-stone-50">REVIEW</button>
                 <button onClick={handleWhatsAppConfirm} className="px-10 py-4 bg-[#25D366] text-white font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                   FINAL CONFIRMATION ON WHATSAPP
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:w-1/3">
        <div className="bg-white p-6 border border-stone-200 shadow-sm sticky top-28">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-4 mb-6">Order Summary</h3>
           <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
             {cart.map(item => (
               <div key={item.id} className="flex justify-between items-start gap-4">
                 <div className="flex gap-3">
                    <div className="w-10 h-12 bg-stone-50 border border-stone-100 flex-shrink-0">
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-stone-800 line-clamp-1">{item.name}</p>
                      <p className="text-[7px] text-stone-400 uppercase font-bold">Qty: {item.quantity}</p>
                    </div>
                 </div>
                 <span className="text-[9px] font-black text-stone-900 shrink-0">₹{((item.offerPrice || item.retailPrice) * item.quantity).toLocaleString()}</span>
               </div>
             ))}
           </div>
           
           <div className="space-y-2 pt-6 border-t border-stone-100">
              <div className="flex justify-between text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                <span>Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[14px] font-black text-[#064E3B] uppercase tracking-tighter pt-2 border-t border-stone-50">
                <span>Total Payable</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
           </div>
           
           <div className="mt-8 p-4 bg-stone-50 border border-stone-100">
              <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">MASTER REGISTRY INFO</p>
              <div className="space-y-1 text-[7px] font-bold text-stone-500 uppercase">
                <p>Authenticity Guaranteed: Yes</p>
                <p>Heritage Grade: Premium</p>
                <p>Payment Mode: Direct WhatsApp</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
