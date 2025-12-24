import axios from 'axios';
import { PARKLOT_ENDPOINTS, PARKLOT_API_CONFIG, USER_ENDPOINTS, USER_API_CONFIG } from '../../../../../config/api';

/**
 * Service for fetching parking lot data
 */
export const parkLotService = {
  /* Get all parking lots */
  getAllParkLots: async () => {
    try {
      const response = await axios.get(PARKLOT_ENDPOINTS.GET_ALL, PARKLOT_API_CONFIG);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch parking lots:', error);
      throw error;
    }
  },

  /* Get all users */
  getAllUsers: async () => {
    try {
      const response = await axios.get(USER_ENDPOINTS.GET_ALL_USERS, USER_API_CONFIG);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  /* Create a map of user ID to user data for quick lookup */
  createUserMap: (users) => {
    if (!Array.isArray(users)) {
      return {};
    }

    return users.reduce((map, user) => {
      if (user.id) {
        map[user.id] = {
          id: user.id,
          fullName: user.fullname || user.name || 'Unknown Manager',
          email: user.email || '',
          phoneNumber: user.phoneNumber || ''
        };
      }
      return map;
    }, {});
  },

  /* Transform parking lot data for map display */
  transformParkLotData: (parkLots, userMap = {}) => {
    if (!Array.isArray(parkLots)) {
      return [];
    }

    return parkLots
      .filter(parkLot => 
        parkLot.latitude && 
        parkLot.longtitude && 
        parkLot.status === 'Active'
      )
      .map(parkLot => {
        const manager = userMap[parkLot.managerId] || null;
        
        return {
          id: parkLot.managerId || `parklot-${Math.random()}`,
          name: parkLot.name || 'Unnamed Parking Lot',
          address: parkLot.address || '',
          city: parkLot.city || '',
          fullAddress: `${parkLot.address || ''}`,
          latitude: parseFloat(parkLot.latitude),
          longitude: parseFloat(parkLot.longtitude),
          capacity: parkLot.capacity || 0,
          contactNum: parkLot.contactNum || '',
          notes: parkLot.notes || '',
          status: parkLot.status || 'Unknown',
          managerId: parkLot.managerId || null,
          manager: manager ? {
            fullName: manager.fullName,
            email: manager.email,
            phoneNumber: manager.phoneNumber
          } : null
        };
      });
  },

  /**
   * Fetch parking lots with manager information
   * @returns {Promise<Array>} Array of parking lots with manager data
   */
  getParkLotsWithManagers: async () => {
    try {
      // Fetch both parking lots and users concurrently
      const [parkLotsData, usersData] = await Promise.all([
        parkLotService.getAllParkLots(),
        parkLotService.getAllUsers()
      ]);

      // Create user map for quick lookup
      const userMap = parkLotService.createUserMap(usersData);

      // Transform parking lot data with manager information
      return parkLotService.transformParkLotData(parkLotsData, userMap);
    } catch (error) {
      console.error('Failed to fetch parking lots with managers:', error);
      throw error;
    }
  }
};