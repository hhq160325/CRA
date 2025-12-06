import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getAllRegDocs, approveRegDoc } from '../api/carRegDocsApi';

const RegDocsApproved = () => {
  const { t } = useTranslation();
  const [regDocs, setRegDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [approving, setApproving] = useState(false);
  const [confirmDoc, setConfirmDoc] = useState(null);

  useEffect(() => {
    fetchRegDocs();
  }, []);

  const fetchRegDocs = async () => {
    try {
      setLoading(true);
      const data = await getAllRegDocs();
      setRegDocs(data.view || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch registration documents');
      console.error('Error fetching registration documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
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

  const handleViewDetails = (doc) => {
    setSelectedDoc(doc);
  };

  const closeModal = () => {
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
      
      toast.success('Registration document approved successfully!');
    } catch (err) {
      console.error('Error approving document:', err);
      toast.error(err.response?.data?.message || 'Failed to approve registration document. Please try again.');
    } finally {
      setApproving(false);
      setConfirmDoc(null);
    }
  };

  const handleCancelApprove = () => {
    setConfirmDoc(null);
  };

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
          <p className="text-lg font-medium">Error loading documents</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchRegDocs}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Car Registration Documents
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            {regDocs.length} {regDocs.length === 1 ? 'Document' : 'Documents'}
          </span>
        </div>

        {regDocs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-sm">No registration documents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regDocs.map((doc, index) => (
                  <tr key={`${doc.carId}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doc.carId?.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.userId?.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(doc.status)}>
                        {doc.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(doc.createDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDetails(doc)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                        {doc.status?.toLowerCase() === 'pending' && (
                          <button
                            onClick={() => handleApproveClick(doc)}
                            disabled={approving}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs font-medium"
                          >
                            {approving ? 'Approving...' : 'Approve'}
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
      </div>

      {/* Modal for viewing document details */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Registration Document Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Car ID</p>
                  <p className="mt-1 text-sm text-gray-900 break-all">{selectedDoc.carId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="mt-1 text-sm text-gray-900 break-all">{selectedDoc.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">
                    <span className={getStatusBadge(selectedDoc.status)}>
                      {selectedDoc.status || 'Unknown'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted Date</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDoc.createDate)}</p>
                </div>
              </div>

              {selectedDoc.urls && selectedDoc.urls.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-500 mb-3">Document Images</p>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedDoc.urls.map((url, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Document ${idx + 1}`}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!selectedDoc.urls || selectedDoc.urls.length === 0) && (
                <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">No document images available</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              {selectedDoc?.status?.toLowerCase() === 'pending' && (
                <button
                  onClick={() => handleApproveClick(selectedDoc)}
                  disabled={approving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {approving ? 'Approving...' : 'Approve Document'}
                </button>
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
              Approve Registration Document
            </h3>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to approve this registration document?
            </p>

            <div className="bg-gray-50 rounded-lg p-3 mb-6 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Car ID:</span>
                <span className="text-gray-900 font-medium">{confirmDoc.carId?.substring(0, 12)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">User ID:</span>
                <span className="text-gray-900 font-medium">{confirmDoc.userId?.substring(0, 12)}...</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelApprove}
                disabled={approving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={approving}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {approving ? 'Approving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegDocsApproved;
