import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        
        // If it's a mock user (res.data empty), load from local storage fallback
        if (res.data.length === 0) {
          const localOrders = JSON.parse(localStorage.getItem('mock_orders')) || [];
          setOrders(localOrders.reverse());
        } else {
          setOrders(res.data);
        }
      } catch (err) {
        // Fallback if backend offline
        const localOrders = JSON.parse(localStorage.getItem('mock_orders')) || [];
        setOrders(localOrders.reverse());
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (!user) return <div className="container animate-fade-in" style={{ marginTop: '4rem' }}><h2>Please login to view orders.</h2></div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '4rem' }}>
      <h2>My Orders</h2>
      {loading ? (
        <p>Loading your delicious history...</p>
      ) : orders.length === 0 ? (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3>No orders yet!</h3>
          <p className="text-muted">You haven't placed any orders yet. Check out our menu!</p>
          <Link to="/menu" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>Browse Menu</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
          {orders.map((order, idx) => (
            <div key={order._id || idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Order #{order._id?.substring(0, 8) || 'Mock'}</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                  {new Date(order.createdAt || Date.now()).toLocaleDateString()} at {new Date(order.createdAt || Date.now()).toLocaleTimeString()}
                </p>
                <p style={{ margin: 0 }}>
                  Status: <span style={{ color: order.status === 'delivered' ? '#4ade80' : '#facc15' }}>
                    {order.status ? order.status.toUpperCase() : 'PREPARING'}
                  </span>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 className="text-primary" style={{ margin: '0 0 0.5rem 0' }}>₹{order.totalAmount}</h3>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>
                  {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'UPI'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
