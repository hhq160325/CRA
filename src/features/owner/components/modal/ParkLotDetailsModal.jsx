import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ParkLotDetailsModal = ({ isOpen, onClose, selectedParkLot }) => {
  const { t } = useTranslation();

  if (!isOpen || !selectedParkLot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {t('parkLotManagement.parkLotDetails') || 'Park Lot Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t('parkLotManagement.basicInformation') || 'Basic Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{t('parkLotManagement.name') || 'Name'}</p>
                <p className="font-medium text-gray-900">{selectedParkLot.name}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('parkLotManagement.status') || 'Status'}</p>
                <p className="font-medium text-gray-900">{selectedParkLot.status}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('parkLotManagement.capacity') || 'Capacity'}</p>
                <p className="font-medium text-gray-900">{selectedParkLot.capacity} {t('parkLotManagement.spaces') || 'spaces'}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('parkLotManagement.contact') || 'Contact'}</p>
                <p className="font-medium text-gray-900">{selectedParkLot.contactNum}</p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {t('parkLotManagement.locationInformation') || 'Location Information'}
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{t('parkLotManagement.address') || 'Address'}</p>
                <p className="font-medium text-gray-900">{selectedParkLot.address}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('parkLotManagement.city') || 'City'}</p>
                <p className="font-medium text-gray-900">{selectedParkLot.city}</p>
              </div>
              {selectedParkLot.latitude && selectedParkLot.longtitude && (
                <div>
                  <p className="text-gray-600">{t('parkLotManagement.coordinates') || 'Coordinates'}</p>
                  <p className="font-medium text-gray-900">
                    {selectedParkLot.latitude.toFixed(6)}, {selectedParkLot.longtitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {selectedParkLot.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                {t('parkLotManagement.notes') || 'Notes'}
              </h3>
              <p className="text-sm text-gray-700">{selectedParkLot.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('common.close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkLotDetailsModal;