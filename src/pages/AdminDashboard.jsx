import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, Settings, LogOut, Plus, Edit, Trash2, 
  RefreshCw, Check, X, Tag, List, Grid, Info, MessageSquare, Mail,
  Bell, Package, Truck
} from 'lucide-react';

const CATEGORIES = [
  'T-Shirts',
  'Shirts',
  'Jeans',
  'Trousers',
  'Cargos',
  'Ethnic Wear'
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    products, 
    addOrUpdateProduct, 
    deleteProduct, 
    resetProducts,
    orders = [],
    updateOrderStatus,
    notifications = [],
    clearNotifications
  } = useShop();

  const pendingOrdersCount = orders.filter((o) => o.status === 'Order Placed').length;

  // Authentication check
  useEffect(() => {
    if (localStorage.getItem('boran_admin_auth') !== 'true' || !customer.loggedIn || customer.role !== 'Admin') {
      navigate('/login', { state: { from: location } });
    }
  }, [customer, navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('boran_admin_auth');
    logoutCustomer();
    navigate('/login');
  };

  // State to manage form dialog
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: 'Shirts',
    sizes: [],
    colors: [],
    images: [''],
    stock_bhongir: 0,
    stock_jangaon: 0,
    stock_mothkur: 0,
    is_featured: false,
    is_new_arrival: false,
    is_trending: false,
    status: 'active',
    out_of_stock: false,
  });

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes || [],
      colors: product.colors || [],
      images: product.images || [''],
      stock_bhongir: product.stock_bhongir || 0,
      stock_jangaon: product.stock_jangaon || 0,
      stock_mothkur: product.stock_mothkur || 0,
      is_featured: product.is_featured || false,
      is_new_arrival: product.is_new_arrival || false,
      is_trending: product.is_trending || false,
      status: product.status || 'active',
      out_of_stock: product.out_of_stock || ((product.stock_bhongir || 0) === 0 && (product.stock_jangaon || 0) === 0 && (product.stock_mothkur || 0) === 0),
    });
    setIsEditing(true);
  };

  const handleAddNewClick = () => {
    setCurrentProduct(null);
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      category: 'Shirts',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Beige'],
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'],
      stock_bhongir: 10,
      stock_jangaon: 10,
      stock_mothkur: 10,
      is_featured: false,
      is_new_arrival: true,
      is_trending: false,
      status: 'active',
      out_of_stock: false,
    });
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Convert array lists
  const handleCommaListChange = (key, value) => {
    const list = value.split(',').map((item) => item.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [key]: list }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: Number(formData.price),
      original_price: null,
      stock_bhongir: formData.out_of_stock ? 0 : Number(formData.stock_bhongir),
      stock_jangaon: formData.out_of_stock ? 0 : Number(formData.stock_jangaon),
      stock_mothkur: formData.out_of_stock ? 0 : Number(formData.stock_mothkur),
      images: typeof formData.images === 'string' ? [formData.images] : formData.images,
    };
    addOrUpdateProduct(productData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      {/* Top Navbar */}
      <header className="w-full bg-card border-b border-border/40 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <span className="font-display font-black tracking-wider text-sm text-foreground uppercase hidden sm:inline">
                  Boran Trends Admin
                </span>
              </div>
              
              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/admin/products"
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-secondary/50 hover:text-primary transition-colors ${
                    location.pathname.includes('/products') || location.pathname === '/admin' ? 'bg-secondary text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" /> Manage Catalog
                </Link>
                <Link
                  to="/admin/orders"
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-secondary/50 hover:text-primary transition-colors ${
                    location.pathname.includes('/orders') ? 'bg-secondary text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Manage Orders
                  {pendingOrdersCount > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse ml-0.5">
                      {pendingOrdersCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/notifications"
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-secondary/50 hover:text-primary transition-colors ${
                    location.pathname.includes('/notifications') ? 'bg-secondary text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Bell className="h-3.5 w-3.5" /> Notification Feed
                  {notifications.length > 0 && (
                    <span className="bg-secondary-foreground/10 text-muted-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                      {notifications.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/settings"
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-secondary/50 hover:text-primary transition-colors ${
                    location.pathname.includes('/settings') ? 'bg-secondary text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Settings
                </Link>
              </nav>
            </div>

            {/* Right side actions (Bell Dropdown, Logout) */}
            <div className="flex items-center gap-3">
              {/* Bell dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-full border border-border/80 hover:bg-secondary/40 hover:text-primary transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                  aria-label="Toggle notifications"
                >
                  <Bell className="h-4 w-4 text-foreground" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-border bg-popover p-3 shadow-xl z-50 space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-border/40">
                        <span className="text-xs font-bold text-foreground">Recent Notifications ({notifications.length})</span>
                        {notifications.length > 0 && (
                          <button 
                            onClick={() => {
                              clearNotifications();
                              setIsNotifOpen(false);
                            }}
                            className="text-[10px] text-destructive hover:underline font-semibold cursor-pointer"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground font-light">
                          No notifications yet
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                          {notifications.slice(0, 5).map((notif) => (
                            <div 
                              key={notif.id}
                              onClick={() => {
                                setIsNotifOpen(false);
                                if (notif.text.includes('order') || notif.text.includes('Order')) {
                                  navigate('/admin/orders');
                                } else {
                                  navigate('/admin/notifications');
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-secondary/40 transition-colors text-[11px] font-medium text-foreground cursor-pointer flex flex-col gap-0.5"
                            >
                              <span className="line-clamp-2">{notif.text}</span>
                              <span className="text-[9px] text-muted-foreground font-light">{notif.date} • {notif.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-border/40 text-center">
                        <Link
                          to="/admin/notifications"
                          onClick={() => setIsNotifOpen(false)}
                          className="text-xs text-primary hover:underline font-semibold block"
                        >
                          View All in Feed
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors focus:outline-none cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Nav Links (sub-navbar) */}
        <div className="md:hidden border-t border-border/40 bg-card py-2 flex items-center justify-around overflow-x-auto no-scrollbar">
          <Link
            to="/admin/products"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              location.pathname.includes('/products') || location.pathname === '/admin' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Grid className="h-4 w-4" /> Products
          </Link>
          <Link
            to="/admin/orders"
            className={`relative flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              location.pathname.includes('/orders') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Orders
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </Link>
          <Link
            to="/admin/notifications"
            className={`relative flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              location.pathname.includes('/notifications') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Bell className="h-4 w-4" /> Feed
            {notifications.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-secondary-foreground/15 text-muted-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </Link>
          <Link
            to="/admin/settings"
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              location.pathname.includes('/settings') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </Link>
        </div>
      </header>

      {/* Main Dashboard Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        
        {/* Dynamic Notification Banner for New Orders */}
        <NewOrdersNotificationBanner />

        {/* Router for dashboard sections */}
        <Routes>
          
          {/* Main Products Tab */}
          <Route path="/" element={<ProductsTableList />} />
          <Route path="products" element={<ProductsTableList />} />
          
          {/* Orders Tab */}
          <Route path="orders" element={<OrdersManagementTab />} />
          
          {/* Notifications Tab */}
          <Route path="notifications" element={<NotificationFeedTab />} />
          
          {/* Settings Tab */}
          <Route path="settings" element={<SettingsTab />} />

        </Routes>

      </main>

      {/* Product Edit / Add Drawer Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          
          <div className="relative w-full max-w-2xl bg-popover border border-border rounded-2xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
              <h2 className="text-base font-bold tracking-wide">
                {currentProduct ? 'Edit Catalog Item' : 'Create New Catalog Item'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full h-9 rounded-lg border border-border bg-secondary/15 px-3 text-xs focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold block mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full h-9 rounded-lg border border-border bg-secondary/15 px-3 text-xs focus:border-primary/50 focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Description *</label>
                <textarea
                  required
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-border bg-secondary/15 p-3 text-xs focus:border-primary/50 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="w-full h-9 rounded-lg border border-border bg-secondary/15 px-3 text-xs focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-semibold block mb-1">Available Sizes (Comma separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S, M, L, XL, 30, 32"
                    value={formData.sizes.join(', ')}
                    onChange={(e) => handleCommaListChange('sizes', e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-secondary/15 px-3 text-xs focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-semibold block mb-1">Available Colors (Comma separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Black, White, Beige, Navy"
                    value={formData.colors.join(', ')}
                    onChange={(e) => handleCommaListChange('colors', e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-secondary/15 px-3 text-xs focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-semibold block mb-1">Product Image *</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com... or Base64"
                    value={formData.images[0] || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, images: [e.target.value] }))}
                    className="flex-grow h-9 rounded-lg border border-border bg-secondary/15 px-3 text-xs focus:border-primary/50 focus:outline-none"
                  />
                  <label className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground hover:text-primary-foreground flex items-center justify-center text-xs font-semibold cursor-pointer shadow-md select-none border border-primary/20 shrink-0">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData((prev) => ({ ...prev, images: [event.target.result] }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {formData.images[0] && (
                  <div className="mt-2 relative inline-block rounded-lg overflow-hidden border border-border bg-secondary/5 h-20 w-20">
                    <img 
                      src={formData.images[0]} 
                      alt="Preview" 
                      className="h-full w-full object-contain bg-white object-center"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* Multi branch Stock counts */}
              <div className="rounded-xl border border-border/80 bg-secondary/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Branch Stock Inventory Levels</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      name="out_of_stock"
                      checked={formData.out_of_stock}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          out_of_stock: checked,
                          stock_bhongir: checked ? 0 : (prev.stock_bhongir || 10),
                          stock_jangaon: checked ? 0 : (prev.stock_jangaon || 10),
                          stock_mothkur: checked ? 0 : (prev.stock_mothkur || 10),
                        }));
                      }}
                      className="h-4 w-4 rounded border-border bg-secondary/15 text-primary focus:ring-primary focus:ring-offset-background"
                    />
                    <span className="font-bold text-destructive">Out of Stock</span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">Bhongir Stock</label>
                    <input
                      type="number"
                      required
                      name="stock_bhongir"
                      disabled={formData.out_of_stock}
                      value={formData.stock_bhongir}
                      onChange={handleFormChange}
                      className="w-full h-9 rounded-md border border-border bg-background px-2.5 text-xs focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">Jangaon Stock</label>
                    <input
                      type="number"
                      required
                      name="stock_jangaon"
                      disabled={formData.out_of_stock}
                      value={formData.stock_jangaon}
                      onChange={handleFormChange}
                      className="w-full h-9 rounded-md border border-border bg-background px-2.5 text-xs focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">Mothkur Stock</label>
                    <input
                      type="number"
                      required
                      name="stock_mothkur"
                      disabled={formData.out_of_stock}
                      value={formData.stock_mothkur}
                      onChange={handleFormChange}
                      className="w-full h-9 rounded-md border border-border bg-background px-2.5 text-xs focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Collections and Status Options */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded border-border bg-secondary/15 text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    name="is_new_arrival"
                    checked={formData.is_new_arrival}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded border-border bg-secondary/15 text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    name="is_trending"
                    checked={formData.is_trending}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded border-border bg-secondary/15 text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <span>Trending Page</span>
                </label>
                <div className="flex items-center gap-2 ml-auto">
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="h-8 rounded border border-border bg-secondary/15 px-2 text-xs focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-border/40 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-lg border border-border hover:bg-secondary text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold shadow-md"
                >
                  Save Product Details
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Sub-component: Products Table
  function ProductsTableList() {
    return (
      <div className="space-y-6">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <h2 className="text-lg font-bold tracking-wide">Products Catalog</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage products across physical branch locations.</p>
          </div>
          <button
            onClick={handleAddNewClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 px-4 h-9 text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>

        {/* Data Table */}
        <div className="border border-border/60 bg-card/25 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-border/50 bg-secondary/10 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Bhongir Stock</th>
                  <th className="p-4 text-center">Jangaon Stock</th>
                  <th className="p-4 text-center">Mothkur Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="h-10 w-8 rounded overflow-hidden bg-secondary/30 flex-shrink-0 border border-border/40">
                        <img src={prod.images && prod.images[0]} alt={prod.name} className="h-full w-full object-contain bg-white object-center" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block">{prod.name}</span>
                        <div className="flex gap-1 mt-0.5">
                          {prod.status === 'inactive' && (
                            <span className="inline-block bg-destructive/10 text-destructive text-[8px] px-1 rounded font-bold uppercase">Inactive</span>
                          )}
                          {(prod.out_of_stock || ((prod.stock_bhongir || 0) === 0 && (prod.stock_jangaon || 0) === 0 && (prod.stock_mothkur || 0) === 0)) && (
                            <span className="inline-block bg-red-500/10 text-red-500 text-[8px] px-1 rounded font-bold uppercase">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-light">{prod.category}</td>
                    <td className="p-4 font-bold text-foreground">₹{prod.price.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-center font-medium">{prod.stock_bhongir || 0}</td>
                    <td className="p-4 text-center font-medium">{prod.stock_jangaon || 0}</td>
                    <td className="p-4 text-center font-medium">{prod.stock_mothkur || 0}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="p-1.5 rounded hover:bg-secondary hover:text-primary transition-colors text-muted-foreground"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 rounded hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }

  // Sub-component: Settings Tab
  function SettingsTab() {
    const [successMessage, setSuccessMessage] = useState('');

    const handleReset = () => {
      if (window.confirm('Reset catalog back to the initial seeded products? All local edits will be discarded.')) {
        resetProducts();
        setSuccessMessage('Catalog successfully reset to defaults!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    };

    return (
      <div className="space-y-6 max-w-xl">
        <div className="pb-4 border-b border-border/40">
          <h2 className="text-lg font-bold tracking-wide">System Settings</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Control panel for database operations.</p>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 text-xs text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20 font-medium">
            <Check className="h-4 w-4" /> {successMessage}
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Info className="h-4 w-4 text-primary" /> Database Restoration
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-light">
            If you need to discard your custom edits and reset the catalog database back to the original seed product collection items, you can use the button below.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 hover:bg-primary/10 text-primary text-xs font-semibold px-4 h-9 transition-colors focus:outline-none"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Restore Default Catalog
          </button>
        </div>

      </div>
    );
  }

  // Sub-component: New Orders Toast Notification Banner
  function NewOrdersNotificationBanner() {
    const pendingOrders = orders.filter((o) => o.status === 'Order Placed');

    if (pendingOrders.length === 0) return null;

    return (
      <div className="mb-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-4 shadow-md border border-amber-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <ShoppingBag className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-100">Pending Action Required</h4>
            <p className="text-sm font-semibold mt-0.5">
              You have {pendingOrders.length} new customer order{pendingOrders.length > 1 ? 's' : ''} waiting for acceptance!
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-amber-50 font-light">
              {pendingOrders.slice(0, 2).map((o) => (
                <span key={o.id}>
                  <strong>{o.customerName}</strong> ({o.phone}) - {o.items.length} item{o.items.length > 1 ? 's' : ''} (₹{o.total.toLocaleString('en-IN')})
                </span>
              ))}
              {pendingOrders.length > 2 && <span>and {pendingOrders.length - 2} more...</span>}
            </div>
          </div>
        </div>
        <Link
          to="/admin/orders"
          className="bg-white text-orange-600 hover:bg-amber-50 px-4 py-2 rounded-lg text-xs font-bold shadow-xs whitespace-nowrap transition-colors text-center font-semibold"
        >
          Review Orders
        </Link>
      </div>
    );
  }

  // Sub-component: Orders Management Tab
  function OrdersManagementTab() {
    // Helper to generate WhatsApp customer message for Accept
    const getAcceptWAText = (order) => `Hello ${order.customerName},

Your order (${order.id}) at Boran Trends has been accepted! 

*Branch:* ${order.branch}
*Items:*
${order.items.map((item) => `- ${item.product_name} (${item.size}, ${item.color || 'N/A'}) x${item.quantity}`).join('\n')}
*Total Amount:* ₹${order.total.toLocaleString('en-IN')}

We are preparing it for delivery. Thank you!`;

    // Helper to generate WhatsApp customer message for Packing
    const getPackingWAText = (order) => `Hello ${order.customerName},

Your order (${order.id}) is now in *Packing & Custom Alterations* stage! 📦

Our in-store tailoring team is performing size validation and preparing your premium menswear package. We will dispatch it shortly.`;

    // Helper to generate WhatsApp customer message for Shipping
    const getShipWAText = (order) => `Hello ${order.customerName},

Great news! Your order (${order.id}) has been *Dispatched from our ${order.branch} Store*! 🚚

It is out for delivery to your address:
${order.address}

Please keep your phone available. Thank you for shopping with Boran Trends!`;

    const handleOrderAction = (order, actionType) => {
      let nextStatus = '';
      let timelineStep = '';
      let waText = '';

      if (actionType === 'accept') {
        nextStatus = 'Accepted';
        timelineStep = 'Availability Confirmed';
        waText = getAcceptWAText(order);
      } else if (actionType === 'packing') {
        nextStatus = 'Packing';
        timelineStep = 'Packing & Custom Alterations';
        waText = getPackingWAText(order);
      } else if (actionType === 'ship') {
        nextStatus = 'Shipped';
        timelineStep = 'Dispatched from Store';
        waText = getShipWAText(order);
      }

      // 1. Update order status in mock database
      updateOrderStatus(order.id, nextStatus, timelineStep);

      // 2. Format customer's WhatsApp mobile number
      const number = order.phone.replace(/[^0-9]/g, '');
      const cleanNumber = number.length === 10 ? `91${number}` : number;

      // 3. Open WhatsApp link directly
      const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waText)}`;
      const newWindow = window.open(url, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = url;
      }
    };

    const handleRejectOrder = (orderId) => {
      updateOrderStatus(orderId, 'Rejected');
    };

    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border/50 rounded-2xl space-y-4">
          <div className="h-12 w-12 rounded-full bg-secondary/15 flex items-center justify-center text-muted-foreground border border-border/40">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">No Orders Placed Yet</h3>
            <p className="text-[11px] text-muted-foreground font-light max-w-xs mt-1">
              Customer orders placed via the storefront cart or direct WhatsApp checkout will show up here.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wide">Manage Orders</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Accept orders, track status, and notify customers.</p>
          </div>
          <div className="text-xs font-bold text-muted-foreground bg-secondary/20 px-3 py-1.5 rounded-lg border border-border/40">
            Total: {orders.length} order{orders.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border/70 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all"
            >
              {/* Header Info */}
              <div className="bg-secondary/10 border-b border-border/40 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-black text-foreground text-sm">{order.id}</span>
                  <span className="text-muted-foreground font-light">
                    {new Date(order.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                  <span className="font-semibold text-primary">{order.branch}</span>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'Order Placed'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25 animate-pulse'
                        : order.status === 'Accepted'
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/25'
                        : order.status === 'Packing'
                        ? 'bg-purple-500/10 text-purple-500 border border-purple-500/25 animate-pulse'
                        : order.status === 'Shipped'
                        ? 'bg-green-500/10 text-green-500 border border-green-500/25'
                        : order.status === 'Rejected' || order.status === 'Cancelled'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/25'
                        : 'bg-muted/10 text-muted-foreground border border-muted/20'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Products Section (7 cols) */}
                <div className="md:col-span-7 space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Products Ordered</h4>
                  <div className="divide-y divide-border/30 max-h-48 overflow-y-auto pr-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 py-2.5 first:pt-0 last:pb-0 items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-8 rounded overflow-hidden bg-secondary/20 flex-shrink-0 border border-border/40">
                            <img src={item.image} alt={item.product_name} className="h-full w-full object-contain bg-white object-center" />
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-foreground block line-clamp-1">{item.product_name}</span>
                            <span className="text-[10px] text-muted-foreground font-light block">
                              Size: {item.size} | Color: {item.color || 'N/A'} | Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-xs text-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-border/30 flex justify-between items-baseline">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Order Total</span>
                    <span className="text-base font-black text-foreground">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Customer Details Section (5 cols) */}
                <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6 space-y-3 text-xs">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Customer Details</h4>
                  
                  <div className="space-y-2 font-light">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Customer Name:</span>
                      <span className="font-semibold text-foreground">{order.customerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">WhatsApp Mobile:</span>
                      <span className="font-semibold text-foreground">{order.phone}</span>
                    </div>
                    {order.email && (
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Email Address:</span>
                        <span className="font-semibold text-foreground">{order.email}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Delivery Address:</span>
                      <span className="font-semibold text-foreground leading-relaxed">{order.address}</span>
                    </div>
                    {order.locationText && (
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Maps Link / Notes:</span>
                        <a
                          href={order.locationText}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary hover:underline break-all block"
                        >
                          {order.locationText}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions Area */}
                  <div className="pt-4 border-t border-border/30 space-y-2">
                    
                    {/* Action buttons depending on state */}
                    {order.status === 'Order Placed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOrderAction(order, 'accept')}
                          className="flex-grow h-8 bg-primary text-primary-foreground hover:bg-primary/95 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 focus:outline-none cursor-pointer"
                        >
                          Accept Order & Open WhatsApp
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="h-8 px-3 border border-border hover:bg-destructive/10 text-destructive hover:text-destructive text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 focus:outline-none cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {order.status === 'Accepted' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleOrderAction(order, 'packing')}
                          className="w-full h-8 bg-purple-600 text-white hover:bg-purple-700 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                        >
                          <Package className="h-3.5 w-3.5" /> Start Packing & Notify WhatsApp
                        </button>
                      </div>
                    )}

                    {order.status === 'Packing' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleOrderAction(order, 'ship')}
                          className="w-full h-8 bg-green-600 text-white hover:bg-green-700 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                        >
                          <Truck className="h-3.5 w-3.5" /> Ship Order & Notify WhatsApp
                        </button>
                      </div>
                    )}

                    {order.status === 'Shipped' && (
                      <div className="text-[10px] text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1">
                        Order has been shipped and customer notified on WhatsApp!
                      </div>
                    )}

                    {order.status === 'Rejected' && (
                      <div className="text-[10px] text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-lg font-medium">
                        This order has been rejected.
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sub-component: Notification Feed Tab
  function NotificationFeedTab() {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-wide">Notification Feed</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time log of customer actions and order state changes.</p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 hover:bg-destructive/10 text-destructive text-xs font-semibold px-3 h-8 transition-colors focus:outline-none cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear Feed Logs
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border/50 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-full bg-secondary/15 flex items-center justify-center text-muted-foreground border border-border/40">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Notification Feed is Empty</h3>
              <p className="text-[11px] text-muted-foreground font-light max-w-xs mt-1">
                There are no logged activities or system transitions at this time.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border/40">
            {notifications.map((notif) => {
              // Icon selector depending on notification text/type
              let NotifIcon = Bell;
              let iconClass = "bg-blue-500/10 text-blue-500 border-blue-500/20";
              
              if (notif.text.includes('New order')) {
                NotifIcon = ShoppingBag;
                iconClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
              } else if (notif.text.includes('status updated to: Accepted')) {
                NotifIcon = Check;
                iconClass = "bg-green-500/10 text-green-500 border-green-500/20";
              } else if (notif.text.includes('status updated to: Packing')) {
                NotifIcon = Package;
                iconClass = "bg-purple-500/10 text-purple-500 border-purple-500/20";
              } else if (notif.text.includes('status updated to: Shipped')) {
                NotifIcon = Truck;
                iconClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
              }

              const orderMatch = notif.text.match(/BT-\d{4}/);
              const orderId = orderMatch ? orderMatch[0] : null;
              const order = orderId ? orders.find(o => o.id === orderId) : null;

              return (
                <div key={notif.id} className="p-4 flex gap-4 items-start hover:bg-secondary/10 transition-colors">
                  <div className={`h-8 w-8 rounded-full border flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                    <NotifIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-grow flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                    <div className="space-y-1.5 flex-grow">
                      <p className="text-xs font-medium text-foreground">{notif.text}</p>
                      <div className="flex gap-2 text-[10px] text-muted-foreground font-light">
                        <span>{notif.date}</span>
                        <span>•</span>
                        <span>{notif.time}</span>
                      </div>
                      
                      {order && (
                        <div className="mt-2.5 pt-2 border-t border-border/30 flex flex-wrap gap-2 items-center">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground">Order Status:</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            order.status === 'Order Placed'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                              : order.status === 'Accepted'
                              ? 'bg-blue-500/10 text-blue-500 border border-blue-500/25'
                              : order.status === 'Packing'
                              ? 'bg-purple-500/10 text-purple-500 border border-purple-500/25 animate-pulse'
                              : order.status === 'Shipped'
                              ? 'bg-green-500/10 text-green-500 border border-green-500/25'
                              : 'bg-red-500/10 text-red-500 border border-red-500/25'
                          }`}>
                            {order.status}
                          </span>

                          <div className="flex gap-1.5 ml-auto">
                            {order.status === 'Order Placed' && (
                              <>
                                <button
                                  onClick={() => handleOrderAction(order, 'accept')}
                                  className="h-6 px-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-bold rounded transition-colors focus:outline-none cursor-pointer"
                                >
                                  Accept & WhatsApp
                                </button>
                                <button
                                  onClick={() => handleRejectOrder(order.id)}
                                  className="h-6 px-2 border border-border text-destructive hover:bg-destructive/10 text-[10px] font-bold rounded transition-colors focus:outline-none cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {order.status === 'Accepted' && (
                              <button
                                onClick={() => handleOrderAction(order, 'packing')}
                                className="h-6 px-2.5 bg-purple-600 text-white hover:bg-purple-700 text-[10px] font-bold rounded transition-colors flex items-center gap-1 focus:outline-none cursor-pointer"
                              >
                                <Package className="h-3 w-3" /> Pack & WhatsApp
                              </button>
                            )}

                            {order.status === 'Packing' && (
                              <button
                                onClick={() => handleOrderAction(order, 'ship')}
                                className="h-6 px-2.5 bg-green-600 text-white hover:bg-green-700 text-[10px] font-bold rounded transition-colors flex items-center gap-1 focus:outline-none cursor-pointer"
                              >
                                <Truck className="h-3 w-3" /> Ship & WhatsApp
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {orderId && (
                      <Link
                        to="/admin/orders"
                        className="text-[10px] font-bold text-primary border border-primary/30 px-2.5 py-1 rounded-md hover:bg-primary hover:text-primary-foreground transition-all shrink-0 font-sans"
                      >
                        Manage Order
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
