import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // optional for OTP login
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'vendor', 'delivery', 'admin'], default: 'user' },
  isApproved: { type: Boolean, default: false }, // for vendors & delivery
  earnings: { type: Number, default: 0 }, // for vendors & delivery
  hasUsedFirstFreeDelivery: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
