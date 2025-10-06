import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '../staffSlice';

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('create');
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    targetAudience: 'all',
    priority: 'normal',
    deliveryMethod: 'in-app',
    scheduleType: 'immediate'
  });

  // Mock data for sent notifications
  const sentNotifications = [
    {
      id: 1,
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance will occur on Sunday from 2-4 AM EST.',
      targetAudience: 'all',
      priority: 'high',
      sentAt: '2024-10-06 10:30',
      deliveryStatus: 'delivered',
      readCount: 1247,
      totalRecipients: 1350
    },
    {
      id: 2,
      title: 'New Feature: Enhanced Search',
      message: 'We\'ve improved our search functionality with better filters.',
      targetAudience: 'customers',
      priority: 'normal',
      sentAt: '2024-10-05 14:15',
      deliveryStatus: 'delivered',
      readCount: 892,
      totalRecipients: 1100
    },
    {
      id: 3,
      title: 'Car Owner Verification Reminder',
      message: 'Please complete your verification process to continue listing cars.',
      targetAudience: 'car-owners',
      priority: 'normal',
      sentAt: '2024-10-04 09:00',
      deliveryStatus: 'delivered',
      readCount: 156,
      totalRecipients: 250
    }
  ];

  const handleInputChange = (field, value) => {
    setNotificationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendNotification = () => {
    const newNotification = {
      id: Date.now(),
      ...notificationForm,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'sending',
      readCount: 0,
      totalRecipients: getTotalRecipients(notificationForm.targetAudience)
    };
    
    dispatch(addNotification(newNotification));
    
    // Reset form
    setNotificationForm({
      title: '',
      message: '',
      targetAudience: 'all',
      priority: 'normal',
      deliveryMethod: 'in-app',
      scheduleType: 'immediate'
    });
  };

  const getTotalRecipients = (audience) => {
    switch (audience) {
      case 'all': return 1350;
      case 'customers': return 1100;
      case 'car-owners': return 250;
      default: return 0;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'normal':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'low':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'sending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-gray-600">Send system-wide notifications to users</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Notification
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Notification History
            </button>
          </nav>
        </div>

        {/* Create Notification Tab */}
        {activeTab === 'create' && (
          <div className="p-6">
            <div className="max-w-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  value={notificationForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter notification title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content
                </label>
                <textarea
                  value={notificationForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Enter your message..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={notificationForm.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Users ({getTotalRecipients('all')})</option>
                    <option value="customers">Customers Only ({getTotalRecipients('customers')})</option>
                    <option value="car-owners">Car Owners Only ({getTotalRecipients('car-owners')})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={notificationForm.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method
                  </label>
                  <select
                    value={notificationForm.deliveryMethod}
                    onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="in-app">In-App Notification</option>
                    <option value="email">Email</option>
                    <option value="both">Both In-App & Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule
                  </label>
                  <select
                    value={notificationForm.scheduleType}
                    onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="immediate">Send Immediately</option>
                    <option value="scheduled">Schedule for Later</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  This notification will be sent to {getTotalRecipients(notificationForm.targetAudience)} users
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Save Draft
                  </button>
                  <button
                    onClick={handleSendNotification}
                    disabled={!notificationForm.title || !notificationForm.message}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Send Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="space-y-4">
              {sentNotifications.map((notification) => (
                <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <span className={getPriorityBadge(notification.priority)}>
                          {notification.priority}
                        </span>
                        <span className={getStatusBadge(notification.deliveryStatus)}>
                          {notification.deliveryStatus}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{notification.message}</p>
                      <div className="flex items-center space-x-6 text-xs text-gray-500">
                        <span>Sent: {notification.sentAt}</span>
                        <span>Audience: {notification.targetAudience}</span>
                        <span>Recipients: {notification.totalRecipients}</span>
                        <span>Read: {notification.readCount} ({Math.round((notification.readCount / notification.totalRecipients) * 100)}%)</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                        Duplicate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;