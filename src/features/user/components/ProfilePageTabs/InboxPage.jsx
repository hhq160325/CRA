import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../../shared/utils/axiosInstance';
import { INQUIRY_ENDPOINTS } from '../../../../config/api';
import { tokenUtils } from '../../../auth/utils';
import { getUserBySpecificId } from '../../api';
import Modal from '../../../../shared/components/Modal';

const formatDateTime = (iso) => new Date(iso).toLocaleString();

const InboxPage = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const currentUserId = tokenUtils.getUserId();

  // Fetch inquiries on component mount
  useEffect(() => {
    const fetchInquiries = async () => {
      if (!currentUserId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(INQUIRY_ENDPOINTS.GET_INQUIRY(currentUserId));

        // Get unique sender IDs
        const senderIds = [...new Set(response.data.map(inquiry => inquiry.senderId).filter(Boolean))];

        // Fetch sender information for all unique sender IDs
        const senderInfoPromises = senderIds.map(async (senderId) => {
          try {
            const userData = await getUserBySpecificId(senderId);
            return {
              id: senderId,
              name: userData.username || userData.fullname || 'Unknown User',
              email: userData.email || 'N/A'
            };
          } catch (error) {
            console.error(`Error fetching user ${senderId}:`, error);
            return {
              id: senderId,
              name: `User ${senderId}`,
              email: 'N/A'
            };
          }
        });

        const senderInfoArray = await Promise.all(senderInfoPromises);

        // Create a sender lookup map
        const senderMap = {};
        senderInfoArray.forEach(sender => {
          senderMap[sender.id] = sender;
        });

        // Transform API data to match inbox message structure
        const transformedMessages = response.data.map(inquiry => {
          const senderInfo = senderMap[inquiry.senderId] || {
            name: 'System',
            email: 'N/A'
          };

          return {
            id: inquiry.id,
            senderId: inquiry.senderId,
            sender: senderInfo.name,
            senderEmail: senderInfo.email,
            subject: inquiry.title || 'No Subject',
            body: inquiry.content || '',
            date: inquiry.createDate || new Date().toISOString(),
            read: inquiry.status === 'responded' || inquiry.status === 'closed',
            tag: inquiry.carId ? 'booking' : 'system',
            carName: inquiry.carName || null,
            carId: inquiry.carId || null,
            status: inquiry.status || 'pending',
            priority: inquiry.priority || 'medium',
            response: inquiry.response || null,
            responseDate: inquiry.responseDate || null,
            mediaUrls: inquiry.mediaUrls || []
          };
        });

        setMessages(transformedMessages);
      } catch (err) {
        console.error('Error fetching inquiries:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [currentUserId]);

  const filtered = useMemo(() => {
    let data = messages;
    if (tag !== 'all') data = data.filter(m => m.tag === tag);
    if (onlyUnread) data = data.filter(m => !m.read);
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(m =>
        m.sender.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q)
      );
    }
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [messages, tag, onlyUnread, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleRead = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !m.read } : m));
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);

  const requestDelete = (id) => {
    const msg = messages.find(m => m.id === id);
    setConfirmDeleteId(id);
    setConfirmTitle(msg ? `“${msg.subject}”` : 'this message');
  };

  const confirmDelete = () => {
    if (confirmDeleteId == null) return;
    setMessages(prev => prev.filter(m => m.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  const markAllAsRead = () => setMessages(prev => prev.map(m => ({ ...m, read: true })));

  const openResponseModal = (message) => {
    setSelectedMessage(message);
    setResponseText('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
    setResponseText('');
  };

  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) {
      return;
    }

    try {
      setSendingResponse(true);

      const formData = new FormData();
      formData.append('Title', `Re: ${selectedMessage.subject}`);
      formData.append('Content', responseText);
      formData.append('isOpen', 'false');
      formData.append('SenderId', currentUserId);
      formData.append('ReceiverId', selectedMessage.senderId);
      formData.append('ParentInquiryId', selectedMessage.id);

      await axiosInstance.post(
        INQUIRY_ENDPOINTS.ANSWER_INQUIRY,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessages(prev =>
        prev.map(msg =>
          msg.id === selectedMessage.id
            ? {
                ...msg,
                status: 'responded',
                response: responseText,
                responseDate: new Date().toISOString()
              }
            : msg
        )
      );

      closeModal();
      alert('Response sent successfully!');
    } catch (err) {
      console.error('Error sending response:', err);
      alert(err.response?.data?.message || 'Failed to send response. Please try again.');
    } finally {
      setSendingResponse(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
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

  const TagBadge = ({ name }) => {
    const color = name === 'booking' ? 'bg-green-100 text-green-700' : name === 'billing' ? 'bg-indigo-100 text-indigo-700' : name === 'promo' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700';
    return <span className={`text-xs px-2 py-0.5 rounded ${color}`}>{name}</span>;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading') || 'Loading messages...'}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-900 mb-2">{t('error') || 'Error'}</h3>
          <p className="text-red-700">{error}</p>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{t('inbox')}</h2>
        <button onClick={markAllAsRead} className="text-sm px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">{t('markAllAsRead')}</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input value={query} onChange={e=>{setQuery(e.target.value); setPage(1);}} placeholder={t('searchMessages')} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <select value={tag} onChange={e=>{setTag(e.target.value); setPage(1);}} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="all">{t('allTags')}</option>
            <option value="booking">{t('bookingTag')}</option>
            <option value="billing">{t('billingTag')}</option>
            <option value="promo">{t('promoTag')}</option>
            <option value="system">{t('systemTag')}</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={onlyUnread} onChange={e=>{setOnlyUnread(e.target.checked); setPage(1);}} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            {t('onlyUnread')}
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
        {current.length === 0 && (
          <div className="p-8 text-center text-gray-500">{t('noMessagesFound')}</div>
        )}
        {current.map(m => (
          <div key={m.id} className={`p-4 flex items-start justify-between ${m.read ? 'bg-white' : 'bg-blue-50/30'}`}>
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${m.read ? 'bg-gray-300' : 'bg-blue-500'}`}></span>
                <span className="font-medium text-gray-900 truncate">{m.subject}</span>
                <TagBadge name={m.tag} />
              </div>
              <div className="text-sm text-gray-600 mt-1 truncate">{m.body}</div>
              <div className="text-xs text-gray-400 mt-1">{m.sender} • {formatDateTime(m.date)}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={()=>toggleRead(m.id)} className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">{m.read ? t('markUnread') : t('markRead')}</button>
              <button onClick={()=>openResponseModal(m)} className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-600 hover:bg-blue-50">{t('response') || 'Response'}</button>
              <button onClick={()=>requestDelete(m.id)} className="px-2 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50">{t('delete')}</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">{t('page')} {page} {t('of')} {totalPages}</div>
        <div className="flex items-center gap-2">
          <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1, p-1))} className={`px-3 py-1 rounded border ${page===1 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{t('previous')}</button>
          <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages, p+1))} className={`px-3 py-1 rounded border ${page===totalPages ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{t('next')}</button>
        </div>
      </div>

      {/* Response Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{t('messageDetails') || 'Message Details'}</h2>
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
              {/* Message Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('messageInformation') || 'Message Information'}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">{t('from') || 'From'}</p>
                    <p className="font-medium text-gray-900">{selectedMessage.sender}</p>
                    <p className="text-xs text-gray-500">{selectedMessage.senderEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('date') || 'Date'}</p>
                    <p className="font-medium text-gray-900">{formatDateTime(selectedMessage.date)}</p>
                  </div>
                  {selectedMessage.carName && (
                    <>
                      <div>
                        <p className="text-gray-600">{t('car') || 'Car'}</p>
                        <p className="font-medium text-gray-900">{selectedMessage.carName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">{t('carId') || 'Car ID'}</p>
                        <p className="font-medium text-gray-900">{selectedMessage.carId}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Message Details */}
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{t('subject') || 'Subject'}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={getPriorityBadge(selectedMessage.priority)}>{selectedMessage.priority}</span>
                    <span className={getStatusBadge(selectedMessage.status)}>{selectedMessage.status}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 break-words">{selectedMessage.subject}</p>
                <div className="bg-white rounded p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{selectedMessage.body}</p>
                </div>
              </div>

              {/* Previous Response */}
              {selectedMessage.response && (
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{t('yourPreviousResponse') || 'Your Previous Response'}</h3>
                    <span className="text-xs text-gray-500">{formatDateTime(selectedMessage.responseDate)}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.response}</p>
                </div>
              )}

              {/* Response Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedMessage.response ? (t('updateResponse') || 'Update Response') : (t('yourResponse') || 'Your Response')}
                </label>
                <textarea
                  rows="6"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('writeResponsePlaceholder') || 'Write your response here...'}
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  disabled={sendingResponse}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('cancel') || 'Cancel'}
                </button>
                <button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim() || sendingResponse}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {sendingResponse ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('sending') || 'Sending...'}
                    </>
                  ) : (
                    selectedMessage.response ? (t('updateResponse') || 'Update Response') : (t('sendResponse') || 'Send Response')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InboxPage;


