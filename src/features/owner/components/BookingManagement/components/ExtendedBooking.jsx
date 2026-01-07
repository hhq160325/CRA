import { useState, useEffect } from 'react';
import axios from 'axios';
import { BOOKING_ENDPOINTS, BOOKING_API_CONFIG } from '../../../../../config/api';

const ExtendedBooking = ({ isOpen, rental, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    timeExtInDays: 1
  });
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
      setFormData({
        timeExtInDays: 1
      });
    }
  }, [isOpen]);

  if (!isOpen || !rental) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'timeExtInDays' ? Number(value) : value
    }));
  };

  const handleExtendBooking = async () => {
    console.log('=== EXTEND BOOKING DEBUG ===');
    console.log('Rental data received:', rental);
    console.log('Form data:', formData);
    
    if (!formData.timeExtInDays || formData.timeExtInDays <= 0) {
      setError('Vui lòng nhập số ngày gia hạn hợp lệ');
      return;
    }

    if (!rental.bookingId) {
      setError('Không tìm thấy booking ID. Vui lòng thử lại.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('jwtToken');
      
      // Step 1: Extend booking using the booking ID from props
      const extendBookingData = {
        bookingId: rental.bookingId,
        carId: rental.carId,
        timeExtInDays: formData.timeExtInDays,
        note: "string"
      };

      console.log('API Endpoint:', BOOKING_ENDPOINTS.EXTEND_BOOKING);
      console.log('Request payload:', extendBookingData);
      console.log('Request headers:', {
        ...BOOKING_API_CONFIG.headers,
        // Authorization: `Bearer ${token}`,
      });

      const extendResponse = await axios.patch(
        BOOKING_ENDPOINTS.EXTEND_BOOKING,
        extendBookingData,
        {
          headers: {
            ...BOOKING_API_CONFIG.headers,
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Extend booking response:', extendResponse.data);
      console.log('Response status:', extendResponse.status);
      console.log('Response headers:', extendResponse.headers);
      console.log('=== END DEBUG ===');
      
      setSuccess(`Đã gia hạn thành công ${formData.timeExtInDays} ngày cho booking ${rental.bookingId}`);
      
      // Call success callback to refresh parent component
      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setFormData({
        timeExtInDays: 1
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);

    } catch (error) {
      console.error('=== EXTEND BOOKING ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.message);
      console.error('=== END ERROR DEBUG ===');
      
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Có lỗi xảy ra khi gia hạn booking'
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateNewEndDate = () => {
    if (!rental.endDate || !formData.timeExtInDays) return '';
    
    const currentEndDate = new Date(rental.endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(currentEndDate.getDate() + formData.timeExtInDays);
    
    return newEndDate.toLocaleDateString('vi-VN');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Gia hạn thời gian thuê xe</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin booking hiện tại</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Mã booking</p>
                <p className="font-medium text-gray-900">{rental.bookingId}</p>
              </div>
              <div>
                <p className="text-gray-600">Xe</p>
                <p className="font-medium text-gray-900">{rental.carName} - {rental.licensePlate}</p>
              </div>
              <div>
                <p className="text-gray-600">Khách hàng</p>
                <p className="font-medium text-gray-900">{rental.customer}</p>
              </div>
              <div>
                <p className="text-gray-600">Ngày kết thúc hiện tại</p>
                <p className="font-medium text-gray-900">{rental.endDate}</p>
              </div>
            </div>
          </div>

          {/* Extension Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số ngày gia hạn <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="timeExtInDays"
                value={formData.timeExtInDays}
                onChange={handleInputChange}
                min="0"
                max="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập số ngày muốn gia hạn"
                disabled={loading}
              />
              {formData.timeExtInDays > 0 && (
                <p className="mt-1 text-sm text-blue-600">
                  Ngày kết thúc mới: {calculateNewEndDate()}
                </p>
              )}
            </div>


          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              onClick={handleExtendBooking}
              disabled={loading || !rental.bookingId || !formData.timeExtInDays || formData.timeExtInDays <= 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Đang xử lý...' : 'Gia hạn booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendedBooking;