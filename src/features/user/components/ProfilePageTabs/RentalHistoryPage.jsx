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
          {rentalHistory.map((rental) => (
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
                  {rentalHistory.map((rental) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default RentalHistoryPage;