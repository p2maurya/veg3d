import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import foodRoutes from './routes/food.js';
import orderRoutes from './routes/orders.js';
import aiRoutes from './routes/ai.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);

// Serve generated images
app.use('/api/images', express.static('C:\\Users\\DELL\\.gemini\\antigravity\\brain\\39a65e1b-c8d5-435f-968e-e4d47ce43d3a'));

app.get('/', (req, res) => {
  res.send('Veg3D Delivery API is running');
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/veg3d';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Even if db fails, keep server running for frontend dev
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (No DB)`));
  });
