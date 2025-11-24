import axios from 'axios';

export const getAllPayments = async () => {
  try {
    const token = localStorage.getItem('token');
    // PayOS endpoint is on a different port (7184) than the main API
    const response = await axios.get('https://localhost:7184/PayOS/AllPayments', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('PaymentAPI - Raw response:', response);
    console.log('PaymentAPI - Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('PaymentAPI - Error fetching payments:', error);
    throw error;
  }
};
