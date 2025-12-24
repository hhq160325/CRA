import { useTranslation } from 'react-i18next';

const MaintenanceDetailsModal = ({
  isOpen,
  selectedCar,
  onClose,
  onScheduleMaintenance,
  onMarkCompleted,
  getStatusBadge,
  getPriorityBadge
}) => {
  const { t } = useTranslation();

  if (!isOpen || !selectedCar) return null;
  console.log("selectedCar", selectedCar);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t('maintenanceSchedule.maintenanceDetails')}</h2>
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
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t('maintenanceSchedule.carName')}</p>
              <p className="font-medium text-gray-900">{selectedCar.carName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('maintenanceSchedule.licensePlate')}</p>
              <p className="font-medium text-gray-900">{selectedCar.licensePlate}</p>
            </div>
            {/* <div>
              <p className="text-sm text-gray-600">{t('maintenanceSchedule.currentMileage')}</p>
              <p className="font-medium text-gray-900">{selectedCar.currentMileage.toLocaleString()} km</p>
            </div> */}
            <div>
              <p className="text-sm text-gray-600">{t('maintenanceSchedule.startDays')}</p>
              <p className="font-medium text-gray-900">{selectedCar.startDateMaintenanceDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('maintenanceSchedule.endDays')}</p>
              <p className="font-medium text-gray-900">{selectedCar.endDateMaintenanceDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('maintenanceSchedule.maintenanceType')}</p>
              <p className="font-medium text-gray-900">{selectedCar.maintenanceType}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('maintenanceSchedule.scheduleTitle')}</p>
            <p className="whitespace-pre-line text-wrap">{selectedCar.scheduleTitle}</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <span className={getStatusBadge(selectedCar.status)}>{t(`maintenanceSchedule.${selectedCar.status}`)}</span>
              <span className={getPriorityBadge(selectedCar.priority)}>{t('maintenanceSchedule.priorityLevel')} {t(`maintenanceSchedule.${selectedCar.priority}`)}</span>
            </div>
          </div>
          <div className="pt-4 flex space-x-3">
            {/* <button
              onClick={() => onScheduleMaintenance(selectedCar)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('maintenanceSchedule.scheduleMaintenance')}
            </button> */}
            {(selectedCar.status === 'due' || selectedCar.status === 'overdue' || selectedCar.status === 'Active') && (
              <button
                onClick={() => {
                  // console.log('=== MODAL MARK AS COMPLETED BUTTON CLICKED ===');
                  // console.log('selectedCar.scheduleId:', selectedCar.scheduleId);
                  // console.log('selectedCar full object:', selectedCar);
                  // console.log('Calling onMarkCompleted...');
                  onMarkCompleted(selectedCar.scheduleId);
                }}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('maintenanceSchedule.markAsCompleted')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetailsModal;