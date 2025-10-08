import React, { useState } from 'react';

const OperationsDashboard = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Mock data for operations
    const systemMetrics = {
        uptime: '99.9%',
        activeUsers: 1247,
        totalRequests: 45678,
        errorRate: '0.1%',
        responseTime: '120ms',
        serverLoad: '67%'
    };

    const operationalAlerts = [
        { id: 1, type: 'warning', message: 'High server load detected', time: '2 min ago', severity: 'medium' },
        { id: 2, type: 'info', message: 'Scheduled maintenance completed', time: '15 min ago', severity: 'low' },
        { id: 3, type: 'error', message: 'Payment gateway timeout', time: '1 hour ago', severity: 'high' },
        { id: 4, type: 'success', message: 'Database backup completed', time: '2 hours ago', severity: 'low' }
    ];

    const serviceStatus = [
        { name: 'Authentication Service', status: 'operational', uptime: '99.9%', responseTime: '45ms' },
        { name: 'Payment Gateway', status: 'degraded', uptime: '98.2%', responseTime: '180ms' },
        { name: 'Car Booking API', status: 'operational', uptime: '99.8%', responseTime: '67ms' },
        { name: 'Notification Service', status: 'operational', uptime: '99.5%', responseTime: '23ms' },
        { name: 'File Storage', status: 'maintenance', uptime: '95.1%', responseTime: '340ms' },
        { name: 'Analytics Engine', status: 'operational', uptime: '99.7%', responseTime: '89ms' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'operational': return 'text-green-600 bg-green-100';
            case 'degraded': return 'text-yellow-600 bg-yellow-100';
            case 'maintenance': return 'text-blue-600 bg-blue-100';
            case 'outage': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getAlertColor = (type) => {
        switch (type) {
            case 'error': return 'border-red-200 bg-red-50 text-red-800';
            case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
            case 'info': return 'border-blue-200 bg-blue-50 text-blue-800';
            case 'success': return 'border-green-200 bg-green-50 text-green-800';
            default: return 'border-gray-200 bg-gray-50 text-gray-800';
        }
    };

    return (
        <div className="p-8 space-y-8 min-h-full bg-gray-50">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
                    <p className="text-gray-600 mt-1">High-level overview to manage user roles and system settings</p>
                </div>
                <div className="flex space-x-4">
                    <select
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* System Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">System Uptime</p>
                            <p className="text-2xl font-bold text-green-600">{systemMetrics.uptime}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold text-blue-600">{systemMetrics.activeUsers.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Requests</p>
                            <p className="text-2xl font-bold text-purple-600">{systemMetrics.totalRequests.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Error Rate</p>
                            <p className="text-2xl font-bold text-red-600">{systemMetrics.errorRate}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Response Time</p>
                            <p className="text-2xl font-bold text-orange-600">{systemMetrics.responseTime}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Server Load</p>
                            <p className="text-2xl font-bold text-yellow-600">{systemMetrics.serverLoad}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Service Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Service Status</h2>
                        <p className="text-gray-600 text-sm mt-1">Monitor all system services and their health</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {serviceStatus.map((service, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{service.name}</p>
                                            <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{service.responseTime}</p>
                                        <p className="text-xs text-gray-600">avg response</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Operational Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
                        <p className="text-gray-600 text-sm mt-1">System notifications and operational updates</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {operationalAlerts.map((alert) => (
                                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium">{alert.message}</p>
                                            <p className="text-sm opacity-75 mt-1">{alert.time}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                                            alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                                'bg-gray-200 text-gray-800'
                                            }`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            View All Alerts
                        </button>
                    </div>
                </div>
            </div>

            {/* User Role Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">User Role Management</h2>
                    <p className="text-gray-600 text-sm mt-1">Manage user permissions and system access</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-blue-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Admin Users</h3>
                            <p className="text-2xl font-bold text-blue-600 mb-2">12</p>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Manage Admins</button>
                        </div>

                        <div className="text-center p-6 bg-green-50 rounded-lg">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Regular Users</h3>
                            <p className="text-2xl font-bold text-green-600 mb-2">1,235</p>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">View Users</button>
                        </div>

                        <div className="text-center p-6 bg-purple-50 rounded-lg">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Permissions</h3>
                            <p className="text-2xl font-bold text-purple-600 mb-2">24</p>
                            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">Configure</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationsDashboard;