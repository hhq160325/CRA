import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addFundToWallet } from '../../api/ownerApi';

const TopUpModal = ({ isOpen, onClose, selectedCar }) => {
  const { t } = useTranslation();
  const [topUpForm, setTopUpForm] = useState({
    amount: '',
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
    const amount = parseFloat(topUpForm.amount);
    if (!topUpForm.amount || amount <= 0) {
      setTopUpError(t('topUpModal.invalidAmount'));
      return;
    }

    // Minimum amount validation (10,000 VND)
    if (amount < 10000) {
      setTopUpError(t('topUpModal.minimumAmountError'));
      return;
    }

    try {
      setTopUpLoading(true);
      setTopUpError(null);

      // Call the actual API
      const response = await addFundToWallet(selectedCar.carId || selectedCar.id, amount);
      
      // console.log('Top-up API response:', response);

      // Check if response contains payment URL
      if (response && response.paymentUrl) {
        // Save wallet top-up flag to localStorage
        localStorage.setItem('isWallet', 'true');
        localStorage.setItem('walletTopUpData', JSON.stringify({
          carId: selectedCar.carId || selectedCar.id,
          carName: selectedCar.carName,
          licensePlate: selectedCar.licensePlate,
          amount: amount,
          timestamp: new Date().toISOString()
        }));
        
        // Redirect to PayOS payment page
        window.open(response.paymentUrl, '_blank');
        
        setTopUpSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        // Handle case where no payment URL is returned
        setTopUpError(t('topUpModal.noPaymentUrlError'));
      }

    } catch (err) {
      console.error('Error processing top-up:', err);
      setTopUpError(err.response?.data?.message || err.message || t('topUpModal.topUpError'));
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleClose = () => {
    setTopUpForm({
      amount: '',
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
                <div>
                  <p className="text-green-800 font-medium">{t('topUpModal.successMessage')}</p>
                  <p className="text-green-700 text-sm mt-1">{t('topUpModal.paymentRedirectMessage')}</p>
                </div>
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
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">VND</span>
                <input
                  type="number"
                  name="amount"
                  value={topUpForm.amount}
                  onChange={handleTopUpFormChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={topUpLoading || topUpSuccess}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('topUpModal.minimumAmount')}</p>
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
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={topUpLoading || topUpSuccess}
            >
              {topUpLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {topUpLoading ? t('topUpModal.processing') : t('topUpModal.topUpButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopUpModal;