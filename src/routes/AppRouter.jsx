import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RegisterCar, RegisterCarStep2, RegisterCarStep3, CarDetail, CarRental } from '../features/cars';
import { ProfilePage } from '../features/user';
import { PaymentPage } from '../features/payment';
import { AdminLayout, AdminDashboard, OperationsDashboard, TransactionMonitoring } from '../features/admin';
import { StaffLayout, StaffDashboard, CarOwnerManagement, CustomerManagement, BookingMonitoring, NotificationCenter } from '../features/staff';
import { OwnerLayout, OwnerDashboard, MaintenanceSchedule, UsageTracking, RentalHistory, CustomerFeedback, Inquiries, BookingManagement, Payments } from '../features/owner';
import { AuthPage } from '../features/auth';
import ForgotPassword from '../features/auth/components/ForgotPassword';
import SearchResult from '../features/search/components/SearchResult';
import { HomePage } from '../features/homepage';
import { selectIsAuthenticated } from '../features/auth/authSlice';

const AppRouter = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      {/* Public routes - no authentication required */}
      <Route path="/" element={<HomePage />} />
      <Route path="/cars" element={<CarRental />} />
      <Route path="/cars/:id" element={<CarDetail />} />
      <Route path="/search" element={<SearchResult />} />
      
      {/* Auth route */}
      <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected routes - authentication required */}
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />} />
      <Route path="/profile/favourite-car" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />} />
      <Route path="/profile/rental-history" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />} />
      <Route path="/profile/inbox" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />} />
      <Route path="/profile/calendar" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />} />
      <Route path="/profile/reimburse" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />} />
      <Route path="/profile/settings" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />} />
      <Route path="/profile/help-center" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />} />
      <Route path="/register-car" element={isAuthenticated ? <RegisterCar /> : <Navigate to="/auth" replace />} />
      <Route path="/register-car/step-2" element={isAuthenticated ? <RegisterCarStep2 /> : <Navigate to="/auth" replace />} />
      <Route path="/register-car/step-3" element={isAuthenticated ? <RegisterCarStep3 /> : <Navigate to="/auth" replace />} />
      <Route path="/payment" element={isAuthenticated ? <PaymentPage /> : <Navigate to="/auth" replace />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/auth" replace />}>
        <Route index element={<AdminDashboard />} />
        <Route path="operations" element={<OperationsDashboard />} />
        <Route path="transactions" element={<TransactionMonitoring />} />
      </Route>
      
      {/* Staff Routes */}
      <Route path="/staff" element={isAuthenticated ? <StaffLayout /> : <Navigate to="/auth" replace />}>
        <Route index element={<StaffDashboard />} />
        <Route path="car-owners" element={<CarOwnerManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="bookings" element={<BookingMonitoring />} />
        <Route path="notifications" element={<NotificationCenter />} />
      </Route>

      {/* Car Owner (Manager) Routes */}
      <Route path="/owner" element={isAuthenticated ? <OwnerLayout /> : <Navigate to="/auth" replace />}>
        <Route index element={<OwnerDashboard />} />
        <Route path="maintenance" element={<MaintenanceSchedule />} />
        <Route path="usage" element={<UsageTracking />} />
        <Route path="rentals" element={<RentalHistory />} />
        <Route path="feedback" element={<CustomerFeedback />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="payments" element={<Payments />} />
      </Route>
      
      {/* Add your other routes here */}
    </Routes>
  );
};

export default AppRouter;