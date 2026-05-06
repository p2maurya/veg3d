import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Navigate } from 'react-router-dom';

export default function DeliveryDashboard() {
  const { user } = useContext(AppContext);
  const [isOnline, setIsOnline] = useState(false);

  if (!user || (user.role !== 'delivery' && user.role !== 'admin')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center">
        <h2>Delivery Partner Dashboard</h2>
        <button 
          className={isOnline ? 'btn-primary' : 'btn-outline'} 
          style={{ background: isOnline ? '#ef4444' : 'transparent', borderColor: isOnline ? '#ef4444' : 'var(--primary)', color: isOnline ? 'white' : 'var(--primary)' }}
          onClick={() => setIsOnline(!isOnline)}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Status: {isOnline ? <span style={{ color: '#4ade80' }}>Online - Waiting for orders...</span> : <span style={{ color: '#ef4444' }}>Offline</span>}</h3>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
          <h4>Today's Earnings</h4>
          <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{user.earnings || 0}</p>
        </div>
      </div>
    </div>
  );
}
