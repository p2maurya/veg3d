import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isVegetarian: { type: Boolean, default: true },
  vegBadge: { type: String, default: '🌱' },
  modelUrl: { type: String, required: true }, // URL to .glb or .gltf
  color: { type: String, default: '#4ade80' }, // For placeholder shapes
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { 
    type: String, 
    enum: ['Budget Meals', 'Thali', 'Snacks', 'Beverages', 'Healthy', 'Combo'], 
    default: 'Budget Meals' 
  },
  prepTime: { type: String, default: '15 mins' },
  ratings: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('FoodItem', foodItemSchema);
