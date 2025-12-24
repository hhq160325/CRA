import { exportReceiptToPDF, printReceipt } from '../../../staff-util/ExportReceiptToPDF';
import { useTranslation } from 'react-i18next';

const RentalDetailsModal = ({ isOpen, rental, onClose, getStatusBadge, getPaymentBadge, onExtendBooking }) => {
  const { t } = useTranslation();
  if (!isOpen || !rental) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900"> {t('rentalHistory.rentalDetails')} - {rental.bookingId}</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => printReceipt(rental)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${rental.status?.toLowerCase() === 'cancelled'
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                title={rental.status?.toLowerCase() === 'cancelled' ? t('rentalHistory.cannotPrintCancelled') : t('rentalHistory.printReceipt')}
                disabled={rental.status?.toLowerCase() === 'cancelled'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>{t('rentalHistory.print')}</span>
              </button>
              <button
                onClick={() => exportReceiptToPDF(rental)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${rental.status?.toLowerCase() === 'cancelled'
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                title={rental.status?.toLowerCase() === 'cancelled' ? t('rentalHistory.cannotExportCancelled') : t('rentalHistory.exportPDF')}
                disabled={rental.status?.toLowerCase() === 'cancelled'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t('rentalHistory.pdf')}</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Car & Customer Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{t('rentalHistory.vehicleInformation')}</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">{t('rentalHistory.vehicleName')}</p>
                  <p className="font-medium text-gray-900">{rental.carName}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t('rentalHistory.licensePlateNumber')}</p>
                  <p className="font-medium text-gray-900">{rental.licensePlate}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t('rentalHistory.vehicleCode')}</p>
                  <p className="font-medium text-gray-900">{rental.carId}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{t('rentalHistory.customerInformation')}</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">{t('rentalHistory.name')}</p>
                  <p className="font-medium text-gray-900">{rental.customer}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t('rentalHistory.email')}</p>
                  <p className="font-medium text-gray-900">{rental.customerEmail}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t('rentalHistory.phoneNumber')}</p>
                  <p className="font-medium text-gray-900">{rental.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('rentalHistory.rentalDuration')}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{t('rentalHistory.startDate')}</p>
                <p className="font-medium text-gray-900">{rental.startDate}</p>
                <p className="text-xs text-gray-500">{t('rentalHistory.pickupCar')}: {rental.pickupDate}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('rentalHistory.endDate')}</p>
                <p className="font-medium text-gray-900">{rental.endDate}</p>
                <p className="text-xs text-gray-500">{t('rentalHistory.returnCar')}: {rental.returnDate}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('rentalHistory.duration')}</p>
                <p className="font-medium text-gray-900">{rental.duration} {t('rentalHistory.days')}</p>
              </div>
              <div>
                {(rental.status === 'confirmed' || rental.status === 'checkedIn') && onExtendBooking && (
                  <button
                    onClick={() => onExtendBooking(rental)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    {t('rentalHistory.renewRental')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('rentalHistory.financialInformation')}</h3>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-green-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">{t('rentalHistory.totalBill')}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.totalPaidAmountShow)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">{t('rentalHistory.totalPaid')}</p>
                  <p className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.totalPaidAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">{t('rentalHistory.remaining')}</p>
                  <p className="text-lg font-bold text-orange-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.remainingPayment)}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className={`grid gap-4 ${rental.hasAdditionalFee && rental.hasExtendBookingFee ? 'grid-cols-4' :
                rental.hasAdditionalFee || rental.hasExtendBookingFee ? 'grid-cols-3' :
                  'grid-cols-2'
                }`}>
                {/* Booking Fee */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {t('rentalHistory.depositFee')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('rentalHistory.amount')}:</span>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.bookingFeePaid)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('rentalHistory.status')}:</span>
                      <span className={getPaymentBadge(rental.bookingFeeStatus)}>
                        {rental.bookingFeeStatus}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">{t('rentalHistory.method')}:</span>
                      <span className="font-medium text-gray-900">{rental.bookingFeePaymentMethod}</span>
                    </div> */}
                  </div>
                </div>

                {/* Rental Fee */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('rentalHistory.rentalFee')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('rentalHistory.amount')}:</span>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.rentalFeePaid)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('rentalHistory.status')}:</span>
                      <span className={getPaymentBadge(rental.rentalFeeStatus)}>
                        {rental.rentalFeeStatus}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">{t('rentalHistory.method')}:</span>
                      <span className="font-medium text-gray-900">{rental.rentalFeePaymentMethod}</span>
                    </div> */}
                  </div>
                </div>

                {/* Additional Fee */}
                {rental.hasAdditionalFee && (
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('rentalHistory.additionalFee')}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('rentalHistory.amount')}:</span>
                        <span className="font-semibold text-gray-900">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.additionalFeePaid)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('rentalHistory.status')}:</span>
                        <span className={getPaymentBadge(rental.additionalFeeStatus)}>
                          {rental.additionalFeeStatus}
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-gray-600">{t('rentalHistory.method')}:</span>
                        <span className="font-medium text-gray-900">{rental.additionalFeePaymentMethod}</span>
                      </div> */}
                    </div>
                  </div>
                )}

                {/* Extend Booking Fee */}
                {rental.hasExtendBookingFee && (
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('rentalHistory.renewalFee')}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('rentalHistory.amount')}:</span>
                        <span className="font-semibold text-gray-900">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.extendBookingFeePaid)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('rentalHistory.status')}:</span>
                        <span className={getPaymentBadge(rental.extendBookingFeeStatus)}>
                          {rental.extendBookingFeeStatus}
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-gray-600">{t('rentalHistory.method')}:</span>
                        <span className="font-medium text-gray-900">{rental.extendBookingFeePaymentMethod}</span>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>

              {/* Daily Rate */}
              {rental.dailyRate > 0 && (
                <div className="pt-3 border-t border-green-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{t('rentalHistory.dailyRate')}: {rental.carName}</span>
                    <span className="font-semibold text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.dailyRate)}/{t('rentalHistory.days')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Status */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('rentalHistory.bookingStatus')}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">{t('rentalHistory.currentStatus')}</p>
                <span className={getStatusBadge(rental.status)}>
                  {rental.status?.toUpperCase() || 'N/A'}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">{t('rentalHistory.bookingCreationDate')}</p>
                <p className="font-medium text-gray-900">{new Date(rental.pickupDate).toLocaleDateString()}</p>
              </div>
              {rental.notes && (
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t('rentalHistory.notes')}</p>
                  <p className="text-sm text-gray-700 italic">{rental.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('rentalHistory.additionalInformation')}</h3>
            <div className="text-sm">
              <div>
                <p className="text-gray-600">{t('rentalHistory.invoiceCode')}</p>
                <p className="font-medium text-gray-900">{rental.invoiceId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailsModal;
