import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import carsReducer from '../features/cars/carsSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import { adminSlice } from '../features/admin/adminSlice';
import { staffSlice } from '../features/staff/staffSlice';
import calendarReducer from '../features/owner/calendarSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
    favorites: favoritesReducer,
    admin: adminSlice.reducer,
    staff: staffSlice.reducer,
    calendar: calendarReducer,
  },
});

export default store;