import { useState, useMemo } from 'react';

export const useCarHandoverFilters = (carHandoverLogs, staffMap) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return carHandoverLogs.filter(log => {
      const staff = staffMap[log.responsibleStaffId];
      const staffName = staff ? staff.name : 'Unknown Staff';

      const matchesSearch = staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.type && log.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.id && log.id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesAction = actionFilter === 'all' ||
        (actionFilter === 'pickup' && log.type === 'Pickup') ||
        (actionFilter === 'return' && log.type === 'Return');

      return matchesSearch && matchesAction;
    });
  }, [carHandoverLogs, staffMap, searchTerm, actionFilter]);

  return {
    searchTerm,
    setSearchTerm,
    actionFilter,
    setActionFilter,
    filteredLogs
  };
};