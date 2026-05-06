import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useContext(AppContext);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container animate-fade-in">
      <h2>Admin Dashboard</h2>
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Overview</h3>
        <p>Manage users, approve vendors, and view global analytics here.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4>Total Users</h4>
            <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>142</p>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4>Active Vendors</h4>
            <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>12</p>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4>Orders Today</h4>
            <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>56</p>
          </div>
        </div>
      </div>
    </div>
  );
}
