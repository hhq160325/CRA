import { Outlet, useLocation, Link } from 'react-router-dom';
import LogoutButton from '../../../shared/components/LogoutButton';

const OwnerLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm min-h-screen">
        <div className="px-6 pt-4">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">CAR OWNER MENU</h2>
            <nav className="space-y-2">
              <Link to="/owner" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>

              <Link to="/owner/maintenance" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/maintenance') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h13M9 7h13M7 17H4a2 2 0 01-2-2V9a2 2 0 012-2h3" />
                </svg>
                Maintenance Schedule
              </Link>

              <Link to="/owner/usage" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/usage') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V3a1 1 0 112 0v8m-2 10V13a1 1 0 112 0v8m-8-4h12M5 7h14" />
                </svg>
                Usage & Mileage
              </Link>

              <Link to="/owner/rentals" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/rentals') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h18M5 10l1.5-3h11L19 10M6 16h12a2 2 0 002-2v-1H4v1a2 2 0 002 2z" />
                </svg>
                Rental History
              </Link>

              <Link to="/owner/feedback" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/feedback') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 8l-4-4V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H7z" />
                </svg>
                Customer Feedback
              </Link>

              <Link to="/owner/inquiries" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/inquiries') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 2H8l-2 2" />
                </svg>
                Inquiries
              </Link>

              <Link to="/owner/bookings" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/bookings') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Booking (Check In/Out)
              </Link>

              <Link to="/owner/payments" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/payments') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m3-4h-8m0 0l3-3m-3 3l3 3" />
                </svg>
                Payments
              </Link>

              <div className="pt-4 border-t mt-4">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Register New Car</h3>
                <nav className="space-y-1">
                  <Link to="/register-car" className={`block px-3 py-2 rounded-lg ${isActive('/register-car') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>Register New Cars</Link>
                </nav>
              </div>
            </nav>
          </div>

          <div className="pt-4 border-t">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="h-full overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;


