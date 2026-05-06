import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App';
import FoodModel from '../components/FoodModel';

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'under100', '50to80'
  const { cart, setCart } = useContext(AppContext);

  useEffect(() => {
    fetchFoods();
  }, [filter]);

  const fetchFoods = async () => {
    setLoading(true);
    let url = 'http://localhost:5000/api/food';
    if (filter === 'under100') url += '?maxPrice=100';
    if (filter === '50to80') url += '?minPrice=50&maxPrice=80';
    
    try {
      const res = await axios.get(url);
      if (res.data && res.data.length > 0) {
        setFoods(res.data);
      } else {
        throw new Error('Database is empty');
      }
    } catch (err) {
      console.error('Error fetching foods, using fallback', err);
      // Fallback data so the site is never boring!
      let fallback = [
        { _id: '64b4c3d8f8a1e50012345671', name: 'Dal Chawal', description: 'Yellow lentil curry with steamed rice and ghee', price: 90, modelUrl: '/images/dal_chawal_1778050618321.png', color: '#facc15' },
        { _id: '64b4c3d8f8a1e50012345672', name: 'Bati Chokha', description: 'Traditional Bihari roasted wheat balls with mashed brinjal', price: 120, modelUrl: '/images/bati_chokha_1778050648286.png', color: '#a3e635' },
        { _id: '64b4c3d8f8a1e50012345673', name: 'Aloo Paratha', description: 'Stuffed potato flatbread with curd and butter', price: 60, modelUrl: '/images/aloo_paratha_1778050952636.png', color: '#4ade80' },
        { _id: '64b4c3d8f8a1e50012345674', name: 'Paneer Butter Masala', description: 'Rich creamy tomato curry with paneer cubes', price: 180, modelUrl: '/images/paneer_butter_masala_1778050982234.png', color: '#fb923c' },
        { _id: '64b4c3d8f8a1e50012345675', name: 'Chole Bhature', description: 'Spicy chickpea curry with deep-fried puffy bread', price: 100, modelUrl: '/images/chole_bhature_1778051090571.png', color: '#fef08a' }
      ];
      if (filter === 'under100') fallback = fallback.filter(f => f.price <= 100);
      if (filter === '50to80') fallback = fallback.filter(f => f.price >= 50 && f.price <= 80);
      setFoods(fallback);
    }
    setLoading(false);
  };

  const addToCart = (food) => {
    setCart([...cart, food]);
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h2>Explore Our 3D Menu</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={filter === 'all' ? 'btn-primary' : 'btn-outline'} 
            onClick={() => setFilter('all')}
          >All</button>
          <button 
            className={filter === 'under100' ? 'btn-primary' : 'btn-outline'} 
            onClick={() => setFilter('under100')}
          >Under ₹100</button>
          <button 
            className={filter === '50to80' ? 'btn-primary' : 'btn-outline'} 
            onClick={() => setFilter('50to80')}
          >₹50 - ₹80</button>
        </div>
      </div>

      {loading ? <p>Loading menu...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {foods.map(food => (
            <div key={food._id} className="card">
              <div className="canvas-container">
                <FoodModel type={food.modelUrl} color={food.color} />
              </div>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{food.name}</h3>
                <span className="text-primary" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{food.price}</span>
              </div>
              <p className="text-muted" style={{ marginBottom: '1.5rem', flex: 1 }}>{food.description}</p>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => addToCart(food)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
