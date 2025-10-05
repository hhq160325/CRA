import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RegisterCar, RegisterCarStep2, RegisterCarStep3 } from '../features/cars';
import { ProfilePage } from '../features/user';
import { FavouriteCarPage } from '../features/user/components';
import { RentalHistoryPage } from '../features/user/components';
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
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/register-car" element={<RegisterCar />} />
      <Route path="/register-car/step-2" element={<RegisterCarStep2 />} />
      <Route path="/register-car/step-3" element={<RegisterCarStep3 />} />
      <Route path="/register-car/step-3" element={<RegisterCarStep3 />} />
      <Route path="/register-car/step-3" element={<RegisterCarStep3 />} />
      {/* Add your other routes here */}
    </Routes>
  );
};

export default AppRouter;