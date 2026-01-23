
import React, { useState } from 'react';
import { Icons, LoadingSpinner, ErrorAlert } from '../constants';

interface WholesaleProps {
  businessInfo: any;
}

const Wholesale: React.FC<WholesaleProps> = ({ businessInfo }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simulate API call with 20% error chance
    setTimeout(() => {
      if (Math.random() > 0.8) {
        setError("Technical registry error. Please contact heritage support directly.");
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 bg-[#FDFBF7]">
      {/* Hero */}
      <section className="bg-stone-900 text-white py-24 text-center border-b border-[#B45309]/20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold serif mb-6 tracking-tight">Expand Your Legacy <br /> <span className="text-[#B45309]">With Our Weaves</span></h1>
          <p className="text-stone-400 text-lg leading-relaxed italic opacity-80">
            Partner with Babu’s Textiles to feature authentic South Indian handlooms 
            and premium collections at competitive manufacturer tiers.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-8 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-6 flex justify-center text-[#064E3B]">🧵</div>
            <h3 className="text-xl font-bold serif mb-4 text-stone-800">Masterloom Quality</h3>
            <p className="text-sm text-stone-500 leading-relaxed italic">Every weave is verified by master craftsmen before registry exit.</p>
          </div>
          <div className="p-8 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-6 flex justify-center text-[#B45309]">💰</div>
            <h3 className="text-xl font-bold serif mb-4 text-stone-800">Direct Pricing</h3>
            <p className="text-sm text-stone-500 leading-relaxed italic">Direct heritage pricing with high-yield business margins.</p>
          </div>
          <div className="p-8 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-6 flex justify-center text-emerald-800">📦</div>
            <h3 className="text-xl font-bold serif mb-4 text-stone-800">Global Logistics</h3>
            <p className="text-sm text-stone-500 leading-relaxed italic">Secured, insured transport across all metro and rural regions.</p>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 bg-stone-50 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-stone-100">
            <div className="lg:w-1/2 p-12 bg-[#064E3B] text-white flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-bold serif mb-8 tracking-tight">Wholesale Registry</h2>
                <p className="opacity-80 mb-12 italic leading-loose">Submit your business credentials for review by our heritage account directors.</p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors"><Icons.User /></div>
                    <div>
                      <h4 className="font-bold text-[#B45309] uppercase text-[10px] tracking-widest mb-1">Direct Support</h4>
                      <p className="text-xs opacity-70 leading-relaxed">Dedicated account stewards for all premium bulk partners.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors"><Icons.ShoppingBag /></div>
                    <div>
                      <h4 className="font-bold text-[#B45309] uppercase text-[10px] tracking-widest mb-1">Legacy Customization</h4>
                      <p className="text-xs opacity-70 leading-relaxed">Custom weaving patterns available for significant bulk requirements.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-10 border-t border-white/10 text-[11px] font-bold uppercase tracking-widest">
                <p className="mb-4 text-[#B45309]">Wholesale Terminal:</p>
                <p className="opacity-60 mb-6">{businessInfo.address}</p>
                <div className="flex flex-col gap-2">
                  {businessInfo.contact.map((c: string) => <span key={c} className="opacity-90">📞 {c}</span>)}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 p-12">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in">
                  <div className="w-20 h-20 bg-emerald-100 text-[#064E3B] rounded-full flex items-center justify-center text-3xl shadow-sm border border-emerald-200">✓</div>
                  <h3 className="text-2xl font-bold text-stone-800 serif">Inquiry Logged</h3>
                  <p className="text-stone-500 italic">Our account director will contact your business shortly.</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-[#064E3B] font-black uppercase tracking-widest text-[10px] underline mt-4">Submit Additional Record</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {error && <ErrorAlert message={error} />}
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Principal Name</label>
                        <input type="text" required className="w-full bg-stone-50 border-stone-200 rounded-lg p-3 focus:ring-1 focus:ring-[#064E3B] outline-none text-xs font-bold" placeholder="First Name" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Surname</label>
                        <input type="text" required className="w-full bg-stone-50 border-stone-200 rounded-lg p-3 focus:ring-1 focus:ring-[#064E3B] outline-none text-xs font-bold" placeholder="Last Name" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Legal Business Entity</label>
                      <input type="text" required className="w-full bg-stone-50 border-stone-200 rounded-lg p-3 focus:ring-1 focus:ring-[#064E3B] outline-none text-xs font-bold" placeholder="Textiles & Co." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Electronic Mail</label>
                      <input type="email" required className="w-full bg-stone-50 border-stone-200 rounded-lg p-3 focus:ring-1 focus:ring-[#064E3B] outline-none text-xs font-bold" placeholder="office@example.com" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Projected Volume (Monthly)</label>
                      <select className="w-full bg-stone-50 border-stone-200 rounded-lg p-3 focus:ring-1 focus:ring-[#064E3B] outline-none text-[10px] font-black uppercase">
                        <option>50 - 200 units</option>
                        <option>200 - 500 units</option>
                        <option>500 - 1000 units</option>
                        <option>1000+ units</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Specific Requirements</label>
                      <textarea className="w-full bg-stone-50 border-stone-200 rounded-lg p-3 focus:ring-1 focus:ring-[#064E3B] outline-none text-xs font-medium" rows={4} placeholder="Tell us about your heritage requirement..."></textarea>
                    </div>
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-4 rounded-lg transition-all shadow-xl disabled:opacity-70 flex items-center justify-center gap-3 tracking-[0.2em] uppercase text-xs"
                    >
                      {isSubmitting ? <><LoadingSpinner className="scale-50 h-5 w-5" /> VERIFYING...</> : 'SUBMIT REGISTRY REQUEST'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wholesale;
