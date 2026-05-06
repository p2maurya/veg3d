import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Leaf, ShoppingCart, User as UserIcon } from 'lucide-react';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import MyOrders from './pages/MyOrders';
import Chatbot from './components/Chatbot';

export const AppContext = React.createContext();

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ cart, setCart, user, setUser }}>
      <Router>
        <nav>
          <div className="container flex justify-between items-center">
            <Link to="/" className="nav-logo text-primary">
              <Leaf size={28} />
              Veg3D
            </Link>
            <div className="nav-links">
              <Link to="/menu">Menu</Link>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} />
                {cart.length > 0 && <span style={{ background: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{cart.length}</span>}
              </Link>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {user.role === 'admin' && <Link to="/admin" className="text-primary">Admin</Link>}
                  {user.role === 'vendor' && <Link to="/vendor" className="text-primary">Vendor Area</Link>}
                  {user.role === 'delivery' && <Link to="/delivery" className="text-primary">Delivery Map</Link>}
                  {user.role === 'user' && <Link to="/orders" className="text-primary">My Orders</Link>}
                  <span>Hi, {user.name}</span>
                  <button onClick={logout} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                  <UserIcon size={18} style={{ marginRight: '0.5rem' }} /> Login
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main style={{ minHeight: '80vh', padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/delivery" element={<DeliveryDashboard />} />
          </Routes>
        </main>
        
        <Chatbot />
        
        <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
          <p>&copy; 2024 Veg3D Delivery. All rights reserved.</p>
        </footer>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
