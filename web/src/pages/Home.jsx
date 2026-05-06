import React from 'react';
import { Link } from 'react-router-dom';
import FoodModel from '../components/FoodModel';

export default function Home() {
  return (
    <div className="container animate-fade-in">
      <div style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Experience Food in <span className="text-primary">3D</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Discover delicious, 100% vegetarian meals. Rotate, zoom, and explore before you order. First delivery is absolutely FREE!
        </p>
        <Link to="/menu" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
          Explore Menu
        </Link>
      </div>

      <div className="flex gap-4" style={{ marginTop: '4rem' }}>
        <div className="card" style={{ flex: 1 }}>
          <div className="canvas-container" style={{ height: '300px' }}>
            <FoodModel type="/images/aloo_paratha_1778050952636.png" color="#4ade80" />
          </div>
          <h3>Aloo Paratha</h3>
          <p className="text-muted">Golden crispy stuffed flatbread.</p>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div className="canvas-container" style={{ height: '300px' }}>
            <FoodModel type="/images/paneer_butter_masala_1778050982234.png" color="#facc15" />
          </div>
          <h3>Paneer Butter Masala</h3>
          <p className="text-muted">Rich, creamy, and irresistible.</p>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div className="canvas-container" style={{ height: '300px' }}>
            <FoodModel type="/images/chole_bhature_1778051090571.png" color="#a3e635" />
          </div>
          <h3>Chole Bhature</h3>
          <p className="text-muted">Spicy brown chickpea curry.</p>
        </div>
      </div>
    </div>
  );
}
