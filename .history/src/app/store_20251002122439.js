import { configureStore } from '@reduxjs/toolkit';

// Create a basic store with an empty reducer for now
const store = configureStore({
  reducer: {
    // Add your reducers here as you create them
    // Example: auth: authSlice.reducer,
  },
});

export default store;