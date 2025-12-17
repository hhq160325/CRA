// Custom hook for managing verification status
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { selectUser } from '../authSlice';
import { fetchVerificationStatus, updateVerificationStatus } from '../authSlice';

/* Custom hook for managing user verification status */
export const useVerificationStatus = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  // Get current verification status
  const isVerified = user?.isVerified;
  console.log("Get current verification status STATE",isVerified);
  
  // Fetch fresh verification status from API
  const refreshVerificationStatus = useCallback(() => {
    return dispatch(fetchVerificationStatus());
  }, [dispatch]);
  
  // Update verification status in Redux state only
  const updateVerificationStatusLocal = useCallback((status) => {
    dispatch(updateVerificationStatus(status));
  }, [dispatch]);
  
  // Check if verification status is available
  const hasVerificationStatus = typeof isVerified === 'boolean';
  
  return {
    isVerified,
    hasVerificationStatus,
    refreshVerificationStatus,
    updateVerificationStatus: updateVerificationStatusLocal,
  };
};