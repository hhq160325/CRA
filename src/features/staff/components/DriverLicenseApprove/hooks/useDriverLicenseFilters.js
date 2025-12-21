import { useState, useMemo } from 'react';

export const useDriverLicenseFilters = (driverLicenses) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLicenses = useMemo(() => {
    return (driverLicenses || []).filter(license => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (license.customerName || '').toLowerCase().includes(searchLower) ||
        (license.licenseNumber || '').toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [driverLicenses, searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredLicenses
  };
};