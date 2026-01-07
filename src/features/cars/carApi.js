import axios from 'axios';
import { PARKLOT_ENDPOINTS, PARKLOT_API_CONFIG, CAR_ENDPOINTS, FEEDBACK_ENDPOINTS, BOOKING_ENDPOINTS, USER_ENDPOINTS, TRACKASIA_ENDPOINTS } from '../../config/api';
import { decodeJWT } from '../auth/utils';


export const fetchParkLots = async () => {
    try {
        const response = await axios.get(PARKLOT_ENDPOINTS.GET_ALL, PARKLOT_API_CONFIG);
        return response.data;
    } catch (error) {
        console.error('Error fetching park lots:', error);
        throw error;
    }
};

export const getCarRentalRate = async (carId) => {
    try {
        const response = await axios.get(CAR_ENDPOINTS.GET_RENTAL_RATE(carId), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching rental rate:', error);
        throw error;
    }
};

export const setCarRentalRate = async (carId, dailyRate) => {
    try {
        const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
        
        const rentalRateData = {
            dailyRate: dailyRate,
            hourlyRate: 0,
            weeklyDiscount: 0,
            monthlyDiscount: 0,
            maxDistancePerDay: 300,
            overtravelRatePerKmInDongperKM: 0,
            carId: carId
        };

        console.log('Setting rental rate:', rentalRateData);

        const response = await axios.post(CAR_ENDPOINTS.SET_RENTAL_RATE, rentalRateData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Rental rate set successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error setting rental rate:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

export const registerCar = async (carData) => {
    try {
        const formData = new FormData();
        
        // Get user info from localStorage - correct keys
        const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const userInfo = userData ? JSON.parse(userData) : {};
        
        // Log the data being sent for debugging
        console.log('Car data being sent:', carData);
        console.log('User info:', userInfo);
        console.log('Token:', token ? 'Present' : 'Missing');
        
        // Add all car information fields - ensure no empty strings for required fields
        if (carData.licensePlate) formData.append('LicensePlate', carData.licensePlate);
        if (carData.model) formData.append('Model', carData.model);
        if (carData.manufacturer) formData.append('Manufacturer', carData.manufacturer);
        if (carData.numberOfSeats) formData.append('Seats', parseInt(carData.numberOfSeats));
        if (carData.yearOfManufacture) formData.append('YearofManufacture', parseInt(carData.yearOfManufacture));
        if (carData.transmission) formData.append('Transmission', carData.transmission);
        if (carData.fuelType) formData.append('FuelType', carData.fuelType);
        if (carData.fuelConsumption) formData.append('FuelConsumption', parseFloat(carData.fuelConsumption));
        if (carData.description) formData.append('Description', carData.description);
        
        // Add photos if available - extract File object from photo object
        if (carData.photos && carData.photos.length > 0) {
            console.log('Photos array:', carData.photos);
            carData.photos.forEach((photo, index) => {
                // Photo object has a 'file' property containing the actual File
                const fileToUpload = photo.file || photo;
                console.log(`Photo ${index}:`, fileToUpload instanceof File ? `File: ${fileToUpload.name}` : 'Not a File object', fileToUpload);
                formData.append('Medias', fileToUpload);
            });
            console.log(`Adding ${carData.photos.length} photos`);
        }
        
        // Extract userId from JWT token
        let userId = null;
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded) {
                userId = decoded.sub || decoded.userId || decoded.id || decoded.nameid;
                console.log('Decoded token:', decoded);
                console.log('Extracted userId:', userId);
            }
        }
        
        // Get username from stored user data
        const username = userInfo.username || userInfo.userName || userInfo.Username || userInfo.email;
        
        if (userId) {
            formData.append('UserId', userId);
        } else {
            console.error('UserId not found - cannot register car without user ID');
            throw new Error('User ID is required. Please log in again.');
        }
        
        if (username) {
            formData.append('Username', username);
        } else {
            console.warn('Username not found in userInfo');
        }
        
        // if (carData.parkLotId) formData.append('PrefLotId', carData.parkLotId); 
        if (carData.address) formData.append('PrefLotName', carData.address);
        

        // Log FormData contents
        console.log('FormData contents:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
        }

        const response = await axios.post(CAR_ENDPOINTS.REGISTER_CAR, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Registration successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error registering car:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
    }
};

export const getCarFeedback = async (carId) => {
    try {
        const response = await axios.get(FEEDBACK_ENDPOINTS.GET_FEEDBACK_BY_CAR(carId), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching car feedback:', error);
        // Return empty array if no feedback found
        if (error.response?.status === 404 || error.response?.data?.message?.includes('no feedback')) {
            return [];
        }
        throw error;
    }
};

export const getBookingById = async (bookingId) => {
    try {
        const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
        const response = await axios.get(BOOKING_ENDPOINTS.GET_BOOKING_BY_ID(bookingId), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
        const response = await axios.get(USER_ENDPOINTS.GET_USER_BY_ID(userId), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const getDistanceBetweenAddresses = async (sourceAddress, destinationAddress) => {
    try {
        const response = await axios.post(TRACKASIA_ENDPOINTS.GET_DISTANCE_BETWEEN_ADDRESSES, {
            sourceAddress,
            destinationAddress
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error calculating distance:', error);
        throw error;
    }
};

export const getAllManufacturers = async () => {
    try {
        const response = await axios.get(CAR_ENDPOINTS.GET_ALL_MANUFACTURER, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching manufacturers:', error);
        throw error;
    }
};

export const getModelsByManufacturerId = async (manufacturerId) => {
    try {
        const response = await axios.get(CAR_ENDPOINTS.GET_MODEL_BY_MANUFACTURERID(manufacturerId), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
                
        return response.data;
        
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
};

// Fetch manufacturers and models in parallel for a specific manufacturer
export const getManufacturersAndModels = async (manufacturerId) => {
    try {
        const [manufacturers, models] = await Promise.all([
            getAllManufacturers(),
            getModelsByManufacturerId(manufacturerId)
        ]);
        return { manufacturers, models };
    } catch (error) {
        console.error('Error fetching manufacturers and models:', error);
        throw error;
    }
};

export const createCarWallet = async (carId) => {
    try {
        const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
        
        console.log('Creating wallet for carId:', carId);

        const response = await axios.post(CAR_ENDPOINTS.CREATE_CAR_WALLET(carId), {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Car wallet created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating car wallet:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

export const getCarWalletByCarId = async (carId) => {
    try {
        const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
        
        console.log('Fetching wallet for carId:', carId);

        const response = await axios.get(CAR_ENDPOINTS.GET_CAR_WALLET_BY_CAR_ID(carId), {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Car wallet fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching car wallet:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};
