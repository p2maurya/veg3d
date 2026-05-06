import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Navigate } from 'react-router-dom';

export default function VendorDashboard() {
  const { user } = useContext(AppContext);

  if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container animate-fade-in">
      <h2>Vendor Dashboard</h2>
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Your Kitchen</h3>
        <p>Add/Edit food items, manage availability, and view incoming orders.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4>Live Orders</h4>
            <p className="text-muted">You have 0 pending orders.</p>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4>Earnings</h4>
            <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{user.earnings || 0}</p>
          </div>
        </div>
        <button className="btn-primary" style={{ marginTop: '2rem' }}>+ Add New Food Item</button>
      </div>
    </div>
  );
}
