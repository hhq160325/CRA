import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for favorites operations
export const addToFavorites = createAsyncThunk(
    'favorites/addToFavorites',
    async (carId, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carId }),
            });

            if (!response.ok) {
                throw new Error('Failed to add to favorites');
            }

            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFromFavorites = createAsyncThunk(
    'favorites/removeFromFavorites',
    async (carId, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            const response = await fetch(`/api/favorites/${carId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove from favorites');
            }

            return carId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/favorites');

            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }

            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    favoriteCarIds: [2, 5], // Mock initial favorites for testing
    favoriteCars: [],
    loading: false,
    error: null,
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavoriteLocal: (state, action) => {
            const carId = action.payload;
            const index = state.favoriteCarIds.indexOf(carId);

            if (index > -1) {
                state.favoriteCarIds.splice(index, 1);
                state.favoriteCars = state.favoriteCars.filter(car => car.id !== carId);
            } else {
                state.favoriteCarIds.push(carId);
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Add to favorites
            .addCase(addToFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToFavorites.fulfilled, (state, action) => {
                state.loading = false;
                const carId = action.payload.carId || action.meta.arg;
                if (!state.favoriteCarIds.includes(carId)) {
                    state.favoriteCarIds.push(carId);
                }
            })
            .addCase(addToFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from favorites
            .addCase(removeFromFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromFavorites.fulfilled, (state, action) => {
                state.loading = false;
                const carId = action.payload;
                state.favoriteCarIds = state.favoriteCarIds.filter(id => id !== carId);
                state.favoriteCars = state.favoriteCars.filter(car => car.id !== carId);
            })
            .addCase(removeFromFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch favorites
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.favoriteCars = action.payload;
                state.favoriteCarIds = action.payload.map(car => car.id);
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { toggleFavoriteLocal, clearError } = favoritesSlice.actions;

export default favoritesSlice.reducer;