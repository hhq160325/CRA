/**
 * Get status badge configuration for a car status
 * @param {string} status - The car status
 * @param {Function} t - Translation function
 * @returns {Object} Status badge configuration
 */
export const getStatusBadgeConfig = (status, t) => {
  const statusConfig = {
    'Pending': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: t('carRegisDocs.statusPending')
    },
    'Active': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: t('carRegisDocs.statusApproved')
    },
    'Inactive': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: t('carRegisDocs.statusApproved')
    },
    'Reserved': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: t('carRegisDocs.statusPending')
    }
  };

  return statusConfig[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: status
  };
};

/**
 * Trigger file input click for a specific car
 * @param {string} carId - The car ID
 */
export const triggerFileInput = (carId) => {
  const fileInput = document.getElementById(`file-upload-${carId}`);
  if (fileInput) {
    fileInput.click();
  }
};