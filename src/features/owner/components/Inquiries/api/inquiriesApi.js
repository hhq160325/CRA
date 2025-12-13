import { axiosInstance } from "../../../../../shared/utils/axiosInstance";
import { INQUIRY_ENDPOINTS, USER_ENDPOINTS } from "../../../../../config/api";

// ============================================
// INQUIRIES API
// ============================================

/* Fetch inquiries for a specific user */
export const getInquiries = async (userId) => {
  try {
    const response = await axiosInstance.get(INQUIRY_ENDPOINTS.GET_INQUIRY(userId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch inquiries');
  }
};

/* Send a response to an inquiry */
export const sendInquiryResponse = async (responseData) => {
  try {
    const formData = new FormData();
    formData.append('Title', responseData.title);
    formData.append('Content', responseData.content);
    formData.append('isOpen', 'true');
    formData.append('SenderId', responseData.senderId);
    formData.append('ReceiverId', responseData.receiverId);
    formData.append('ParentInquiryId', responseData.parentInquiryId);

    const response = await axiosInstance.post(
      INQUIRY_ENDPOINTS.ANSWER_INQUIRY,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to send response');
  }
};

/* Create a new inquiry */
export const createInquiry = async (inquiryData) => {
  try {
    const formData = new FormData();
    formData.append('Title', inquiryData.title);
    formData.append('Content', inquiryData.content);
    formData.append('isOpen', 'true');
    formData.append('SenderId', inquiryData.senderId);
    formData.append('ReceiverId', inquiryData.receiverId);

    const response = await axiosInstance.post(
      INQUIRY_ENDPOINTS.CREATE_INQUIRY,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to create inquiry');
  }
};

/* Get chat log history between two users */
export const getChatLogHistory = async (senderId, receiverId) => {
  try {
    const response = await axiosInstance.get(
      INQUIRY_ENDPOINTS.CHAT_LOG_HISTORY(senderId, receiverId)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch chat history');
  }
};

/* Mark an inquiry as closed */
export const closeInquiry = async (inquiryId) => {
  try {
    // TODO: Implement actual API call when endpoint is available
    console.log('Closing inquiry:', inquiryId);
    return { success: true, message: 'Inquiry marked as closed' };
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to close inquiry');
  }
};

// ============================================
// USER LOOKUP API (for inquiries)
// ============================================

/* Fetch all users and create a lookup map */
export const getUserLookupMap = async () => {
  try {
    const response = await axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS);
    const usersData = response.data;
    
    const userMap = {};
    usersData.forEach(user => {
      userMap[user.id] = {
        name: user.username || user.fullName || 'Unknown',
        email: user.email || 'No data',
        phone: user.phoneNumber || 'No data'
      };
    });

    return userMap;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch users');
  }
};

/* Get user info by ID from the lookup map */
export const getUserInfo = (userMap, userId) => {
  return userMap[userId] || {
    name: 'Unknown',
    email: 'No data',
    phone: 'No data'
  };
};

// ============================================
// COMBINED DATA FETCHING 
// ============================================

/* Fetch inquiries and user lookup data in parallel */
export const fetchInquiriesWithUsers = async (userId) => {
  try {
    const [inquiriesData, userMap] = await Promise.all([
      getInquiries(userId),
      getUserLookupMap()
    ]);

    return {
      inquiries: inquiriesData,
      userMap
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch inquiries and user data');
  }
};