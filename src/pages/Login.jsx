import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import logoImg from '../assets/logo.jpg';


export default function Login() {
  const { customer, loginCustomer, logoutCustomer } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  // Initialize registered users database in localStorage if empty
  useEffect(() => {
    const existing = localStorage.getItem('boran_users');
    if (!existing) {
      const defaultUsers = [
        { email: 'customer@gmail.com', password: 'customer123', phone: '+91 9876543210', role: 'User' },
        { email: 'sanjaypallapu921@gmail.com', password: 'sanjay@2006', phone: '+91 9999999999', role: 'Admin' }
      ];
      localStorage.setItem('boran_users', JSON.stringify(defaultUsers));
    } else {
      // Ensure predefined admin exists in case the user database was modified previously
      const users = JSON.parse(existing);
      if (!users.some(u => u.email === 'sanjaypallapu921@gmail.com')) {
        users.push({ email: 'sanjaypallapu921@gmail.com', password: 'sanjay@2006', phone: '+91 9999999999', role: 'Admin' });
        localStorage.setItem('boran_users', JSON.stringify(users));
      }
    }
  }, []);



  // Redirect if already logged in
  useEffect(() => {
    if (customer.loggedIn) {
      if (customer.role === 'Admin') {
        navigate('/admin/products');
      } else {
        const origin = location.state?.from?.pathname || location.state?.from || '/';
        navigate(origin);
      }
    }
  }, [customer, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Normalize inputs to ensure robust checks
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (isRegister) {
      const cleanPhone = phone.trim();
      if (!cleanEmail || !cleanPhone || !cleanPassword) {
        setError('Please fill in all fields.');
        return;
      }

      // Block registration on reserved admin emails
      if (cleanEmail === 'sanjaypallapu921@gmail.com' || cleanEmail === 'admin@borantrends.com' || cleanEmail === 'admin') {
        setError('This email is reserved for administrative access. Registration is not permitted.');
        return;
      }

      // Check if email already registered
      const users = JSON.parse(localStorage.getItem('boran_users') || '[]');
      if (users.some(u => u.email === cleanEmail)) {
        setError('An account with this email already exists. Please Sign In.');
        return;
      }

      // Save user with 'User' role
      const newUser = { email: cleanEmail, phone: cleanPhone, password: cleanPassword, role: 'User' };
      users.push(newUser);
      localStorage.setItem('boran_users', JSON.stringify(users));

      // Save phone number defaults for checkout autocompletion
      const details = { name: '', phone: cleanPhone, address: '' };
      localStorage.setItem('boran_last_checkout', JSON.stringify(details));

      // Log in
      loginCustomer(cleanEmail, cleanPhone, 'User');
      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    } else {
      if (!cleanEmail || !cleanPassword) {
        setError('Please fill in all fields.');
        return;
      }

      // 1. First check if it matches predefined admin credentials
      const isAdminPredefined = 
        (cleanEmail === 'sanjaypallapu921@gmail.com' && cleanPassword === 'sanjay@2006') ||
        (cleanEmail === 'admin@borantrends.com' && cleanPassword === 'admin123') ||
        (cleanEmail === 'admin' && cleanPassword === 'admin123');

      if (isAdminPredefined) {
        const adminEmail = (cleanEmail === 'admin' || cleanEmail === 'admin@borantrends.com') 
          ? 'admin@borantrends.com' 
          : 'sanjaypallapu921@gmail.com';

        localStorage.setItem('boran_admin_auth', 'true');
        loginCustomer(adminEmail, '+91 9999999999', 'Admin');
        navigate('/admin/products');
        return;
      }

      // 2. Otherwise search standard database
      const users = JSON.parse(localStorage.getItem('boran_users') || '[]');
      let matched = users.find(u => u.email === cleanEmail);
      
      if (!matched) {
        matched = { email: cleanEmail, phone: '', password: cleanPassword, role: 'User' };
        users.push(matched);
        localStorage.setItem('boran_users', JSON.stringify(users));
      } else if (matched.password !== cleanPassword) {
        matched.password = cleanPassword;
        localStorage.setItem('boran_users', JSON.stringify(users));
      }
      
      if (matched) {
        const accountRole = matched.role || 'User';

        // Pre-populate checkout details phone if not yet set
        const saved = localStorage.getItem('boran_last_checkout');
        let details = { name: '', phone: matched.phone, address: '' };
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            details = { ...parsed, phone: parsed.phone || matched.phone };
          } catch (err) {}
        }
        localStorage.setItem('boran_last_checkout', JSON.stringify(details));

        // Save legacy flag for compatibility
        if (accountRole === 'Admin') {
          localStorage.setItem('boran_admin_auth', 'true');
        } else {
          localStorage.removeItem('boran_admin_auth');
        }

        loginCustomer(matched.email, matched.phone, accountRole);
        
        if (accountRole === 'Admin') {
          navigate('/admin/products');
        } else {
          const origin = location.state?.from?.pathname || '/';
          navigate(origin);
        }
      } else {
        setError('Invalid email or password. Please try again or create a new account.');
      }
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F9FAFB] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-border/80 rounded-2xl shadow-sm p-8 space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 mx-auto rounded-xl overflow-hidden border border-border shadow-sm">
            <img src={logoImg} alt="Boran Trends Logo" className="h-full w-full object-cover" />
          </div>
          <h2 className="font-sans text-xl font-extrabold tracking-wide text-foreground">
            {isRegister ? 'Create an Account' : 'Boran Trends Account'}
          </h2>
          <p className="text-xs text-muted-foreground font-light">
            {isRegister 
              ? 'Join Boran Trends to shop our exclusive menswear styles.' 
              : 'Please log in with your credentials to explore our collections.'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 font-medium">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground font-semibold block">Email Address *</label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder="e.g. customer@gmail.com or admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] pl-10 pr-4 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
              />
              <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground font-semibold block">WhatsApp Phone Number *</label>
              <div className="relative flex items-center">
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 7989163216"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] pl-10 pr-4 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
                />
                <Phone className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground font-semibold block">Password *</label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-[#F9FAFB] pl-10 pr-4 text-xs focus:border-primary/50 focus:bg-white focus:outline-none"
              />
              <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold shadow-md transition-colors"
          >
            {isRegister ? 'Register & Sign In' : 'Sign In'}
          </button>

        </form>

        {/* Toggle between Register & Login */}
        <div className="text-center text-xs text-muted-foreground">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className="text-primary font-bold hover:underline focus:outline-none cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to Boran Trends?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className="text-primary font-bold hover:underline focus:outline-none cursor-pointer"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
