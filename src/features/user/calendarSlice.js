import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../shared/utils/axiosInstance';

// Async thunks
export const fetchUserBookings = createAsyncThunk(
  'calendar/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/bookings`);
      return response.data;
    } catch (error) {
      // Return empty array for now if API doesn't exist
      if (error.response?.status === 404) {
        console.warn('Bookings API not available, using empty array');
        return [];
      }
      console.warn('Bookings API not available, using empty array:', error.message);
      return [];
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
        state.events = action.payload.map(booking => {
          const startDate = booking.startDate || booking.start;
          const endDate = booking.endDate || booking.end;
          
          return {
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

