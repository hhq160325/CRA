import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getAllRegDocs, getAllUsers, getAllCars, approveRegDoc } from '../../../api/carRegDocsApi';
import Pagination from '../../../../../shared/components/Pagination';
import { filterRegDocs, getStatusBadgeClasses } from '../../../staff-util/staffFilter';

const RegDocsApproved = () => {
  const { t } = useTranslation();
  const [regDocs, setRegDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [confirmDoc, setConfirmDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchRegDocs();
  }, []);

  const fetchRegDocs = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [regDocsData, usersData, carsData] = await Promise.all([
        getAllRegDocs(),
        getAllUsers(),
        getAllCars()
      ]);
      
      // Handle response structure with view and urls
      const viewData = regDocsData?.view || [];
      const urlsData = regDocsData?.urls || [];
      
      // Create lookup maps for users and cars
      const usersMap = new Map();
      const carsMap = new Map();
      
      // Populate users map (id -> user object)
      if (Array.isArray(usersData)) {
        usersData.forEach(user => {
          if (user.id) {
            usersMap.set(user.id, user);
          }
        });
      }
      
      // Populate cars map (id -> car object)
      if (Array.isArray(carsData)) {
        carsData.forEach(car => {
          if (car.id) {
            carsMap.set(car.id, car);
          }
        });
      }
      
      // Transform API data to match component structure
      const docsArray = Array.isArray(viewData) ? viewData : [];
      const transformedData = docsArray.map((doc, index) => {
        // Wrap URL string in an array for consistency
        const urlString = urlsData[index];
        const imageUrls = urlString ? [urlString] : [];
        
        // Get user and car details
        const user = usersMap.get(doc.userId);
        const car = carsMap.get(doc.carId);
        
        return {
          ...doc,
          urls: imageUrls, // Array with single URL string
          url: imageUrls[0] || null, // Primary image URL
          userFullName: user?.fullName || user?.fullname || 'N/A',
          carModel: car?.model || 'N/A',
          carManufacturer: car?.manufacturer || 'N/A',
        };
      });
      // console.log("transformedData",transformedData);
      setRegDocs(transformedData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch registration documents');
      console.error('Error fetching registration documents:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openModal = (doc) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoc(null);
  };

  const handleApproveClick = (doc) => {
    setConfirmDoc(doc);
  };

  const handleConfirmApprove = async () => {
    if (!confirmDoc) return;

    try {
      setApproving(true);
      const approvalData = {
        userId: confirmDoc.userId,
        carId: confirmDoc.carId,
        email: confirmDoc.email || 'string',
        licensePlate: confirmDoc.licensePlate || 'string'
      };

      await approveRegDoc(approvalData);
      
      // Refresh the list after approval
      await fetchRegDocs();
      
      // Close modal if it's open
      if (selectedDoc?.carId === confirmDoc.carId) {
        setSelectedDoc(null);
      }
      
      toast.success(t('registrationDocumentApprovedSuccessfully'));
    } catch (err) {
      console.error('Error approving document:', err);
      toast.error(err.response?.data?.message || t('failedToApproveRegistrationDocument'));
    } finally {
      setApproving(false);
      setConfirmDoc(null);
    }
  };

  const handleCancelApprove = () => {
    setConfirmDoc(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter documents using utility function
  const filteredDocs = filterRegDocs(regDocs, {
    searchTerm,
    status: statusFilter
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredDocs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="text-center text-red-600 py-8">
          <p className="text-lg font-medium">{t('errorLoadingDocuments')}</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchRegDocs}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('carRegistrationDocuments')}</h1>
            <p className="text-gray-600">{t('reviewAndApproveCarRegistrationDocuments')}</p>
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
                  placeholder={t('searchDocuments')}
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
              {t('showing')} {filteredDocs.length} {t('of')} {regDocs.length} {t('documents')}
            </div>
          </div>
        </div>

        {/* Registration Documents Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">{t('errorLoadingDocuments')}</p>
              <p className="text-sm mt-2">{error}</p>
              <button
                onClick={fetchRegDocs}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('retry')}
              </button>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">{t('noDocumentsFound')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('userFullName')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('carInfo')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('documentImage')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('submittedDate')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('status')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((doc, index) => (
                    <tr key={`${doc.carId}-${index}`} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{doc.userFullName}</div>
                        <div className="text-xs text-gray-500">{doc.userId?.substring(0, 8)}...</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{doc.carManufacturer} {doc.carModel}</div>
                        <div className="text-xs text-gray-500">{doc.carId?.substring(0, 8)}...</div>
                      </td>
                      <td className="py-4 px-6">
                        {doc.url ? (
                          <div className="flex items-center space-x-2">
                            <img
                              src={doc.url}
                              alt="Document thumbnail"
                              className="w-20 h-14 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openModal(doc)}
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="56"%3E%3Crect fill="%23f3f4f6" width="80" height="56"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="10" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            {doc.urls && doc.urls.length > 1 && (
                              <span className="text-xs text-gray-500">+{doc.urls.length - 1}</span>
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
                        <div className="text-sm text-gray-600">{formatDate(doc.createDate)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={getStatusBadgeClasses(doc.status)}>
                          {doc.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal(doc)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            {t('view')}
                          </button>
                          {doc.status?.toLowerCase() === 'pending' && (
                            <button
                              onClick={() => handleApproveClick(doc)}
                              disabled={approving}
                              className="text-green-600 hover:text-green-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              {t('approve')}
                            </button>
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
          {!loading && filteredDocs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredDocs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* View Document Modal */}
      {isModalOpen && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('registrationDocumentDetails')}</h2>
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
              {/* Document Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('userFullName')}</label>
                  <p className="mt-1 text-gray-900">{selectedDoc.userFullName}</p>
                  <p className="mt-1 text-xs text-gray-500 break-all">{selectedDoc.userId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('carInfo')}</label>
                  <p className="mt-1 text-gray-900">{selectedDoc.carManufacturer} {selectedDoc.carModel}</p>
                  <p className="mt-1 text-xs text-gray-500 break-all">{selectedDoc.carId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('submittedDate')}</label>
                  <p className="mt-1 text-gray-900">{formatDate(selectedDoc.createDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('status')}</label>
                  <div className="mt-1">
                    <span className={getStatusBadgeClasses(selectedDoc.status)}>
                      {selectedDoc.status || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">{t('actions')}</label>
                  <div className="flex items-center space-x-2">
                    {selectedDoc.status?.toLowerCase() === 'pending' ? (
                      <button
                        onClick={() => handleApproveClick(selectedDoc)}
                        disabled={approving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {approving ? t('approving') : t('approve')}
                      </button>
                    ) : selectedDoc.status?.toLowerCase() === 'approved' ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-green-100 text-green-800 rounded-lg cursor-not-allowed text-sm font-medium"
                      >
                        ✓ {t('approved')}
                      </button>
                    ) : selectedDoc.status?.toLowerCase() === 'rejected' ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-lg cursor-not-allowed text-sm font-medium"
                      >
                        ✗ {t('rejected')}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Document Images */}
              {selectedDoc.urls && selectedDoc.urls.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {t('documentImages')} ({selectedDoc.urls.length})
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {selectedDoc.urls.map((imageUrl, index) => (
                      <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Registration Document ${index + 1}`}
                          className="w-full h-auto"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!selectedDoc.urls || selectedDoc.urls.length === 0) && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">{t('noDocumentImagesAvailable')}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedDoc.status?.toLowerCase() === 'pending' && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={() => handleApproveClick(selectedDoc)}
                    disabled={approving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {approving ? t('approving') : t('approve')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {t('approveRegistrationDocument')}
            </h3>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              {t('areYouSureApprove')}
            </p>

            <div className="bg-gray-50 rounded-lg p-3 mb-6 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">{t('user')}:</span>
                <span className="text-gray-900 font-medium">{confirmDoc.userFullName}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">{t('car')}:</span>
                <span className="text-gray-900 font-medium">{confirmDoc.carManufacturer} {confirmDoc.carModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('carId')}:</span>
                <span className="text-gray-900 font-medium">{confirmDoc.carId?.substring(0, 12)}...</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelApprove}
                disabled={approving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={approving}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {approving ? t('approving') : t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegDocsApproved;
