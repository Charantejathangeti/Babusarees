
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';
import { Icons, LoadingSpinner } from '../constants';

interface AIStylistProps {
  products: Product[];
}

const AIStylist: React.FC<AIStylistProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Namaskaram! I am your Heritage Assistant. Looking for a specific weave or a gift for a special occasion?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;

    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setQuery('');
    setIsTyping(true);

    try {
      // Fix: Follow initialization guidelines strictly
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const catalogSummary = products.map(p => 
        `- ${p.name} (${p.category}) by ${p.brand}: ₹${p.offerPrice || p.retailPrice}. Desc: ${p.description}`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are a high-end personal shopper and fashion consultant for "Babu's Textiles", an authentic South Indian handloom store in Tirupati. 
          Use the following product catalog to make recommendations:
          ${catalogSummary}
          
          Rules:
          1. Be polite, professional, and use a bit of traditional South Indian warmth (e.g., Namaskaram).
          2. If the user asks for a price range, only suggest products fitting that range.
          3. Recommend 2-3 specific items from the catalog.
          4. Keep responses concise and focused on the heritage quality of the fabrics.`,
          temperature: 0.7,
        },
      });

      // Fix: Use .text property directly as per instructions (not a method call)
      const aiResponse = response.text || "I apologize, I'm having trouble accessing our registry right now. Please browse our collections manually.";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Our digital registry is temporarily offline. Please reach us via WhatsApp for personal assistance." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[200] bg-[#B45309] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <div className="absolute -top-12 right-0 bg-white text-stone-800 text-[8px] font-black py-1 px-3 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity border border-stone-100 shadow-sm whitespace-nowrap tracking-widest uppercase">
          Style Assistant
        </div>
        <Icons.ShoppingBag />
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="bg-[#064E3B] text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black serif uppercase tracking-tighter">Heritage Assistant</h3>
                <p className="text-[8px] font-black text-[#DAA520] uppercase tracking-[0.3em]">AI-Powered Personalized Styling</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 transition-colors">
                <Icons.X />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 text-xs font-medium leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-[#064E3B] text-white rounded-l-xl rounded-tr-xl' 
                      : 'bg-white text-stone-700 border border-stone-100 rounded-r-xl rounded-tl-xl'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-r-xl rounded-tl-xl border border-stone-100 shadow-sm">
                    <LoadingSpinner />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-stone-100 bg-white">
              <form onSubmit={handleAskAI} className="flex gap-2">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask for recommendations..."
                  className="flex-grow bg-stone-50 border border-stone-200 p-3 text-xs font-bold outline-none focus:border-[#064E3B] transition-all"
                />
                <button 
                  type="submit"
                  disabled={isTyping}
                  className="bg-[#064E3B] text-white p-3 hover:bg-[#B45309] transition-all disabled:opacity-30"
                >
                  <Icons.ArrowRight />
                </button>
              </form>
              <p className="text-[7px] text-stone-300 text-center mt-3 uppercase font-black tracking-widest">Powered by Babu's Heritage Intelligence</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIStylist;
