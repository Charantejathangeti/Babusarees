
import React, { useState } from 'react';
import { CartItem, User } from '../types';
import { Icons } from '../constants';

interface CheckoutProps {
  cart: CartItem[];
  user: User | null;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, user }) => {
  const [step, setStep] = useState(1);
  const subtotal = cart.reduce((sum, item) => sum + (item.retailPrice * item.quantity), 0);
  const shipping = 150; // Professional flat rate shipping
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 bg-[#FDFBF7]">
      <div className="lg:w-2/3">
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4">
          {['Information', 'Shipping', 'Payment'].map((s, idx) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step > idx ? 'bg-emerald-900 text-white' : step === idx + 1 ? 'bg-[#064E3B] text-white' : 'bg-stone-200 text-stone-500'}`}>
                {step > idx ? '✓' : idx + 1}
              </div>
              <span className={`ml-2 text-sm font-bold ${step === idx + 1 ? 'text-stone-900' : 'text-stone-400'}`}>{s}</span>
              {idx < 2 && <div className="w-12 h-[2px] bg-stone-100 mx-4"></div>}
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <h2 className="text-2xl font-bold serif mb-8">Shipping Address</h2>
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2">First Name</label>
                  <input type="text" required className="w-full bg-stone-50 border-stone-200 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Last Name</label>
                  <input type="text" required className="w-full bg-stone-50 border-stone-200 rounded-lg p-3" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Address</label>
                  <input type="text" required className="w-full bg-stone-50 border-stone-200 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2">City</label>
                  <input type="text" required className="w-full bg-stone-50 border-stone-200 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Pincode</label>
                  <input type="text" required className="w-full bg-stone-50 border-stone-200 rounded-lg p-3" />
                </div>
                <button className="sm:col-span-2 bg-[#064E3B] text-white py-4 font-bold rounded-lg mt-4 shadow-xl uppercase tracking-widest text-xs">CONTINUE TO SHIPPING</button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <h2 className="text-2xl font-bold serif mb-8">Shipping Method</h2>
              <div className="space-y-4 mb-10">
                <label className="flex items-center justify-between p-6 border-2 border-[#064E3B] bg-stone-50 rounded-xl cursor-pointer">
                  <div className="flex items-center">
                    <input type="radio" checked readOnly className="text-[#064E3B] focus:ring-[#064E3B]" />
                    <div className="ml-4">
                      <p className="font-bold text-stone-800">Standard Professional Delivery</p>
                      <p className="text-xs text-stone-500">Verified heritage transport within 3-5 days</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#064E3B]">₹150</span>
                </label>
                <label className="flex items-center justify-between p-6 border-2 border-stone-100 rounded-xl cursor-pointer opacity-50 grayscale">
                  <div className="flex items-center">
                    <input type="radio" disabled className="text-[#064E3B] focus:ring-[#064E3B]" />
                    <div className="ml-4">
                      <p className="font-bold text-stone-800">Express Luxury Courier</p>
                      <p className="text-xs text-stone-500">Priority handling within 24 hours</p>
                    </div>
                  </div>
                  <span className="font-bold">₹350</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-stone-100 text-stone-600 py-4 font-bold rounded-lg hover:bg-stone-200 uppercase text-xs tracking-widest">BACK</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-[#064E3B] text-white py-4 font-bold rounded-lg shadow-xl uppercase text-xs tracking-widest">CONTINUE TO PAYMENT</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <h2 className="text-2xl font-bold serif mb-8">Payment Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-10">
                <button className="p-4 border-2 border-[#064E3B] rounded-xl flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">💳</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#064E3B]">Secured Card</span>
                </button>
                <button className="p-4 border-2 border-stone-100 rounded-xl flex flex-col items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all">
                  <span className="text-2xl">📱</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Digital UPI</span>
                </button>
              </div>
              <form className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Card Number</label>
                  <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-lg p-3" placeholder="XXXX XXXX XXXX XXXX" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Expiry Date</label>
                    <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-lg p-3" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">CVV Security</label>
                    <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-lg p-3" placeholder="***" />
                  </div>
                </div>
                <button className="w-full bg-[#064E3B] text-white py-4 font-bold rounded-lg shadow-xl text-sm tracking-widest uppercase">AUTHORIZE PAYMENT: ₹{total}</button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="lg:w-1/3">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-md sticky top-28">
          <h3 className="text-xl font-bold serif mb-6">Order Summary</h3>
          <div className="space-y-6 max-h-[300px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-20 rounded border bg-white flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-stone-800 line-clamp-1 italic serif">{item.name}</h4>
                  <p className="text-xs text-stone-500 font-bold uppercase tracking-tighter">Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-[#064E3B] mt-1">₹{item.retailPrice * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-6 border-t border-stone-200">
            <div className="flex justify-between text-stone-500 text-sm">
              <span>Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-500 text-sm">
              <span>Shipping Fee</span>
              <span className="font-bold">₹{shipping}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-stone-800 pt-4 border-t border-stone-200 serif">
              <span>Total</span>
              <span className="text-[#064E3B]">₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
