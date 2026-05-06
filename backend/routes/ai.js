import express from 'express';
import FoodItem from '../models/FoodItem.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMsg = message.toLowerCase();
    
    // Simple rule-based mock engine
    let reply = "I can help you find delicious vegetarian meals. What are you craving?";
    let suggestedFoods = [];

    if (lowerMsg.includes('under 80') || lowerMsg.includes('< 80')) {
      reply = "Here are some great options under ₹80:";
      suggestedFoods = await FoodItem.find({ price: { $lt: 80 } }).limit(3);
    } else if (lowerMsg.includes('suggest') || lowerMsg.includes('recommend')) {
      reply = "Based on the time of day, you might like these:";
      // Just pick random items for suggestion
      suggestedFoods = await FoodItem.aggregate([{ $sample: { size: 3 } }]);
    }

    res.json({
      reply,
      suggestions: suggestedFoods
    });

  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
