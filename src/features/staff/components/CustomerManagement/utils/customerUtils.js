export const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'Active':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'Closed':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'Pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const getVerificationBadge = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'AutoApproved':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'Pending':
      return `${baseClasses} bg-orange-100 text-orange-800`;
    case 'ManualApproved':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'NeedManualCheck':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'Rejected':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};