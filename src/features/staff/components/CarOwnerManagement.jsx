<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  updateCarOwnerStatus,
  setCarOwners,
  setLoading,
  setError,
  clearError,
} from '../staffSlice';
import { CarOwnerModal } from './modals/carOwnerModal';
import { fetchAllUsers } from '../api';
=======
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateCarOwnerStatus } from '../staffSlice';
import { CarOwnerModal } from './modals/carOwnerModal';
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328

const CarOwnerManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
<<<<<<< HEAD
  const carOwners = useSelector((state) => state.staff?.carOwners || []);
  const isLoading = useSelector(
    (state) => state.staff?.loading?.carOwners || false
  );
  const error = useSelector((state) => state.staff?.errors?.carOwners);
=======
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'suspend'
  const [isModalOpen, setIsModalOpen] = useState(false);

<<<<<<< HEAD
  useEffect(() => {
    const loadCarOwners = async () => {
      try {
        dispatch(setLoading({ section: 'carOwners', loading: true }));
        const users = await fetchAllUsers();
        // Car owners: IsCarOwner true or RoleId == 2 (Car Owner)
        const ownerRows = (users || [])
          .filter((u) => u.isCarOwner || u.roleId === 2)
          .map((u) => ({
            id: u.id,
            name: u.fullname || u.username,
            email: u.email,
            phone: u.phoneNumber || '',
            status: (u.status || 'active').toLowerCase(),
            registrationDate: '',
            carsListed: 0,
            totalEarnings: 0,
            verificationStatus:
              (u.status || '').toLowerCase() === 'active'
                ? 'verified'
                : 'pending',
            lastActive: '',
          }));
        dispatch(setCarOwners(ownerRows));
        dispatch(clearError('carOwners'));
      } catch (e) {
        dispatch(
          setError({
            section: 'carOwners',
            error: e?.message || 'Failed to load car owners',
          })
        );
      } finally {
        dispatch(setLoading({ section: 'carOwners', loading: false }));
      }
    };

    loadCarOwners();
  }, [dispatch]);
=======
  // Mock data for car owners
  const carOwners = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      registrationDate: '2024-01-15',
      carsListed: 3,
      totalEarnings: 12450,
      verificationStatus: 'verified',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 234-5678',
      status: 'pending',
      registrationDate: '2024-02-20',
      carsListed: 1,
      totalEarnings: 0,
      verificationStatus: 'pending',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.w@email.com',
      phone: '+1 (555) 345-6789',
      status: 'suspended',
      registrationDate: '2023-12-10',
      carsListed: 2,
      totalEarnings: 8750,
      verificationStatus: 'verified',
      lastActive: '1 week ago'
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1 (555) 456-7890',
      status: 'active',
      registrationDate: '2024-03-05',
      carsListed: 5,
      totalEarnings: 23100,
      verificationStatus: 'verified',
      lastActive: '30 minutes ago'
    }
  ];
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328

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

  const handleStatusChange = (ownerId, newStatus) => {
    dispatch(updateCarOwnerStatus({ id: ownerId, status: newStatus }));
  };

  // Modal Func S

  const openModal = (owner, type) => {
    setSelectedOwner(owner);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOwner(null);
    setModalType(null);
  };

  const handleSuspend = () => {
    if (selectedOwner) {
      handleStatusChange(selectedOwner.id, 'suspended');
      closeModal();
    }
  };

  const handleEdit = (formData) => {
    // Handle edit logic here
    console.log('Editing owner:', selectedOwner.id, formData);
    closeModal();
  };

  const handleChangeModalType = (type) => {
    setModalType(type);
  };

   // Modal Func E

  const filteredOwners = carOwners.filter(owner => {
    const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || owner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6 space-y-reverse-0 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-gray-900">
            {t('carOwnerManagement')}
          </h1>
          <p className="text-gray-600">{t('viewAndManageCarOwners')}</p>
          {isLoading && (
            <p className="text-xs text-gray-400 mt-1">{t('loading')}...</p>
          )}
          {error && (
            <p className="text-xs text-red-500 mt-1">
              {t('error')}: {error}
            </p>
          )}
=======
          <h1 className="text-2xl font-bold text-gray-900">{t('carOwnerManagement')}</h1>
          <p className="text-gray-600">{t('viewAndManageCarOwners')}</p>
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {t('exportData')}
        </button>
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
                placeholder={t('searchCarOwners')}
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
            {t('showing')} {filteredOwners.length} {t('of')} {carOwners.length} {t('carOwners')}
          </div>
        </div>
      </div>

      {/* Car Owners Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('carOwner')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('status')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('verification')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('carsListed')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('totalEarnings')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('lastActive')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOwners.map((owner) => (
                <tr key={owner.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{owner.name}</div>
                      <div className="text-sm text-gray-500">{owner.email}</div>
                      <div className="text-xs text-gray-400">{owner.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(owner.status)}>
                      {owner.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getVerificationBadge(owner.verificationStatus)}>
                      {owner.verificationStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{owner.carsListed}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">${(owner.totalEarnings || 0).toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{owner.lastActive}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(owner, 'view')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {t('view')}
                      </button>
                      <button
                        onClick={() => openModal(owner, 'edit')}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        {t('edit')}
                      </button>
                      {owner.status === 'active' ? (
                        <button
                          onClick={() => openModal(owner, 'suspend')}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          {t('suspend')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(owner.id, 'active')}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          {t('activate')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('previous')}</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
            </div>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('next')}</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CarOwnerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedOwner={selectedOwner}
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

export default CarOwnerManagement;