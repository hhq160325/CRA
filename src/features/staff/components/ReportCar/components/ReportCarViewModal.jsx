import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import axios from 'axios';
import { CAR_ENDPOINTS } from '../../../../../config/api';

const ReportCarViewModal = ({
  selectedReport,
  getStatusBadge,
  onChangeModalType,
  onReportUpdate
}) => {
  const { t } = useTranslation();
  const [isRecalling, setIsRecalling] = useState(false);

  // Log selectedReport to see its structure
  // console.log('selectedReport:', selectedReport);

  const handleRecallCar = async () => {
    if (!selectedReport?.reportedCarId || !selectedReport?.carLicensePlate) {
      alert('Missing car information');
      return;
    }

    try {
      setIsRecalling(true);
      const token = localStorage.getItem('jwtToken');

      const requestBody = {
        carId: selectedReport.reportedCarId,
        licensePlate: selectedReport.carLicensePlate,
        isActive: false
      };

      await axios.patch(CAR_ENDPOINTS.PATCH_CAR_ACTIVE_STATUS, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      alert('Car has been recalled successfully');

      // Notify parent component to refresh data
      if (onReportUpdate) {
        onReportUpdate();
      }
    } catch (error) {
      console.error('Error recalling car:', error);
      alert('Failed to recall car. Please try again.');
    } finally {
      setIsRecalling(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('reportNo')}</label>
            <p className="text-gray-900">{selectedReport.reportNo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
            <span className={getStatusBadge(selectedReport.status)}>
              {t(selectedReport.status)}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('title')}</label>
            <p className="text-gray-900">{selectedReport.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('reporter')}</label>
            <p className="text-gray-900">{selectedReport.reporterName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('reporterEmail')}</label>
            <p className="text-gray-900">{selectedReport.reporterEmail}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('reporterPhone')}</label>
            <p className="text-gray-900">{selectedReport.reporterPhone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('car')}</label>
            <p className="text-gray-900">{selectedReport.carName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('licensePlate')}</label>
            <p className="text-gray-900">{selectedReport.carLicensePlate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('carOwner')}</label>
            <p className="text-gray-900">{selectedReport.carOwner}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('carOwnerEmail')}</label>
            <p className="text-gray-900">{selectedReport.carEmail}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('carOwnerPhone')}</label>
            <p className="text-gray-900">{selectedReport.carPhoneNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('createdAt')}</label>
            <p className="text-gray-900">{selectedReport.createDate}</p>
          </div>
        </div>

        {selectedReport.content && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('reportContent')}</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedReport.content}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          onClick={() => onChangeModalType('edit')}
          className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {t('edit')}
        </button>

        <button
          onClick={handleRecallCar}
          disabled={isRecalling}
          className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecalling ? t('recalling') : t('recallCar')}
        </button>

        {selectedReport.status === 'pending' && (
          <button
            onClick={() => onChangeModalType('resolve')}
            className="px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            {t('resolve')}
          </button>
        )}
      </div>
    </>
  );
};

export default ReportCarViewModal;