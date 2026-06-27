import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageSquare, Phone, MapPin } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border/80 text-foreground pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-border/50">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="h-9 w-9 rounded-md overflow-hidden border border-border">
                <img src={logoImg} alt="Boran Trends Logo" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-base font-bold text-foreground">
                  Boran Trends
                </span>
                <span className="text-[8px] uppercase tracking-[0.1em] text-primary -mt-0.5 font-bold">
                  Online Fashion Store
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              We offer the finest collection of premium menswear, shirts, denim jeans, custom co-ord sets, and modern streetwear, available across our physical branches in Bhongir, Jangaon, and Mothkur.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/boran_trends"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-[#F9FAFB] text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://wa.me/917989163216"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-[#F9FAFB] text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Collection links */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Browse Categories
            </h3>
            <ul className="space-y-2 text-xs font-light text-muted-foreground">
              <li>
                <Link to="/shop" className="hover:text-primary transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Shirts" className="hover:text-primary transition-colors">
                  Shirts Collection
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Jeans" className="hover:text-primary transition-colors">
                  Jeans & Denim
                </Link>
              </li>
              <li>
                <Link to="/shop?category=T-Shirts" className="hover:text-primary transition-colors">
                  Oversized T-Shirts
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop locations */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Our Stores
            </h3>
            <ul className="space-y-2 text-xs font-light text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" /> Bhongir Store
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" /> Jangaon Store
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" /> Mothkur Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Customer Support
            </h3>
            <ul className="space-y-2 text-xs font-light text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact & Feedback
                </Link>
              </li>

              <li>
                <a href="#privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1">
                  Staff Admin Portal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} Boran Trends. All Rights Reserved. Made for Indian Fashion.
          </p>
          <div className="flex gap-2 text-[10px] text-muted-foreground">
            <span>Bhongir • Jangaon • Mothkur Boutiques</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
