import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ArrowRight, MapPin, Star, ShoppingCart, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

const BANNERS = [
  {
    title: 'Lowest Prices • Best Quality',
    subtitle: 'Premium Menswear Direct from Stores',
    tagline: 'Casual Shirts, Denim Jeans & Oversized Streetwear',
    bgColor: 'bg-gradient-to-r from-pink-500 via-[#f43397] to-purple-600',
    btnText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Bhongir • Jangaon • Mothkur Branches',
    subtitle: 'Real-time Branch Stock Availability',
    tagline: 'Check stock, select sizes, and order instantly on WhatsApp',
    bgColor: 'bg-gradient-to-r from-blue-600 to-indigo-700',
    btnText: 'View Store Stock',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  }
];

const CIRCLE_CATEGORIES = [
  {
    name: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Trousers',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Cargos',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Ethnic Wear',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=150&q=80',
  }
];

export default function Home() {
  const { products, selectedBranch } = useShop();
  const [activeBanner, setActiveBanner] = useState(0);

  // Filter active products
  const activeProducts = products.filter((p) => p.status === 'active');

  const nextBanner = () => {
    setActiveBanner((prev) => (prev + 1) % BANNERS.length);
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* 1. Circular Categories Nav bar (Meesho / Premium Style) */}
      <div className="bg-white border-b border-border/60 py-4 mb-6 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex justify-start sm:justify-center items-center gap-6 sm:gap-10 min-w-max">
          {CIRCLE_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-all shadow-sm">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors mt-1.5">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 2. Promotional Slider Banner */}
        <section className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md flex items-center bg-card">
          <div className={`absolute inset-0 flex items-center justify-between p-8 sm:p-12 text-white ${BANNERS[activeBanner].bgColor}`}>
            
            {/* Left promo info */}
            <div className="space-y-4 max-w-lg z-10">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] bg-white/20 px-3 py-1 rounded-full font-bold">
                Boran Trends Special
              </span>
              <h2 className="text-xl sm:text-3xl font-black leading-tight">
                {BANNERS[activeBanner].title}
              </h2>
              <p className="text-xs sm:text-sm font-light text-white/95 leading-relaxed">
                {BANNERS[activeBanner].subtitle} <br />
                <span className="font-semibold text-yellow-300">{BANNERS[activeBanner].tagline}</span>
              </p>
              
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1 bg-white text-primary px-5 py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-slate-50 transition-colors"
                >
                  {BANNERS[activeBanner].btnText} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right decorative img */}
            <div className="hidden sm:block w-72 h-56 rounded-xl overflow-hidden border border-white/20 shadow-lg shrink-0">
              <img
                src={BANNERS[activeBanner].image}
                alt="Promo banner display"
                className="h-full w-full object-cover"
              />
            </div>

          </div>

          {/* Banner Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBanner(idx)}
                className={`h-2 w-2 rounded-full transition-all ${
                  activeBanner === idx ? 'bg-white w-5' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </section>

        {/* 3. Info Highlights */}
        <section className="bg-white border border-border/80 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
          <div className="flex items-center gap-3 p-2 border-b md:border-b-0 md:border-r border-border/50">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Free Delivery</h4>
              <p className="text-[10px] text-muted-foreground font-light">Free WhatsApp concierge shipping across regions.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 border-b md:border-b-0 md:border-r border-border/50">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Best Quality</h4>
              <p className="text-[10px] text-muted-foreground font-light">Handpicked cotton, linens, and accessories.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Bespoke Adjustments</h4>
              <p className="text-[10px] text-muted-foreground font-light">In-store custom tailoring alterations at our physical branches.</p>
            </div>
          </div>
        </section>

        {/* 4. Products Feed List Grid */}
        <section className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-black tracking-tight text-foreground">Products For You</h2>
              <p className="text-xs text-muted-foreground font-light">
                Showing all active items in the store. Branch stock: <span className="text-primary font-semibold">{selectedBranch}</span>.
              </p>
            </div>
            <Link to="/shop" className="text-xs font-bold text-primary hover:underline shrink-0">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeProducts.map((prod) => {
              const stockKey = `stock_${selectedBranch.toLowerCase()}`;
              const branchStock = prod[stockKey] || 0;
              const hasStock = branchStock > 0;

              return (
                <div
                  key={prod.id}
                  className="bg-white border border-border/60 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <Link to={`/product/${prod.id}`} className="group flex-grow">
                    <div className="aspect-[3/4] overflow-hidden bg-[#F9FAFB] relative border-b border-border/40">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
                        loading="lazy"
                      />
                      
                      {/* Out of Stock banner */}
                      {!hasStock && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                          <span className="bg-destructive text-destructive-foreground px-2.5 py-1 rounded text-[9px] uppercase tracking-wider font-bold shadow-md">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      {/* Trending Badge */}
                      {prod.is_trending && hasStock && (
                        <span className="absolute top-2.5 left-2.5 bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold shadow">
                          Hot
                        </span>
                      )}

                      {/* Colors Available Badge */}
                      {prod.variants && prod.variants.length > 0 && (
                        <span className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-neutral-800 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border border-border/40">
                          {prod.variants.length} Colors
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-3 sm:p-4 space-y-2">
                    
                    {/* Title */}
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block font-medium">
                        {prod.category}
                      </span>
                      <Link to={`/product/${prod.id}`}>
                        <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 hover:text-primary transition-colors">
                          {prod.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Price details */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-black text-foreground">₹{prod.price.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <span className="inline-flex text-[9px] text-muted-foreground font-light bg-secondary/35 px-1.5 py-0.5 rounded w-fit">
                        Free Delivery
                      </span>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 pt-1.5 border-t border-border/40">
                      <span className="inline-flex items-center gap-0.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        4.3 <Star className="h-2.5 w-2.5 fill-white text-white" />
                      </span>
                      <span className="text-[9px] text-muted-foreground font-light">
                        (42 Reviews)
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </section>

      </div>
    </div>
  );
}
