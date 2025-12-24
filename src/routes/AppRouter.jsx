import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RegisterCar, RegisterCarStep2, RegisterCarStep3, CarDetail, CarDetailRev, CarRental } from '../features/cars';
import { ProfilePage } from '../features/user';
import { PaymentPage, PaymentSuccess, PaymentCancel } from '../features/payment';
import { AdminLayout, AdminDashboard, OperationsDashboard, TransactionMonitoring, StaffManagement, StaffLog, CarHandover, CreateStaffAcc } from '../features/admin';
import { StaffLayout, StaffDashboard, CarOwnerManagement, CustomerManagement, BookingMonitoring, NotificationCenter, ParklotCreate, RegDocsApproved, DriverLicenseApprove, ReportCarMonitoring } from '../features/staff';
import { OwnerLayout, OwnerDashboard, MaintenanceSchedule, UsageTracking, RentalHistory, CustomerFeedback, Inquiries, BookingManagement, Payments, CarRegisDocs, Maps } from '../features/owner';
import { AuthPage, GoogleCallback, ForgotPassword, ResetPassword } from '../features/auth';
import SearchResult from '../features/search/components/SearchResult';
import { HomePage } from '../features/homepage';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLES, tokenUtils, getRedirectPathByRole } from '../features/auth/utils';
import CalendarPage from '../features/owner/components/CalendarPage';
// import RentalMonitoring from '../features/staff/components/RentalMonitoring'
import RentalMonitoring from '../features/staff/components/RentalMonitoring'
import MaintenanceCalendar from '../features/owner/components/MaintenanceScheduleCalendar/components/MaintenanceCalendar';
import { FavouriteCarPage, RentalHistoryPage, PaymentHistoryPage, InboxPage, ReimbursePage, SettingsPage, HelpCenterPage, MyProfile } from '../features/user/components';
import OtpVerify from '../features/auth/components/OtpVerify';
import Notification from '../features/user/components/ProfilePageTabs/Notification';
// Component to redirect authenticated users based on their role
const AuthRedirect = () => {
  const userRole = tokenUtils.getUserRole();
  const redirectPath = getRedirectPathByRole(userRole);
  return <Navigate to={redirectPath} replace />;
};

const AppRouter = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      {/* Public routes - no authentication required */}
      <Route path="/" element={<HomePage />} />
      <Route path="/cars" element={<CarRental />} />
      <Route path="/cars/:id" element={<CarDetail />} />
      <Route path="/search" element={<SearchResult />} />
      <Route path="/car_detail/:id" element={<CarDetailRev />} />
      {/* Auth route - redirects based on user role if already authenticated */}
      <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <AuthRedirect />} />
      <Route path="/auth/forgot_password" element={<ForgotPassword />} />
      <Route path="/auth/reset_password" element={<ResetPassword />} />
      <Route path="/otp-verify" element={<OtpVerify />} />
      <Route path="/auth/google_callback" element={<GoogleCallback />} />

      {/* Protected routes - authentication required */}
      <Route path="/profile" element={<RoleBasedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.OWNER, ROLES.STAFF, ROLES.ADMIN]}><ProfilePage /></RoleBasedRoute>}>
        <Route index element={<MyProfile />} />
        <Route path="favourite_car" element={<FavouriteCarPage />} />
        <Route path="favourite_car" element={<FavouriteCarPage />} />
        <Route path="rental_history" element={<RentalHistoryPage />} />
        <Route path="payment_history" element={<PaymentHistoryPage />} />
        <Route path="notification" element={<Notification />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="reimburse" element={<ReimbursePage />} />
        <Route path="security" element={<SettingsPage />} />
        <Route path="help_center" element={<HelpCenterPage />} />
      </Route>
      {/* <Route path="/register-car" element={isAuthenticated ? <RegisterCar /> : <Navigate to="/auth" replace />} />
      <Route path="/register-car/step-2" element={isAuthenticated ? <RegisterCarStep2 /> : <Navigate to="/auth" replace />} />
      <Route path="/register-car/step-3" element={isAuthenticated ? <RegisterCarStep3 /> : <Navigate to="/auth" replace />} /> */}
      <Route path="/payment" element={isAuthenticated ? <PaymentPage /> : <Navigate to="/auth" replace />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />

      {/* Admin Routes - Only accessible by Admin role */}
      <Route path="/admin" element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN]}><AdminLayout /></RoleBasedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="operations" element={<OperationsDashboard />} />
        <Route path="transactions" element={<TransactionMonitoring />} />
        <Route path="staff_management" element={<StaffManagement />} />
        <Route path="staff_log" element={<StaffLog />} />
        <Route path="car_handover" element={<CarHandover />} />
        <Route path="create_staff" element={<CreateStaffAcc />} />
      </Route>

      {/* Staff Routes - Only accessible by Staff role */}
      <Route path="/staff" element={<RoleBasedRoute allowedRoles={[ROLES.STAFF]}><StaffLayout /></RoleBasedRoute>}>
        <Route index element={<StaffDashboard />} />
        <Route path="car_owners" element={<CarOwnerManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="bookings" element={<BookingMonitoring />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="parklot_create" element={<ParklotCreate />} />
        <Route path="rental_monitoring" element={<RentalMonitoring />} />
        <Route path="reg_docs" element={<RegDocsApproved />} />
        <Route path="driver_license_approve" element={<DriverLicenseApprove />} />
        <Route path="maps" element={<Maps />} />
      </Route>

      {/* Car Owner (Manager) Routes */}
      <Route path="/owner" element={<RoleBasedRoute allowedRoles={[ROLES.OWNER]}> <OwnerLayout /> </RoleBasedRoute>}>
        <Route index element={<OwnerDashboard />} />
        <Route path="maintenance" element={<MaintenanceSchedule />} />
        <Route path="maintenance-calendar" element={<MaintenanceCalendar />} />
        <Route path="usage" element={<UsageTracking />} />
        <Route path="rentals" element={<RentalHistory />} />
        <Route path="feedback" element={<CustomerFeedback />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="payments" element={<Payments />} />
        <Route path="car_regis_docs" element={<CarRegisDocs />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="register_car" element={<RegisterCar />} />
        <Route path="register_car/step2" element={<RegisterCarStep2 />} />
        <Route path="register_car/step3" element={<RegisterCarStep3 />} />
        <Route path="report_car" element={<ReportCarMonitoring />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;