import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../../shared/utils/axiosInstance';
import { NOTIFICATION_ENDPOINTS } from '../../../../config/api';
import { tokenUtils } from '../../../auth/utils';
import DropdownTemplate from '../../../../shared/components/DropdownTemplate';

const formatDateTime = (iso) => new Date(iso).toLocaleString();

const Notification = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [page, setPage] = useState(1);
  const [tag, setTag] = useState('all');
  const pageSize = 5;

  const currentUserId = tokenUtils.getUserId();

  // Tag options for dropdown
  const tagOptions = [
    { id: 'all', value: 'all', label: t('allTags') || 'All Tags' },
    { id: 'booking', value: 'booking', label: t('bookingTag') || 'Booking' },
    { id: 'billing', value: 'billing', label: t('billingTag') || 'Billing' },
    { id: 'system', value: 'system', label: t('systemTag') || 'System' }
  ];

  // Helper function to determine notification tag based on content
  const getNotificationTag = (content) => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('payment') || lowerContent.includes('paid')) return 'billing';
    if (lowerContent.includes('booking') || lowerContent.includes('rental')) return 'booking';
    if (lowerContent.includes('report') || lowerContent.includes('violation')) return 'system';
    if (lowerContent.includes('invoice')) return 'billing';
    return 'system';
  };

  // Helper function to extract subject from content
  const getNotificationSubject = (content) => {
    // Extract first 50 characters as subject
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUserId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(NOTIFICATION_ENDPOINTS.GET_NOTIFICATION);

        // Check if response.data is an array
        if (!Array.isArray(response.data)) {
          setError('Invalid response format');
          return;
        }

        // Filter notifications for current user
        const userNotifications = response.data.filter(notification =>
          notification.userId === currentUserId
        );

        // Transform the data (only show notifications for current user)
        const transformedNotifications = userNotifications.map(notification => ({
          id: notification.id,
          content: notification.content,
          date: notification.createDate.toLocaleString('vi-VN'),
          read: notification.isViewed,
          userId: notification.userId,
          // Determine notification type based on content
          tag: getNotificationTag(notification.content),
          subject: getNotificationSubject(notification.content)
        }));

        setNotifications(transformedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUserId]);

  const filtered = useMemo(() => {
    let data = notifications;
    if (tag !== 'all') data = data.filter(n => n.tag === tag);
    if (onlyUnread) data = data.filter(n => !n.read); // Filter for unread notifications (isViewed = false)
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(n =>
        n.subject.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      );
    }
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [notifications, tag, onlyUnread, query]);

  // Get unread count for display
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleRead = async (id) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    try {
      if (!notification.read) {
        // If marking as read, call the API
        await axiosInstance.patch(NOTIFICATION_ENDPOINTS.PATCH_NOTIFICATION_MARK_AS_READ(id));
      }
      // Update local state
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    } catch (error) {
      console.error('Error toggling notification read status:', error);
      toast.error(t('failedToUpdateNotification') || 'Failed to update notification status. Please try again.');
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(NOTIFICATION_ENDPOINTS.PATCH_NOTIFICATION_MARK_AS_READ(id));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error(t('failedToMarkAsRead') || 'Failed to mark notification as read. Please try again.');
    }
  };

  // Temporarily disabled delete confirmation
  // const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  // const [confirmTitle, setConfirmTitle] = useState('');
  const [deletingNotification, setDeletingNotification] = useState(false);

  const requestDelete = async (id) => {
    try {
      setDeletingNotification(true);
      await axiosInstance.delete(NOTIFICATION_ENDPOINTS.DELETE_NOTIFICATION(id));
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success(t('notificationDeletedSuccessfully') || 'Notification deleted successfully.');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(t('failedToDeleteNotification') || 'Failed to delete notification. Please try again.');
    } finally {
      setDeletingNotification(false);
    }
  };

  // Temporarily disabled - delete confirmation function
  // const confirmDelete = async () => {
  //   if (confirmDeleteId == null) return;
  //   
  //   try {
  //     setDeletingNotification(true);
  //     await axiosInstance.delete(NOTIFICATION_ENDPOINTS.DELETE_NOTIFICATION(confirmDeleteId));
  //     setNotifications(prev => prev.filter(n => n.id !== confirmDeleteId));
  //     setConfirmDeleteId(null);
  //     toast.success(t('notificationDeletedSuccessfully') || 'Notification deleted successfully.');
  //   } catch (error) {
  //     console.error('Error deleting notification:', error);
  //     toast.error(t('failedToDeleteNotification') || 'Failed to delete notification. Please try again.');
  //     setConfirmDeleteId(null); // Close the modal even on error
  //   } finally {
  //     setDeletingNotification(false);
  //   }
  // };
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
          <p className="text-gray-600">{t('loading') || 'Loading notifications...'}</p>
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
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{t('notifications') || 'Notifications'}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder={t('searchNotifications') || 'Search notifications...'} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="w-full md:w-48">
              <DropdownTemplate
                value={tag}
                onChange={(option) => { setTag(option.value); setPage(1); }}
                options={tagOptions}
                placeholder={t('selectTag') || 'Select Tag'}
                className="w-full"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={onlyUnread} onChange={e => { setOnlyUnread(e.target.checked); setPage(1); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              {t('onlyUnread') || 'Only Unread'} {unreadCount > 0 && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">({unreadCount})</span>}
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
          {current.length === 0 && (
            <div className="p-8 text-center text-gray-500">{t('noNotificationsFound') || 'No notifications found'}</div>
          )}
          {current.map(n => (
            <div key={n.id} className={`p-4 flex items-start justify-between ${n.read ? 'bg-white' : 'bg-blue-50/30'}`}>
              <div className="min-w-0 pr-4 cursor-pointer" onClick={() => !n.read && markAsRead(n.id)}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-blue-500'}`}></span>
                  <span className={`font-medium text-gray-900 truncate ${!n.read ? 'font-semibold' : ''}`}>{n.subject}</span>
                  <TagBadge name={n.tag} />
                </div>
                <div className={`text-sm text-gray-600 mt-1 ${!n.read ? 'font-medium' : ''}`}>{n.content}</div>
                <div className="text-xs text-gray-400 mt-1">{formatDateTime(n.date)}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleRead(n.id)} className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">{n.read ? (t('markUnread') || 'Mark Unread') : (t('markRead') || 'Mark Read')}</button>
                <button onClick={() => requestDelete(n.id)} className="px-2 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50">{t('delete') || 'Delete'}</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">{t('page') || 'Page'} {page} {t('of') || 'of'} {totalPages}</div>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className={`px-3 py-1 rounded border ${page === 1 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{t('previous') || 'Previous'}</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className={`px-3 py-1 rounded border ${page === totalPages ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{t('next') || 'Next'}</button>
          </div>
        </div>
      </div>

      {/* Temporarily disabled - Delete Confirmation Modal */}
      {/* {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('confirmDelete') || 'Confirm Delete'}</h3>
            <p className="text-gray-600 mb-4">
              {t('deleteConfirmMessage') || 'Are you sure you want to delete'} {confirmTitle}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deletingNotification}
                className={`px-4 py-2 border border-gray-300 rounded-lg ${
                  deletingNotification 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('cancel') || 'Cancel'}
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingNotification}
                className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                  deletingNotification
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deletingNotification && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {deletingNotification ? (t('deleting') || 'Deleting...') : (t('delete') || 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Notification;