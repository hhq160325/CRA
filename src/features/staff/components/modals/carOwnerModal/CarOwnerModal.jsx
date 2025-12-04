import { useTranslation } from 'react-i18next';
import CarOwnerViewModal from './CarOwnerViewModal';
import CarOwnerEditModal from './CarOwnerEditModal';
import CarOwnerSuspendModal from './CarOwnerSuspendModal';

const CarOwnerModal = ({ 
  isOpen, 
  onClose, 
  selectedOwner, 
  modalType, 
  onEdit, 
  onSuspend, 
  onChangeModalType,
  getStatusBadge,
  getVerificationBadge 
}) => {
  const { t } = useTranslation();
  
  if (!isOpen || !selectedOwner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 [--tw-space-y-reverse:false!important]">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {modalType === 'view' && t('carOwnerDetails')}
            {modalType === 'edit' && t('editCarOwner')}
            {modalType === 'suspend' && t('suspendCarOwner')}
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
          <CarOwnerViewModal
            selectedOwner={selectedOwner}
            getStatusBadge={getStatusBadge}
            // getVerificationBadge={getVerificationBadge}
            onChangeModalType={onChangeModalType}
          />
        )}

        {modalType === 'edit' && (
          <CarOwnerEditModal
            selectedOwner={selectedOwner}
            onEdit={onEdit}
            onClose={onClose}
          />
        )}

        {modalType === 'suspend' && (
          <CarOwnerSuspendModal
            selectedOwner={selectedOwner}
            onSuspend={onSuspend}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default CarOwnerModal;