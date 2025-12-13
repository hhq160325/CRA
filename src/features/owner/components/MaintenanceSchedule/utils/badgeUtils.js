export const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'upcoming':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'due':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'overdue':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'completed':
      return `${baseClasses} bg-green-100 text-green-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const getPriorityBadge = (priority) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch (priority) {
    case 'high':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'medium':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'low':
      return `${baseClasses} bg-green-100 text-green-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};