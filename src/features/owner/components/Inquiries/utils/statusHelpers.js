/* Get CSS classes for status badge */
export const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'responded':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'closed':
      return `${baseClasses} bg-gray-100 text-gray-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

/* Get translated status text */
export const getStatusText = (status, t) => {
  switch (status) {
    case 'pending':
      return t('inquiries.statusPending');
    case 'responded':
      return t('inquiries.statusResponded');
    case 'closed':
      return t('inquiries.statusClosed');
    default:
      return status;
  }
};

/* Get CSS classes for priority badge */
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

/* Get translated priority text */
export const getPriorityText = (priority, t) => {
  switch (priority) {
    case 'high':
      return t('inquiries.priorityHigh');
    case 'medium':
      return t('inquiries.priorityMedium');
    case 'low':
      return t('inquiries.priorityLow');
    default:
      return priority;
  }
};