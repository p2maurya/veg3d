import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  discountApplied: { type: Boolean, default: false }, // For first free delivery
  paymentMethod: { type: String, enum: ['upi', 'card', 'cod'], default: 'upi' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  status: { type: String, enum: ['pending', 'accepted', 'preparing', 'picked', 'out_for_delivery', 'delivered'], default: 'pending' },
  deliveryAddress: { type: String, required: true },
  gpsLocation: { lat: Number, lng: Number },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
