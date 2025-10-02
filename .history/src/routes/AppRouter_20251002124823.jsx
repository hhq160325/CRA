import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RegisterCar } from '../features/cars';

// Placeholder components - replace with your actual pages
const HomePage = () => (
  <div className="container mx-auto px-6 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to MORENT</h1>
    <p className="text-gray-600">Your car rental platform is ready!</p>
  </div>
);

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Add your other routes here */}
    </Routes>
  );
};

export default AppRouter;