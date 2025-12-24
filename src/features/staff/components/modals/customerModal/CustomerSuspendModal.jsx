import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { createUserReport } from '../../CustomerManagement/services/userReportService';

const CustomerSuspendModal = ({ selectedCustomer, onSuspend, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSuspend = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create user report with 100 deducted points for suspension
      await createUserReport({
        title: 'Account Suspension',
        content: `Customer account suspended for policy violations. Account: ${selectedCustomer.name} (${selectedCustomer.email})`,
        deductedPoints: 100,
        reportedUserId: selectedCustomer.id
      });

      // Call the original onSuspend callback
      if (onSuspend) {
        await onSuspend();
      }

      toast.success(t('customerSuspendedSuccessfully') || 'Customer suspended successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to suspend customer:', err);
      const errorMessage = err.message || t('failedToSuspendCustomer') || 'Failed to suspend customer';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {t('suspendCustomerAccount')}
            </h3>
            <p className="mt-2 text-sm text-red-700">
              {t('suspendCustomerWarning')} <strong>{selectedCustomer.name}</strong>{t('suspendCustomerDescription')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">{t('accountDetails')}</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">{t('email')}:</span> {selectedCustomer.email}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleSuspend}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (t('suspending') || 'Suspending...') : (t('suspendAccount') || 'Suspend Account')}
        </button>
      </div>
    </div>
  );
};

export default CustomerSuspendModal;