import { sortByLatest, sortByOldest, sortByMultipleDates } from '../../../../../shared/utils/SortByLatest';

export const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'confirmed':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'completed':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'cancelled':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'canceled':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'active':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'overdue':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const getStatusText = (status, t) => {
  switch (status) {
    case 'active':
      return t('active');
    case 'pending':
      return t('pending');
    case 'confirmed':
      return t('confirmed');
    case 'cancelled':
      return t('cancelled');
    case 'canceled':
      return t('cancelled');
    case 'overdue':
      return t('overdue');
    case 'completed':
      return t('completed');
    default:
      return status;
  }
};

export const getPaymentBadge = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  const normalizedStatus = status?.toLowerCase();
  switch (normalizedStatus) {
    case 'success':
    case 'paid':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'cancelled':
    case 'failed':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const getPaymentStatusText = (status, t) => {
  const normalizedStatus = status?.toLowerCase();
  switch (normalizedStatus) {
    case 'success':
    case 'paid':
      return t('success');
    case 'pending':
      return t('pending');
    case 'cancelled':
    case 'failed':
      return t('cancelled');
    default:
      return status;
  }
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return `${Number(amount).toLocaleString('vi-VN')} đ`;
};

// Booking sorting utilities
export const sortBookingsByCreateDate = (bookings, descending = true) => {
  return descending ? sortByLatest(bookings, 'createDate') : sortByOldest(bookings, 'createDate');
};

export const sortBookingsByStartDate = (bookings, descending = true) => {
  return descending ? sortByLatest(bookings, 'startDate') : sortByOldest(bookings, 'startDate');
};

export const sortBookingsByMultipleDates = (bookings, descending = true) => {
  return sortByMultipleDates(bookings, ['createDate', 'startDate'], descending);
};

export const sortBookingsByStatus = (bookings) => {
  const statusPriority = {
    'overdue': 1,
    'active': 2,
    'pending': 3,
    'confirmed': 4,
    'completed': 5,
    'cancelled': 6
  };

  return [...bookings].sort((a, b) => {
    const priorityA = statusPriority[a.status] || 999;
    const priorityB = statusPriority[b.status] || 999;
    return priorityA - priorityB;
  });
};