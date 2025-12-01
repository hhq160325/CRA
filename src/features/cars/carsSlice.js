import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../shared/utils/axiosInstance';

// Async thunks for car operations
export const registerCar = createAsyncThunk(
  'cars/registerCar',
  async (carData, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await axiosInstance.post('/cars', carData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserCars = createAsyncThunk(
  'cars/fetchUserCars',
  async (userId, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await axiosInstance.get(`/users/${userId}/cars`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

<<<<<<< HEAD
=======
export const fetchAllCars = createAsyncThunk(
  'cars/fetchAllCars',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/Car/AllCars');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
export const fetchCarById = createAsyncThunk(
  'cars/fetchCarById',
  async (carId, { rejectWithValue }) => {
    try {
<<<<<<< HEAD
      // TODO: Replace with actual API call
      const response = await axiosInstance.get(`/cars/${carId}`);
=======
      const response = await axiosInstance.get(`/Car/${carId}`);
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRelatedCars = createAsyncThunk(
  'cars/fetchRelatedCars',
  async (carId, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await axiosInstance.get(`/cars/${carId}/related`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
<<<<<<< HEAD
=======
      // Fetch all cars
      .addCase(fetchAllCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchAllCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
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

export default carsSlice.reducer;