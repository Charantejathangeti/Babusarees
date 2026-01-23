
import React from 'react';
import { Icons } from '../constants';

interface ContactProps {
  businessInfo: any;
}

const Contact: React.FC<ContactProps> = ({ businessInfo }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-500">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-stone-800 serif mb-6">Get In Touch</h1>
        <p className="text-stone-500 max-w-2xl mx-auto italic text-lg leading-relaxed">
          "We value every thread of conversation. Reach out to us for any inquiries, 
          wholesale orders, or simply to visit our heritage showroom in Tirupati."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div className="animate-in slide-in-from-left-6 duration-700">
          <div className="space-y-12">
            <div className="flex gap-6 group">
              <div className="w-14 h-14 bg-[#800000] text-white flex items-center justify-center rounded-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                📍
              </div>
              <div>
                <h3 className="text-xl font-bold serif text-stone-800 mb-2">Our Store</h3>
                <p className="text-stone-500 leading-relaxed font-medium">{businessInfo.address}</p>
              </div>
            </div>
            <div className="flex gap-6 group">
              <div className="w-14 h-14 bg-[#DAA520] text-white flex items-center justify-center rounded-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                📞
              </div>
              <div>
                <h3 className="text-xl font-bold serif text-stone-800 mb-2">Contact Numbers</h3>
                <div className="space-y-1 text-stone-500 font-medium">
                  {businessInfo.contact.map((num: string) => <p key={num}>{num}</p>)}
                </div>
              </div>
            </div>
            <div className="flex gap-6 group">
              <div className="w-14 h-14 bg-[#006400] text-white flex items-center justify-center rounded-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                ✉️
              </div>
              <div>
                <h3 className="text-xl font-bold serif text-stone-800 mb-2">Email Us</h3>
                <p className="text-stone-500 font-medium">care@babustextiles.com</p>
                <p className="text-stone-500 font-medium">wholesale@babustextiles.com</p>
              </div>
            </div>
          </div>

          <div className="mt-16 h-72 w-full rounded-2xl bg-stone-200 overflow-hidden relative border-4 border-white shadow-xl group">
             <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-bold serif text-center px-10 italic bg-stone-100">
                [ Interactive Google Maps Embed for Tirupati - Gandhi Road ]
             </div>
             <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors pointer-events-none"></div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-stone-100 animate-in slide-in-from-right-6 duration-700">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-lg p-4 focus:ring-1 focus:ring-[#800000] outline-none transition-all" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Phone</label>
                <input type="text" className="w-full bg-stone-50 border-stone-200 rounded-lg p-4 focus:ring-1 focus:ring-[#800000] outline-none transition-all" placeholder="Enter number" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Subject</label>
              <select className="w-full bg-stone-50 border-stone-200 rounded-lg p-4 focus:ring-1 focus:ring-[#800000] outline-none transition-all">
                <option>General Inquiry</option>
                <option>Order Status</option>
                <option>Wholesale Request</option>
                <option>Feedback</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Message</label>
              <textarea className="w-full bg-stone-50 border-stone-200 rounded-lg p-4 focus:ring-1 focus:ring-[#800000] outline-none transition-all" rows={6} placeholder="How can we help you today?"></textarea>
            </div>
            <button className="w-full bg-[#800000] text-white py-5 font-bold rounded-xl shadow-xl hover:bg-[#600000] transition-all tracking-widest uppercase text-sm">SEND MESSAGE</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
