import { useTranslation } from 'react-i18next';

const CarOwnerViewModal = ({
  selectedOwner,
  getStatusBadge,
  // getVerificationBadge,
  onChangeModalType
}) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
            <p className="text-gray-900">{selectedOwner.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <p className="text-gray-900">{selectedOwner.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
            <p className="text-gray-900">{selectedOwner.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
            <span className={getStatusBadge(selectedOwner.status)}>
              {selectedOwner.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('registrationDate')}</label>
            <p className="text-gray-900">{selectedOwner.registrationDate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('carsListed')}</label>
            <p className="text-gray-900">{selectedOwner.carsListed}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('totalEarnings')}</label>
            <p className="text-gray-900">${(selectedOwner.totalEarnings || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* View Mode Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        {/* <button
          onClick={() => onChangeModalType('edit')}
          className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {t('edit')}
        </button> */}
        {selectedOwner.status === 'active' && (
          <button
            onClick={() => onChangeModalType('suspend')}
            className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            {t('suspend')}
          </button>
        )}
      </div>
    </>
  );
};

export default CarOwnerViewModal;