import { useTranslation } from 'react-i18next';
import BookingViewModal from '../../Booking Monitoring/components/BookingViewModal';
import BookingEditModal from './BookingEditModal';
import BookingCancelModal from './BookingCancelModal';
import BookingResolveModal from './BookingResolveModal';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  selectedBooking, 
  modalType, 
  onEdit, 
  onCancel,
  onResolve,
  onChangeModalType,
  getStatusBadge,
  getPaymentBadge 
}) => {
  const { t } = useTranslation();
  
  if (!isOpen || !selectedBooking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {modalType === 'view' && t('bookingDetails')}
            {modalType === 'edit' && t('editBooking')}
            {modalType === 'cancel' && t('cancelBooking')}
            {modalType === 'resolve' && t('resolveOverdueBooking')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        {modalType === 'view' && (
          <BookingViewModal
            selectedBooking={selectedBooking}
            getStatusBadge={getStatusBadge}
            getPaymentBadge={getPaymentBadge}
            onChangeModalType={onChangeModalType}
          />
        )}

        {modalType === 'edit' && (
          <BookingEditModal
            selectedBooking={selectedBooking}
            onEdit={onEdit}
            onClose={onClose}
          />
        )}

        {modalType === 'cancel' && (
          <BookingCancelModal
            selectedBooking={selectedBooking}
            onCancel={onCancel}
            onClose={onClose}
          />
        )}

        {modalType === 'resolve' && (
          <BookingResolveModal
            selectedBooking={selectedBooking}
            onResolve={onResolve}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default BookingModal;