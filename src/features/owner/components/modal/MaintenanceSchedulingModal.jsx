import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createCarSchedule } from '../../ownerApi';

const MaintenanceSchedulingModal = ({ isOpen, onClose, selectedCar }) => {
  const { t } = useTranslation();
  const [maintenanceForm, setMaintenanceForm] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    note: '',
  });
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState(null);
  const [maintenanceSuccess, setMaintenanceSuccess] = useState(false);

  const handleMaintenanceFormChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault();

    if (!selectedCar) return;

    // Validation
    if (!maintenanceForm.title || !maintenanceForm.location || !maintenanceForm.startDate || !maintenanceForm.endDate) {
      setMaintenanceError(t('maintenanceModal.fillRequiredFields'));
      return;
    }

    if (new Date(maintenanceForm.startDate) >= new Date(maintenanceForm.endDate)) {
      setMaintenanceError(t('maintenanceModal.endDateAfterStart'));
      return;
    }

    try {
      setMaintenanceLoading(true);
      setMaintenanceError(null);

      const payload = {
        title: maintenanceForm.title,
        location: maintenanceForm.location,
        startDate: new Date(maintenanceForm.startDate).toISOString(),
        endDate: new Date(maintenanceForm.endDate).toISOString(),
        note: maintenanceForm.note || '',
        carId: selectedCar.id
      };

      await createCarSchedule(payload);

      setMaintenanceSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      console.error('Error scheduling maintenance:', err);
      setMaintenanceError(err.response?.data?.message || t('maintenanceModal.schedulingError'));
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleClose = () => {
    setMaintenanceForm({
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      note: '',
    });
    setMaintenanceError(null);
    setMaintenanceSuccess(false);
    onClose();
  };

  if (!isOpen || !selectedCar) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t('maintenanceModal.title')}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleScheduleMaintenance} className="p-6 space-y-6">
          {/* Car Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">{t('maintenanceModal.car')}</p>
            <p className="font-medium text-gray-900 text-lg">{selectedCar.carName}</p>
            <p className="text-sm text-gray-500">{selectedCar.licensePlate}</p>
          </div>

          {/* Success Message */}
          {maintenanceSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-800 font-medium">{t('maintenanceModal.successMessage')}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {maintenanceError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{maintenanceError}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('maintenanceModal.titleLabel')} <span className="text-red-500">{t('maintenanceModal.required')}</span>
              </label>
              <input
                type="text"
                name="title"
                value={maintenanceForm.title}
                onChange={handleMaintenanceFormChange}
                placeholder={t('maintenanceModal.titlePlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={maintenanceLoading || maintenanceSuccess}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('maintenanceModal.locationLabel')} <span className="text-red-500">{t('maintenanceModal.required')}</span>
              </label>
              <input
                type="text"
                name="location"
                value={maintenanceForm.location}
                onChange={handleMaintenanceFormChange}
                placeholder={t('maintenanceModal.locationPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={maintenanceLoading || maintenanceSuccess}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('maintenanceModal.startDateLabel')} <span className="text-red-500">{t('maintenanceModal.required')}</span>
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={maintenanceForm.startDate}
                  onChange={handleMaintenanceFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                  disabled={maintenanceLoading || maintenanceSuccess}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('maintenanceModal.endDateLabel')} <span className="text-red-500">{t('maintenanceModal.required')}</span>
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={maintenanceForm.endDate}
                  onChange={handleMaintenanceFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                  disabled={maintenanceLoading || maintenanceSuccess}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('maintenanceModal.noteLabel')}
              </label>
              <textarea
                name="note"
                value={maintenanceForm.note}
                onChange={handleMaintenanceFormChange}
                placeholder={t('maintenanceModal.notePlaceholder')}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                disabled={maintenanceLoading || maintenanceSuccess}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={maintenanceLoading}
            >
              {t('maintenanceModal.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={maintenanceLoading || maintenanceSuccess}
            >
              {maintenanceLoading ? t('maintenanceModal.scheduling') : t('maintenanceModal.scheduleButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceSchedulingModal;
