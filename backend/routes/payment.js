import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { verifyToken } from '../middleware/auth.js';

// import Razorpay from 'razorpay';
// Uncomment and configure when you have API keys:
/*
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});
*/

const router = express.Router();

// 1. Create Payment Order (Triggered before checkout)
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    
    if (method === 'cod') {
       return res.json({ message: 'COD selected, skipping Razorpay' });
    }

    // Mock Razorpay Order Creation
    const mockRzpOrderId = `order_${Math.floor(Math.random() * 1000000)}`;

    if (req.user.id === 'mock_user_id') {
      return res.json({
        success: true,
        orderId: mockRzpOrderId,
        amount: amount * 100,
        currency: 'INR'
      });
    }

    const newPayment = new Payment({
      user: req.user.id,
      order: orderId,
      amount,
      method,
      razorpayOrderId: mockRzpOrderId,
      status: 'created'
    });
    
    await newPayment.save();

    res.json({
      success: true,
      orderId: mockRzpOrderId,
      amount: amount * 100,
      currency: 'INR'
    });

  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 2. Verify Payment (Triggered after UPI/Card success on frontend)
router.post('/verify', verifyToken, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Verify signature (Production logic commented)
    /*
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
                                    .update(body.toString())
                                    .digest('hex');
    if (expectedSignature !== razorpaySignature) {
       return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    */

    if (req.user && req.user.id === 'mock_user_id') {
      return res.json({ success: true, message: 'Mock Payment verified successfully' });
    }

    // Update Payment record
    const payment = await Payment.findOne({ razorpayOrderId });
    if (payment) {
      payment.razorpayPaymentId = razorpayPaymentId || `pay_${Math.floor(Math.random() * 1000000)}`;
      payment.razorpaySignature = razorpaySignature || 'mock_signature';
      payment.status = 'captured';
      await payment.save();
    }

    // Update Actual Order Status
    const order = await Order.findById(orderId).catch(() => null);
    if (order) {
      order.paymentStatus = 'completed';
      order.status = 'accepted'; // Move from pending to accepted
      await order.save();
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
