import { exportReceiptToPDF, printReceipt } from '../../owner-utils/ExportReceiptToPDF';

const RentalDetailsModal = ({ isOpen, rental, onClose, getStatusBadge, getPaymentBadge }) => {
  if (!isOpen || !rental) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết thuê xe - {rental.bookingId}</h2>
            <div className="flex items-center space-x-3">
              {/* <button
                onClick={() => printReceipt(rental)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="Print Receipt"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print</span>
              </button>
              <button
                onClick={() => exportReceiptToPDF(rental)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                title="Export to PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>PDF</span>
              </button> */}
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
              <h3 className="font-semibold text-gray-900 mb-3">Thông tin xe</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Tên xe</p>
                  <p className="font-medium text-gray-900">{rental.carName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Biển số xe</p>
                  <p className="font-medium text-gray-900">{rental.licensePlate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Mã xe</p>
                  <p className="font-medium text-gray-900">{rental.carId}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Tên</p>
                  <p className="font-medium text-gray-900">{rental.customer}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{rental.customerEmail}</p>
                </div>
                <div>
                  <p className="text-gray-600">Số điện thoại</p>
                  <p className="font-medium text-gray-900">{rental.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thời gian thuê xe</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Ngày bắt đầu</p>
                <p className="font-medium text-gray-900">{rental.startDate}</p>
                <p className="text-xs text-gray-500">Nhận xe: {rental.pickupDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Ngày kết thúc</p>
                <p className="font-medium text-gray-900">{rental.endDate}</p>
                <p className="text-xs text-gray-500">Trả xe: {rental.returnDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Thời lượng</p>
                <p className="font-medium text-gray-900">{rental.duration} ngày</p>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin tài chính</h3>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-green-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tổng đã thanh toán</p>
                  <p className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.totalPaidAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tổng hóa đơn</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Còn lại</p>
                  <p className="text-lg font-bold text-orange-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.remainingPayment)}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4">
                {/* Booking Fee */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Phí đặt cọc
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.bookingFeePaid)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={getPaymentBadge(rental.bookingFeeStatus)}>
                        {rental.bookingFeeStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="font-medium text-gray-900">{rental.bookingFeePaymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Rental Fee */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Phí thuê xe
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.rentalFeePaid)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={getPaymentBadge(rental.rentalFeeStatus)}>
                        {rental.rentalFeeStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="font-medium text-gray-900">{rental.rentalFeePaymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Rate */}
              {rental.dailyRate > 0 && (
                <div className="pt-3 border-t border-green-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Giá thuê hàng ngày: {rental.carName}</span>
                    <span className="font-semibold text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.dailyRate)}/ngày
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Status */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Trạng thái đặt xe</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">Trạng thái hiện tại</p>
                <span className={getStatusBadge(rental.status)}>
                  {rental.status?.toUpperCase() || 'N/A'}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">Ngày tạo đặt xe</p>
                <p className="font-medium text-gray-900">{new Date(rental.pickupDate).toLocaleDateString()}</p>
              </div>
              {rental.notes && (
                <div>
                  <p className="text-gray-600 text-sm mb-1">Ghi chú</p>
                  <p className="text-sm text-gray-700 italic">{rental.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Feedback & Rating */}
          {/* {rental.feedback && rental.feedback.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Customer Feedback
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({rental.totalFeedbacks} review{rental.totalFeedbacks !== 1 ? 's' : ''})
                </span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-yellow-600 mr-2">{rental.rating.toFixed(1)}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= rental.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {rental.feedback.slice(0, 3).map((fb, index) => (
                    <div key={index} className="bg-white rounded p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{fb.customerName || 'Anonymous'}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-3 h-3 ${star <= fb.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{fb.comment || 'No comment provided'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )} */}

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin bổ sung</h3>
            <div className="text-sm">
              <div>
                <p className="text-gray-600">Mã hóa đơn</p>
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
