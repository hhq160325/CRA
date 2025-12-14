import { useTranslation } from 'react-i18next';
import { formatDate, calculateRentalDays } from '../utils/formatters';

const RecentBookings = ({ bookings }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{t('recentBookings')}</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {t('viewAll')}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('bookingCode')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('customer')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('rentalDuration')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('pickUpTime')}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('returnTime')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.slice(0, 5).map((booking) => {
              const rentalDays = calculateRentalDays(booking.pickupTime, booking.dropoffTime);
              
              return (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 text-sm">
                      BK{String(booking.id).padStart(3, '0')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 text-sm">
                      {booking.customerName || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      {rentalDays > 0 ? `${rentalDays} ${t('days')}` : 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      {formatDate(booking.pickupTime)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      {formatDate(booking.dropoffTime)}
                    </div>
                  </td>
                </tr>
              );
            })}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  {t('noBookingsFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;