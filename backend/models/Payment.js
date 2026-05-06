import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  method: { type: String, enum: ['upi', 'card', 'netbanking', 'wallet', 'cod'], required: true },
  status: { type: String, enum: ['created', 'authorized', 'captured', 'refunded', 'failed'], default: 'created' }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
