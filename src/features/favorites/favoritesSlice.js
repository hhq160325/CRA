import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteCarIds: [], // Array of car IDs that are favorited
  favoriteCars: [],   // Array of full car objects that are favorited
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const { carId, carData } = action.payload;
      const isCurrentlyFavorite = state.favoriteCarIds.includes(carId);
      
      if (isCurrentlyFavorite) {
        // Remove from favorites
        state.favoriteCarIds = state.favoriteCarIds.filter(id => id !== carId);
        state.favoriteCars = state.favoriteCars.filter(car => car.id !== carId);
      } else {
        // Add to favorites
        state.favoriteCarIds.push(carId);
        if (carData) {
          // Only add car data if it's provided and not already in the array
          const existingCar = state.favoriteCars.find(car => car.id === carId);
          if (!existingCar) {
            state.favoriteCars.push(carData);
          }
        }
      }
    },
    addToFavorites: (state, action) => {
      const { carId, carData } = action.payload;
      if (!state.favoriteCarIds.includes(carId)) {
        state.favoriteCarIds.push(carId);
        if (carData) {
          const existingCar = state.favoriteCars.find(car => car.id === carId);
          if (!existingCar) {
            state.favoriteCars.push(carData);
          }
        }
      }
    },
    removeFromFavorites: (state, action) => {
      const carId = action.payload;
      state.favoriteCarIds = state.favoriteCarIds.filter(id => id !== carId);
      state.favoriteCars = state.favoriteCars.filter(car => car.id !== carId);
    },
    clearFavorites: (state) => {
      state.favoriteCarIds = [];
      state.favoriteCars = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  toggleFavorite,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  setError,
  clearError,
} = favoritesSlice.actions;

// Selectors
export const selectFavoriteCarIds = (state) => state.favorites.favoriteCarIds;
export const selectFavoriteCars = (state) => state.favorites.favoriteCars;
export const selectIsFavorite = (carId) => (state) => 
  state.favorites.favoriteCarIds.includes(carId);
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer;