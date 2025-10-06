import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import carsReducer from '../features/cars/carsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
  },
});

export default store;