import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, PAYMENT_ENDPOINTS, INVOICE_ENDPOINTS } from '../../config/api';
import { decodeJWT } from '../auth/utils';
import { convertToVietnamTime } from '../../shared/utils/CheckUTC';

// Helper function to get user ID from token
const getUserIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  // Try different possible user ID claims
  return decoded.sub || decoded.userId || decoded.id || decoded.nameid || null;
};

// Helper function to fetch all payments and create a lookup map
const fetchAllPayments = async () => {
  try {
    const response = await axiosInstance.get(PAYMENT_ENDPOINTS.GET_ALL_PAYMENTS);
    const payments = response.data || [];
    
    // Create a map of invoiceId -> payment for quick lookup
    const paymentMap = {};
    payments.forEach(payment => {
      if (payment.invoiceId) {
        paymentMap[payment.invoiceId] = payment;
      }
    });
    
    return paymentMap;
  } catch (error) {
    console.error('Error fetching payments:', error);
    return {};
  }
};

// Helper function to fetch invoice details
const fetchInvoiceDetails = async (invoiceId) => {
  try {
    if (!invoiceId) return null;
    const response = await axiosInstance.get(INVOICE_ENDPOINTS.GET_INVOICE_BY_ID(invoiceId));
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice ${invoiceId}:`, error);
    return null;
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

      // Fetch bookings and payments in parallel
      const [bookingsResponse, paymentMap] = await Promise.all([
        axiosInstance.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS),
        fetchAllPayments()
      ]);
      
      const bookings = bookingsResponse.data || [];

      // Fetch invoice details and match with payments
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          let invoiceData = null;
          let paymentData = null;
          
          if (booking.invoiceId) {
            // Fetch invoice details
            invoiceData = await fetchInvoiceDetails(booking.invoiceId);
            // Get payment data from the map
            paymentData = paymentMap[booking.invoiceId];
          }
          
          return {
            ...booking,
            invoice: invoiceData,
            payment: paymentData,
          };
        })
      );

      // Filter bookings to show only those where the current user is the vendor/car owner
      const userOwnedBookings = bookingsWithDetails.filter(booking => {
        const invoice = booking.invoice;
        // If no invoice data, include the booking (fallback)
        if (!invoice) return true;
        
        // Compare vendorId from invoice with current user ID
        return invoice.vendorId === userId;
      });

      return userOwnedBookings;
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
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        // Transform booking data to calendar events
        state.events = (action.payload || []).map(booking => {
          const car = booking.car || {};
          const invoice = booking.invoice || {};
          const payment = booking.payment || {};
          const carName = `${car.manufacturer || ''} ${car.model || ''}`.trim() || 'Unknown Car';
          
          return {
            id: booking.id,
            title: `${booking.bookingNumber || `Booking ${booking.id}`} - ${carName}`,
            start: booking.pickupTime ? new Date(booking.pickupTime) : new Date(),
            end: booking.dropoffTime ? new Date(booking.dropoffTime) : new Date(),
            allDay: false,
            // Store full booking details for modal display
            bookingId: booking.id,
            status: booking.status,
            notes: booking.notes,
            bookingNumber: booking.bookingNumber,
            createDate: booking.createDate,
            // Car details
            carId: car.id,
            carName: carName,
            licensePlate: car.licensePlate,
            seats: car.seats,
            transmission: car.transmission,
            fuelType: car.fuelType,
            // Booking details
            pickupPlace: booking.pickupPlace,
            dropoffPlace: booking.dropoffPlace,
            pickupTime: booking.pickupTime,
            dropoffTime: booking.dropoffTime,
            bookingStatus: booking.status,
            invoiceId: booking.invoiceId,
            invoiceNo: booking.invoiceNo,
            // Invoice/Payment details
            totalAmount: invoice.totalAmount || 0,
            carRentPrice: invoice.carRentPrice || 0,
            bookingFee: invoice.bookingFee || 0,
            // Payment status from PayOS
            paymentStatus: payment.status || 'pending',
            paymentMethod: payment.paymentMethod,
            paymentDate: payment.paymentDate,
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
  openDayEventsModal,
  closeDayEventsModal,
  setSearchQuery,
  setFilter,
  updateEventInState,
} = calendarSlice.actions;

export default calendarSlice.reducer;

