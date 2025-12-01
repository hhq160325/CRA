// Global logout function
import { tokenUtils } from "../../features/auth/utils";

// Logout function
export const logout = async () => {
  // Clear local storage - no API call needed
  tokenUtils.clearTokens();
  
  // Clear delivery location
  localStorage.removeItem('deliveryLocation');
  
  // Clear rental dates
  localStorage.removeItem('rentalDates');
};

export default logout;