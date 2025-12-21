import { useTranslation } from 'react-i18next';
import { getActionBadge, formatTimestamp } from '../utils/staffLogUtils';

const StaffLogModal = ({ isOpen, log, staffMap, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen || !log) return null;

  const staff = staffMap[log.staffId];

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
              <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                {log.id}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('timestamp') || 'Timestamp'}
              </label>
              <p className="text-sm text-gray-900">
                {formatTimestamp(log.timestamp)}
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
              <p className="text-xs text-gray-500">
                {staff ? staff.email : log.staffId}
              </p>
              <p className="text-xs text-gray-500">
                {log.staffId}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                {t('action') || 'Action'}
              </label>
              <span className={getActionBadge(log.action)}>
                {log.action}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('handoverId') || 'Related Handover ID'}
            </label>
            <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
              {log.relatedHandoverId || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogModal;