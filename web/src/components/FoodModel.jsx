import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';

function RotatingShape({ type, color }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  const getGeometry = () => {
    switch (type) {
      case 'cube': return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case 'cylinder': return <cylinderGeometry args={[1, 1, 1.5, 32]} />;
      case 'sphere': return <sphereGeometry args={[1, 32, 32]} />;
      case 'torus': return <torusGeometry args={[0.8, 0.4, 16, 100]} />;
      default: return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {getGeometry()}
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
    </Float>
  );
}

export default function FoodModel({ type, color }) {
  // If type is a URL or absolute path, it's a real image, else fallback
  const isImage = type && (type.startsWith('http') || type.startsWith('/'));
  
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {isImage ? (
        <img src={type} alt="Food" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
             onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} 
             onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
      ) : (
        <div style={{ background: color, width: '100%', height: '100%' }} />
      )}
    </div>
  );
}
