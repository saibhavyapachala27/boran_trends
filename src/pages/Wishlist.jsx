import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, products, toggleWishlist, addItem, selectedBranch } = useShop();

  // Find actual product details for all wishlisted product IDs
  const wishlistedItems = products.filter((p) => wishlist.includes(p.id) && p.status === 'active');

  const handleMoveToBag = (product) => {
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || 'Black';
    addItem(product, defaultSize, defaultColor, 1);
    // Remove from wishlist once added to bag
    toggleWishlist(product.id);
  };

  if (wishlistedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-6 px-4">
        <div className="h-16 w-16 rounded-full bg-secondary/15 flex items-center justify-center text-muted-foreground border border-border/40">
          <Heart className="h-7 w-7 text-muted-foreground/60" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="font-display text-xl font-bold tracking-wide">Your Wishlist is Empty</h1>
          <p className="text-sm text-muted-foreground max-w-xs font-light">
            Bookmark your favorite premium menswear pieces to keep track of them here.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md"
        >
          Discover Styles <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-sans text-2xl font-black tracking-tight mb-10 text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
          <Heart className="h-6 w-6 text-primary fill-primary" /> My Wishlist ({wishlistedItems.length} items)
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistedItems.map((prod) => {
            const stockKey = `stock_${selectedBranch.toLowerCase()}`;
            const branchStock = prod[stockKey] || 0;
            const isAvailable = branchStock > 0;

            return (
              <div
                key={prod.id}
                className="bg-white border border-border/60 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary/15 group">
                  <Link to={`/product/${prod.id}`}>
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
                    />
                  </Link>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-2.5 right-2.5 h-8 w-8 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center text-destructive shadow hover:bg-white transition-all focus:outline-none"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {!isAvailable && (
                    <span className="absolute bottom-2.5 left-2.5 bg-destructive text-destructive-foreground px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold shadow-md">
                      Out of stock
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider block font-medium">
                      {prod.category}
                    </span>
                    <Link to={`/product/${prod.id}`}>
                      <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 hover:text-primary transition-colors">
                        {prod.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-1.5 pt-1">
                      <span className="text-sm font-bold text-foreground">₹{prod.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToBag(prod)}
                    disabled={!isAvailable}
                    className={`w-full h-9 inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
                      isAvailable
                        ? 'bg-primary text-primary-foreground hover:bg-primary/95'
                        : 'bg-secondary/40 text-muted-foreground border border-border/80 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Move to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
