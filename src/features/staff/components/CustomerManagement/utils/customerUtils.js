export const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'active':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'suspended':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const getVerificationBadge = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'verified':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'pending':
      return `${baseClasses} bg-orange-100 text-orange-800`;
    case 'rejected':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};