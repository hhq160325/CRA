import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DropdownTemplate from '../../../../../shared/components/DropdownTemplate';
import Pagination from '../../../../../shared/components/Pagination';
import { tokenUtils } from '../../../../auth/utils';
import { getAllParkLots } from '../../../api/ownerApi';
import { ParkLotDetailsModal } from '../../modal';

const ParkLotManagement = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedParkLot, setSelectedParkLot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parkLots, setParkLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch park lots from API
  useEffect(() => {
    const fetchParkLots = async () => {
      try {
        setLoading(true);

        // Get current user ID from JWT token
        const currentManagerId = tokenUtils.getUserId();

        if (!currentManagerId) {
          setError(t('parkLotManagement.cannotIdentifyUser') || 'Cannot identify current user');
          setLoading(false);
          return;
        }

        // Fetch all park lots
        const allParkLots = await getAllParkLots();

        // Filter park lots by current manager ID
        const userParkLots = allParkLots.filter(parkLot => 
          parkLot.managerId === currentManagerId
        );

        setParkLots(userParkLots);
        setError(null);
      } catch (err) {
        console.error('Error fetching park lots:', err);
        setError(t('parkLotManagement.errorLoadingParkLots') || 'Error loading park lots');
      } finally {
        setLoading(false);
      }
    };

    fetchParkLots();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case 'active':
        return { className: `${baseClasses} bg-green-100 text-green-800`, label: t('parkLotManagement.active') || 'Active' };
      case 'inactive':
        return { className: `${baseClasses} bg-red-100 text-red-800`, label: t('parkLotManagement.inactive') || 'Inactive' };
      case 'maintenance':
        return { className: `${baseClasses} bg-yellow-100 text-yellow-800`, label: t('parkLotManagement.maintenance') || 'Maintenance' };
      default:
        return { className: `${baseClasses} bg-gray-100 text-gray-800`, label: t('parkLotManagement.unknown') || 'Unknown' };
    }
  };

  const openModal = (parkLot) => {
    setSelectedParkLot(parkLot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParkLot(null);
  };

  const filteredParkLots = useMemo(() => {
    return parkLots.filter(parkLot => {
      const matchesSearch = !searchTerm || 
        parkLot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parkLot.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parkLot.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        parkLot.status.toLowerCase() === statusFilter.toLowerCase();
      
      const matchesCity = cityFilter === 'all' || 
        parkLot.city.toLowerCase().includes(cityFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesCity;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [parkLots, searchTerm, statusFilter, cityFilter]);

  // Get unique cities and statuses for filter dropdowns
  const uniqueCities = [...new Set(parkLots.map(parkLot => parkLot.city))].sort();
  const uniqueStatuses = [...new Set(parkLots.map(parkLot => parkLot.status))].sort();

  // Prepare dropdown options
  const cityOptions = [
    { id: 'all', value: 'all', label: t('parkLotManagement.allCities') || 'All Cities' },
    ...uniqueCities.map(city => ({ id: city, value: city, label: city }))
  ];

  const statusOptions = [
    { id: 'all', value: 'all', label: t('parkLotManagement.allStatuses') || 'All Statuses' },
    ...uniqueStatuses.map(status => {
      const badge = getStatusBadge(status);
      return {
        id: status,
        value: status,
        label: badge.label
      };
    })
  ];

  // Pagination calculations
  const totalPages = Math.ceil(filteredParkLots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedParkLots = filteredParkLots.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, cityFilter]);



  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-full">
        <div className="text-gray-500">{t('parkLotManagement.loadingParkLots') || 'Loading park lots...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('parkLotManagement.title') || 'Park Lot Management'}</h1>
            <p className="text-gray-600">{t('parkLotManagement.subtitle') || 'Manage your park lots and monitor their status'}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('parkLotManagement.searchPlaceholder') || 'Search park lots...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>

              <div className="w-full sm:w-48">
                <DropdownTemplate
                  value={cityFilter}
                  onChange={(option) => setCityFilter(option.value)}
                  options={cityOptions}
                  placeholder={t('parkLotManagement.allCities') || 'All Cities'}
                  searchable={true}
                  searchPlaceholder={(t('parkLotManagement.allCities') || 'All Cities') + '...'}
                />
              </div>

              <div className="w-full sm:w-48">
                <DropdownTemplate
                  value={statusFilter}
                  onChange={(option) => setStatusFilter(option.value)}
                  options={statusOptions}
                  placeholder={t('parkLotManagement.allStatuses') || 'All Statuses'}
                  searchable={false}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 whitespace-nowrap">
              {t('parkLotManagement.showingResults', { filtered: filteredParkLots.length, total: parkLots.length }) || 
               `Showing ${filteredParkLots.length} of ${parkLots.length} park lots`}
            </div>
          </div>
        </div>

        {/* Park Lot Management Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('parkLotManagement.parkLotInfo') || 'Park Lot Info'}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('parkLotManagement.location') || 'Location'}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('parkLotManagement.capacity') || 'Capacity'}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('parkLotManagement.contact') || 'Contact'}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('parkLotManagement.status') || 'Status'}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('parkLotManagement.actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedParkLots.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      {t('parkLotManagement.noParkLotsFound') || 'No park lots found'}
                    </td>
                  </tr>
                ) : (
                  paginatedParkLots.map((parkLot) => {
                    return (
                      <tr key={parkLot.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900 text-sm">{parkLot.name}</div>
                          <div className="text-xs text-gray-500">{parkLot.notes || 'No notes'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{parkLot.address}</div>
                          <div className="text-xs text-gray-500">{parkLot.city}</div>
                          {parkLot.latitude && parkLot.longtitude && (
                            <div className="text-xs text-gray-400">
                              {parkLot.latitude.toFixed(6)}, {parkLot.longtitude.toFixed(6)}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{parkLot.capacity}</div>
                          <div className="text-xs text-gray-500">{t('parkLotManagement.spaces') || 'spaces'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{parkLot.contactNum}</div>
                        </td>
                        <td className="py-4 px-6">
                          {(() => {
                            const badge = getStatusBadge(parkLot.status);
                            return <span className={badge.className}>{badge.label}</span>;
                          })()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openModal(parkLot)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              {t('parkLotManagement.viewDetails') || 'View Details'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredParkLots.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Park Lot Details Modal */}
      {selectedParkLot && (
        <ParkLotDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedParkLot={selectedParkLot}
        />
      )}
    </>
  );
};

export default ParkLotManagement;