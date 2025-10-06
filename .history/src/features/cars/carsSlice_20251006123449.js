import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for car operations
export const registerCar = createAsyncThunk(
  'cars/registerCar',
  async (carData, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to register car');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserCars = createAsyncThunk(
  'cars/fetchUserCars',
  async (userId, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/users/${userId}/cars`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCarById = createAsyncThunk(
  'cars/fetchCarById',
  async (carId, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/cars/${carId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch car details');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRelatedCars = createAsyncThunk(
  'cars/fetchRelatedCars',
  async (carId, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/cars/${carId}/related`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch related cars');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cars: [],
  currentCar: null,
  relatedCars: [],
  registrationStep: 1,
  registrationData: {
    step1: {},
    step2: {},
    step3: {},
  },
  loading: false,
  error: null,
};

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },
    updateRegistrationData: (state, action) => {
      const { step, data } = action.payload;
      state.registrationData[step] = { ...state.registrationData[step], ...data };
    },
    resetRegistration: (state) => {
      state.registrationStep = 1;
      state.registrationData = {
        step1: {},
        step2: {},
        step3: {},
      };
    },
    setCurrentCar: (state, action) => {
      state.currentCar = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register car
      .addCase(registerCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars.push(action.payload);
        state.registrationStep = 1;
        state.registrationData = {
          step1: {},
          step2: {},
          step3: {},
        };
      })
      .addCase(registerCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user cars
      .addCase(fetchUserCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchUserCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch car by ID
      .addCase(fetchCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCar = action.payload;
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch related cars
      .addCase(fetchRelatedCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedCars.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedCars = action.payload;
      })
      .addCase(fetchRelatedCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setRegistrationStep,
  updateRegistrationData,
  resetRegistration,
  setCurrentCar,
  clearError,
} = carsSlice.actions;

// Export async thunks
export { registerCar, fetchUserCars, fetchCarById, fetchRelatedCars };

export default carsSlice.reducer;