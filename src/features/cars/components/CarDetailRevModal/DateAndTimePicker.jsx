import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchVietnamHolidays } from '../../utils/vietnamHolidays2026';
const RENTAL_DATES_KEY = 'rentalDates';

// Custom Time Dropdown Component
const TimeDropdown = ({ label, value, onChange, options, disabledTimes = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll to first available time when dropdown opens
  useEffect(() => {
    if (isOpen && listRef.current) {
      // Find the first available (non-disabled) time
      const firstAvailableIndex = options.findIndex(time => !disabledTimes.includes(time));

      if (firstAvailableIndex !== -1) {
        // Calculate scroll position (each item is approximately 52px tall)
        const itemHeight = 52;
        const scrollPosition = firstAvailableIndex * itemHeight;

        // Scroll to the first available time
        setTimeout(() => {
          if (listRef.current) {
            listRef.current.scrollTop = scrollPosition;
          }
        }, 0);
      }
    }
  }, [isOpen, options, disabledTimes]);

  const isTimeDisabled = (time) => {
    return disabledTimes.includes(time);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label className="text-sm text-gray-600 mb-2 block">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
      >
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto scroll-smooth"
        >
          {options.map((time) => {
            const disabled = isTimeDisabled(time);
            return (
              <button
                key={time}
                type="button"
                onClick={() => {
                  if (!disabled) {
                    onChange(time);
                    setIsOpen(false);
                  }
                }}
                disabled={disabled}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${disabled
                    ? 'cursor-not-allowed opacity-40'
                    : 'hover:bg-gray-50 cursor-pointer'
                  }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === time ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                  {value === time && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <span className={`text-lg ${value === time
                    ? 'font-semibold text-gray-900'
                    : disabled
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}>
                  {time}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DateAndTimePicker = ({ isOpen, onClose, onConfirm, dailyPrice = 0 }) => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth()); // Current month (0-indexed)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedPickupDate, setSelectedPickupDate] = useState(null); // { day, month, year }
  const [selectedDropoffDate, setSelectedDropoffDate] = useState(null); // { day, month, year }
  const [pickupTime, setPickupTime] = useState('06:00');
  const [dropoffTime, setDropoffTime] = useState('23:00');
  const [vietnamHolidays, setVietnamHolidays] = useState([]);

  // Fetch Vietnam holidays on component mount
  useEffect(() => {
    fetchVietnamHolidays().then(holidays => {
      setVietnamHolidays(holidays);
    });
  }, []);

  // Get next available pickup time for today
  const getNextAvailablePickupTime = (selectedDate) => {
    const now = new Date();
    const isToday = selectedDate.day === now.getDate() &&
      selectedDate.month === now.getMonth() &&
      selectedDate.year === now.getFullYear();

    if (!isToday) return '06:00';

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const nextHour = currentMinute > 0 ? currentHour + 1 : currentHour;

    // Ensure the time is within business hours (6:00-22:00)
    const validHour = Math.max(6, Math.min(nextHour, 22));

    return `${validHour.toString().padStart(2, '0')}:00`;
  };

  // Load saved rental dates from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(RENTAL_DATES_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.selectedPickupDate) {
          setSelectedPickupDate(parsed.selectedPickupDate);

          const now = new Date();
          const isToday = parsed.selectedPickupDate.day === now.getDate() &&
            parsed.selectedPickupDate.month === now.getMonth() &&
            parsed.selectedPickupDate.year === now.getFullYear();

          if (isToday && parsed.pickupTime) {
            const savedHour = parseInt(parsed.pickupTime.split(':')[0]);
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const cutoffHour = currentMinute > 0 ? currentHour + 1 : currentHour;

            if (savedHour < cutoffHour) {
              const nextAvailableTime = getNextAvailablePickupTime(parsed.selectedPickupDate);
              setPickupTime(nextAvailableTime);
            } else {
              setPickupTime(parsed.pickupTime);
            }
          } else {
            setPickupTime(parsed.pickupTime || '06:00');
          }
        }

        if (parsed.selectedDropoffDate) setSelectedDropoffDate(parsed.selectedDropoffDate);
        if (parsed.dropoffTime) setDropoffTime(parsed.dropoffTime);
      } catch (error) {
        console.error('Failed to load rental dates from localStorage:', error);
      }
    } else {
      // Set default pickup date to current day if no saved data
      const today = new Date();
      const defaultPickupDate = {
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear()
      };
      const defaultPickupTime = getNextAvailablePickupTime(defaultPickupDate);

      setSelectedPickupDate(defaultPickupDate);
      setPickupTime(defaultPickupTime);
      saveToLocalStorage({ selectedPickupDate: defaultPickupDate, pickupTime: defaultPickupTime });
    }
  }, []);

  const monthNames = [
    t('january'), t('february'), t('march'), t('april'), t('may'), t('june'),
    t('july'), t('august'), t('september'), t('october'), t('november'), t('december')
  ];

  const weekDays = [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday'), t('sunday')];

  // Generate time options (00:00 to 23:00)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  // Get days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Monday, 6 = Sunday)
  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday from 0 to 6
  };

  // Generate calendar days
  const generateCalendarDays = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleDateClick = (day, month, year) => {
    if (!day) return;

    // Check if date is within 10 days from current date
    const clickedDate = new Date(year, month, day);
    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    maxDate.setDate(currentDate.getDate() + 10);

    // Reset time to compare only dates
    clickedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);

    // Prevent selection if date is in the past or more than 10 days from now
    if (clickedDate < currentDate || clickedDate > maxDate) {
      return;
    }

    const clickedDateObj = { day, month, year };
    const clickedTimestamp = clickedDate.getTime();

    if (!selectedPickupDate) {
      setSelectedPickupDate(clickedDateObj);
      // Update pickup time if selecting today
      const nextAvailableTime = getNextAvailablePickupTime(clickedDateObj);
      setPickupTime(nextAvailableTime);
      saveToLocalStorage({ selectedPickupDate: clickedDateObj, pickupTime: nextAvailableTime });
    } else if (!selectedDropoffDate) {
      const pickupTimestamp = new Date(selectedPickupDate.year, selectedPickupDate.month, selectedPickupDate.day).getTime();

      if (clickedTimestamp > pickupTimestamp) {
        setSelectedDropoffDate(clickedDateObj);
        saveToLocalStorage({ selectedDropoffDate: clickedDateObj });
      } else {
        setSelectedPickupDate(clickedDateObj);
        setSelectedDropoffDate(null);
        // Update pickup time if selecting today
        const nextAvailableTime = getNextAvailablePickupTime(clickedDateObj);
        setPickupTime(nextAvailableTime);
        saveToLocalStorage({ selectedPickupDate: clickedDateObj, selectedDropoffDate: null, pickupTime: nextAvailableTime });
      }
    } else {
      setSelectedPickupDate(clickedDateObj);
      setSelectedDropoffDate(null);
      // Update pickup time if selecting today
      const nextAvailableTime = getNextAvailablePickupTime(clickedDateObj);
      setPickupTime(nextAvailableTime);
      saveToLocalStorage({ selectedPickupDate: clickedDateObj, selectedDropoffDate: null, pickupTime: nextAvailableTime });
    }
  };

  const saveToLocalStorage = (updates) => {
    const currentData = {
      selectedPickupDate,
      selectedDropoffDate,
      pickupTime,
      dropoffTime,
      ...updates
    };
    localStorage.setItem(RENTAL_DATES_KEY, JSON.stringify(currentData));
  };

  const isDateInRange = (day, month, year) => {
    if (!day || !selectedPickupDate || !selectedDropoffDate) return false;

    const currentTimestamp = new Date(year, month, day).getTime();
    const pickupTimestamp = new Date(selectedPickupDate.year, selectedPickupDate.month, selectedPickupDate.day).getTime();
    const dropoffTimestamp = new Date(selectedDropoffDate.year, selectedDropoffDate.month, selectedDropoffDate.day).getTime();

    return currentTimestamp > pickupTimestamp && currentTimestamp < dropoffTimestamp;
  };

  const isDateSelected = (day, month, year) => {
    if (!day) return false;

    if (selectedPickupDate &&
      selectedPickupDate.day === day &&
      selectedPickupDate.month === month &&
      selectedPickupDate.year === year) {
      return true;
    }

    if (selectedDropoffDate &&
      selectedDropoffDate.day === day &&
      selectedDropoffDate.month === month &&
      selectedDropoffDate.year === year) {
      return true;
    }

    return false;
  };

  const isDateDisabled = (day, month, year) => {
    if (!day) return false;

    const dateToCheck = new Date(year, month, day);
    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    maxDate.setDate(currentDate.getDate() + 10);

    // Reset time to compare only dates
    dateToCheck.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);

    // Disable if date is in the past or more than 10 days from now
    return dateToCheck < currentDate || dateToCheck > maxDate;
  };

  const isVietnameseHoliday = (day, month, year) => {
    return vietnamHolidays.some(holiday => 
      holiday.day === day && holiday.month === month && holiday.year === year
    );
  };

  const getHolidayName = (day, month, year) => {
    const holiday = vietnamHolidays.find(holiday => 
      holiday.day === day && holiday.month === month && holiday.year === year
    );
    return holiday ? holiday.name : null;
  };

  // Check if any date in the rental period is a holiday
  const hasHolidayInRange = () => {
    if (!selectedPickupDate || !selectedDropoffDate) return false;

    const pickupDate = new Date(selectedPickupDate.year, selectedPickupDate.month, selectedPickupDate.day);
    const dropoffDate = new Date(selectedDropoffDate.year, selectedDropoffDate.month, selectedDropoffDate.day);
    
    // Check each day in the range
    for (let d = new Date(pickupDate); d < dropoffDate; d.setDate(d.getDate() + 1)) {
      if (isVietnameseHoliday(d.getDate(), d.getMonth(), d.getFullYear())) {
        return true;
      }
    }
    return false;
  };

  // Count holiday days in the rental period
  const countHolidayDays = () => {
    if (!selectedPickupDate || !selectedDropoffDate) return 0;

    const pickupDate = new Date(selectedPickupDate.year, selectedPickupDate.month, selectedPickupDate.day);
    const dropoffDate = new Date(selectedDropoffDate.year, selectedDropoffDate.month, selectedDropoffDate.day);
    let holidayCount = 0;
    
    // Check each day in the range
    for (let d = new Date(pickupDate); d < dropoffDate; d.setDate(d.getDate() + 1)) {
      if (isVietnameseHoliday(d.getDate(), d.getMonth(), d.getFullYear())) {
        holidayCount++;
      }
    }
    return holidayCount;
  };

  // Calculate total price with holiday surcharge applied only to holiday days
  const calculateTotalPrice = () => {
    if (!dailyPrice || calculateDuration() === 0) return 0;
    
    const totalDays = calculateDuration();
    const holidayDays = countHolidayDays();
    const normalDays = totalDays - holidayDays;
    
    // Calculate price: normal days at regular price + holiday days at 20% surcharge
    const normalDaysPrice = normalDays * dailyPrice;
    const holidayDaysPrice = holidayDays * dailyPrice * 1.2;
    
    return Math.round(normalDaysPrice + holidayDaysPrice);
  };

  const calculateDuration = () => {
    if (selectedPickupDate && selectedDropoffDate && pickupTime && dropoffTime) {
      // Create full datetime objects including time
      const pickupDateTime = new Date(
        selectedPickupDate.year, 
        selectedPickupDate.month, 
        selectedPickupDate.day,
        parseInt(pickupTime.split(':')[0]), // hour
        parseInt(pickupTime.split(':')[1]) || 0 // minute
      );
      
      const dropoffDateTime = new Date(
        selectedDropoffDate.year, 
        selectedDropoffDate.month, 
        selectedDropoffDate.day,
        parseInt(dropoffTime.split(':')[0]), // hour
        parseInt(dropoffTime.split(':')[1]) || 0 // minute
      );
      
      const diffTime = Math.abs(dropoffDateTime.getTime() - pickupDateTime.getTime());
      const diffHours = diffTime / (1000 * 60 * 60); // Convert to hours
      
      // If less than 24 hours, count as 1 day
      if (diffHours < 24) {
        return 1;
      }
      
      // For 24+ hours, calculate days based on total hours
      const diffDays = Math.ceil(diffHours / 24);
      return diffDays;
    }
    return 0;
  };

  // Get disabled times for pickup based on current date/time
  const getDisabledPickupTimes = () => {
    const disabledTimes = [];

    // Always disable times outside 6:00-22:00 range for pickup
    for (let i = 0; i < 6; i++) {
      disabledTimes.push(`${i.toString().padStart(2, '0')}:00`);
    }
    for (let i = 23; i < 24; i++) {
      disabledTimes.push(`${i.toString().padStart(2, '0')}:00`);
    }

    if (!selectedPickupDate) return disabledTimes;

    const now = new Date();
    const isToday = selectedPickupDate.day === now.getDate() &&
      selectedPickupDate.month === now.getMonth() &&
      selectedPickupDate.year === now.getFullYear();

    if (isToday) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      // If current time is past the hour (e.g., 14:30), disable that hour too
      const cutoffHour = currentMinute > 0 ? currentHour + 1 : currentHour;

      // Disable all times before current time (but only within the 6-22 range)
      for (let i = 6; i < Math.min(cutoffHour, 23); i++) {
        if (!disabledTimes.includes(`${i.toString().padStart(2, '0')}:00`)) {
          disabledTimes.push(`${i.toString().padStart(2, '0')}:00`);
        }
      }
    }

    return disabledTimes;
  };

  // Get disabled times for dropoff based on pickup time and date
  const getDisabledDropoffTimes = () => {
    const disabledTimes = [];

    // Always disable times outside 6:00-22:00 range for dropoff
    for (let i = 0; i < 6; i++) {
      disabledTimes.push(`${i.toString().padStart(2, '0')}:00`);
    }
    for (let i = 23; i < 24; i++) {
      disabledTimes.push(`${i.toString().padStart(2, '0')}:00`);
    }

    if (!selectedDropoffDate || !selectedPickupDate) return disabledTimes;

    const isSameDay = selectedPickupDate.day === selectedDropoffDate.day &&
      selectedPickupDate.month === selectedDropoffDate.month &&
      selectedPickupDate.year === selectedDropoffDate.year;

    if (isSameDay) {
      // If same day, also disable times before or equal to pickup time
      const pickupHour = parseInt(pickupTime.split(':')[0]);
      
      for (let i = 6; i <= pickupHour; i++) {
        if (!disabledTimes.includes(`${i.toString().padStart(2, '0')}:00`)) {
          disabledTimes.push(`${i.toString().padStart(2, '0')}:00`);
        }
      }
    }

    return disabledTimes;
  };

  const handleConfirm = () => {
    if (selectedPickupDate && selectedDropoffDate && pickupTime && dropoffTime) {
      const duration = calculateDuration();
      const rentalData = {
        pickupDate: `${selectedPickupDate.day}/${selectedPickupDate.month + 1}`,
        dropoffDate: `${selectedDropoffDate.day}/${selectedDropoffDate.month + 1}`,
        pickupTime,
        dropoffTime,
        duration,
        selectedPickupDate,
        selectedDropoffDate
      };

      // Save complete data to localStorage
      localStorage.setItem(RENTAL_DATES_KEY, JSON.stringify(rentalData));

      onConfirm(rentalData);
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentMonthDays = generateCalendarDays(selectedMonth, selectedYear);
  const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
  const nextMonthYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
  const nextMonthDays = generateCalendarDays(nextMonth, nextMonthYear);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg max-w-2xl w-full animate-slideUp shadow-xl">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-lg font-semibold"> {t('time')} </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Header Title */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="text-sm font-medium text-gray-900 text-center">{t('rentalPerDay')}</h3>
        </div>

        {/* Calendar Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Current Month */}
            <div>
              {/* Month Header */}
              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={handlePreviousMonth}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex-1 text-center font-medium text-gray-900">{monthNames[selectedMonth]}</div>
                <div className="w-6"></div>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-xs text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {currentMonthDays.map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day ? (
                      <button
                        onClick={() => handleDateClick(day, selectedMonth, selectedYear)}
                        disabled={isDateDisabled(day, selectedMonth, selectedYear)}
                        title={getHolidayName(day, selectedMonth, selectedYear) || ''}
                        className={`w-full h-full flex flex-col items-center justify-center text-sm transition-colors rounded relative ${isDateSelected(day, selectedMonth, selectedYear)
                            ? 'bg-blue-500 text-white font-semibold'
                            : isDateInRange(day, selectedMonth, selectedYear)
                              ? 'bg-blue-100 text-gray-900'
                              : isDateDisabled(day, selectedMonth, selectedYear)
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'hover:bg-gray-100 text-gray-700'
                          }`}
                      >
                        <span>{day}</span>
                        {isVietnameseHoliday(day, selectedMonth, selectedYear) && (
                          <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        )}
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Month */}
            <div>
              {/* Month Header */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-6"></div>
                <div className="flex-1 text-center font-medium text-gray-900">{monthNames[nextMonth]}</div>
                <button
                  onClick={handleNextMonth}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-xs text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {nextMonthDays.map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day ? (
                      <button
                        onClick={() => handleDateClick(day, nextMonth, nextMonthYear)}
                        disabled={isDateDisabled(day, nextMonth, nextMonthYear)}
                        title={getHolidayName(day, nextMonth, nextMonthYear) || ''}
                        className={`w-full h-full flex flex-col items-center justify-center text-sm transition-colors rounded relative ${isDateSelected(day, nextMonth, nextMonthYear)
                            ? 'bg-blue-500 text-white font-semibold'
                            : isDateInRange(day, nextMonth, nextMonthYear)
                              ? 'bg-blue-100 text-gray-900'
                              : isDateDisabled(day, nextMonth, nextMonthYear)
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'hover:bg-gray-100 text-gray-700'
                          }`}
                      >
                        <span>{day}</span>
                        {isVietnameseHoliday(day, nextMonth, nextMonthYear) && (
                          <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        )}
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Holiday Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              <span>{t('vietnameseHoliday') || 'Vietnamese Holiday'}</span>
              <span className="text-red-500 ml-1">(+20%)</span>
            </div>
          </div>

          {/* Time Selection */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* Pickup Time */}
            <TimeDropdown
              label={t('pickUpVehicle')}
              value={pickupTime}
              onChange={(time) => {
                setPickupTime(time);
                saveToLocalStorage({ pickupTime: time });
              }}
              options={timeOptions}
              disabledTimes={getDisabledPickupTimes()}
            />

            {/* Dropoff Time */}
            <TimeDropdown
              label={t('returnVehicle')}
              value={dropoffTime}
              onChange={(time) => {
                setDropoffTime(time);
                saveToLocalStorage({ dropoffTime: time });
              }}
              options={timeOptions}
              disabledTimes={getDisabledDropoffTimes()}
            />
          </div>

          {/* Time Range Display */}
          <div className="mt-4 space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>{t('pickUpTime')}</span>
              <span>{pickupTime}-22:00</span>
            </div>
            <div className="flex justify-between">
              <span>{t('returnTime')}</span>
              <span>06:00-{dropoffTime}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t px-6 py-4 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm text-gray-900 font-medium">
                {selectedPickupDate && selectedDropoffDate && selectedPickupDate.year && selectedDropoffDate.year ? (
                  <>
                    {pickupTime}, {selectedPickupDate.day}/{selectedPickupDate.month + 1}/{selectedPickupDate.year.toString().slice(-2)} - {dropoffTime}, {selectedDropoffDate.day}/{selectedDropoffDate.month + 1}/{selectedDropoffDate.year.toString().slice(-2)}
                  </>
                ) : (
                  <span className="text-gray-400">Chọn ngày nhận và trả xe</span>
                )}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {t('rentalDuration')}: <span className="text-blue-600 font-semibold">{calculateDuration()} {t('days')}</span>
                {calculateDuration() > 0 && (
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
              {/* Pricing Information */}
              {calculateDuration() > 0 && dailyPrice > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <span>{t('estimatedPrice') || 'Estimated Price'}:</span>
                    <span className="font-semibold text-green-600">
                      {calculateTotalPrice().toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  {hasHolidayInRange() && (
                    <div className="text-xs mt-0.5 space-y-0.5">
                      <div className="flex justify-between text-gray-500">
                        <span>{t('normalDays') || 'Normal days'}: {calculateDuration() - countHolidayDays()}</span>
                        <span>{((calculateDuration() - countHolidayDays()) * dailyPrice).toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="flex justify-between text-red-500">
                        <span>{t('holidayDays') || 'Holiday days'}: {countHolidayDays()}</span>
                        <span>{(countHolidayDays() * dailyPrice * 1.2).toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="text-xs text-red-500">
                        {t('holidayPricingNotice') || 'Holiday pricing applies to selected dates'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleConfirm}
              disabled={!selectedPickupDate || !selectedDropoffDate}
              className="ml-4 px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              {t('next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateAndTimePicker;
