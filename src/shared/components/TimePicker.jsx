import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const TimePicker = ({ selectedTime, onTimeSelect, onClose, minTime }) => {
  const { t } = useTranslation();
  const [timeInput, setTimeInput] = useState('');
  const [period, setPeriod] = useState('AM');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedTime) {
      const parts = selectedTime.split(' ');
      if (parts.length === 2) {
        setTimeInput(parts[0]);
        setPeriod(parts[1]);
      }
    }
  }, [selectedTime]);

  const validateTime = (value) => {
    // Remove any non-digit or colon characters
    const cleaned = value.replace(/[^\d:]/g, '');

    // Check format
    const timeRegex = /^([0-1]?[0-9]):([0-5][0-9])$/;
    if (!timeRegex.test(cleaned)) {
      return null;
    }

    const [hours] = cleaned.split(':').map(Number);

    // Validate hours (01-12)
    if (hours < 1 || hours > 12) {
      return null;
    }

    return cleaned;
  };

  const handleTimeChange = (e) => {
    let value = e.target.value;
    setError('');

    // Only allow digits and colon
    value = value.replace(/[^\d:]/g, '');

    // Prevent invalid hour input (first digit can't be > 1)
    if (value.length === 1 && parseInt(value) > 1) {
      value = '0' + value + ':';
    }

    // Prevent hours > 12
    if (value.length === 2 && !value.includes(':')) {
      const hours = parseInt(value);
      if (hours > 12 || hours === 0) {
        return; // Don't update if invalid
      }
      value = value + ':';
    }

    // Prevent invalid minute first digit (can't be > 5)
    const colonIndex = value.indexOf(':');
    if (colonIndex !== -1 && value.length === colonIndex + 2) {
      const minuteFirstDigit = parseInt(value[colonIndex + 1]);
      if (minuteFirstDigit > 5) {
        return; // Don't update if invalid
      }
    }

    // Limit to 5 characters (00:00)
    if (value.length <= 5) {
      setTimeInput(value);
    }
  };

  const handleTimeBlur = () => {
    if (!timeInput) return;

    const validated = validateTime(timeInput);
    if (validated) {
      // Format with leading zeros
      const [h, m] = validated.split(':');
      const formatted = `${h.padStart(2, '0')}:${m}`;
      setTimeInput(formatted);
      setError('');
    } else {
      setError(t('invalidTimeFormat') || 'Invalid time format. Use 00:00');
    }
  };

  const isTimeValid = () => {
    if (!timeInput) return false;
    const validated = validateTime(timeInput);
    if (!validated) return false;

    // Check if time is after minTime (but don't set error here to avoid re-render loop)
    if (minTime) {
      const minTimeParts = minTime.split(' ');
      if (minTimeParts.length === 2) {
        const [minTimeStr, minPeriod] = minTimeParts;
        const minTimeSplit = minTimeStr.split(':');
        if (minTimeSplit.length === 2) {
          const [minH, minM] = minTimeSplit.map(Number);
          const currentTimeSplit = timeInput.split(':');
          if (currentTimeSplit.length === 2) {
            const [currentH, currentM] = currentTimeSplit.map(Number);

            // Convert to 24-hour for comparison
            let minHour24 = minH;
            if (minPeriod === 'PM' && minH !== 12) minHour24 += 12;
            if (minPeriod === 'AM' && minH === 12) minHour24 = 0;

            let currentHour24 = currentH;
            if (period === 'PM' && currentH !== 12) currentHour24 += 12;
            if (period === 'AM' && currentH === 12) currentHour24 = 0;

            const minTotalMinutes = minHour24 * 60 + minM;
            const currentTotalMinutes = currentHour24 * 60 + currentM;

            if (currentTotalMinutes <= minTotalMinutes) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  const handleConfirm = () => {
    if (!isTimeValid()) {
      // Set error only when user tries to confirm
      if (minTime) {
        setError(t('dropoffMustBeAfterPickup') || 'Drop-off time must be after pick-up time');
      }
      return;
    }
    
    const formattedTime = `${timeInput} ${period}`;
    onTimeSelect(formattedTime);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isTimeValid()) {
      handleConfirm();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('selectTime')}</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Time Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('time')} <span className="text-gray-400 text-xs">(HH:MM)</span>
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={timeInput}
            onChange={handleTimeChange}
            onBlur={handleTimeBlur}
            onKeyDown={handleKeyDown}
            placeholder="00:00"
            className={`flex-1 border rounded-lg px-4 py-2.5 text-lg font-mono focus:outline-none focus:ring-2 w-5 ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            maxLength={5}
          />

          {/* AM/PM Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPeriodOpen(!periodOpen)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition-colors min-w-[80px] flex items-center justify-between"
            >
              {period}
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${periodOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {periodOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setPeriodOpen(false)}
                />
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setPeriod('AM');
                      setPeriodOpen(false);
                      setError('');
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${period === 'AM' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                      }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPeriod('PM');
                      setPeriodOpen(false);
                      setError('');
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${period === 'PM' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                      }`}
                  >
                    PM
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          {t('timeFormatHint') || 'Enter time in 12-hour format (e.g., 09:30)'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          {t('cancel') || 'Cancel'}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!isTimeValid()}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${isTimeValid()
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {t('confirm') || 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default TimePicker;
