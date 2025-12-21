export const getActionBadge = (action) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium text-left";
  if (action.includes('Check-in')) {
    return `${baseClasses} bg-green-100 text-green-800`;
  } else if (action.includes('Check-out')) {
    return `${baseClasses} bg-blue-100 text-blue-800`;
  } else {
    return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};