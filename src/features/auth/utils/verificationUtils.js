// Verification utilities for managing isVerified status
import { updateVerificationStatus } from '../authSlice';

/* Fetch current user's verification status and update Redux state */
export const fetchAndUpdateVerificationStatus = async (dispatch) => {
  try {
    const { getUserById } = await import('../../user/api');
    const userData = await getUserById();
    
    // Update Redux state with verification status
    dispatch(updateVerificationStatus(userData.isVerified));
    
    return userData.isVerified;
  } catch (error) {
    console.error('Failed to fetch verification status:', error);
    return false;
  }
};

/* Update verification status in Redux state only */
export const updateVerificationStatusInState = (dispatch, isVerified) => {
  dispatch(updateVerificationStatus(isVerified));
};

/* Check if user needs verification status refresh */
export const shouldRefreshVerificationStatus = (user) => {
  // If user exists but isVerified is undefined, we should fetch it
  return user && typeof user.isVerified === 'undefined';
};