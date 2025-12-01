// Global logout function
import { tokenUtils } from "../../features/auth/utils";

// Logout function
export const logout = async () => {
  // Clear local storage - no API call needed
  tokenUtils.clearTokens();
<<<<<<< HEAD
=======
  
  // Clear delivery location
  localStorage.removeItem('deliveryLocation');
  
  // Clear rental dates
  localStorage.removeItem('rentalDates');
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
};

export default logout;