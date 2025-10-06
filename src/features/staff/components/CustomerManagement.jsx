import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCustomerAccount } from '../staffSlice';

const CustomerManagement = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for customers
  const customers = [
    {
      id: 1,
      name: 'Alice Cooper',
      email: 'alice.cooper@email.com',
      phone: '+1 (555) 111-2222',
      status: 'active',
      registrationDate: '2024-01-20',
      totalBookings: 12,
      totalSpent: 3450,
      lastBooking: '2024-10-01',
      verificationStatus: 'verified',
      complianceIssues: 0
    },
    {
      id: 2,
      name: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      phone: '+1 (555) 222-3333',
      status: 'active',
      registrationDate: '2024-02-15',
      totalBookings: 8,
      totalSpent: 2100,
      lastBooking: '2024-09-28',
      verificationStatus: 'verified',
      complianceIssues: 0
    },
    {
      id: 3,
      name: 'Carol Smith',
      email: 'carol.smith@email.com',
      phone: '+1 (555) 333-4444',
      status: 'suspended',
      registrationDate: '2023-11-10',
      totalBookings: 15,
      totalSpent: 4200,
      lastBooking: '2024-09-15',
      verificationStatus: 'verified',
      complianceIssues: 2
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 444-5555',
      status: 'pending',
      registrationDate: '2024-10-05',
      totalBookings: 0,
      totalSpent: 0,
      lastBooking: null,
      verificationStatus: 'pending',
      complianceIssues: 0
    },
    {
      id: 5,
      name: 'Eva Brown',
      email: 'eva.brown@email.com',
      phone: '+1 (555) 555-6666',
      status: 'active',
      registrationDate: '2024-03-12',
      totalBookings: 25,
      totalSpent: 7800,
      lastBooking: '2024-10-03',
      verificationStatus: 'verified',
      complianceIssues: 0
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'suspended':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getVerificationBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'pending':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getCustomerTier = (totalSpent) => {
    if (totalSpent >= 5000) return { tier: 'Gold', class: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 2000) return { tier: 'Silver', class: 'bg-gray-100 text-gray-800' };
    return { tier: 'Bronze', class: 'bg-orange-100 text-orange-800' };
  };

  const handleAccountUpdate = (customerId, updates) => {
    dispatch(updateCustomerAccount({ id: customerId, updates }));
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">View and manage customer accounts</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Send Bulk Message
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Verification</p>
              <p className="text-2xl font-bold text-yellow-600">{customers.filter(c => c.verificationStatus === 'pending').length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Issues</p>
              <p className="text-2xl font-bold text-red-600">{customers.reduce((sum, c) => sum + c.complianceIssues, 0)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Verification</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Tier</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Bookings</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Total Spent</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Issues</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => {
                const tier = getCustomerTier(customer.totalSpent);
                return (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        <div className="text-xs text-gray-400">{customer.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(customer.status)}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getVerificationBadge(customer.verificationStatus)}>
                        {customer.verificationStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tier.class}`}>
                        {tier.tier}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{customer.totalBookings}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">${customer.totalSpent.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      {customer.complianceIssues > 0 ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {customer.complianceIssues}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
            </div>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;