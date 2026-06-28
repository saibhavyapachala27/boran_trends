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

  const isAuthenticated = customer.loggedIn;
  const isAdmin = isAuthenticated && customer.role === 'Admin';

  // 1. Admin route protection
  if (location.pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return <Navigate to="/login" replace state={{ from: location }} />;
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

  // 2. Customer profile & wishlist route protection
  if ((location.pathname === '/profile' || location.pathname === '/wishlist') && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Public storefront routes
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
