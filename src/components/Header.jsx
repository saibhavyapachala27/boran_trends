import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, MapPin, Search, User, LogOut, ChevronDown, Award, Heart } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

const BRANCHES = ['Bhongir', 'Jangaon', 'Mothkur'];
const QUICK_CATEGORIES = [
  'T-Shirts',
  'Shirts',
  'Jeans',
  'Trousers',
  'Cargos',
  'Ethnic Wear'
];

export default function Header() {
  const { selectedBranch, setSelectedBranch, itemCount, customer, logoutCustomer, wishlist } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setIsBranchOpen(false);
  };

  const handleQuickCategorySelect = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const isAdminAuthenticated = localStorage.getItem('boran_admin_auth') === 'true';

  const handleAdminLogout = () => {
    localStorage.removeItem('boran_admin_auth');
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="w-full bg-white border-b border-border/80 sticky top-0 z-50 shadow-sm">
      
      {/* Top Bar / Brand header */}
      <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between gap-4">
        
        {/* Logo and Name */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-11 w-11 rounded-lg overflow-hidden border border-border shadow-sm">
            <img src={logoImg} alt="Boran Trends Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xl font-extrabold tracking-wide text-foreground group-hover:text-primary transition-colors">
              Boran Trends
            </span>
            <span className="text-[10px] tracking-[0.1em] text-primary uppercase font-bold -mt-0.5">
              Online Fashion
            </span>
          </div>
        </Link>

        {/* Center Search Input */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-lg relative items-center">
          <div className="absolute left-3.5 text-muted-foreground">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Try shirts, jeans, or oversized t-shirts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-lg border border-border bg-[#F9FAFB] text-sm font-light text-foreground focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-inner"
          />
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          
          {/* Branch Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsBranchOpen(!isBranchOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-border/70 hover:border-primary/40 bg-secondary/20 px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none transition-colors"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span>{selectedBranch}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {isBranchOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsBranchOpen(false)} />
                <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg border border-border bg-popover p-1 shadow-lg z-20">
                  {BRANCHES.map((b) => (
                    <button
                      key={b}
                      onClick={() => handleBranchSelect(b)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-secondary hover:text-primary ${
                        selectedBranch === b ? 'text-primary font-bold bg-secondary/50' : 'text-foreground'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5 text-foreground" />
            <span className="text-[10px] mt-0.5 font-medium">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5 text-foreground" />
            <span className="text-[10px] mt-0.5 font-medium">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Account / Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors focus:outline-none p-1"
            >
              <User className="h-5 w-5 text-foreground" />
              <span className="text-[10px] mt-0.5 font-medium">Profile</span>
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-popover p-2 shadow-xl z-20 space-y-1">
                  
                  {isAdminAuthenticated ? (
                    <div className="px-3 py-2 border-b border-border/40">
                      <p className="text-xs text-muted-foreground font-light">Admin Session</p>
                      <p className="text-xs font-bold text-primary">Logged in as Administrator</p>
                    </div>
                  ) : customer.loggedIn ? (
                    <div className="px-3 py-2 border-b border-border/40">
                      <p className="text-xs text-muted-foreground font-light">Welcome,</p>
                      <p className="text-sm font-bold text-foreground line-clamp-1">{customer.email}</p>
                    </div>
                  ) : (
                    <div className="px-3 py-2 border-b border-border/40">
                      <p className="text-xs text-muted-foreground">Welcome to Boran Trends</p>
                      <Link
                        to="/login"
                        onClick={() => setIsProfileOpen(false)}
                        className="mt-2 w-full h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-colors"
                      >
                        Login / Sign Up
                      </Link>
                    </div>
                  )}



                  {customer.loggedIn && !isAdminAuthenticated && (
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs hover:bg-secondary hover:text-primary transition-colors text-foreground"
                    >
                      My Profile Details
                    </Link>
                  )}

                  {isAdminAuthenticated && (
                    <Link
                      to="/admin/products"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold hover:bg-secondary hover:text-primary transition-colors text-primary"
                    >
                      Staff Admin Dashboard
                    </Link>
                  )}

                  {customer.loggedIn && !isAdminAuthenticated && (
                    <button
                      onClick={() => {
                        logoutCustomer();
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  )}

                  {isAdminAuthenticated && (
                    <button
                      onClick={handleAdminLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left font-semibold"
                    >
                      <LogOut className="h-4 w-4" /> Log Out Admin
                    </button>
                  )}

                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Categories Sub-Navbar */}
      <div className="w-full border-t border-border/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-center md:justify-start gap-6 overflow-x-auto no-scrollbar">
          <Link
            to="/shop"
            className={`text-xs font-semibold tracking-wide hover:text-primary shrink-0 transition-colors ${
              location.pathname === '/shop' && !location.search ? 'text-primary border-b-2 border-primary py-2.5' : 'text-muted-foreground'
            }`}
          >
            All Collections
          </Link>
          {QUICK_CATEGORIES.map((cat) => {
            const active = location.search.includes(`category=${encodeURIComponent(cat)}`);
            return (
              <button
                key={cat}
                onClick={() => handleQuickCategorySelect(cat)}
                className={`text-xs font-semibold tracking-wide hover:text-primary shrink-0 transition-colors py-2.5 ${
                  active ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
