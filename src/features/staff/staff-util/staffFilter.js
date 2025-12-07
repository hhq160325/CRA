// Staff filtering utilities

/**
 * Filter registration documents by status
 * @param {Array} docs - Array of registration documents
 * @param {string} status - Status to filter by ('all', 'pending', 'approved', 'rejected')
 * @returns {Array} Filtered documents
 */
export const filterByStatus = (docs, status) => {
  if (!Array.isArray(docs)) return [];
  if (status === 'all') return docs;
  
  return docs.filter(doc => 
    doc.status?.toLowerCase() === status.toLowerCase()
  );
};

/**
 * Filter documents by search term
 * @param {Array} docs - Array of registration documents
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered documents
 */
export const filterBySearchTerm = (docs, searchTerm) => {
  if (!Array.isArray(docs)) return [];
  if (!searchTerm || searchTerm.trim() === '') return docs;
  
  const searchLower = searchTerm.toLowerCase();
  
  return docs.filter(doc => {
    const matchesCarId = (doc.carId || '').toLowerCase().includes(searchLower);
    const matchesUserId = (doc.userId || '').toLowerCase().includes(searchLower);
    const matchesLicensePlate = (doc.licensePlate || '').toLowerCase().includes(searchLower);
    const matchesUserName = (doc.userFullName || '').toLowerCase().includes(searchLower);
    const matchesCarModel = (doc.carModel || '').toLowerCase().includes(searchLower);
    const matchesCarManufacturer = (doc.carManufacturer || '').toLowerCase().includes(searchLower);
    
    return matchesCarId || matchesUserId || matchesLicensePlate || 
           matchesUserName || matchesCarModel || matchesCarManufacturer;
  });
};

/**
 * Combined filter for registration documents
 * @param {Array} docs - Array of registration documents
 * @param {Object} filters - Filter options
 * @param {string} filters.searchTerm - Search term
 * @param {string} filters.status - Status filter
 * @returns {Array} Filtered documents
 */
export const filterRegDocs = (docs, { searchTerm = '', status = 'all' } = {}) => {
  if (!Array.isArray(docs)) return [];
  
  let filtered = docs;
  
  // Apply status filter
  filtered = filterByStatus(filtered, status);
  
  // Apply search filter
  filtered = filterBySearchTerm(filtered, searchTerm);
  
  return filtered;
};

/**
 * Get status badge classes
 * @param {string} status - Document status
 * @returns {string} CSS classes for status badge
 */
export const getStatusBadgeClasses = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
  const normalizedStatus = status?.toLowerCase();
  
  switch (normalizedStatus) {
    case 'approved':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'rejected':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};
