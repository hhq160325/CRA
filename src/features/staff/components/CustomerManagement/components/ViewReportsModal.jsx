import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getUserReports } from '../services/userReportViewService';

const ViewReportsModal = ({ isOpen, onClose, customer }) => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (isOpen && customer?.id) {
      fetchUserReports();
    }
  }, [isOpen, customer?.id]);

  const fetchUserReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const reportsData = await getUserReports(customer.id);
      setReports(reportsData || []);
    } catch (err) {
      console.error('Error fetching user reports:', err);
      
      // Handle 404 error specifically (no reports found)
      if (err.response && err.response.status === 404) {
        setReports([]); // Set empty array for no reports
        setError(null); // Don't show error for no reports case
      } else {
        const errorMessage = err.message || t('failedToLoadReports') || 'Failed to load reports';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReports([]);
    setError(null);
    setSelectedReport(null);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'active':
        return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
      case 'resolved':
        return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800';
      case 'pending':
        return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
      default:
        return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('userReports') || 'User Reports'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {customer && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                {t('customerInformation') || 'Customer Information'}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{t('name') || 'Name'}: </span>
                  <span className="font-medium text-gray-900">{customer.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t('email') || 'Email'}: </span>
                  <span className="font-medium text-gray-900">{customer.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t('behaviourScore') || 'Behaviour Score'}: </span>
                  <span className="font-medium text-gray-900">{customer.behaviourScore}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t('status') || 'Status'}: </span>
                  <span className="font-medium text-gray-900">{customer.status}</span>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">{t('loadingReports') || 'Loading reports...'}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('noReportsFound') || 'No reports found'}
              </h3>
              <p className="text-gray-600">
                {t('thisUserHasNoReports') || 'This user has no reports filed against them.'}
              </p>
            </div>
          )}

          {!loading && !error && reports.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 mb-4">
                {t('reportHistory') || 'Report History'} ({reports.length})
              </h4>
              
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-medium text-gray-900">{report.title}</h5>
                        <span className={getStatusBadge(report.status)}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {t('reportNo') || 'Report No'}: {report.reportNo}
                        </span>
                        <span>
                          {t('created') || 'Created'}: {formatDate(report.createDate)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-4"
                    >
                      {selectedReport?.id === report.id ? (t('hideDetails') || 'Hide Details') : (t('viewDetails') || 'View Details')}
                    </button>
                  </div>

                  {selectedReport?.id === report.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">{t('reporterId') || 'Reporter ID'}: </span>
                          <span className="font-medium text-gray-900">{report.reporterId}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{t('reportedUserId') || 'Reported User ID'}: </span>
                          <span className="font-medium text-gray-900">{report.reportedUserId}</span>
                        </div>
                      </div>
                      
                      {report.urls && report.urls.length > 0 && (
                        <div>
                          <h6 className="font-medium text-gray-900 mb-2">
                            {t('attachments') || 'Attachments'} ({report.urls.length})
                          </h6>
                          <div className="grid grid-cols-2 gap-2">
                            {report.urls.map((url, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={url}
                                  alt={`Report attachment ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80"
                                  onClick={() => window.open(url, '_blank')}
                                />
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                  {t('clickToView') || 'Click to view'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {t('close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReportsModal;