export const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(3);
  }
  return num.toString();
};

export const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const calculateRentalDays = (pickupTime, dropoffTime) => {
  if (!pickupTime || !dropoffTime) return 0;
  
  const pickupDate = new Date(pickupTime);
  const dropoffDate = new Date(dropoffTime);
  
  return Math.ceil((dropoffDate - pickupDate) / (1000 * 60 * 60 * 24));
};