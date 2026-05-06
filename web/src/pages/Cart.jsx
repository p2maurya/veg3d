import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, setCart, user } = useContext(AppContext);
  const [address, setAddress] = useState('');
  const [trackingId, setTrackingId] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [currentOrder, setCurrentOrder] = useState(null);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // If user hasn't used first free delivery, we subtract a delivery fee.
  // For simplicity here, we just display "Free Delivery Applied!" if total > 0.
  const isFirstDelivery = user && !user.hasUsedFirstFreeDelivery;
  
  const initiateCheckout = async () => {
    if (!user) {
      alert("Please login first!");
      navigate('/login');
      return;
    }
    if (cart.length === 0) return;
    if (!address) {
      alert("Please enter a delivery address");
      return;
    }

    try {
      // Step 1: Create Order
      const items = cart.map(item => ({ food: item._id, quantity: 1 }));
      const orderRes = await axios.post('http://localhost:5000/api/orders', {
        items,
        totalAmount: isFirstDelivery ? total : total + 20,
        deliveryAddress: address
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });

      const newOrder = orderRes.data;

      // Step 2: Create Payment Intent
      const paymentRes = await axios.post('http://localhost:5000/api/payments/create-order', {
        orderId: newOrder._id,
        amount: newOrder.totalAmount,
        method: paymentMethod
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });

      if (paymentMethod === 'cod') {
        setTrackingId(newOrder._id);
        setCart([]);
        alert('Order Placed with Cash on Delivery!');
        return;
      }

      setCurrentOrder({ ...newOrder, razorpayOrderId: paymentRes.data.orderId });
      setShowPayment(true);
    } catch (err) {
      console.error('Checkout error', err);
      alert('Failed to initialize payment.');
    }
  };

  const handlePaymentConfirm = async () => {
    try {
      // Step 3: Verify Payment
      await axios.post('http://localhost:5000/api/payments/verify', {
        razorpayOrderId: currentOrder.razorpayOrderId,
        orderId: currentOrder._id
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });

      setTrackingId(currentOrder._id);
      setCart([]);
      setShowPayment(false);
    } catch (err) {
      console.error('Payment error', err);
      alert('Payment failed.');
      setShowPayment(false);
    }
  };

  if (trackingId) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 className="text-primary">Order Placed Successfully!</h2>
        <p className="text-muted" style={{ margin: '1rem 0 2rem 0' }}>Your order is now being prepared. Tracking ID: {trackingId}</p>
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
          <h3>Live Tracking</h3>
          <p><strong>Status:</strong> Preparing</p>
          <p><strong>Est. Time:</strong> 15 mins</p>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
            <div style={{ width: '30%', height: '100%', background: 'var(--primary)', transition: 'width 1s ease' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-muted" style={{ marginTop: '2rem' }}>Your cart is empty.</p>
      ) : (
        <div className="flex gap-4" style={{ marginTop: '2rem' }}>
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map((item, idx) => (
              <div key={idx} className="card flex justify-between items-center" style={{ padding: '1rem 1.5rem' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>Quantity: 1</span>
                </div>
                <span style={{ fontWeight: 'bold' }}>₹{item.price}</span>
              </div>
            ))}
          </div>
          
          <div className="card" style={{ flex: 1, height: 'fit-content' }}>
            <h3>Order Summary</h3>
            <div className="flex justify-between" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              <span className="text-muted">Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-muted">Delivery Fee</span>
              {isFirstDelivery ? (
                <span className="text-primary">FREE (First Order)</span>
              ) : (
                <span>₹20</span>
              )}
            </div>
            <div className="flex justify-between" style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>₹{isFirstDelivery ? total : total + 20}</span>
            </div>

            <input 
              type="text" 
              className="input-field" 
              placeholder="Delivery Address" 
              value={address}
              onChange={e => setAddress(e.target.value)}
            />

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Payment Method</label>
              <select className="input-field" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ color: '#000' }}>
                <option value="upi">UPI (GPay, PhonePe)</option>
                <option value="card">Credit / Debit Card</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={initiateCheckout}>
              Proceed to Pay
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal Mockup */}
      {showPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Payment System</h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button className="btn-primary" style={{ flex: 1, pointerEvents: 'none' }}>
                Paying via {paymentMethod.toUpperCase()}
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <input className="input-field" placeholder="Card Number (e.g. 4242 4242...)" />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input className="input-field" placeholder="MM/YY" />
                  <input className="input-field" placeholder="CVC" />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '2rem' }}>
                <input className="input-field" placeholder="Enter UPI ID (e.g. user@okbank)" />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowPayment(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handlePaymentConfirm}>Pay ₹{isFirstDelivery ? total : total + 20}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
