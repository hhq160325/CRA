import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../shared/utils/axiosInstance';
import { SCHEDULE_ENDPOINTS, CAR_ENDPOINTS } from '../../config/api';
import { decodeJWT } from '../auth/utils';
import { maintenanceScheduleService } from './components/MaintenanceSchedule/services/maintenanceScheduleService';

// Helper function to get user ID from token
const getUserIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  // Try different possible user ID claims
  return decoded.sub || decoded.userId || decoded.id || decoded.nameid || null;
};

// Async thunks
export const fetchMaintenanceSchedules = createAsyncThunk(
  'calendar/fetchMaintenanceSchedules',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Starting fetchMaintenanceSchedules...');
      
      const userId = getUserIdFromToken();
      console.log('👤 User ID:', userId);
      
      if (!userId) {
        console.warn('❌ No user ID found in token');
        return [];
      }

      // Fetch all cars
      console.log('🚗 Fetching all cars...');
      const carsResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
      const allCars = carsResponse.data || [];
      console.log('🚗 All cars:', allCars.length);
      
      // Filter cars owned by current user and with Inactive status (in maintenance)
      const inactiveCars = allCars.filter(car =>
        car.owner.id === userId && car.status?.toLowerCase() === 'inactive'
      );
      console.log('🔧 Inactive cars for user:', inactiveCars.length);
      
      if (inactiveCars.length === 0) {
        console.log('❌ No inactive cars found');
        return [];
      }

      // Fetch schedules for all inactive cars
      console.log('📅 Fetching schedules for inactive cars...');
      const schedulePromises = inactiveCars.map(async (car) => {
        try {
          const response = await axiosInstance.get(SCHEDULE_ENDPOINTS.GET_CAR_SCHEDULES(car.id));
          const allSchedules = response.data || [];
          console.log(`📅 Car ${car.id} schedules:`, allSchedules.length);
          
          // Filter to show only maintenance schedules
          const maintenanceSchedules = allSchedules.filter(schedule => 
            schedule.scheduleType === "Maintenance"
          );
          console.log(`🔧 Car ${car.id} maintenance schedules:`, maintenanceSchedules.length);
          
          return { car, schedules: maintenanceSchedules };
        } catch (err) {
          console.error(`❌ Error fetching schedule for car ${car.id}:`, err);
          return { car, schedules: [] };
        }
      });
      
      const carSchedulesData = await Promise.all(schedulePromises);
      console.log('📊 Car schedules data:', carSchedulesData);
      
      // Use the maintenanceScheduleService to format the data
      const t = (key) => {
        const translations = {
          'maintenanceSchedule.unknownCarModel': 'Unknown Car Model',
          'maintenanceSchedule.needsMaintenance': 'Needs Maintenance'
        };
        return translations[key] || key;
      };
      
      const formattedSchedules = maintenanceScheduleService(carSchedulesData, t);
      console.log('✅ Formatted schedules:', formattedSchedules);
      
      return formattedSchedules;
    } catch (error) {
      console.error('❌ Error fetching schedules:', error);
      if (error.response?.status === 404) {
        return [];
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  events: [],
  currentView: 'month', // 'month' | 'week' | 'day' | 'agenda'
  currentDate: new Date().toISOString(),
  selectedEvent: null,
  isEventModalOpen: false,
  selectedDayEvents: [],
  isDayEventsModalOpen: false,
  searchQuery: '',
  filters: {
    status: 'all',
    car: 'all',
  },
  loading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setCurrentDate: (state, action) => {
      state.currentDate = new Date(action.payload).toISOString();
    },
    navigateDate: (state, action) => {
      const { direction, view } = action.payload;
      const date = new Date(state.currentDate);
      
      if (view === 'month') {
        date.setMonth(date.getMonth() + direction);
      } else if (view === 'week') {
        date.setDate(date.getDate() + (direction * 7));
      } else if (view === 'day') {
        date.setDate(date.getDate() + direction);
      }
      
      state.currentDate = date.toISOString();
    },
    goToToday: (state) => {
      state.currentDate = new Date().toISOString();
    },
    openEventModal: (state, action) => {
      state.selectedEvent = action.payload;
      state.isEventModalOpen = true;
    },
    closeEventModal: (state) => {
      state.isEventModalOpen = false;
      state.selectedEvent = null;
    },
    openDayEventsModal: (state, action) => {
      state.selectedDayEvents = action.payload;
      state.isDayEventsModalOpen = true;
    },
    closeDayEventsModal: (state) => {
      state.isDayEventsModalOpen = false;
      state.selectedDayEvents = [];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    updateEventInState: (state, action) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenanceSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenanceSchedules.fulfilled, (state, action) => {
        state.loading = false;
        // Transform maintenance schedule data to calendar events
        state.events = (action.payload || []).map(schedule => {
          // Handle date creation more carefully
          let startDate, endDate;
          
          if (schedule.startDateMaintenanceDate !== 'N/A' && schedule.pickupTime !== 'N/A') {
            startDate = new Date(`${schedule.startDateMaintenanceDate}T${schedule.pickupTime}:00`);
          } else if (schedule.startDateMaintenanceDate !== 'N/A') {
            startDate = new Date(`${schedule.startDateMaintenanceDate}T09:00:00`);
          } else {
            startDate = new Date();
          }
          
          if (schedule.endDateMaintenanceDate !== 'N/A' && schedule.returnTime !== 'N/A') {
            endDate = new Date(`${schedule.endDateMaintenanceDate}T${schedule.returnTime}:00`);
          } else if (schedule.endDateMaintenanceDate !== 'N/A') {
            endDate = new Date(`${schedule.endDateMaintenanceDate}T17:00:00`);
          } else {
            endDate = new Date();
          }
          
          console.log('📅 Creating calendar event:', {
            title: `${schedule.scheduleTitle || schedule.maintenanceType} - ${schedule.carName}`,
            start: startDate,
            end: endDate,
            status: schedule.status
          });
          
          return {
            id: schedule.scheduleId || schedule.id,
            title: `${schedule.scheduleTitle || schedule.maintenanceType} - ${schedule.carName}`,
            start: startDate,
            end: endDate,
            allDay: false,
            // Store full schedule details for modal display
            scheduleId: schedule.scheduleId,
            scheduleTitle: schedule.scheduleTitle,
            scheduleType: schedule.maintenanceType,
            priority: schedule.priority,
            status: schedule.status,
            daysUntil: schedule.daysUntil,
            // Car details
            carId: schedule.carId,
            carName: schedule.carName,
            carModel: schedule.carModel,
            licensePlate: schedule.licensePlate,
            currentMileage: schedule.currentMileage,
            mileageAtLastService: schedule.mileageAtLastService,
            // Maintenance details
            startDateMaintenanceDate: schedule.startDateMaintenanceDate,
            endDateMaintenanceDate: schedule.endDateMaintenanceDate,
            pickupTime: schedule.pickupTime,
            returnTime: schedule.returnTime,
          };
        });
      })
      .addCase(fetchMaintenanceSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentView,
  setCurrentDate,
  navigateDate,
  goToToday,
  openEventModal,
  closeEventModal,
  openDayEventsModal,
  closeDayEventsModal,
  setSearchQuery,
  setFilter,
  updateEventInState,
} = calendarSlice.actions;

export default calendarSlice.reducer;

