import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cars: [
    {
      id: 1,
      name: 'Nissan GT - R',
      status: 'Rented',
      pickUp: '20/07/2022',
      dropOff: '21/07/2022',
      paid: true,
      type: 'Sport Car',
      price: 80.00
    },
    {
      id: 2,
      name: 'Koegnigsegg',
      status: 'Rented',
      pickUp: '19/07/2022',
      dropOff: '20/07/2022',
      paid: true,
      type: 'Sport Car',
      price: 99.00
    },
    {
      id: 3,
      name: 'Rolls - Royce',
      status: 'Overdue',
      pickUp: '18/07/2022',
      dropOff: '19/07/2022',
      paid: false,
      type: 'Luxury',
      price: 96.00
    },
    {
      id: 4,
      name: 'CR - V',
      status: 'Rented',
      pickUp: '21/07/2022',
      dropOff: '23/07/2022',
      paid: false,
      type: 'SUV',
      price: 80.00
    },
    {
      id: 5,
      name: 'Toyota Raize',
      status: 'Available',
      pickUp: '--/--/----',
      dropOff: '--/--/----',
      paid: false,
      type: 'SUV',
      price: 0
    },
    {
      id: 6,
      name: 'BMW X5',
      status: 'Returned',
      pickUp: '21/07/2022',
      dropOff: '23/07/2022',
      paid: true,
      type: 'SUV',
      price: 0
    },
    {
      id: 7,
      name: 'Hyundai Tucson',
      status: 'Available',
      pickUp: '--/--/----',
      dropOff: '--/--/----',
      paid: false,
      type: 'SUV',
      price: 0
    },
    {
      id: 8,
      name: 'Mazda CX-5',
      status: 'Returned',
      pickUp: '16/07/2022',
      dropOff: '17/07/2022',
      paid: false,
      type: 'SUV',
      price: 0
    }
  ],
  carStats: {
    sportCar: { count: 17439, percentage: 35 },
    suv: { count: 9478, percentage: 20 },
    coupe: { count: 18197, percentage: 37 },
    hatchback: { count: 12510, percentage: 25 },
    mpv: { count: 14406, percentage: 28 }
  },
  totalRentalCar: 72030,
  recentTransactions: [
    {
      id: 1,
      car: 'Nissan GT - R',
      type: 'Sport Car',
      date: '20 July',
      price: 80.00
    },
    {
      id: 2,
      car: 'Koegnigsegg',
      type: 'Sport Car',
      date: '19 July',
      price: 99.00
    },
    {
      id: 3,
      car: 'Rolls - Royce',
      type: 'Luxury',
      date: '18 July',
      price: 96.00
    },
    {
      id: 4,
      car: 'CR - V',
      type: 'SUV',
      date: '17 July',
      price: 80.00
    }
  ]
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    updateCarStatus: (state, action) => {
      const { carId, status } = action.payload;
      const car = state.cars.find(car => car.id === carId);
      if (car) {
        car.status = status;
      }
    },
    addTransaction: (state, action) => {
      state.recentTransactions.unshift(action.payload);
      if (state.recentTransactions.length > 4) {
        state.recentTransactions.pop();
      }
    }
  }
});

export const { updateCarStatus, addTransaction } = adminSlice.actions;
export { adminSlice };