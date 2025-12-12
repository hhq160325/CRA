import { useTranslation } from 'react-i18next';
import { getStatusBadge } from '../utils/statusUtils';

const BookingTable = ({ bookings }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('bookingManagement.bookingId')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('bookingManagement.vehicleInfo')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('bookingManagement.customer')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('bookingManagement.rentalPeriod')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('bookingManagement.pickupReturnTime')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('bookingManagement.status')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{booking.bookingId}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{booking.carName}</div>
                  <div className="text-xs text-gray-500">{booking.licensePlate}</div>
                  <div className="text-xs text-gray-400">{booking.carId}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{booking.customer}</div>
                  <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                  <div className="text-xs text-gray-400">{booking.customerPhone}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900">{booking.startDate}</div>
                  <div className="text-xs text-gray-500">
                    {t('bookingManagement.to')} {booking.endDate}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.endDate === new Date().toISOString().split('T')[0] ? t('bookingManagement.today') : ''}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900">
                    {t('bookingManagement.pickup')}: {booking.pickupTime}
                  </div>
                  <div className="text-sm text-gray-900">
                    {t('bookingManagement.return')}: {booking.returnTime}
                  </div>
                  {booking.checkInDate && (
                    <div className="text-xs text-green-600">
                      {t('bookingManagement.pickedUp')}: {booking.checkInDate.split(' ')[1]}
                    </div>
                  )}
                  {booking.checkOutDate && (
                    <div className="text-xs text-purple-600">
                      {t('bookingManagement.returned')}: {booking.checkOutDate.split(' ')[1]}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  {(() => {
                    const badge = getStatusBadge(booking.status, t);
                    return <span className={badge.className}>{badge.label}</span>;
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;