export const getStatusBadge = (status, t) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case 'confirmed':
      return {
        className: `${baseClasses} bg-blue-100 text-blue-800`,
        label: t('bookingManagement.confirmedStatus')
      };
    case 'completed':
      return {
        className: `${baseClasses} bg-green-100 text-green-800`,
        label: t('bookingManagement.completedStatus')
      };
    case 'cancelled':
      return {
        className: `${baseClasses} bg-red-100 text-red-800`,
        label: t('bookingManagement.cancelledStatus')
      };
    case 'canceled':
      return {
        className: `${baseClasses} bg-red-100 text-red-800`,
        label: t('bookingManagement.cancelledStatus')
      };
    case 'pending':
      return {
        className: `${baseClasses} bg-yellow-100 text-yellow-800`,
        label: t('bookingManagement.pending')
      };
    default:
      return {
        className: `${baseClasses} bg-gray-100 text-gray-800`,
        label: t('bookingManagement.notAvailable')
      };
  }
};