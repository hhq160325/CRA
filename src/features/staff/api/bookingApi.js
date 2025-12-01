import axios from 'axios';
import { BOOKING_ENDPOINTS, BOOKING_API_CONFIG, USER_ENDPOINTS, CAR_ENDPOINTS } from '../../../config/api';

// Get all bookings with user and car details
export const getAllBookings = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Fetch all data in parallel
    const [bookingsResponse, carsResponse, usersResponse] = await Promise.all([
      axios.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS, {
        ...BOOKING_API_CONFIG,
        headers: {
          ...BOOKING_API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
      }),
      axios.get(CAR_ENDPOINTS.GET_ALL_CARS, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
      axios.get(USER_ENDPOINTS.GET_ALL_USERS, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ]);
    
    const bookings = bookingsResponse.data;
    const allCars = carsResponse.data;
    const allUsers = usersResponse.data;
    
    // Create user map by id
    const userMap = {};
    allUsers.forEach(user => {
      userMap[user.id] = user;
    });
    
    // Create car map by id
    const carMap = {};
    allCars.forEach(car => {
      carMap[car.id] = car;
    });
    
    // Enrich bookings with user and car data
    const enrichedBookings = bookings.map(booking => {
      const user = userMap[booking.userId];
      const car = carMap[booking.carId];
      
      // Get car owner from car data
      const carOwner = car?.userId ? userMap[car.userId] : null;
      
      // Get customer name - prioritize username over email
      let customerName = 'N/A';
      if (user) {
        // Try full name first
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        if (fullName) {
          customerName = fullName;
        } else if (user.username) {
          customerName = user.username;
        } else if (user.email) {
          customerName = user.email;
        } else {
          customerName = `User ${booking.userId.slice(0, 8)}`;
        }
      } else {
        customerName = `User ${booking.userId.slice(0, 8)}...`;
      }
      
      // Get owner name - prioritize username over email
      let ownerName = 'N/A';
      if (carOwner) {
        // Try full name first
        const fullName = `${carOwner.firstName || ''} ${carOwner.lastName || ''}`.trim();
        if (fullName) {
          ownerName = fullName;
        } else if (carOwner.username) {
          ownerName = carOwner.username;
        } else if (carOwner.email) {
          ownerName = carOwner.email;
        } else {
          ownerName = 'Unknown Owner';
        }
      } else if (car?.userId) {
        ownerName = `Owner ${car.userId.slice(0, 8)}...`;
      }
      
      return {
        ...booking,
        customerName,
        ownerName,
        carModel: car?.model || 'N/A',
        carManufacturer: car?.manufacturer || 'N/A',
        carLicensePlate: car?.licensePlate || 'N/A',
      };
    });
    
    return enrichedBookings;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};
