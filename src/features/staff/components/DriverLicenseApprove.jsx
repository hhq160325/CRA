import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setLoading, setError } from '../staffSlice';
import axios from 'axios';
import { USER_ENDPOINTS, USER_API_CONFIG } from '../../../config/api';

const DriverLicenseApprove = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.staff.loading.driverLicenses);
  const [driverLicenses, setDriverLicenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch all driver licenses on component mount
  useEffect(() => {
    const fetchDriverLicenses = async () => {
      dispatch(setLoading({ section: 'driverLicenses', loading: true }));
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(USER_ENDPOINTS.GET_ALL_DRIVER_LICENSE, {
          headers: {
            ...USER_API_CONFIG.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", response.data);
        
        // Handle response structure with view and urls
        const viewData = response.data?.view || [];
        const urlsData = response.data?.urls || [];
        
        // console.log("View data:", viewData);
        // console.log("URLs data:", urlsData);
        
        // Transform API data to match component structure
        const licensesArray = Array.isArray(viewData) ? viewData : [];
        const transformedData = licensesArray.map((license, index) => {
          // Wrap it in an array for consistency
          const urlString = urlsData[index];
          const imageUrls = urlString ? [urlString] : [];
          
          console.log(`License ${index} - userId: ${license.userId}, URL: ${urlString}`);
          
          return {
            id: license.userId || index + 1,
            userId: license.userId,
            customerName: `User ${license.userId}`, // TODO: Fetch actual user name
            submittedDate: license.createDate ? new Date(license.createDate).toLocaleString() : 'N/A',
            status: license.status || 'pending',
            urls: imageUrls, // Array with single URL string
            url: imageUrls[0] || null, // Primary image URL
            // createdDate: license.createDate,
          };
        });

        console.log('DriverLicenseApprove - Transformed licenses:', transformedData);
        setDriverLicenses(transformedData);
      } catch (error) {
        dispatch(setError({ section: 'driverLicenses', error: error.message }));
        setDriverLicenses([]);
        console.error('Failed to fetch driver licenses:', error);
      } finally {
        dispatch(setLoading({ section: 'driverLicenses', loading: false }));
      }
    };

    fetchDriverLicenses();
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return t('approved');
      case 'pending':
        return t('pending');
      case 'rejected':
        return t('rejected');
      default:
        return status;
    }
  };

  const openModal = (license) => {
    setSelectedLicense(license);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLicense(null);
  };

  const handleApprove = async (licenseId) => {
    try {
      // TODO: Implement API call to approve license when endpoint is available
      // const token = localStorage.getItem('token');
      // await axios.patch(APPROVE_ENDPOINT, { userId: licenseId, status: 'approved' }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      console.log('Approving license:', licenseId);
      
      // Update local state optimistically
      setDriverLicenses(prev => 
        prev.map(license => 
          license.id === licenseId 
            ? { ...license, status: 'approved' }
            : license
        )
      );
      
      closeModal();
    } catch (error) {
      console.error('Failed to approve license:', error);
    }
  };

  const handleReject = async (licenseId, reason) => {
    try {
      // TODO: Implement API call to reject license when endpoint is available
      // const token = localStorage.getItem('token');
      // await axios.patch(REJECT_ENDPOINT, { userId: licenseId, status: 'rejected', reason }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      console.log('Rejecting license:', licenseId, 'Reason:', reason);
      
      // Update local state optimistically
      setDriverLicenses(prev => 
        prev.map(license => 
          license.id === licenseId 
            ? { ...license, status: 'rejected' }
            : license
        )
      );
      
      closeModal();
    } catch (error) {
      console.error('Failed to reject license:', error);
    }
  };

  const filteredLicenses = (driverLicenses || []).filter(license => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (license.customerName || '').toLowerCase().includes(searchLower) ||
      (license.licenseNumber || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredLicenses.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('driverLicenseApprove')}</h1>
          <p className="text-gray-600">{t('reviewAndApproveDriverLicenses')}</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            {t('exportReport')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('searchLicenses')}
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
              <option value="pending">{t('pending')}</option>
              <option value="approved">{t('approved')}</option>
              <option value="rejected">{t('rejected')}</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {t('showing')} {filteredLicenses.length} {t('of')} {driverLicenses.length} {t('licenses')}
          </div>
        </div>
      </div>

      {/* View License Modal */}
      {isModalOpen && selectedLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('driverLicenseDetails')}</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* License Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('customer')}</label>
                  <p className="mt-1 text-gray-900">{selectedLicense.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('licenseNumber')}</label>
                  <p className="mt-1 text-gray-900">{selectedLicense.licenseNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('submittedDate')}</label>
                  <p className="mt-1 text-gray-900">{selectedLicense.submittedDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('status')}</label>
                  <div className="mt-1">
                    <span className={getStatusBadge(selectedLicense.status)}>
                      {getStatusText(selectedLicense.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* License Images */}
              {selectedLicense.urls && selectedLicense.urls.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {t('licenseImages')} ({selectedLicense.urls.length})
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedLicense.urls.map((imageUrl, index) => (
                      <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Driver License ${index + 1}`}
                          className="w-full h-auto"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600">
                          {t('image')} {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedLicense.status === 'pending' && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={() => handleReject(selectedLicense.id, 'Rejected by staff')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('reject')}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedLicense.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t('approve')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Driver Licenses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLicenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">{t('noLicensesFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('customer')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('licenseImage')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('submittedDate')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('status')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((license) => (
                  <tr key={license.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{license.customerName}</div>
                      <div className="text-xs text-gray-500">{license.licenseNumber}</div>
                    </td>
                    <td className="py-4 px-6">
                      {license.url ? (
                        <div className="flex items-center space-x-2">
                          <img
                            src={license.url}
                            alt="License thumbnail"
                            className="w-20 h-14 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openModal(license)}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="56"%3E%3Crect fill="%23f3f4f6" width="80" height="56"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="10" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          {license.urls && license.urls.length > 1 && (
                            <span className="text-xs text-gray-500">+{license.urls.length - 1}</span>
                          )}
                        </div>
                      ) : (
                        <div className="w-20 h-14 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{license.submittedDate}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(license.status)}>
                        {getStatusText(license.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(license)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          {t('view')}
                        </button>
                        {license.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(license.id)}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              {t('approve')}
                            </button>
                            <button
                              onClick={() => handleReject(license.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              {t('reject')}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredLicenses.length > 0 && totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('previous')}
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('next')}
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  {t('showing')} <span className="font-medium">{startIndex + 1}</span> {t('to')}{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredLicenses.length)}</span> {t('of')}{' '}
                  <span className="font-medium">{filteredLicenses.length}</span> {t('licenses')}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">{t('previous')}</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">{t('next')}</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverLicenseApprove;
