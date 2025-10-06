import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { carsAPI } from './carsAPI';

// Async thunks for car operations
export const registerCar = createAsyncThunk(
  'cars/registerCar',
  async (carData, { rejectWithValue }) => {
    try {
      return await carsAPI.registerCar(carData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserCars = createAsyncThunk(
  'cars/fetchUserCars',
  async (userId, { rejectWithValue }) => {
    try {
      return await carsAPI.getUserCars(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCarById = createAsyncThunk(
  'cars/fetchCarById',
  async (carId, { rejectWithValue }) => {
    try {
      return await carsAPI.getCarById(carId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async ({ carId, updateData }, { rejectWithValue }) => {
    try {
      return await carsAPI.updateCar(carId, updateData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCar = createAsyncThunk(
  'cars/deleteCar',
  async (carId, { rejectWithValue }) => {
    try {
      await carsAPI.deleteCar(carId);
      return carId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cars: [],
  currentCar: null,
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
      // Update car
      .addCase(updateCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cars.findIndex(car => car.id === action.payload.id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
        if (state.currentCar?.id === action.payload.id) {
          state.currentCar = action.payload;
        }
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete car
      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = state.cars.filter(car => car.id !== action.payload);
        if (state.currentCar?.id === action.payload) {
          state.currentCar = null;
        }
      })
      .addCase(deleteCar.rejected, (state, action) => {
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

export default carsSlice.reducer;