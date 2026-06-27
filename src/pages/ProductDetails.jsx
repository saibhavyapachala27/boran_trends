import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { MapPin, ShoppingBag, MessageSquare, ArrowLeft, Star, Heart, Check, X } from 'lucide-react';

const BRANCH_LABELS = {
  Bhongir: 'stock_bhongir',
  Jangaon: 'stock_jangaon',
  Mothkur: 'stock_mothkur',
};

// CSS color map for dot display
const COLOR_CLASSES = {
  white: '#ffffff',
  black: '#101010',
  beige: '#f5f5dc',
  olive: '#556b2f',
  navy: '#000080',
  grey: '#808080',
  gray: '#808080',
  blue: '#4169e1',
  green: '#2e8b57',
  cream: '#fffdd0',
  brown: '#8b4513',
  khaki: '#f0e68c',
  mustard: '#ffdb58',
  'rust orange': '#b7410e',
  'sage green': '#9caf88',
  'dark brown': '#5c4033',
  'olive green': '#556b2f',
  'dark green': '#013220',
  maroon: '#800000',
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    selectedBranch, 
    addItem, 
    generateProductWhatsAppURL,
    wishlist,
    toggleWishlist,
    getLastCheckoutDetails
  } = useShop();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4 px-4">
        <h1 className="text-xl font-bold">Product Not Found</h1>
        <p className="text-sm text-muted-foreground">The product catalog item does not exist or has been removed.</p>
        <Link to="/shop" className="text-xs font-semibold text-primary underline">
          Return to Shop Collection
        </Link>
      </div>
    );
  }

  // State selectors
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Modal checkout states
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutLocation, setCheckoutLocation] = useState('');

  // Filter similar products (same category, excluding self)
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === 'active')
    .slice(0, 4);

  const activeVariant = product.variants ? product.variants.find((v) => v.color === selectedColor) : null;

  const getBranchStock = (branchName) => {
    const key = BRANCH_LABELS[branchName];
    if (activeVariant) {
      return activeVariant[key] || 0;
    }
    return product[key] || 0;
  };

  const currentBranchStock = getBranchStock(selectedBranch);
  const isAvailableInSelectedBranch = currentBranchStock > 0;
  const wishlisted = wishlist.includes(product.id);

  // Add to Bag action
  const handleAddToBag = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Instant checkout via WhatsApp action: prompt for name and location
  const handleOrderWhatsApp = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    const saved = getLastCheckoutDetails();
    setCheckoutName(saved.name || '');
    setCheckoutLocation(saved.address || '');
    setShowBuyModal(true);
  };

  const handleConfirmWhatsAppOrder = (e) => {
    e.preventDefault();
    if (!checkoutName.trim() || !checkoutLocation.trim()) {
      alert('Please fill in your name and delivery address/location.');
      return;
    }

    // 1. Save inputs to storage first so generateProductWhatsAppURL reads the updated details
    const saved = getLastCheckoutDetails();
    localStorage.setItem(
      'boran_last_checkout',
      JSON.stringify({
        ...saved,
        name: checkoutName.trim(),
        address: checkoutLocation.trim()
      })
    );

    // 2. Generate and open URL
    const url = generateProductWhatsAppURL(product, selectedSize, selectedColor, quantity);
    const newWindow = window.open(url, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }

    // 3. Close modal
    setShowBuyModal(false);
  };

  const getHexColor = (colorName) => {
    if (!colorName) return '#808080';
    const clean = colorName.toLowerCase().trim();
    return COLOR_CLASSES[clean] || '#808080';
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8 focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>

        {/* Product Details Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image Viewer */}
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-secondary/15 border border-border/50 relative">
              <img
                src={activeVariant ? activeVariant.image : (product.images && product.images[activeImageIndex])}
                alt={activeVariant ? `${product.name} - ${selectedColor}` : product.name}
                className="h-full w-full object-cover object-center"
              />
              
              {/* Overlay Stock Warning */}
              {!isAvailableInSelectedBranch && (
                <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded text-xs uppercase tracking-wider font-bold shadow-lg">
                  Out of Stock at {selectedBranch}
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {product.variants ? (
                  product.variants.map((v) => (
                    <button
                      key={v.color}
                      onClick={() => {
                        setSelectedColor(v.color);
                      }}
                      className={`relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-secondary/15 transition-all ${
                        selectedColor === v.color ? 'border-primary' : 'border-border/60 hover:border-border'
                      }`}
                    >
                      <img src={v.image} alt={`${product.name} - ${v.color}`} className="h-full w-full object-cover object-center" />
                    </button>
                  ))
                ) : (
                  product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-secondary/15 transition-all ${
                        activeImageIndex === idx ? 'border-primary' : 'border-border/60 hover:border-border'
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${idx}`} className="h-full w-full object-cover object-center" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Controls */}
          <div className="space-y-6">
            
            {/* Title & Slogan */}
            <div className="space-y-2">
              <span className="text-xs text-primary font-semibold uppercase tracking-widest block">
                {product.category}
              </span>
              <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {product.name} {selectedColor && ` - ${selectedColor}`}
              </h1>
              
              {/* Stars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="text-xs text-muted-foreground ml-2">(Verified Collection)</span>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="flex items-baseline gap-3.5 pb-6 border-b border-border/40">
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Sizes Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Size</span>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 min-w-10 px-3 flex items-center justify-center rounded-md border text-xs font-semibold tracking-wide transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary'
                          : 'border-border/80 bg-secondary/10 text-foreground hover:bg-secondary/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Color: <strong className="text-foreground">{selectedColor}</strong></span>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative h-7 w-7 rounded-full border border-border hover:scale-105 transition-all flex items-center justify-center`}
                      style={{ backgroundColor: getHexColor(color) }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <Check className="h-3.5 w-3.5 text-foreground drop-shadow" style={{ color: color.toLowerCase() === 'white' ? '#101010' : '#ffffff' }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity</span>
              <div className="flex items-center gap-1.5 w-32 rounded-lg border border-border bg-secondary/15 px-1 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-7 w-7 rounded flex items-center justify-center text-sm hover:bg-secondary/50 font-bold"
                >
                  -
                </button>
                <span className="flex-grow text-center text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-7 w-7 rounded flex items-center justify-center text-sm hover:bg-secondary/50 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Product description */}
            <div className="space-y-2.5 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</span>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Availability Detail Grid */}
            <div className="rounded-xl border border-border bg-secondary/10 p-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Branch Availability
              </span>
              <div className="grid grid-cols-3 gap-3 text-center">
                {['Bhongir', 'Jangaon', 'Mothkur'].map((branch) => {
                  const stock = getBranchStock(branch);
                  const active = branch === selectedBranch;

                  return (
                    <div 
                      key={branch} 
                      className={`rounded-lg p-3 border transition-colors ${
                        active ? 'border-primary/40 bg-primary/5' : 'border-border/40 bg-background/30'
                      }`}
                    >
                      <h4 className="text-xs font-semibold text-foreground">{branch}</h4>
                      <div className="mt-1">
                        {stock > 0 ? (
                          <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
                            {stock} available
                          </span>
                        ) : (
                          <span className="text-[10px] text-destructive font-bold bg-destructive/10 px-2 py-0.5 rounded-full">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Checkout CTA Buttons */}
            <div className="flex items-center gap-3 pt-6 border-t border-border/40">
              
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`h-12 w-12 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
                  wishlisted
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'border-border bg-secondary/10 text-muted-foreground hover:bg-secondary/35'
                }`}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? 'fill-destructive' : ''}`} />
              </button>

              <button
                onClick={handleAddToBag}
                disabled={!isAvailableInSelectedBranch}
                className={`flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all ${
                  !isAvailableInSelectedBranch
                    ? 'bg-secondary/40 text-muted-foreground border border-border cursor-not-allowed'
                    : isAdded
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                    : 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10'
                }`}
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {isAdded ? 'Added to Bag!' : 'Add to Shopping Bag'}
              </button>

              <button
                onClick={handleOrderWhatsApp}
                className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 text-primary bg-primary/5 hover:bg-primary/15 transition-all text-sm font-semibold"
              >
                <MessageSquare className="h-4.5 w-4.5" /> Buy via WhatsApp
              </button>
            </div>

          </div>

        </div>

        {/* Similar Products Carousel */}
        {similarProducts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-border/40">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-8">Similar Collections</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((prod) => {
                const stockKey = `stock_${selectedBranch.toLowerCase()}`;
                const hasStock = prod[stockKey] > 0;

                return (
                  <Link
                    key={prod.id}
                    to={`/product/${prod.id}`}
                    onClick={() => {
                      // Reset details page scroll
                      window.scrollTo(0, 0);
                      setSelectedSize(prod.sizes[0] || '');
                      setSelectedColor(prod.colors[0] || '');
                      setActiveImageIndex(0);
                      setQuantity(1);
                    }}
                    className="group flex flex-col bg-card/20 border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-secondary/15">
                      <img
                        src={prod.images && prod.images[0]}
                        alt={prod.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      {!hasStock && (
                        <span className="absolute top-2.5 left-2.5 bg-destructive text-destructive-foreground px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block font-light">
                          {prod.category}
                        </span>
                        <h3 className="font-semibold text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {prod.name}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-foreground">₹{prod.price.toLocaleString('en-IN')}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Quick WhatsApp checkout details prompt */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
          
          <div className="relative w-full max-w-md bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
              <h2 className="text-base font-bold tracking-wide">
                Confirm Delivery Details
              </h2>
              <button onClick={() => setShowBuyModal(false)} className="text-muted-foreground hover:text-foreground focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmWhatsAppOrder} className="space-y-4">
              <p className="text-xs text-muted-foreground font-light mb-4">
                Please confirm your name and delivery address/location details so we can add them to your WhatsApp checkout message.
              </p>
              
              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Satish Kumar"
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] px-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Delivery Address / Location *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="e.g. Street Name, Landmark, Town/City"
                  value={checkoutLocation}
                  onChange={(e) => setCheckoutLocation(e.target.value)}
                  className="w-full rounded-lg border border-border bg-[#F9FAFB] p-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBuyModal(false)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-secondary text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" /> Proceed to WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
