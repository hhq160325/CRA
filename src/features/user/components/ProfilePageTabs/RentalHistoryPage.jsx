import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, CAR_ENDPOINTS } from '../../../../config/api';
import { decodeJWT } from '../../../auth/utils';

const RentalHistoryPage = () => {
  const { t } = useTranslation();
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRentalHistory = async () => {
      try {
        setLoading(true);
        
        // Get userId from JWT token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const decoded = decodeJWT(token);
        const currentUserId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;

        if (!currentUserId) {
          setError('Unable to get user information');
          setLoading(false);
          return;
        }

        // Fetch bookings for current customer
        const bookingsResponse = await axiosInstance.get(BOOKING_ENDPOINTS.GET_CUSTOMER_BOOKINGS(currentUserId));
        const userBookings = bookingsResponse.data;

        // Fetch all cars
        const carsResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
        const allCars = carsResponse.data;

        // Create a map of cars for quick lookup
        const carsMap = {};
        allCars.forEach(car => {
          carsMap[car.id] = car;
        });

        // Combine booking and car data
        const history = userBookings.map((booking, index) => {
          const car = carsMap[booking.carId];
          const pickupDate = new Date(booking.pickupTime);
          
          return {
            id: index + 1,
            carName: car?.model || 'Unknown Car',
            // type: car?.model || 'N/A',
            brand: car?.manufacturer || 'N/A',
            plateNo: car?.licensePlate || 'N/A',
            rentDay: pickupDate.toISOString().split('T')[0],
            status: booking.status === 'Pending' ? 'UnPaid' : booking.status,
            paymentDate: 'No Payment'
          };
        });

        setRentalHistory(history);
        setError(null);
      } catch (err) {
        console.error('Error fetching rental history:', err);
        setError('Failed to load rental history');
      } finally {
        setLoading(false);
      }
    };

    fetchRentalHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(rentalHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = rentalHistory.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h1 className="hidden lg:block text-xl font-semibold text-gray-900">{t('Rental History')}</h1>
          <h1 className="lg:hidden text-lg font-semibold text-gray-900">{t('Rental History')}</h1>
        </div>

        {rentalHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t('noRentalHistory') || 'No rental history found'}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden">
          {currentItems.map((rental) => (
            <div key={rental.id} className="border-b border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{rental.carName}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${rental.status === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {rental.status === 'Paid' ? t('paid') : t('unpaid')}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                {/* <div className="flex justify-between">
                  <span>{t('type')}:</span>
                  <span>{rental.type}</span>
                </div> */}
                <div className="flex justify-between">
                  <span>{t('brand')}:</span>
                  <span>{rental.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('plateNo')}:</span>
                  <span>{rental.plateNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('rentDay')}:</span>
                  <span>{rental.rentDay}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('paymentDate')}:</span>
                  <span>{rental.paymentDate === 'No Payment' ? t('noPayment') : rental.paymentDate}</span>
                </div>
              </div>
              </div>
            ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('no')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('carName')}</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('brand')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('plateNo')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('rentDay')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentDate')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.carName}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.type}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.plateNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.rentDay}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${rental.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {rental.status === 'Paid' ? t('paid') : t('unpaid')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.paymentDate === 'No Payment' ? t('noPayment') : rental.paymentDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('previous') || 'Previous'}
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('next') || 'Next'}
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      {t('showing') || 'Showing'} <span className="font-medium">{startIndex + 1}</span> {t('to') || 'to'}{' '}
                      <span className="font-medium">{Math.min(endIndex, rentalHistory.length)}</span> {t('of') || 'of'}{' '}
                      <span className="font-medium">{rentalHistory.length}</span> {t('results') || 'results'}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">{t('previous') || 'Previous'}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNumber
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">{t('next') || 'Next'}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RentalHistoryPage;