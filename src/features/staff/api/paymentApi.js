import axios from 'axios';
import { PAYMENT_ENDPOINTS, PAYMENT_API_CONFIG } from '../../../config/api';
export const getAllPayments = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get(PAYMENT_ENDPOINTS.GET_ALL_PAYMENTS, {
      headers: {
        ...PAYMENT_API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('PaymentAPI - Error fetching payments:', error);
    throw error;
  }
};
