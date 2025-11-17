import axios from 'axios';
import { PARKLOT_ENDPOINTS, PARKLOT_API_CONFIG } from '../../config/api';


export const fetchParkLots = async () => {
    try {
        const response = await axios.get(PARKLOT_ENDPOINTS.GET_ALL, PARKLOT_API_CONFIG);
        return response.data;
    } catch (error) {
        console.error('Error fetching park lots:', error);
        throw error;
    }
};
