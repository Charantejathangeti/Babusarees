
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { Icons } from '../constants';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, q: number) => void;
  removeFromCart: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateQuantity, removeFromCart }) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.retailPrice * item.quantity), 0);
  const shipping = 150; // Professional flat rate shipping
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-in fade-in bg-[#FDFBF7]">
        <div className="text-stone-200 text-9xl mb-8 flex justify-center"><Icons.ShoppingBag /></div>
        <h2 className="text-3xl font-bold text-stone-800 serif mb-4">Your collection is empty</h2>
        <p className="text-stone-500 mb-10">Look like you haven't added any weaves to your cart yet.</p>
        <Link to="/categories" className="bg-[#064E3B] text-white px-8 py-3 rounded-md font-bold shadow-lg">START BROWSING</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-bold text-stone-800 serif mb-10">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-32 h-40 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#B45309] tracking-widest">{item.brand}</span>
                    <h3 className="text-lg font-bold text-stone-800 serif">{item.name}</h3>
                    <p className="text-xs text-stone-400 mt-1">Fabric: {item.fabric}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-300 hover:text-red-500 transition-colors"
                  >
                    <Icons.X />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center border border-stone-200 rounded-md">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-stone-50 transition-colors"
                    >-</button>
                    <span className="px-3 py-1 text-sm font-bold min-w-[2rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-stone-50 transition-colors"
                    >+</button>
                  </div>
                  <span className="text-lg font-bold text-[#064E3B]">₹{item.retailPrice * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-lg sticky top-28">
            <h3 className="text-xl font-bold text-stone-800 serif mb-6">Order Summary</h3>
            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shipping</span>
                <span className="font-bold">₹{shipping}</span>
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-between">
                <span className="text-lg font-bold text-stone-800 serif">Total</span>
                <span className="text-2xl font-bold text-[#064E3B]">₹{total}</span>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className="w-full block text-center bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-4 rounded-md transition-all shadow-xl"
            >
              PROCEED TO CHECKOUT
            </Link>
            
            <div className="mt-8 flex flex-col items-center gap-4 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
              <div className="flex gap-4">
                <span>Safe & Secure Payments</span>
                <span>•</span>
                <span>100% Authentic</span>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-4 bg-stone-100 rounded"></div>
                <div className="w-8 h-4 bg-stone-100 rounded"></div>
                <div className="w-8 h-4 bg-stone-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
