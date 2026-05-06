import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', { phone });
      alert(`OTP Sent! (Mock OTP: ${res.data.mockOtp})`);
      setOtpSent(true);
    } catch (err) {
      // For local fallback testing if backend offline
      alert("Mock OTP: 123456");
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { phone, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      // Local fallback
      if (otp === '123456') {
        const mockUser = { id: '1', name: name || 'Mock User', phone, role };
        localStorage.setItem('token', 'mock_token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        navigate('/');
      } else {
        alert('Invalid OTP');
      }
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{isLogin ? 'Login with OTP' : 'Create Account'}</h2>
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            {!isLogin && (
              <>
                <input className="input-field" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <select className="input-field" value={role} onChange={e => setRole(e.target.value)} style={{ color: '#000' }}>
                  <option value="user">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="delivery">Delivery Partner</option>
                </select>
              </>
            )}
            <input className="input-field" type="tel" placeholder="Mobile Number" value={phone} onChange={e => setPhone(e.target.value)} required />
            <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '1rem' }}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input className="input-field" type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
            <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '1rem' }}>
              Verify & Login
            </button>
          </form>
        )}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="text-primary" 
            style={{ cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
