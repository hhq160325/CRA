import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, CAR_ENDPOINTS } from '../../config/api';
import { decodeJWT } from '../auth/utils';

// Helper function to get user ID from token
const getUserIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  // Try different possible user ID claims
  return decoded.sub || decoded.userId || decoded.id || decoded.nameid || null;
};

// Helper function to fetch car details
const fetchCarDetails = async (carId) => {
  try {
    const response = await axiosInstance.get(CAR_ENDPOINTS.GET_CAR_BY_ID(carId));
    const car = response.data;
    // Combine manufacturer and model to create car name
    return `${car.manufacturer || ''} ${car.model || ''}`.trim() || 'Unknown Car';
  } catch (error) {
    console.error(`Error fetching car ${carId}:`, error);
    return 'Unknown Car';
  }
};

// Async thunks
export const fetchUserBookings = createAsyncThunk(
  'calendar/fetchUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.warn('No user ID found in token');
        return [];
      }

      const response = await axiosInstance.get(BOOKING_ENDPOINTS.GET_CUSTOMER_BOOKINGS(userId));
      const bookings = response.data || [];

      // Fetch car details for each booking
      const bookingsWithCarDetails = await Promise.all(
        bookings.map(async (booking) => {
          let carName = booking.carName || booking.car;
          
          // If no car name and we have a carId, fetch car details
          if ((!carName || carName === 'N/A') && booking.carId) {
            carName = await fetchCarDetails(booking.carId);
          }
          
          return {
            ...booking,
            carName,
          };
        })
      );

      return bookingsWithCarDetails;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response?.status === 404) {
        return [];
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBookingEvent = createAsyncThunk(
  'calendar/createBookingEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/bookings', eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBookingEvent = createAsyncThunk(
  'calendar/updateBookingEvent',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/bookings/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBookingEvent = createAsyncThunk(
  'calendar/deleteBookingEvent',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      return id;
    } catch (error) {
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
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        // Transform booking data to calendar events
        state.events = (action.payload || []).map(booking => {
          // Use pickupTime and dropoffTime from API
          const pickupTime = booking.pickupTime || booking.pickUpDateTime || booking.startDate;
          const dropoffTime = booking.dropoffTime || booking.dropOffDateTime || booking.endDate;
          
          return {
            id: booking.bookingId || booking.id,
            title: `${booking.carName || booking.car || 'Car Rental'}`,
            start: pickupTime ? new Date(pickupTime) : new Date(),
            end: dropoffTime ? new Date(dropoffTime) : new Date(),
            allDay: false,
            // Store full booking details for modal display
            bookingId: booking.bookingId || booking.id,
            carId: booking.carId,
            carName: booking.carName || booking.car,
            pickupPlace: booking.pickupPlace,
            dropoffPlace: booking.dropoffPlace,
            pickupTime: pickupTime,
            dropoffTime: dropoffTime,
            status: booking.status || 'pending',
            totalAmount: booking.totalAmount || booking.amount || 0,
            bookingFee: booking.bookingFee || 0,
            carRentPrice: booking.carRentPrice || 0,
            paymentStatus: booking.paymentStatus || 'pending',
            notes: booking.notes || '',
            customerId: booking.customerId,
            customerName: booking.customerName,
          };
        });
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBookingEvent.fulfilled, (state, action) => {
        const booking = action.payload;
        const startDate = booking.startDate || booking.start;
        const endDate = booking.endDate || booking.end;
        
        state.events.push({
          id: booking.id,
          title: `${booking.car || 'Car'} - ${booking.bookingId || booking.id}`,
          start: new Date(startDate ? `${startDate}T09:00` : Date.now()),
          end: new Date(endDate ? `${endDate}T17:00` : Date.now()),
          allDay: false,
          status: booking.status || 'pending',
          car: booking.car || '',
          customer: booking.customer || '',
          carOwner: booking.carOwner || '',
          amount: booking.totalAmount || booking.amount || 0,
          paymentStatus: booking.paymentStatus || 'pending',
          notes: booking.notes || '',
          bookingId: booking.bookingId || booking.id,
        });
      })
      .addCase(updateBookingEvent.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.events.findIndex(e => e.id === updated.id);
        if (index !== -1) {
          const startDate = updated.startDate || updated.start;
          const endDate = updated.endDate || updated.end;
          
          state.events[index] = {
            ...state.events[index],
            title: `${updated.car || 'Car'} - ${updated.bookingId || updated.id}`,
            start: new Date(startDate ? `${startDate}T09:00` : state.events[index].start),
            end: new Date(endDate ? `${endDate}T17:00` : state.events[index].end),
            status: updated.status || state.events[index].status,
            car: updated.car || state.events[index].car,
            amount: updated.totalAmount || updated.amount || state.events[index].amount,
            paymentStatus: updated.paymentStatus || state.events[index].paymentStatus,
            notes: updated.notes || state.events[index].notes,
          };
        }
      })
      .addCase(deleteBookingEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e.id !== action.payload);
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
  setSearchQuery,
  setFilter,
  updateEventInState,
} = calendarSlice.actions;

export default calendarSlice.reducer;

