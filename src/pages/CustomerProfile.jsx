import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { User, Phone, MapPin, Check, Save, LogOut, ShoppingBag } from 'lucide-react';

export default function CustomerProfile() {
  const { customer, logoutCustomer, getLastCheckoutDetails, cart, orders, updateOrderStatus } = useShop();
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!customer.loggedIn) {
      navigate('/login');
    }
  }, [customer, navigate]);

  // Load last checkout details to serve as profile defaults
  const savedDetails = getLastCheckoutDetails();

  const [formData, setFormData] = useState({
    name: savedDetails.name || '',
    phone: savedDetails.phone || '',
    address: savedDetails.address || '',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Save to local storage
    localStorage.setItem(
      'boran_last_checkout',
      JSON.stringify({ name: formData.name, phone: formData.phone, address: formData.address })
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSignOut = () => {
    logoutCustomer();
    navigate('/');
  };

  // Filter customer's orders
  const customerOrders = (orders || []).filter(
    (o) => o.email?.trim().toLowerCase() === customer.email?.trim().toLowerCase()
  );

  return (
    <div className="min-h-[80vh] bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Account Profile Details (5 cols) */}
        <div className="md:col-span-5 bg-white border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">Account Profile</h1>
                <p className="text-[10px] text-muted-foreground font-light">{customer.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 text-[10px] font-bold text-destructive hover:bg-destructive/10 px-2.5 py-1.5 rounded-lg border border-transparent transition-all focus:outline-none cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Log Out
            </button>
          </div>

          {isSaved && (
            <div className="flex items-center gap-2 text-xs text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20 font-medium">
              <Check className="h-4 w-4" /> Default checkout details successfully updated!
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Checkout Details</h3>
            
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground font-medium block">Full Name</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Satish Goud"
                  className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] pl-10 pr-4 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
                />
                <User className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground font-medium block">WhatsApp Mobile</label>
              <div className="relative flex items-center">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 7989163216"
                  className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] pl-10 pr-4 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
                />
                <Phone className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground font-medium block">Default Delivery Address</label>
              <div className="relative flex items-start">
                <textarea
                  name="address"
                  rows="4"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street, Landmark, City name"
                  className="w-full rounded-lg border border-border bg-[#F9FAFB] pl-10 pr-4 py-3 text-xs focus:border-primary/50 focus:bg-white focus:outline-none resize-none"
                />
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save Default Details
            </button>
          </form>

          {/* Cart summary preview */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-border/40 text-center">
              <p className="text-xs text-muted-foreground font-light">
                You currently have <strong className="text-foreground">{cart.length} items</strong> in your shopping bag.
              </p>
              <Link
                to="/cart"
                className="mt-2 text-xs font-bold text-primary hover:underline block font-semibold"
              >
                Go to Shopping Bag
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Order History & Status (7 cols) */}
        <div className="md:col-span-7 bg-white border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 self-stretch flex flex-col">
          <div className="border-b border-border/50 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-foreground">Track & Manage Your Orders</h2>
              <p className="text-[10px] text-muted-foreground font-light">Real-time status updates and order cancellation options.</p>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-secondary/15 px-2.5 py-1 rounded-lg border border-border/40">
              Orders: {customerOrders.length}
            </span>
          </div>

          {customerOrders.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-secondary/15 flex items-center justify-center text-muted-foreground border border-border/40">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-foreground">No Orders Placed Yet</h3>
                <p className="text-[10px] text-muted-foreground font-light max-w-xs mt-1">
                  Once you place orders through the shopping bag checkout, they will appear here for status tracking.
                </p>
              </div>
              <Link
                to="/shop"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors shadow-xs"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="flex-grow space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
              {customerOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-secondary/5 border border-border/55 rounded-xl p-4 hover:border-border/80 transition-colors flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
                    <div>
                      <span className="font-black text-foreground block">{order.id}</span>
                      <span className="text-[9px] text-muted-foreground font-light block">
                        {new Date(order.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        order.status === 'Order Placed'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25 animate-pulse'
                          : order.status === 'Accepted'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/25'
                          : order.status === 'Packing'
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/25 animate-pulse'
                          : order.status === 'Shipped'
                          ? 'bg-green-500/10 text-green-500 border border-green-500/25'
                          : order.status === 'Cancelled' || order.status === 'Rejected'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/25'
                          : 'bg-muted/10 text-muted-foreground border border-muted/20'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Order items details */}
                  <div className="divide-y divide-border/30 border-t border-b border-border/30 py-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 py-2 items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-6 rounded overflow-hidden bg-secondary/20 flex-shrink-0 border border-border/40">
                            <img src={item.image} alt={item.product_name} className="h-full w-full object-contain bg-white object-center" />
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block line-clamp-1">{item.product_name}</span>
                            <span className="text-[9px] text-muted-foreground font-light block">
                              Size: {item.size} | Color: {item.color || 'N/A'} | Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Order Total</span>
                    <span className="font-black text-foreground text-sm">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Cancel Order Button */}
                  {['Order Placed', 'Accepted', 'Packing'].includes(order.status) && (
                    <div className="pt-2 border-t border-border/30 flex justify-end">
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            updateOrderStatus(order.id, 'Cancelled');
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white hover:text-white text-[10px] font-bold shadow-xs hover:shadow-sm transition-all focus:outline-none cursor-pointer border-none"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}

                  {order.status === 'Cancelled' && (
                    <div className="text-[9px] text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-lg font-medium">
                      You cancelled this order.
                    </div>
                  )}

                  {order.status === 'Rejected' && (
                    <div className="text-[9px] text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-lg font-medium">
                      This order was rejected by the store.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
