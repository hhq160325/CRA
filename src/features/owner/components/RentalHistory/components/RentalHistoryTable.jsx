import { useTranslation } from 'react-i18next';
import { getStatusBadge, getPaymentBadge, useTranslateStatus, formatVND } from '../utils/rentalUtils';
import Pagination from '../../../../../shared/components/Pagination';

const RentalHistoryTable = ({
  paginatedRentals,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewDetails,
  onExtendBooking
}) => {
  const { t } = useTranslation();
  const translateStatus = useTranslateStatus();
  console.log(paginatedRentals);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.invoiceCode')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.carInfo')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.customer')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.rentalTime')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.duration')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.amount')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.bookingFeeStatus')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.rentalFeeStatus')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.additionalFeeStatus')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.extendBookingFeeStatus')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.bookingStatus')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedRentals.length === 0 ? (
              <tr>
                <td colSpan="12" className="py-8 text-center text-gray-500">
                  {t('rentalHistory.noRentalHistory')}
                </td>
              </tr>
            ) : (
              paginatedRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{rental.bookingId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{rental.carName}</div>
                    <div className="text-xs text-gray-500">{rental.licensePlate}</div>
                    <div className="text-xs text-gray-400">{rental.carId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{rental.customer}</div>
                    <div className="text-xs text-gray-500">{rental.customerEmail}</div>
                    <div className="text-xs text-gray-400">{rental.customerPhone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{rental.startDate}</div>
                    <div className="text-xs text-gray-500">{t('to')} {rental.endDate}</div>
                    <div className="text-xs text-gray-400">{rental.pickupDate.split(' ')[1]}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{rental.duration} {t('rentalHistory.days')}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{formatVND(rental.totalPaidAmountShow)}</div>
                    <div className="text-xs text-gray-500">{t('rentalHistory.bookingFee')}: {formatVND(rental.bookingFeePaid)}</div>
                    <div className="text-xs text-gray-500">{t('rentalHistory.rentalFee')}: {formatVND(rental.rentalFeePaid)}</div>
                    {rental.hasAdditionalFee && (
                      <div className="text-xs text-gray-500">{t('rentalHistory.additionalFee')}: {formatVND(rental.additionalFeePaid)}</div>
                    )}
                    {rental.hasExtendBookingFee && (
                      <div className="text-xs text-gray-500">{t('rentalHistory.extendBookingFee')}: {formatVND(rental.extendBookingFeePaid)}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={getPaymentBadge(rental.bookingFeeStatus)}>
                      {translateStatus(rental.bookingFeeStatus)} 
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{formatVND(rental.bookingFeePaid)}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{rental.bookingFeePaymentMethod}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getPaymentBadge(rental.rentalFeeStatus)}>
                      {translateStatus(rental.rentalFeeStatus)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{formatVND(rental.rentalFeePaid)}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{rental.rentalFeePaymentMethod}</div>
                  </td>
                  <td className="py-4 px-6">
                    {rental.hasAdditionalFee ? (
                      <>
                        <span className={getPaymentBadge(rental.additionalFeeStatus)}>
                          {translateStatus(rental.additionalFeeStatus)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{formatVND(rental.additionalFeePaid)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{rental.additionalFeePaymentMethod}</div>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {rental.hasExtendBookingFee ? (
                      <>
                        <span className={getPaymentBadge(rental.extendBookingFeeStatus)}>
                          {translateStatus(rental.extendBookingFeeStatus)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{formatVND(rental.extendBookingFeePaid)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{rental.extendBookingFeePaymentMethod}</div>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(rental.status)}>
                      {translateStatus(rental.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => onViewDetails(rental)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {t('rentalHistory.viewDetails')}
                      </button>
                      {(rental.status === 'confirmed' || rental.status === 'checkedIn') && (
                        <button
                          onClick={() => onExtendBooking(rental)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          {t('rentalHistory.extend')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default RentalHistoryTable;