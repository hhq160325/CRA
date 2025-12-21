export const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'approved':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'autoapproved':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'active':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'denied':
    case 'rejected':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const getStatusText = (status, t) => {
  switch (status) {
    case 'approved':
      return t('statusApproved') || 'Approved';
    case 'autoapproved':
      return t('statusApproved') || 'Approved';
    case 'active':
      return t('statusPending') || 'Pending';
    case 'denied':
    case 'rejected':
      return t('statusRejected') || 'Rejected';
    default:
      return status;
  }
};