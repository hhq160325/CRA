import axios from 'axios';
import { CAR_ENDPOINTS, CAR_API_CONFIG, USER_ENDPOINTS, USER_API_CONFIG } from '../../../config/api';

export const getAllRegDocs = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(CAR_ENDPOINTS.GET_ALL_REG_DOCS, {
      headers: {
        ...CAR_API_CONFIG.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('CarRegDocsAPI - Error fetching registration documents:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(USER_ENDPOINTS.GET_ALL_USERS, {
      headers: {
        ...USER_API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('CarRegDocsAPI - Error fetching users:', error);
    throw error;
  }
};

export const getAllCars = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(CAR_ENDPOINTS.GET_ALL_CARS, {
      headers: {
        ...CAR_API_CONFIG.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('CarRegDocsAPI - Error fetching cars:', error);
    throw error;
  }
};

export const approveRegDoc = async (approvalData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(
      `${CAR_ENDPOINTS.APPROVE_REG_DOC}?isApproved=true`,
      approvalData,
      {
        headers: {
          ...CAR_API_CONFIG.headers,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('CarRegDocsAPI - Error approving registration document:', error);
    throw error;
  }
};
