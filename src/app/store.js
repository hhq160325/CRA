import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import carsReducer from '../features/cars/carsSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
    favorites: favoritesReducer,
  },
});

export default store;