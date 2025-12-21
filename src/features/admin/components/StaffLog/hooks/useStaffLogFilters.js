import { useState, useMemo } from 'react';

export const useStaffLogFilters = (staffLogs, staffMap) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return staffLogs.filter(log => {
      const staff = staffMap[log.staffId];
      const staffName = staff ? staff.name : 'Unknown Staff';

      const matchesSearch = staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = actionFilter === 'all' ||
        (actionFilter === 'check-in' && log.action.includes('Check-in')) ||
        (actionFilter === 'check-out' && log.action.includes('Check-out'));

      return matchesSearch && matchesAction;
    });
  }, [staffLogs, staffMap, searchTerm, actionFilter]);

  return {
    searchTerm,
    setSearchTerm,
    actionFilter,
    setActionFilter,
    filteredLogs
  };
};