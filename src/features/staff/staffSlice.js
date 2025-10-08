import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Dashboard metrics
  dashboardMetrics: {
    totalBookings: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    totalRevenue: 0
  },
  
  // Car owners data
  carOwners: [],
  
  // Customers data
  customers: [],
  
  // Booking activities
  bookingActivities: [],
  
  // Notifications
  notifications: [],
  
  // Loading states
  loading: {
    dashboard: false,
    carOwners: false,
    customers: false,
    bookings: false,
    notifications: false
  },
  
  // Error states
  errors: {}
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    // Dashboard actions
    setDashboardMetrics: (state, action) => {
      state.dashboardMetrics = action.payload;
    },
    
    // Car owner actions
    setCarOwners: (state, action) => {
      state.carOwners = action.payload;
    },
    updateCarOwnerStatus: (state, action) => {
      const { id, status } = action.payload;
      const carOwner = state.carOwners.find(owner => owner.id === id);
      if (carOwner) {
        carOwner.status = status;
      }
    },
    
    // Customer actions
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    updateCustomerAccount: (state, action) => {
      const { id, updates } = action.payload;
      const customer = state.customers.find(customer => customer.id === id);
      if (customer) {
        Object.assign(customer, updates);
      }
    },
    
    // Booking actions
    setBookingActivities: (state, action) => {
      state.bookingActivities = action.payload;
    },
    updateBookingStatus: (state, action) => {
      const { id, status, notes } = action.payload;
      const booking = state.bookingActivities.find(booking => booking.id === id);
      if (booking) {
        booking.status = status;
        if (notes) booking.notes = notes;
      }
    },
    
    // Notification actions
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    
    // Loading actions
    setLoading: (state, action) => {
      const { section, loading } = action.payload;
      state.loading[section] = loading;
    },
    
    // Error actions
    setError: (state, action) => {
      const { section, error } = action.payload;
      state.errors[section] = error;
    },
    clearError: (state, action) => {
      delete state.errors[action.payload];
    }
  }
});

export const {
  setDashboardMetrics,
  setCarOwners,
  updateCarOwnerStatus,
  setCustomers,
  updateCustomerAccount,
  setBookingActivities,
  updateBookingStatus,
  setNotifications,
  addNotification,
  setLoading,
  setError,
  clearError
} = staffSlice.actions;

export { staffSlice };