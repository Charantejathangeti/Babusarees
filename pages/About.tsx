
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <section className="relative h-[40vh] flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=2000&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Weaver working"
        />
        <div className="absolute inset-0 bg-stone-900/60"></div>
        <div className="relative text-center text-white">
          <h1 className="text-5xl font-bold serif mb-4">Our Legacy</h1>
          <p className="text-[#DAA520] tracking-[0.3em] uppercase font-bold text-sm">Crafting Tradition Since 2019</p>
        </div>
      </section>

      <section className="py-24 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold serif text-stone-800 mb-10">Weaving Stories of Heritage</h2>
        <div className="space-y-8 text-stone-600 leading-relaxed text-lg">
          <p>
            Babu’s Textiles began as a small family loom in Tirupati, driven by a passion for preserving 
            the intricate art of South Indian weaving. Today, we stand as a beacon of tradition, 
            connecting hundreds of master weavers with discerning customers across the globe.
          </p>
          <p>
            Our philosophy is simple: Quality over quantity. Every Kanchipuram silk saree, every 
            handloom cotton dhoti, and every set of premium innerwear is treated as a masterpiece. 
            We source only the finest yarns and use traditional dyeing methods that have stood the 
            test of time.
          </p>
          <div className="py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div>
                <span className="block text-4xl font-bold text-[#800000] serif mb-2">5+</span>
                <span className="text-xs uppercase font-bold tracking-widest text-stone-400">Years of Trust</span>
              </div>
              <div>
                <span className="block text-4xl font-bold text-[#800000] serif mb-2">200+</span>
                <span className="text-xs uppercase font-bold tracking-widest text-stone-400">Master Weavers</span>
              </div>
              <div>
                <span className="block text-4xl font-bold text-[#800000] serif mb-2">1M+</span>
                <span className="text-xs uppercase font-bold tracking-widest text-stone-400">Happy Customers</span>
              </div>
              <div>
                <span className="block text-4xl font-bold text-[#800000] serif mb-2">10k+</span>
                <span className="text-xs uppercase font-bold tracking-widest text-stone-400">Unique Designs</span>
              </div>
            </div>
          </div>
          <p>
            Based in the sacred city of Tirupati, we continue to uphold the values of honesty, 
            dedication, and craftsmanship that were instilled by our founders. When you wear 
            Babu’s Textiles, you don’t just wear a piece of clothing; you wear a piece of history.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
