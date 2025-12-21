import { useTranslation } from 'react-i18next';
import { getActionBadge, formatTimestamp } from '../utils/carHandoverUtils';

const CarHandoverModal = ({ isOpen, selectedLog, staffMap, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen || !selectedLog) return null;

  const staff = staffMap[selectedLog.responsibleStaffId];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('logDetails') || 'Log Details'}
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

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('logId') || 'Log ID'}
              </label>
              <p className="text-sm text-gray-900">
                {selectedLog.id}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('timestamp') || 'Timestamp'}
              </label>
              <p className="text-sm text-gray-900">
                {formatTimestamp(selectedLog.timestamp)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('staff') || 'Staff'}
              </label>
              <p className="text-sm text-gray-900">
                {staff ? staff.name : 'Unknown Staff'}
              </p>
              <p className="text-sm text-gray-500">
                {staff ? staff.email : selectedLog.responsibleStaffId}
              </p>
              <p className="text-xs text-gray-400">
                ID: {selectedLog.responsibleStaffId}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('type') || 'Type'}
              </label>
              <span className={getActionBadge(selectedLog.type)}>
                {selectedLog.type || 'N/A'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('description') || 'Description'}
            </label>
            <p className="text-sm text-gray-900">
              {selectedLog.description || 'N/A'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('scheduleId') || 'Schedule ID'}
              </label>
              <p className="text-sm text-gray-900">
                {selectedLog.scheduleId || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('verificationMethod') || 'Verification Method'}
              </label>
              <p className="text-sm text-gray-900">
                {selectedLog.verificationMethod || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarHandoverModal;