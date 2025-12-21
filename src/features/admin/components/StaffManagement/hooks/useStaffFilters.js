import { useState, useMemo } from 'react';

export const useStaffFilters = (staffMembers) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredStaff = useMemo(() => {
    return staffMembers.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
      const matchesRole = roleFilter === 'all' || staff.roleName.toLowerCase() === roleFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [staffMembers, searchTerm, statusFilter, roleFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    filteredStaff
  };
};