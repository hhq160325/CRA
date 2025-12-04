<<<<<<< Updated upstream
<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  updateCustomerAccount,
  setCustomers,
  setLoading,
  setError,
  clearError,
} from '../staffSlice';
import { CustomerModal } from './modals/customerModal';
import { fetchAllUsers } from '../api';
const CustomerManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.staff?.customers || []);
  const isLoading = useSelector(
    (state) => state.staff?.loading?.customers || false
  );
  const error = useSelector((state) => state.staff?.errors?.customers);
=======
import { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> Stashed changes
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateCustomerAccount } from '../staffSlice';
import { CustomerModal } from './modals/customerModal';
import { USER_ENDPOINTS } from '../../../config/api';
import axios from 'axios';
import Pagination from '../../../shared/components/Pagination';
const CustomerManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'suspend'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

<<<<<<< Updated upstream
<<<<<<< HEAD
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        dispatch(setLoading({ section: 'customers', loading: true }));
        const users = await fetchAllUsers();
        // Filter customers: roleId === 1 (Customer) and not car owner
        const customerRows = (users || [])
          .filter((u) => u.roleId === 1 && !u.isCarOwner)
          .map((u) => ({
            id: u.id,
            name: u.fullname || u.username,
            email: u.email,
            phone: u.phoneNumber || '',
            status: (u.status || 'active').toLowerCase(),
            registrationDate: '', // backend không trả, để trống
            totalBookings: 0,
            totalSpent: 0,
            lastBooking: null,
            verificationStatus:
              (u.status || '').toLowerCase() === 'active'
                ? 'verified'
                : 'pending',
            complianceIssues: 0,
          }));
        dispatch(setCustomers(customerRows));
        dispatch(clearError('customers'));
      } catch (e) {
        dispatch(
          setError({
            section: 'customers',
            error: e?.message || 'Failed to load customers',
          })
        );
      } finally {
        dispatch(setLoading({ section: 'customers', loading: false }));
      }
    };

    loadCustomers();
  }, [dispatch]);
=======
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
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
=======
  // Fetch all users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(USER_ENDPOINTS.GET_ALL_USERS, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Transform API data to match component structure
        const transformedUsers = response.data.map(user => ({
          id: user.userId,
          name: user.fullname || 'N/A',
          email: user.email || 'N/A',
          phone: user.phoneNumber || 'N/A',
          status: user.status,
          registrationDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
          totalBookings: user.totalBookings || 0,
          totalSpent: user.totalSpent || 0,
          lastBooking: user.lastBooking || null,
          verificationStatus: user.isVerified ? 'verified' : 'pending',
          complianceIssues: user.complianceIssues || 0,
          role: user.role || 'customer'
        }));

        setCustomers(transformedUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
>>>>>>> Stashed changes

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


  // Modal Func S
  const openModal = (customer, type) => {
    setSelectedCustomer(customer);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setModalType(null);
  };

  const handleSuspend = () => {
    if (selectedCustomer) {
      handleAccountUpdate(selectedCustomer.id, { status: 'suspended' });
      closeModal();
    }
  };

  const handleEdit = (formData) => {
    if (selectedCustomer) {
      handleAccountUpdate(selectedCustomer.id, formData);
      closeModal();
    }
  };

   const handleChangeModalType = (type) => {
    setModalType(type);
  };
// Modal Func E
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading') || 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-red-800 font-medium">{t('error') || 'Error'}</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('retry') || 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-gray-900">
            {t('customerManagement')}
          </h1>
          <p className="text-gray-600">{t('viewAndManageCustomers')}</p>
          {isLoading && (
            <p className="text-xs text-gray-400 mt-1">{t('loading')}...</p>
          )}
          {error && (
            <p className="text-xs text-red-500 mt-1">
              {t('error')}: {error}
            </p>
          )}
=======
          <h1 className="text-2xl font-bold text-gray-900">{t('customerManagement')}</h1>
          <p className="text-gray-600">{t('viewAndManageCustomers')}</p>
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            {t('exportData')}
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {t('sendBulkMessage')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('totalCustomers')}</p>
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
              <p className="text-sm text-gray-600">{t('activeCustomers')}</p>
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
              <p className="text-sm text-gray-600">{t('pendingVerification')}</p>
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
              <p className="text-sm text-gray-600">{t('complianceIssues')}</p>
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
                placeholder={t('searchCustomers')}
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
              <option value="all">{t('allStatus')}</option>
              <option value="active">{t('active')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="suspended">{t('suspended')}</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {t('showing')} {currentCustomers.length} {t('of')} {filteredCustomers.length} {t('customers')}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('customer')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('status')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('verification')}</th>
                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('tier')}</th> */}
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookings')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('totalSpent')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('issues')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentCustomers.map((customer) => {
                // const tier = getCustomerTier(customer.totalSpent);
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
                    {/* <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tier.class}`}>
                        {tier.tier}
                      </span>
                    </td> */}
                    <td className="py-4 px-6 text-gray-600 text-sm">{customer.totalBookings}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">${(customer.totalSpent || 0).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      {customer.complianceIssues > 0 ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {customer.complianceIssues}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">{t('none')}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(customer, 'view')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          {t('view')}
                        </button>
                        <button
                          onClick={() => openModal(customer, 'edit')}
                          className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                        >
                          {t('edit')}
                        </button>
                        {customer.status === 'active' ? (
                          <button
                            onClick={() => openModal(customer, 'suspend')}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            {t('suspend')}
                          </button>
                        ) : customer.status === 'suspended' ? (
                          <button
                            onClick={() => handleAccountUpdate(customer.id, { status: 'active' })}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            {t('activate')}
                          </button>
                        ) : (
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                            {t('message')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredCustomers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal */}
      {/* {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"> */}
      {/* Modal Header */}
      {/* <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'view' && 'Customer Details'}
                {modalType === 'edit' && 'Edit Customer'}
                {modalType === 'suspend' && 'Suspend Customer'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div> */}

      {/* Modal Content */}
      {/* {modalType === 'view' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={getStatusBadge(selectedCustomer.status)}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                    <p className="text-gray-900">{selectedCustomer.registrationDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                    <span className={getVerificationBadge(selectedCustomer.verificationStatus)}>
                      {selectedCustomer.verificationStatus}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Tier</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCustomerTier(selectedCustomer.totalSpent).class}`}>
                      {getCustomerTier(selectedCustomer.totalSpent).tier}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Bookings</label>
                    <p className="text-gray-900">{selectedCustomer.totalBookings}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent</label>
                    <p className="text-gray-900">${(selectedCustomer.totalSpent || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Booking</label>
                    <p className="text-gray-900">{selectedCustomer.lastBooking || 'No bookings yet'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Issues</label>
                    <p className="text-gray-900">
                      {selectedCustomer.complianceIssues > 0 ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {selectedCustomer.complianceIssues} issues
                        </span>
                      ) : (
                        <span className="text-green-600">No issues</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )} */}

      {/* {modalType === 'edit' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleEdit(Object.fromEntries(formData));
              }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={selectedCustomer.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={selectedCustomer.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={selectedCustomer.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        defaultValue={selectedCustomer.status}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                      <select
                        name="verificationStatus"
                        defaultValue={selectedCustomer.verificationStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Issues</label>
                      <input
                        type="number"
                        name="complianceIssues"
                        min="0"
                        defaultValue={selectedCustomer.complianceIssues}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )} */}

      {/* {modalType === 'suspend' && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Suspend Customer Account
                      </h3>
                      <p className="mt-2 text-sm text-red-700">
                        Are you sure you want to suspend <strong>{selectedCustomer.name}</strong>'s account? 
                        This will prevent them from making new bookings and accessing their account.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Account Details:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                    <p><span className="font-medium">Total Bookings:</span> {selectedCustomer.totalBookings}</p>
                    <p><span className="font-medium">Total Spent:</span> ${(selectedCustomer.totalSpent || 0).toLocaleString()}</p>
                    <p><span className="font-medium">Customer Tier:</span> {getCustomerTier(selectedCustomer.totalSpent).tier}</p>
                    {selectedCustomer.complianceIssues > 0 && (
                      <p><span className="font-medium text-red-600">Compliance Issues:</span> {selectedCustomer.complianceIssues}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSuspend}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Suspend Account
                  </button>
                </div>
              </div>
            )} */}

      {/* View Mode Action Buttons */}
      {/* {modalType === 'view' && (
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setModalType('edit')}
                  className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                {selectedCustomer.status === 'active' && (
                  <button
                    onClick={() => setModalType('suspend')}
                    className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Suspend
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      )} */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedCustomer={selectedCustomer}
        modalType={modalType}
        onEdit={handleEdit}
        onSuspend={handleSuspend}
        onChangeModalType={handleChangeModalType}
        getStatusBadge={getStatusBadge}
        getVerificationBadge={getVerificationBadge}
      />
    </div>
  );
};

export default CustomerManagement;