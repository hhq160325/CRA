import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCarOwnerStatus } from '../staffSlice';

const CarOwnerManagement = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'suspend'
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <h1 className="text-2xl font-bold text-gray-900">Car Owner Management</h1>
          <p className="text-gray-600">View and manage car owner accounts</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Data
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
                placeholder="Search car owners..."
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
            Showing {filteredOwners.length} of {carOwners.length} car owners
          </div>
        </div>
      </div>

      {/* Car Owners Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Car Owner</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Verification</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Cars Listed</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Total Earnings</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Last Active</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
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
                  <td className="py-4 px-6 text-gray-600 text-sm">${owner.totalEarnings.toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{owner.lastActive}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(owner, 'view')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => openModal(owner, 'edit')}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      {owner.status === 'active' ? (
                        <button
                          onClick={() => openModal(owner, 'suspend')}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(owner.id, 'active')}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Activate
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

      {/* Modal */}
      {isModalOpen && selectedOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 [--tw-space-y-reverse:false!important]">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'view' && 'Car Owner Details'}
                {modalType === 'edit' && 'Edit Car Owner'}
                {modalType === 'suspend' && 'Suspend Car Owner'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            {modalType === 'view' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{selectedOwner.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedOwner.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedOwner.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={getStatusBadge(selectedOwner.status)}>
                      {selectedOwner.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                    <p className="text-gray-900">{selectedOwner.registrationDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                    <span className={getVerificationBadge(selectedOwner.verificationStatus)}>
                      {selectedOwner.verificationStatus}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cars Listed</label>
                    <p className="text-gray-900">{selectedOwner.carsListed}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Earnings</label>
                    <p className="text-gray-900">${selectedOwner.totalEarnings.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Active</label>
                    <p className="text-gray-900">{selectedOwner.lastActive}</p>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'edit' && (
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
                        defaultValue={selectedOwner.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={selectedOwner.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={selectedOwner.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        defaultValue={selectedOwner.status}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
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
            )}

            {modalType === 'suspend' && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Suspend Car Owner Account
                      </h3>
                      <p className="mt-2 text-sm text-red-700">
                        Are you sure you want to suspend <strong>{selectedOwner.name}</strong>'s account? 
                        This will prevent them from accessing their account and listing new cars.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Account Details:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Email:</span> {selectedOwner.email}</p>
                    <p><span className="font-medium">Cars Listed:</span> {selectedOwner.carsListed}</p>
                    <p><span className="font-medium">Total Earnings:</span> ${selectedOwner.totalEarnings.toLocaleString()}</p>
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
            )}

            {/* View Mode Action Buttons */}
            {modalType === 'view' && (
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setModalType('edit')}
                  className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                {selectedOwner.status === 'active' && (
                  <button
                    onClick={() => setModalType('suspend')}
                    className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Suspend
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarOwnerManagement;