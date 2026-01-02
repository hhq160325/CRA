import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoutButton from '../../../shared/components/LogoutButton';

const OwnerLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm min-h-screen">
        <div className="px-6 pt-4">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">{t('ownerMenu')}</h2>
            <nav className="space-y-2">
              <Link to="/owner" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('dashboard')}
              </Link>

              <Link to="/owner/park_lot_dashboard" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/park_lot_dashboard') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('ParkLotDashboard')}
              </Link>

              <Link to="/owner/maintenance" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/maintenance') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h13M9 7h13M7 17H4a2 2 0 01-2-2V9a2 2 0 012-2h3" />
                </svg>
                {t('maintenanceSchedule')}
              </Link>

              <Link to="/owner/maintenance-calendar" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/maintenance-calendar') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('maintenanceCalendar')}
              </Link>

              <Link to="/owner/usage" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/usage') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                {/* <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V3a1 1 0 112 0v8m-2 10V13a1 1 0 112 0v8m-8-4h12M5 7h14" />
                </svg> */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" stroke="#e5e7eb" fill="black" version="1.1" id="Layer_1" viewBox="0 0 512.006 512.006">
                  <g>
                    <g>
                      <path d="M499.2,428.791h-12.8V181.299l7.834,3.302c1.613,0.674,3.302,0.998,4.966,0.998c4.983,0,9.737-2.935,11.802-7.834    c2.739-6.511-0.316-14.012-6.835-16.759l-243.2-102.4c-3.174-1.323-6.75-1.323-9.924,0l-243.2,102.4    c-6.528,2.748-9.574,10.249-6.835,16.759c2.748,6.537,10.3,9.54,16.759,6.835l7.834-3.302v247.492H12.8    c-7.074,0-12.8,5.726-12.8,12.8s5.726,12.8,12.8,12.8h486.4c7.074,0,12.8-5.726,12.8-12.8    C512,434.517,506.274,428.791,499.2,428.791z M409.6,428.791H102.4v-51.2h307.2V428.791z M409.6,352H102.4v-51.2h307.2V352z     M409.6,275.2H102.4V224h307.2V275.2z M460.8,428.791h-25.6v-204.8c0-14.131-11.46-25.591-25.6-25.591H102.4    c-14.14,0-25.6,11.46-25.6,25.6v204.8H51.2V170.521L256,84.284l204.8,86.229V428.791z" />
                    </g>
                  </g>
                </svg>
                {t('usageAndMileage')}
              </Link>

              <Link to="/owner/rentals" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/rentals') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h18M5 10l1.5-3h11L19 10M6 16h12a2 2 0 002-2v-1H4v1a2 2 0 002 2z" />
                </svg>
                {t('rentalHistory')}
              </Link>

              {/* <Link to="/owner/feedback" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/feedback') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 8l-4-4V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H7z" />
                </svg>
                {t('customerFeedback')}
              </Link> */}

              <Link to="/owner/inquiries" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/inquiries') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 2H8l-2 2" />
                </svg>
                {t('inquiries')}
              </Link>

              <Link to="/owner/bookings" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/bookings') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('bookingsPickupReturn')}
              </Link>

              <Link to="/owner/payments" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/payments') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m3-4h-8m0 0l3-3m-3 3l3 3" />
                </svg>
                {t('payments')}
              </Link>

              <Link to="/owner/calendar" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/calendar') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('calendar')}
              </Link>

              {/* <Link to="/owner/maps" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/maps') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('maps')}
              </Link> */}
              <Link
                to="/owner/report_car"
                className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner/report_car') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="currentColor" stroke="currentColor" id="Layer_1" data-name="Layer 1" viewBox="0 0 122.88 87.76"><path className="cls-1" d="M9.31,42c-10-5.11-8.9-10.8,1.2-10.21l2.26,4.24,4.66-14.49c1.83-5.7,4.87-10.87,10.85-10.87H64.64v5.7H30.26c-4.55,0-6.88,3.94-8.29,8.28L17.6,39.24v0h47V65.4a8.6,8.6,0,0,0,8.53,8.53H112l-.27,4.42v6a3.4,3.4,0,0,1-3.4,3.39H93.88a3.4,3.4,0,0,1-3.4-3.39V81.64H22v2.73a3.4,3.4,0,0,1-3.39,3.39H4.12a3.4,3.4,0,0,1-3.4-3.39V76.54a4.73,4.73,0,0,1,0-.53C-.34,62-1.88,49.26,9.31,42ZM75.11,6.44h8.16v5.28H79.75a2.9,2.9,0,0,0-2.88,2.87v44.3a2.89,2.89,0,0,0,2.88,2.87h35.08a2.89,2.89,0,0,0,2.88-2.87V14.59a2.9,2.9,0,0,0-2.88-2.87h-3.52V6.44h8.16a3.43,3.43,0,0,1,3.41,3.41V63.23a3.43,3.43,0,0,1-3.41,3.4H75.11a3.43,3.43,0,0,1-3.41-3.4V9.85a3.41,3.41,0,0,1,3.41-3.41ZM90.7,50.63a1.83,1.83,0,1,1,0-3.66h13.19a1.83,1.83,0,0,1,0,3.66Zm-3.9-11a1.83,1.83,0,1,1,0-3.66h21a1.83,1.83,0,0,1,0,3.66ZM83.36,28.54a1.83,1.83,0,1,1,0-3.65h27.86a1.83,1.83,0,1,1,0,3.65ZM88,4.75h3.86a5.13,5.13,0,0,1,10.22,0l4.52,0a.58.58,0,0,1,.57.57V13a.58.58,0,0,1-.57.57H88a.58.58,0,0,1-.57-.57V5.32A.57.57,0,0,1,88,4.75Zm6.86,2.34a3.85,3.85,0,0,0,1.38,1.19,2.44,2.44,0,0,0,1.34,0,3.75,3.75,0,0,0,1.61-1.71,3.33,3.33,0,0,0,0-.56,2.3,2.3,0,1,0-4.6,0,2.67,2.67,0,0,0,.22,1.06Zm-67,51.61L14.94,57.08c-3-.34-3.86.94-2.82,3.56L13.51,64A4.86,4.86,0,0,0,15.25,66a5.83,5.83,0,0,0,2.88.79l11.48.09c2.77,0,4-1.11,3.1-3.66a6.18,6.18,0,0,0-4.9-4.48Z" /></svg>
                {t('reportcar')}
              </Link>
              <div className="pt-4 border-t mt-4">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{t('registerNewCarSection')}</h3>
                <nav className="space-y-1">
                  <Link to="/owner/register_car" className={`block px-3 py-2 rounded-lg ${isActive('/register-car') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>{t('registerNewCar')}</Link>
                  <Link to="/owner/car_regis_docs" className={`block px-3 py-2 rounded-lg ${isActive('/owner/car-regis-docs') ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>{t('submitVehicleRegistrationCertificate')}</Link>
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


