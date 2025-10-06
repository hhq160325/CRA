import { createSelector } from '@reduxjs/toolkit';

// Basic selectors
export const selectCarsState = (state) => state.cars;
export const selectCars = (state) => state.cars.cars;
export const selectCurrentCar = (state) => state.cars.currentCar;
export const selectCarsLoading = (state) => state.cars.loading;
export const selectCarsError = (state) => state.cars.error;

// Registration selectors
export const selectRegistrationStep = (state) => state.cars.registrationStep;
export const selectRegistrationData = (state) => state.cars.registrationData;

// Memoized selectors
export const selectActiveCars = createSelector(
  [selectCars],
  (cars) => cars.filter(car => car.status === 'active')
);

export const selectCarsByMake = createSelector(
  [selectCars, (state, make) => make],
  (cars, make) => cars.filter(car => car.make.toLowerCase() === make.toLowerCase())
);

export const selectCarsCount = createSelector(
  [selectCars],
  (cars) => cars.length
);

export const selectRegistrationProgress = createSelector(
  [selectRegistrationStep],
  (step) => {
    const totalSteps = 3;
    return Math.round((step / totalSteps) * 100);
  }
);

export const selectIsRegistrationComplete = createSelector(
  [selectRegistrationData],
  (data) => {
    return Object.keys(data.step1).length > 0 && 
           Object.keys(data.step2).length > 0 && 
           Object.keys(data.step3).length > 0;
  }
);

export const selectCarById = createSelector(
  [selectCars, (state, carId) => carId],
  (cars, carId) => cars.find(car => car.id === carId)
);