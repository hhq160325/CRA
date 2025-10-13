import { Routes, Route } from 'react-router-dom';
import { RegisterCar, RegisterCarStep2, RegisterCarStep3, CarDetail } from '../features/cars';
import { ProfilePage } from '../features/user';
import { FavouriteCarPage } from '../features/user/components';
import { RentalHistoryPage } from '../features/user/components';
import { PaymentPage } from '../features/payment';
import { AdminLayout, AdminDashboard, OperationsDashboard, TransactionMonitoring } from '../features/admin';
import { StaffLayout, StaffDashboard, CarOwnerManagement, CustomerManagement, BookingMonitoring, NotificationCenter } from '../features/staff';
import { AuthPage } from '../features/auth';
import { HomePage } from '../features/homepage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/register-car" element={<RegisterCar />} />
      <Route path="/register-car/step-2" element={<RegisterCarStep2 />} />
      <Route path="/register-car/step-3" element={<RegisterCarStep3 />} />
      <Route path="/profile/favourite-car" element={<FavouriteCarPage />} />
      <Route path="/profile/rental-history" element={<RentalHistoryPage />} />
      <Route path="/cars" element={<HomePage />} />
      <Route path="/cars/:id" element={<CarDetail />} />
      <Route path="/payment" element={<PaymentPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="operations" element={<OperationsDashboard />} />
        <Route path="transactions" element={<TransactionMonitoring />} />
      </Route>
      
      {/* Staff Routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<StaffDashboard />} />
        <Route path="car-owners" element={<CarOwnerManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="bookings" element={<BookingMonitoring />} />
        <Route path="notifications" element={<NotificationCenter />} />
      </Route>
      
      {/* Add your other routes here */}
    </Routes>
  );
};

export default AppRouter;