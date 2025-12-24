import { useTranslation } from 'react-i18next';
import Pagination from '../../../../../shared/components/Pagination';

const MaintenanceScheduleTable = ({
  paginatedSchedules,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewDetails,
  onMarkCompleted,
  getStatusBadge,
  getPriorityBadge
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.carInfo')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.maintenanceDate')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.maintenanceTime')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.maintenanceType')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.status')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.priority')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedSchedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{schedule.carName}</div>
                  <div className="text-xs text-gray-500">{schedule.carModel} • {schedule.licensePlate}</div>
                  <div className="text-xs text-gray-400">{schedule.carId}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900">{t('maintenanceSchedule.fromTo', {
                    start: schedule.startDateMaintenanceDate,
                    end: schedule.endDateMaintenanceDate
                  })}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium text-gray-900">{t('maintenanceSchedule.timeFromTo', {
                    start: schedule.pickupTime,
                    end: schedule.returnTime
                  })}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900">{schedule.maintenanceType}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={getStatusBadge(schedule.status)}>
                    {t(`maintenanceSchedule.${schedule.status}`)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={getPriorityBadge(schedule.priority)}>
                    {t(`maintenanceSchedule.${schedule.priority}`)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewDetails(schedule)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('maintenanceSchedule.view')}
                    </button>
                    {(schedule.status === 'due' || schedule.status === 'overdue' || schedule.status === 'Active') ? (
                      <button
                        onClick={() => {
                          // console.log('=== TABLE MARK AS COMPLETED BUTTON CLICKED ===');
                          // console.log('schedule.scheduleId:', schedule.scheduleId);
                          // console.log('schedule full object:', schedule);
                          // console.log('Calling onMarkCompleted...');
                          onMarkCompleted(schedule.scheduleId);
                        }}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        {t('maintenanceSchedule.complete')}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default MaintenanceScheduleTable;