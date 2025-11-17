import { useTranslation } from 'react-i18next';
import CustomerViewModal from './CustomerViewModal';
import CustomerEditModal from './CustomerEditModal';
import CustomerSuspendModal from './CustomerSuspendModal';

const CustomerModal = ({ 
  isOpen, 
  onClose, 
  selectedCustomer, 
  modalType, 
  onEdit, 
  onSuspend, 
  onChangeModalType,
  getStatusBadge,
  getVerificationBadge 
}) => {
  const { t } = useTranslation();
  
  if (!isOpen || !selectedCustomer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 [--tw-space-y-reverse:false!important]">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {modalType === 'view' && t('customerDetails')}
            {modalType === 'edit' && t('editCustomer')}
            {modalType === 'suspend' && t('suspendCustomer')}
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
          <CustomerViewModal
            selectedCustomer={selectedCustomer}
            getStatusBadge={getStatusBadge}
            getVerificationBadge={getVerificationBadge}
            onChangeModalType={onChangeModalType}
          />
        )}

        {modalType === 'edit' && (
          <CustomerEditModal
            selectedCustomer={selectedCustomer}
            onEdit={onEdit}
            onClose={onClose}
          />
        )}

        {modalType === 'suspend' && (
          <CustomerSuspendModal
            selectedCustomer={selectedCustomer}
            onSuspend={onSuspend}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerModal;