import { Routes, Route } from 'react-router-dom';
import { RegisterCar, RegisterCarStep2, RegisterCarStep3, CarDetail } from '../features/cars';
import { ProfilePage } from '../features/user';
import { FavouriteCarPage } from '../features/user/components';
import { RentalHistoryPage } from '../features/user/components';
import { PaymentPage } from '../features/payment';
import { AdminLayout, AdminDashboard, OperationsDashboard, TransactionMonitoring } from '../features/admin';
// Placeholder components - replace with your actual pages
const HomePage = () => (
  <div className="container mx-auto px-6 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to MORENT</h1>
    <p className="text-gray-600 mb-6">Your car rental platform is ready!</p>
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Quick Links</h2>
      <div className="space-y-2">
        <a href="/cars/1" className="block text-blue-600 hover:text-blue-700 underline">
          View Nissan GT-R Details
        </a>
        <a href="/register-car" className="block text-blue-600 hover:text-blue-700 underline">
          Register a Car
        </a>
        <a href="/profile" className="block text-blue-600 hover:text-blue-700 underline">
          View Profile
        </a>
        <a href="/payment" className="block text-blue-600 hover:text-blue-700 underline">
          Payment Page
        </a>
        <a href="/admin" className="block text-blue-600 hover:text-blue-700 underline">
          Admin Dashboard
        </a>
      </div>
    </div>
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
      <Route path="/profile/favourite-car" element={<FavouriteCarPage />} />
      <Route path="/profile/rental-history" element={<RentalHistoryPage />} />
      <Route path="/cars/:id" element={<CarDetail />} />
      <Route path="/payment" element={<PaymentPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="operations" element={<OperationsDashboard />} />
        <Route path="transactions" element={<TransactionMonitoring />} />
      </Route>
      
      {/* Add your other routes here */}
    </Routes>
  );
};

export default AppRouter;