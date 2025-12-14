import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getStatusBadge } from '../utils/statusUtils';
import ExtendedBooking from './ExtendedBooking';

const BookingTable = ({ bookings, onBookingUpdate }) => {
  const { t } = useTranslation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  const handleExtendRent = (booking) => {
    // Convert booking data to match ExtendedBooking component expectations
    const rentalData = {
      carId: booking.carId,
      carName: booking.carName,
      licensePlate: booking.licensePlate,
      customer: booking.customer,
      endDate: booking.endDate,
      bookingId: booking.bookingId
    };
    setSelectedBooking(rentalData);
    setIsExtendModalOpen(true);
  };

  const handleExtendSuccess = () => {
    setIsExtendModalOpen(false);
    setSelectedBooking(null);
    // Call parent callback to refresh bookings
    if (onBookingUpdate) {
      onBookingUpdate();
    }
  };

  const handleExtendClose = () => {
    setIsExtendModalOpen(false);
    setSelectedBooking(null);
  };

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
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('bookingManagement.actions')}
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
                <td className="py-4 px-6">
                  {(booking.status === 'Confirmed' || booking.status === 'checkedIn') && (
                        <button
                          onClick={() => handleExtendRent(booking)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          {t('rentalHistory.extend')}
                        </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extended Booking Modal */}
      <ExtendedBooking
        isOpen={isExtendModalOpen}
        rental={selectedBooking}
        onClose={handleExtendClose}
        onSuccess={handleExtendSuccess}
      />
    </div>
  );
};

export default BookingTable;