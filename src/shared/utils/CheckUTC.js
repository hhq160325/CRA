// Helper function to convert date to Vietnam time (UTC+7)
export const convertToVietnamTime = (dateString) => {
  const date = new Date(dateString);
  
  // Check if the date string ends with 'Z' (UTC indicator)
  const isUTC = dateString.endsWith('Z') || dateString.includes('+00:00');
  
  if (isUTC) {
    // Old UTC dates - add 7 hours to convert to Vietnam time
    return new Date(date.getTime() + (7 * 60 * 60 * 1000));
  } else {
    // New dates are already in UTC+7 or local time
    return date;
  }
};