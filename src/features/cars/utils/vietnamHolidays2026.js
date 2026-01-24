import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { VIETHOLIDAY_ENDPOINTS } from '../../../config/api';

// Cache for holidays data
let cachedHolidays = null;
let isFetching = false;
let fetchPromise = null;

// Helper function to get holiday name based on date
const getHolidayName = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.getMonth();
  const day = date.getDate();

  // New Year's Day
  if (month === 0 && day === 1) return "New Year's Day";
  
  // Tet - Lunar New Year (typically in January/February)
  if (month === 1 && day >= 16 && day <= 24) {
    if (day === 16) return "Vietnamese New Year's Eve";
    if (day === 17) return "Vietnamese New Year";
    return "Tet Holiday";
  }
  if (month === 1 && day >= 5 && day <= 13) {
    if (day === 5) return "Vietnamese New Year's Eve";
    if (day === 6) return "Vietnamese New Year";
    return "Tet Holiday";
  }
  if (month === 0 && day >= 25 && day <= 31) {
    if (day === 25) return "Vietnamese New Year's Eve";
    if (day === 26) return "Vietnamese New Year";
    return "Tet Holiday";
  }
  
  // Hung Kings' Festival (April)
  if (month === 3 && (day === 4 || day === 16 || day === 26 || day === 27)) {
    return day === 26 || day === 16 || day === 4 ? "Hung Kings Festival" : "Day off for Hung Kings Festival";
  }
  
  // Reunification Day
  if (month === 3 && day === 30) return "Liberation Day/Reunification Day";
  
  // International Labor Day
  if (month === 4 && day === 1) return "International Labor Day";
  
  // Independence Day
  if (month === 8 && (day === 1 || day === 2)) return "Independence Day";
  if (month === 7 && day === 31) return "Independence Day Holiday";
  
  return "Public Holiday";
};

// Fetch holidays from API
export const fetchVietnamHolidays = async () => {
  // Return cached data if available
  if (cachedHolidays) {
    return cachedHolidays;
  }

  // If already fetching, return the existing promise
  if (isFetching && fetchPromise) {
    return fetchPromise;
  }

  isFetching = true;
  fetchPromise = (async () => {
    try {
      const response = await axiosInstance.get(VIETHOLIDAY_ENDPOINTS.GET_VIET_HOLIDAY);
      const holidayDates = response.data;

      // Transform API data to the expected format
      const transformedHolidays = holidayDates.map(dateStr => {
        const date = new Date(dateStr);
        return {
          day: date.getDate(),
          month: date.getMonth(), // 0-indexed (0 = January)
          year: date.getFullYear(),
          name: getHolidayName(dateStr)
        };
      });

      cachedHolidays = transformedHolidays;
      return transformedHolidays;
    } catch (error) {
      console.error('Error fetching Vietnam holidays:', error);
      // Return fallback data for 2026
      return [
        { day: 1, month: 0, year: 2026, name: 'New Year\'s Day' },
        { day: 16, month: 1, year: 2026, name: 'Vietnamese New Year\'s Eve' },
        { day: 17, month: 1, year: 2026, name: 'Vietnamese New Year' },
        { day: 18, month: 1, year: 2026, name: 'Tet Holiday' },
        { day: 19, month: 1, year: 2026, name: 'Tet Holiday' },
        { day: 20, month: 1, year: 2026, name: 'Tet Holiday' },
        { day: 21, month: 1, year: 2026, name: 'Tet Holiday' },
        { day: 26, month: 3, year: 2026, name: 'Hung Kings Festival' },
        { day: 27, month: 3, year: 2026, name: 'Day off for Hung Kings Festival' },
        { day: 30, month: 3, year: 2026, name: 'Liberation Day/Reunification Day' },
        { day: 1, month: 4, year: 2026, name: 'International Labor Day' },
        { day: 31, month: 7, year: 2026, name: 'Independence Day Holiday' },
        { day: 1, month: 8, year: 2026, name: 'Independence Day Holiday' },
        { day: 2, month: 8, year: 2026, name: 'Independence Day' }
      ];
    } finally {
      isFetching = false;
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

// Export static data for backward compatibility (will be empty initially)
export let vietnamHolidays2026 = [];

// Initialize holidays on module load
fetchVietnamHolidays().then(holidays => {
  vietnamHolidays2026 = holidays;
});
