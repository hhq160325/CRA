// Mock API service for cars - replace with real API calls when backend is ready

// Mock data for development
const mockCars = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'Silver',
    licensePlate: 'ABC-123',
    vin: '1HGBH41JXMN109186',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    color: 'Blue',
    licensePlate: 'XYZ-789',
    vin: '2HGFC2F59NH123456',
    status: 'active',
    createdAt: '2024-02-20T14:15:00Z',
  },
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const carsAPI = {
  // Register a new car
  registerCar: async (carData) => {
    await delay(1000); // Simulate network delay
    
    // Mock validation
    if (!carData.make || !carData.model) {
      throw new Error('Make and model are required');
    }
    
    const newCar = {
      id: Date.now().toString(),
      ...carData,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    mockCars.push(newCar);
    return newCar;
  },

  // Get user's cars
  getUserCars: async (userId) => {
    await delay(500);
    
    // In real implementation, filter by userId
    return mockCars;
  },

  // Get car by ID
  getCarById: async (carId) => {
    await delay(300);
    
    const car = mockCars.find(car => car.id === carId);
    if (!car) {
      throw new Error('Car not found');
    }
    
    return car;
  },

  // Update car
  updateCar: async (carId, updateData) => {
    await delay(800);
    
    const carIndex = mockCars.findIndex(car => car.id === carId);
    if (carIndex === -1) {
      throw new Error('Car not found');
    }
    
    mockCars[carIndex] = { ...mockCars[carIndex], ...updateData };
    return mockCars[carIndex];
  },

  // Delete car
  deleteCar: async (carId) => {
    await delay(500);
    
    const carIndex = mockCars.findIndex(car => car.id === carId);
    if (carIndex === -1) {
      throw new Error('Car not found');
    }
    
    const deletedCar = mockCars.splice(carIndex, 1)[0];
    return deletedCar;
  },
};

// API endpoints for backend team reference
export const API_ENDPOINTS = {
  REGISTER_CAR: '/api/cars',
  GET_USER_CARS: '/api/users/:userId/cars',
  GET_CAR: '/api/cars/:carId',
  UPDATE_CAR: '/api/cars/:carId',
  DELETE_CAR: '/api/cars/:carId',
};