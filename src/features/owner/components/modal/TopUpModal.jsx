import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TopUpModal = ({ isOpen, onClose, selectedCar }) => {
  const { t } = useTranslation();
  const [topUpForm, setTopUpForm] = useState({
    amount: '',
    paymentMethod: 'credit_card',
    note: '',
  });
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpError, setTopUpError] = useState(null);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const handleTopUpFormChange = (e) => {
    const { name, value } = e.target;
    setTopUpForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopUp = async (e) => {
    e.preventDefault();

    if (!selectedCar) return;

    // Validation
    if (!topUpForm.amount || parseFloat(topUpForm.amount) <= 0) {
      setTopUpError(t('topUpModal.invalidAmount'));
      return;
    }

    try {
      setTopUpLoading(true);
      setTopUpError(null);

      // TODO: Replace with actual API call when available
      const payload = {
        carId: selectedCar.id,
        amount: parseFloat(topUpForm.amount),
        paymentMethod: topUpForm.paymentMethod,
        note: topUpForm.note || '',
      };

      console.log('Top-up payload (placeholder):', payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setTopUpSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      console.error('Error processing top-up:', err);
      setTopUpError(err.response?.data?.message || t('topUpModal.topUpError'));
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleClose = () => {
    setTopUpForm({
      amount: '',
      paymentMethod: 'credit_card',
      note: '',
    });
    setTopUpError(null);
    setTopUpSuccess(false);
    onClose();
  };

  if (!isOpen || !selectedCar) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t('topUpModal.title')}</h2>
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

        <form onSubmit={handleTopUp} className="p-6 space-y-6">
          {/* Car Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">{t('topUpModal.car')}</p>
            <p className="font-medium text-gray-900 text-lg">{selectedCar.carName}</p>
            <p className="text-sm text-gray-500">{selectedCar.licensePlate}</p>
          </div>

          {/* Success Message */}
          {topUpSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-800 font-medium">{t('topUpModal.successMessage')}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {topUpError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{topUpError}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('topUpModal.amountLabel')} <span className="text-red-500">{t('topUpModal.required')}</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="amount"
                  value={topUpForm.amount}
                  onChange={handleTopUpFormChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={topUpLoading || topUpSuccess}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('topUpModal.paymentMethodLabel')} <span className="text-red-500">{t('topUpModal.required')}</span>
              </label>
              <select
                name="paymentMethod"
                value={topUpForm.paymentMethod}
                onChange={handleTopUpFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                disabled={topUpLoading || topUpSuccess}
              >
                <option value="credit_card">{t('topUpModal.creditCard')}</option>
                <option value="debit_card">{t('topUpModal.debitCard')}</option>
                <option value="bank_transfer">{t('topUpModal.bankTransfer')}</option>
                <option value="paypal">{t('topUpModal.paypal')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('topUpModal.noteLabel')}
              </label>
              <textarea
                name="note"
                value={topUpForm.note}
                onChange={handleTopUpFormChange}
                placeholder={t('topUpModal.notePlaceholder')}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                disabled={topUpLoading || topUpSuccess}
              />
            </div>
          </div>

          {/* Placeholder Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-yellow-800 font-medium text-sm">{t('topUpModal.placeholderTitle')}</p>
                <p className="text-yellow-700 text-sm mt-1">{t('topUpModal.placeholderMessage')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={topUpLoading}
            >
              {t('topUpModal.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={topUpLoading || topUpSuccess}
            >
              {topUpLoading ? t('topUpModal.processing') : t('topUpModal.topUpButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopUpModal;