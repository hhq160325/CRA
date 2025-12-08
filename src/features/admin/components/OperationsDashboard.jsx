import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAllAdminData, getAllUsers } from '../adminapi/adminAPI';
import { ROLES } from '../../auth/utils';
const OperationsDashboard = () => {
    const { t } = useTranslation();
    const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
    const [systemMetrics, setSystemMetrics] = useState({
        activeCars: 0,
        carsInUse: 0,
        maintenanceCars: 0,
        totalBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        canceledBookings: 0,
        activeUsers: 0,
        RoleManagementUsers: 0,
        RoleManagementCarOwners: 0,
        RoleManagementStaff: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [adminData, usersData] = await Promise.all([
                fetchAllAdminData(),
                getAllUsers()
            ]);

            const { cars, bookings } = adminData;

            // Calculate metrics from real data
            const activeCars = cars.filter(car => car.status === 'Active').length;
            const carsInUse = cars.filter(car => car.status === 'Reserved').length;
            const maintenanceCars = cars.filter(car => car.status === 'Inactive').length;
            const totalBookings = bookings.length;
            const confirmedBookings = bookings.filter(booking => booking.status === 'Confirmed').length;
            const completedBookings = bookings.filter(booking => booking.status === 'Completed').length;
            const canceledBookings = bookings.filter(booking => booking.status === 'Cancelled').length;

            // Count users by role using ROLES constants
            const activeUsers = usersData.filter(user => user.roleId === ROLES.CUSTOMER).length;
            const carOwners = usersData.filter(user => user.roleId === ROLES.OWNER).length;
            const staff = usersData.filter(user => user.roleId === ROLES.STAFF).length;

            setSystemMetrics({
                activeCars,
                carsInUse,
                maintenanceCars,
                totalBookings,
                confirmedBookings,
                completedBookings,
                canceledBookings,
                RoleManagementUsers: activeUsers,
                RoleManagementCarOwners: carOwners,
                RoleManagementStaff: staff
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const operationalAlerts = [
        { id: 1, type: 'warning', message: 'Car #VN-2345 battery low (15%) - needs charging', time: '2 min ago', severity: 'high' },
        { id: 2, type: 'error', message: 'Car #VN-8901 reported collision - staff dispatched', time: '8 min ago', severity: 'high' },
        { id: 3, type: 'info', message: 'Maintenance scheduled for 12 vehicles tomorrow', time: '15 min ago', severity: 'low' },
        { id: 4, type: 'warning', message: 'High demand in District 1 - consider rebalancing', time: '45 min ago', severity: 'medium' },
        { id: 5, type: 'success', message: 'Car #VN-5678 maintenance completed', time: '1 hour ago', severity: 'low' }
    ];

    const serviceStatus = [
        { name: 'Active Cars', value: systemMetrics.activeCars, status: 'Active' },
        { name: 'Cars In Use', value: systemMetrics.carsInUse, status: 'Reserved' },
        { name: 'Inactive Cars', value: systemMetrics.maintenanceCars, status: 'Inactive' },
        { name: 'Confirmed Bookings', value: systemMetrics.confirmedBookings, status: 'Confirmed' },
        { name: 'Completed Bookings', value: systemMetrics.completedBookings, status: 'Completed' },
        { name: 'Cancelled Bookings', value: systemMetrics.canceledBookings, status: 'Cancelled' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-green-600 bg-green-100';
            case 'Reserved': return 'text-blue-600 bg-blue-100';
            case 'Inactive': return 'text-gray-600 bg-gray-100';
            case 'Confirmed': return 'text-green-600 bg-green-100';
            case 'Completed': return 'text-blue-600 bg-blue-100';
            case 'Cancelled': return 'text-red-600 bg-red-100';
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

    const handleRefresh = () => {
        loadDashboardData();
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-full bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('loadingData')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 min-h-full bg-gray-50">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('operationsDashboardTitle')}</h1>
                    <p className="text-gray-600 mt-1">{t('operationsDashboardSubtitle')}</p>
                </div>
                <div className="flex space-x-4">
                    <select
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="1h">{t('lastHour')}</option>
                        <option value="24h">{t('last24Hours')}</option>
                        <option value="7d">{t('last7Days')}</option>
                        <option value="30d">{t('last30Days')}</option>
                    </select>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {t('refreshData')}
                    </button>
                </div>
            </div>

            {/* Fleet Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('activeCars')}</p>
                            <p className="text-2xl font-bold text-green-600">{systemMetrics.activeCars}</p>
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
                            <p className="text-sm font-medium text-gray-600">{t('carsInUse')}</p>
                            <p className="text-2xl font-bold text-blue-600">{systemMetrics.carsInUse}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('totalBookings')}</p>
                            <p className="text-2xl font-bold text-purple-600">{systemMetrics.totalBookings.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('activeUsers')}</p>
                            <p className="text-2xl font-bold text-indigo-600">{systemMetrics.RoleManagementUsers}</p>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('RoleManagementCarOwners')}</p>
                            <p className="text-2xl font-bold text-orange-600">{systemMetrics.RoleManagementCarOwners}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{t('RoleManagementStaff')}</p>
                            <p className="text-2xl font-bold text-teal-600">{systemMetrics.RoleManagementStaff}</p>
                        </div>
                        <div className="p-3 bg-teal-100 rounded-full">
                            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Service Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">{t('serviceStatus')}</h2>
                        <p className="text-gray-600 text-sm mt-1">{t('serviceStatusSubtitle')}</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {serviceStatus.map((service, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                                            {t(service.status)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{service.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Operational Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">{t('recentAlerts')}</h2>
                        <p className="text-gray-600 text-sm mt-1">{t('recentAlertsSubtitle')}</p>
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
                                            {t(alert.severity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            {t('viewAllAlerts')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Role Management - Users, Car Owners, Staff */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-3 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{t('roleManagement')}</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                
                            <h3 className="font-semibold text-gray-900 mb-2">{t('RoleManagementUsers')}: {systemMetrics.RoleManagementUsers}</h3>
                            {/* <p className="text-2xl font-bold text-blue-600 mb-2">{systemMetrics.activeUsers.toLocaleString()}</p> */}
                            <p className="text-sm text-gray-600 mb-4">{t('customersRentingCars')}</p>
                            {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">{t('manageUsers')}</button> */}
                        </div>

                        <div className="text-center p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{t('RoleManagementCarOwners')}: {systemMetrics.RoleManagementCarOwners}</h3>
                            {/* <p className="text-2xl font-bold text-orange-600 mb-2">{systemMetrics.carOwners}</p> */}
                            <p className="text-sm text-gray-600 mb-4">{t('managersProvidingVehicles')}</p>
                            {/* <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">{t('manageOwners')}</button> */}
                        </div>

                        <div className="text-center p-6 bg-teal-50 rounded-lg border-2 border-teal-200">
                            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{t('RoleManagementStaff')}: {systemMetrics.RoleManagementStaff}</h3>
                            {/* <p className="text-2xl font-bold text-teal-600 mb-2">{systemMetrics.staffMembers}</p> */}
                            <p className="text-sm text-gray-600 mb-4">{t('supportMaintenanceTeam')}</p>
                            {/* <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">{t('manageStaff')}</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationsDashboard;