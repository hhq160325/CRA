export const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case 'active':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'confirmed':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'cancelled':
      return `${baseClasses} bg-gray-100 text-gray-800`;
    case 'overdue':
      return `${baseClasses} bg-red-100 text-red-800`;
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
  switch (status) {
    case 'paid':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'refunded':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'failed':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'expired':
      return `${baseClasses} bg-gray-100 text-gray-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export const getPaymentStatusText = (status, t) => {
  switch (status) {
    case 'paid':
      return t('paid');
    case 'pending':
      return t('pending');
    case 'refunded':
      return t('refunded');
    case 'failed':
      return t('failed');
    case 'expired':
      return t('expired');
    default:
      return status;
  }
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return `${Number(amount).toLocaleString('vi-VN')} đ`;
};