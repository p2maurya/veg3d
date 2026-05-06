import express from 'express';
import FoodItem from '../models/FoodItem.js';

const router = express.Router();

// Get all food items, optionally filter by price
router.get('/', async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    let query = { isVegetarian: true }; // Ensure vegetarian

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const foods = await FoodItem.find(query);
    res.json(foods);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Seed some initial data
router.post('/seed', async (req, res) => {
  try {
    const items = [
      { name: 'Dal Chawal', description: 'Yellow lentil curry with steamed rice and ghee', price: 90, modelUrl: 'http://localhost:5000/api/images/dal_chawal_1778050618321.png', color: '#facc15' },
      { name: 'Bati Chokha', description: 'Traditional Bihari roasted wheat balls with mashed brinjal', price: 120, modelUrl: 'http://localhost:5000/api/images/bati_chokha_1778050648286.png', color: '#a3e635' },
      { name: 'Aloo Paratha', description: 'Stuffed potato flatbread with curd and butter', price: 60, modelUrl: 'http://localhost:5000/api/images/aloo_paratha_1778050952636.png', color: '#4ade80' },
      { name: 'Paneer Butter Masala', description: 'Rich creamy tomato curry with paneer cubes', price: 180, modelUrl: 'http://localhost:5000/api/images/paneer_butter_masala_1778050982234.png', color: '#fb923c' },
      { name: 'Chole Bhature', description: 'Spicy chickpea curry with deep-fried puffy bread', price: 100, modelUrl: 'http://localhost:5000/api/images/chole_bhature_1778051090571.png', color: '#fef08a' }
    ];
    await FoodItem.deleteMany();
    await FoodItem.insertMany(items);
    res.json({ message: 'Database seeded' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
