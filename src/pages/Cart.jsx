import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, MessageSquare, ShoppingBag, MapPin, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { 
    cart, 
    selectedBranch, 
    updateQuantity, 
    removeItem, 
    total, 
    generateWhatsAppURL,
    getLastCheckoutDetails,
    placeMockOrder,
    customer
  } = useShop();

  const navigate = useNavigate();

  // Load defaults from previous purchases
  const savedDetails = getLastCheckoutDetails();

  // Customer checkout form state
  const [formData, setFormData] = useState({
    name: savedDetails.name || '',
    phone: savedDetails.phone || '',
    email: savedDetails.email || '',
    address: savedDetails.address || '',
    location: '',
  });

  // Sync state if cached details load late
  useEffect(() => {
    const freshDetails = getLastCheckoutDetails();
    setFormData((prev) => ({
      ...prev,
      name: prev.name || freshDetails.name,
      phone: prev.phone || freshDetails.phone,
      email: prev.email || freshDetails.email,
      address: prev.address || freshDetails.address,
    }));
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // 1. Save to mock orders database and clear cart
    const orderId = placeMockOrder(
      formData.name,
      formData.phone,
      formData.email,
      formData.address,
      formData.location
    );

    // 2. Generate WhatsApp checkout link and open in new tab
    const url = generateWhatsAppURL(
      formData.name,
      formData.phone,
      formData.email,
      formData.address,
      formData.location,
      orderId
    );
    const newWindow = window.open(url, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }

    // 3. Redirect user to home screen
    alert('Thank you! Your order draft has been generated. Please send the message on WhatsApp to confirm your order with us.');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-6 px-4">
        <div className="h-16 w-16 rounded-full bg-secondary/15 flex items-center justify-center text-muted-foreground border border-border/40">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="font-display text-xl font-bold tracking-wide">Your Bag is Empty</h1>
          <p className="text-sm text-muted-foreground max-w-xs font-light">
            You haven't added any products to your shopping bag yet.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md"
        >
          Explore Collection <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-sans text-2xl font-black tracking-tight mb-10 text-center sm:text-left">
          Shopping Bag ({cart.length} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Cart Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.product_id}-${item.size}-${item.color}`}
                className="flex gap-4 p-4 rounded-xl border border-border bg-white shadow-xs"
              >
                {/* Image */}
                <div className="h-24 w-20 rounded-lg overflow-hidden bg-[#F9FAFB] flex-shrink-0 border border-border/40">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col justify-between space-y-1">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">
                      {item.product_name}
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-muted-foreground font-light">
                      <span>Size: <strong className="text-foreground">{item.size}</strong></span>
                      {item.color && (
                        <span>Color: <strong className="text-foreground">{item.color}</strong></span>
                      )}
                      <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5 text-primary" /> {selectedBranch}</span>
                    </div>
                  </div>

                  {/* Quantity & Price controls */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 w-24 rounded-md border border-border bg-secondary/10 px-0.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)}
                        className="h-6 w-6 flex items-center justify-center text-xs hover:bg-secondary/40 font-bold"
                      >
                        -
                      </button>
                      <span className="flex-grow text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)}
                        className="h-6 w-6 flex items-center justify-center text-xs hover:bg-secondary/40 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => removeItem(item.product_id, item.size, item.color)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Checkout Form (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Price Summary */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground pb-2 border-b border-border/40">
                Price Details
              </h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-light">Product Subtotal</span>
                <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-light">Store Branch</span>
                <span className="font-semibold text-primary">{selectedBranch}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-light">Delivery Fee</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
              <div className="border-t border-border/40 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold text-foreground">Order Total</span>
                <span className="text-xl font-black text-foreground">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Delivery/Customer Form */}
            <form onSubmit={handleCheckout} className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground pb-2 border-b border-border/40">
                Delivery Details
              </h2>
              
              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Satish Kumar"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] px-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">WhatsApp Mobile *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] px-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. customer@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] px-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Full Delivery Address *</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  placeholder="Street, Landmark, City name"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border bg-[#F9FAFB] p-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Google Maps Pin / Notes (Optional)</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Link or specific instructions"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] px-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold shadow-md transition-colors mt-4"
              >
                <MessageSquare className="h-4.5 w-4.5" /> Order via WhatsApp
              </button>
            </form>

            <p className="text-[10px] text-muted-foreground text-center font-light leading-relaxed">
              * By clicking the checkout button, you will be redirected to WhatsApp. Our support concierge will verify size stock and arrange delivery details.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}
