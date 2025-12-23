import { useState, useMemo } from 'react';

export const useCustomerFilters = (customers) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortByScore, setSortByScore] = useState('default');

  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Apply sorting by behaviour score
    if (sortByScore === 'highest') {
      filtered = filtered.sort((a, b) => b.behaviourScore - a.behaviourScore);
    } else if (sortByScore === 'lowest') {
      filtered = filtered.sort((a, b) => a.behaviourScore - b.behaviourScore);
    }
    // 'default' keeps the original order (already sorted highest to lowest from useCustomers)

    return filtered;
  }, [customers, searchTerm, statusFilter, sortByScore]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortByScore,
    setSortByScore,
    filteredCustomers
  };
};