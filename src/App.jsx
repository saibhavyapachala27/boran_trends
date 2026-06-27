import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Login from './pages/Login';
import CustomerProfile from './pages/CustomerProfile';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/Wishlist';

// Layout Wrapper to conditionally hide header/footer on admin panels
function AppLayout({ children }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {!isDashboard && <Header />}
      <main className="flex-grow">{children}</main>
      {!isDashboard && <Footer />}
    </div>
  );
}

// Global Authentication Gate Wrapper
function MainAppContent() {
  const { customer } = useShop();
  const location = useLocation();

  // If path is /admin or starts with /admin/, auto-authenticate admin
  if (location.pathname.startsWith('/admin')) {
    localStorage.setItem('boran_admin_auth', 'true');
  }
  // If path is /login, clear admin auth to ensure customer page opens
  if (location.pathname === '/login') {
    localStorage.removeItem('boran_admin_auth');
  }

  const isAdminAuthenticated = localStorage.getItem('boran_admin_auth') === 'true';
  const isCustomerAuthenticated = customer.loggedIn;
  const isAuthenticated = isCustomerAuthenticated || isAdminAuthenticated;

  const isLoginPage = location.pathname === '/login';

  // 1. Force redirect to login page if user is not authenticated at all
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. If logged in as Admin, lock them into the Admin Dashboard portal
  if (isAdminAuthenticated) {
    if (!location.pathname.startsWith('/admin') && location.pathname !== '/login') {
      return <Navigate to="/admin/products" replace />;
    }
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* Catch-all redirects back to admin panel */}
          <Route path="*" element={<Navigate to="/admin/products" replace />} />
        </Routes>
      </div>
    );
  }

  // 3. If logged in as Customer, show standard customer storefront
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        {/* Block customers from admin urls and redirect to home */}
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <Router>
        <MainAppContent />
      </Router>
    </ShopProvider>
  );
}
