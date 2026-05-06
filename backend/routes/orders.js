import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;
    
    // Check if first delivery
    const user = await User.findById(req.user.id).catch(() => null);
    let finalAmount = totalAmount;
    let discountApplied = false;

    if (user && !user.hasUsedFirstFreeDelivery) {
      // Apply discount (e.g., reduce delivery fee or flat discount)
      // Assuming a flat 20 delivery fee that gets waived
      finalAmount = Math.max(0, finalAmount - 20);
      discountApplied = true;
      user.hasUsedFirstFreeDelivery = true;
      await user.save();
    }

    // If mock user, don't save to DB, just return success
    if (!user) {
      return res.json({ _id: `mock_order_${Math.floor(Math.random()*1000)}`, totalAmount: finalAmount });
    }

    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount: finalAmount,
      discountApplied,
      deliveryAddress,
      status: 'pending'
    });

    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Live tracking route (mock)
router.get('/:id/tracking', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json({
      status: order.status,
      driverLocation: { lat: 28.7041, lng: 77.1025 }, // Mock coordinates
      estimatedTime: '15 mins'
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
