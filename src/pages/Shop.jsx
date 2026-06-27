import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Search, SlidersHorizontal, MapPin, X, ArrowUpDown, Heart } from 'lucide-react';

const CATEGORIES = [
  'All Collections',
  'T-Shirts',
  'Shirts',
  'Jeans',
  'Trousers',
  'Cargos',
  'Ethnic Wear'
];

export default function Shop() {
  const { products, selectedBranch, wishlist, toggleWishlist } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reading filter parameters from URL
  const categoryFilter = searchParams.get('category') || 'All Collections';
  const sortOption = searchParams.get('sort') || 'featured';
  const stockOnlyFilter = searchParams.get('inStock') === 'true';

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync search input with search param on initial render
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Handle parameter changes
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'All Collections') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchQuery);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
  };

  // Filter & Sort Catalog
  const filteredProducts = products
    .filter((prod) => {
      // 1. Status Filter
      if (prod.status !== 'active') return false;

      // 2. Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name?.toLowerCase().includes(query);
        const matchesDesc = prod.description?.toLowerCase().includes(query);
        const matchesCat = prod.category?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // 3. Category Filter
      if (categoryFilter.toLowerCase() !== 'all collections' && prod.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // 4. Branch Stock Filter
      if (stockOnlyFilter) {
        const stockKey = `stock_${selectedBranch.toLowerCase()}`;
        if (!(prod[stockKey] > 0)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'newest') return new Date(b.created_date) - new Date(a.created_date);
      // Default: featured first, then standard sort
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Slogan */}
        <div className="mb-10 text-center sm:text-left space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Shop Our Collection</h1>
          <p className="text-sm text-muted-foreground font-light">
            Currently showing inventory for the <span className="text-primary font-medium">{selectedBranch}</span> store branch.
          </p>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 pb-6 border-b border-border/40">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-80 relative flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 rounded-lg border border-border bg-secondary/15 px-4 pr-10 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <button type="submit" className="absolute right-3 text-muted-foreground hover:text-foreground">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/15 px-4 text-xs font-semibold hover:bg-secondary/40 transition-colors"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" /> Filters
            </button>

            <div className="flex items-center gap-2 relative w-full sm:w-auto">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="h-10 rounded-lg border border-border bg-secondary/15 px-3 py-1.5 text-xs focus:border-primary/50 focus:outline-none cursor-pointer w-full sm:w-44 font-medium"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

        </div>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-6">
            
            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">Categories</h3>
              <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto pr-2 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat)}
                    className={`text-xs text-left px-3 py-2 rounded-lg hover:bg-secondary/40 transition-colors font-medium ${
                      categoryFilter.toLowerCase() === cat.toLowerCase() ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Filter */}
            <div className="space-y-3 pt-4 border-t border-border/40">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">Stock Options</h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground select-none">
                <input
                  type="checkbox"
                  checked={stockOnlyFilter}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : 'false')}
                  className="h-4 w-4 rounded border-border bg-secondary/15 text-primary focus:ring-primary focus:ring-offset-background"
                />
                <span>Available in {selectedBranch}</span>
              </label>
            </div>

            {/* Clear Filters Button */}
            {(categoryFilter !== 'All Collections' || stockOnlyFilter || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2 bg-secondary/20 hover:bg-secondary/40 border border-border text-xs font-semibold rounded-lg text-foreground transition-all mt-4"
              >
                Reset Filters
              </button>
            )}

          </aside>

          {/* Product Grid Area */}
          <main className="flex-grow">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl">
                <p className="text-sm text-muted-foreground">No products found matching your active filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-xs font-semibold text-primary underline"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => {
                  const stockKey = `stock_${selectedBranch.toLowerCase()}`;
                  const branchStock = prod[stockKey] || 0;
                  const isAvailable = branchStock > 0;
                  const wishlisted = wishlist.includes(prod.id);

                  return (
                    <div
                      key={prod.id}
                      className="group flex flex-col bg-card/20 border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all shadow-sm relative"
                    >
                      {/* Wishlist Toggle overlay on image */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(prod.id);
                        }}
                        className="absolute top-3 right-3 h-7.5 w-7.5 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform z-10 focus:outline-none"
                        aria-label="Toggle Wishlist"
                      >
                        <Heart className={`h-4 w-4 transition-colors ${wishlisted ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`} />
                      </button>

                      <Link
                        to={`/product/${prod.id}`}
                        className="flex flex-col flex-grow"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-secondary/15">
                          <img
                            src={prod.images && prod.images[0]}
                            alt={prod.name}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          
                          {/* Status Badges */}
                          {!isAvailable && (
                            <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold">
                              Out of Stock
                            </span>
                          )}
                          {isAvailable && prod.is_new_arrival && (
                            <span className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold">
                              New
                            </span>
                          )}
                          {prod.variants && prod.variants.length > 0 && (
                            <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-neutral-800 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border border-border/40">
                              {prod.variants.length} Colors
                            </span>
                          )}
                        </div>

                        <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-light">
                              {prod.category}
                            </span>
                            <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {prod.name}
                            </h3>
                          </div>

                          {/* Price and Stock Indicators */}
                          <div className="flex flex-col gap-2 pt-1 border-t border-border/20">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground">₹{prod.price.toLocaleString('en-IN')}</span>
                            </div>
                            
                            {/* Stock status detail */}
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                              {isAvailable ? (
                                <span>In Stock: <strong className="text-foreground">{branchStock} left</strong></span>
                              ) : (
                                <span className="text-destructive font-semibold">Out of Stock at {selectedBranch}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Mobile Drawer filter menu */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          
          {/* Overlay backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-80 max-w-xs bg-popover border-l border-border h-full p-6 flex flex-col justify-between z-10 space-y-6 overflow-y-auto">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <h2 className="text-sm font-semibold tracking-wide flex items-center gap-1">
                  <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter Options
                </h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Category Options */}
              <div className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-muted-foreground">Categories</h3>
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        updateFilter('category', cat);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`text-xs text-left px-2 py-1.5 rounded hover:bg-secondary/40 ${
                        categoryFilter.toLowerCase() === cat.toLowerCase() ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Option */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-muted-foreground">Stock Options</h3>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-foreground select-none">
                  <input
                    type="checkbox"
                    checked={stockOnlyFilter}
                    onChange={(e) => {
                      updateFilter('inStock', e.target.checked ? 'true' : 'false');
                      setIsMobileFilterOpen(false);
                    }}
                    className="h-4 w-4 rounded border-border bg-secondary/15 text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <span>Available in {selectedBranch}</span>
                </label>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="pt-6 border-t border-border/40 space-y-2">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2 bg-secondary/20 border border-border text-xs font-semibold rounded-lg text-foreground hover:bg-secondary/40 transition-colors"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shadow-md hover:bg-primary/95 transition-colors"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
