import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { INQUIRY_ENDPOINTS } from '../../../config/api';
import { tokenUtils } from '../../auth/utils';
import { getAllUsers } from '../ownerApi';

const Inquiries = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user ID
  const currentUserId = tokenUtils.getUserId();

  // Fetch inquiries and user data on component mount
  useEffect(() => {
    const fetchInquiriesAndUsers = async () => {
      if (!currentUserId) {
        setError(t('inquiries.userNotLoggedIn'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch both inquiries and users in parallel
        const [inquiriesResponse, usersData] = await Promise.all([
          axiosInstance.get(INQUIRY_ENDPOINTS.GET_INQUIRY(currentUserId)),
          getAllUsers()
        ]);

        // Create a user lookup map for quick access
        const userMap = {};
        usersData.forEach(user => {
          userMap[user.id] = {
            name: user.username || user.fullName || t('inquiries.unknown'),
            email: user.email || t('inquiries.noData'),
            phone: user.phoneNumber || t('inquiries.noData')
          };
        });

        // Transform API data to match component structure
        const transformedData = inquiriesResponse.data.map(inquiry => {
          // Get sender info from user map
          const senderInfo = userMap[inquiry.senderId] || {
            name: t('inquiries.unknown'),
            email: t('inquiries.noData'),
            phone: t('inquiries.noData')
          };

          return {
            id: inquiry.id,
            inquiryId: `INQ${String(inquiry.id).padStart(3, '0')}`,
            senderId: inquiry.senderId,
            customer: senderInfo.name,
            customerEmail: senderInfo.email,
            customerPhone: senderInfo.phone,
            subject: inquiry.title,
            message: inquiry.content,
            carName: inquiry.carName || t('inquiries.noData'),
            carId: inquiry.carId || t('inquiries.noData'),
            date: new Date(inquiry.createDate).toLocaleString(t('locale'), {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: inquiry.status || 'pending',
            priority: inquiry.priority || 'medium',
            response: inquiry.response || null,
            responseDate: inquiry.responseDate ? new Date(inquiry.responseDate).toLocaleString() : null,
            mediaUrls: inquiry.mediaUrls || []
          };
        });

        setInquiries(transformedData);
      } catch (err) {
        console.error(t('inquiries.responseError'), err);
        setError(err.response?.data?.message || err.message || t('inquiries.cannotLoadInquiries'));
      } finally {
        setLoading(false);
      }
    };

    fetchInquiriesAndUsers();
  }, [currentUserId]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'responded':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'closed':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return t('inquiries.statusPending');
      case 'responded':
        return t('inquiries.statusResponded');
      case 'closed':
        return t('inquiries.statusClosed');
      default:
        return status;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return t('inquiries.priorityHigh');
      case 'medium':
        return t('inquiries.priorityMedium');
      case 'low':
        return t('inquiries.priorityLow');
      default:
        return priority;
    }
  };

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setResponseText(inquiry.response || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
    setResponseText('');
  };

  const handleSendResponse = async () => {
    if (!selectedInquiry || !responseText.trim()) {
      return;
    }

    console.log(t('inquiries.sendingResponse'));
    console.log(t('inquiries.selectedInquiry'), selectedInquiry);
    console.log(t('inquiries.responseContent'), responseText);
    console.log(t('inquiries.currentUserId'), currentUserId);

    try {
      setLoading(true);
      
      // Create FormData for the answer
      const formData = new FormData();
      formData.append('Title', selectedInquiry.subject);
      formData.append('Content', responseText);
      formData.append('isOpen', 'false');
      formData.append('SenderId', currentUserId);
      formData.append('ReceiverId', selectedInquiry.senderId);
      formData.append('ParentInquiryId', selectedInquiry.id);

      console.log(t('inquiries.formDataContent'));
      console.log(t('inquiries.title'), selectedInquiry.subject);
      console.log(t('inquiries.content'), responseText);
      console.log(t('inquiries.isOpen'), 'false');
      console.log(t('inquiries.senderId'), currentUserId);
      console.log(t('inquiries.receiverId'), selectedInquiry.senderId);
      console.log(t('inquiries.parentInquiryId'), selectedInquiry.id);
      console.log(t('inquiries.endpoint'), INQUIRY_ENDPOINTS.ANSWER_INQUIRY);

      const response = await axiosInstance.post(
        INQUIRY_ENDPOINTS.ANSWER_INQUIRY,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(t('inquiries.responseSuccess'), response.data);
      
      // Update the inquiry in the local state
      setInquiries(prevInquiries =>
        prevInquiries.map(inq =>
          inq.id === selectedInquiry.id
            ? {
                ...inq,
                status: 'responded',
                response: responseText,
                responseDate: new Date().toLocaleString()
              }
            : inq
        )
      );

      closeModal();
      
      // Show success message
      toast.success(t('inquiries.responseSuccessMessage'));
    } catch (err) {
      console.error(t('inquiries.responseError'), err);
      toast.error(err.response?.data?.message || t('inquiries.responseErrorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsClosed = (inquiryId) => {
    // Handle mark as closed logic
    console.log(t('inquiries.markClosedMessage'), inquiryId);
    // TODO: Implement actual API call to mark as closed
    toast.info(t('inquiries.markClosedFeature'));
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.inquiryId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalInquiries = inquiries.length;
  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const respondedCount = inquiries.filter(i => i.status === 'responded').length;
  const highPriorityCount = inquiries.filter(i => i.priority === 'high' && i.status === 'pending').length;

  // Loading state
  if (loading) {
    return (
      <div className="p-8 space-y-6 min-h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('inquiries.loadingInquiries')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-900 mb-2">{t('inquiries.errorLoadingInquiries')}</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('inquiries.tryAgain')}
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
            <h1 className="text-2xl font-bold text-gray-900">{t('inquiries.title')}</h1>
            <p className="text-gray-600">{t('inquiries.subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              {t('inquiries.exportReport')}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('inquiries.totalInquiries')}</p>
                <p className="text-2xl font-bold text-blue-600">{totalInquiries}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('inquiries.pending')}</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('inquiries.responded')}</p>
                <p className="text-2xl font-bold text-green-600">{respondedCount}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('inquiries.highPriority')}</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('inquiries.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('inquiries.allStatuses')}</option>
                <option value="pending">{t('inquiries.pending')}</option>
                <option value="responded">{t('inquiries.responded')}</option>
                <option value="closed">{t('inquiries.closed')}</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {t('inquiries.showingResults', { filtered: filteredInquiries.length, total: inquiries.length })}
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('inquiries.inquiryCode')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('inquiries.customer')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('inquiries.subject')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('inquiries.car')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('inquiries.date')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('inquiries.priority')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('inquiries.status')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('inquiries.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{inquiry.inquiryId}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{inquiry.customer}</div>
                      <div className="text-xs text-gray-500">{inquiry.customerEmail}</div>
                      <div className="text-xs text-gray-400">{inquiry.customerPhone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm max-w-xs truncate">{inquiry.subject}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{inquiry.message}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{inquiry.carName}</div>
                      <div className="text-xs text-gray-500">{inquiry.carId}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{inquiry.date.split(' ')[0]}</div>
                      <div className="text-xs text-gray-500">{inquiry.date.split(' ')[1]}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getPriorityBadge(inquiry.priority)}>
                        {getPriorityText(inquiry.priority)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(inquiry.status)}>
                        {getStatusText(inquiry.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(inquiry)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          {inquiry.status === 'pending' ? t('inquiries.respond') : t('inquiries.view')}
                        </button>
                        {inquiry.status === 'responded' && (
                          <button
                            onClick={() => handleMarkAsClosed(inquiry.id)}
                            className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                          >
                            {t('inquiries.close')}
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
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('inquiries.previous')}</button>
              <div className="flex space-x-1">
                <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
                <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
                <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
              </div>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('inquiries.next')}</button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for viewing/responding to inquiry */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{t('inquiries.inquiryDetails')} - {selectedInquiry.inquiryId}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('inquiries.customerInformation')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">{t('inquiries.name')}</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('inquiries.email')}</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('inquiries.phone')}</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('inquiries.date')}</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.date}</p>
                  </div>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{t('inquiries.subject')}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={getPriorityBadge(selectedInquiry.priority)}>{getPriorityText(selectedInquiry.priority)}</span>
                    <span className={getStatusBadge(selectedInquiry.status)}>{getStatusText(selectedInquiry.status)}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 break-words">{selectedInquiry.subject}</p>
                <div className="bg-white rounded p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{selectedInquiry.message}</p>
                </div>
                <div className="mt-3 text-sm text-gray-600 break-words">
                  <span className="font-medium">{t('inquiries.car')}:</span> {selectedInquiry.carName} ({selectedInquiry.carId})
                </div>
              </div>

              {/* Previous Response */}
              {selectedInquiry.response && (
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{t('inquiries.previousResponse')}</h3>
                    <span className="text-xs text-gray-500">{selectedInquiry.responseDate}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInquiry.response}</p>
                </div>
              )}

              {/* Response Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedInquiry.response ? t('inquiries.updateResponse') : t('inquiries.yourResponse')}
                </label>
                <textarea
                  rows="6"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('inquiries.responsePlaceholder')}
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('inquiries.cancel')}
                </button>
                <button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim() || loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('inquiries.sending')}
                    </>
                  ) : (
                    selectedInquiry.response ? t('inquiries.updateResponse') : t('inquiries.sendResponse')
                  )}
                </button>
                {selectedInquiry.status === 'responded' && (
                  <button
                    onClick={() => handleMarkAsClosed(selectedInquiry.id)}
                    disabled={loading}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('inquiries.markAsClosed')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inquiries;

