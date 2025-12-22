import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectIsAuthenticated, selectUser } from '../../features/auth/authSlice';
import { axiosInstance } from '../utils/axiosInstance';
import { NOTIFICATION_ENDPOINTS } from '../../config/api';
import { tokenUtils } from '../../features/auth/utils';
import Modal from './Modal';

const NavBar = () => {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [filterFuel, setFilterFuel] = useState('');
    const [filterSeats, setFilterSeats] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    // Fetch notifications for authenticated user
    const fetchNotifications = async () => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        const currentUserId = tokenUtils.getUserId();
        if (!currentUserId) {
            setNotifications([]);
            return;
        }

        try {
            setNotificationLoading(true);
            const response = await axiosInstance.get(NOTIFICATION_ENDPOINTS.GET_NOTIFICATION_BY_USER_ID(currentUserId));
            
            if (Array.isArray(response.data)) {
                // Transform the data to match the expected format
                const transformedNotifications = response.data.map(notification => ({
                    id: notification.id,
                    title: notification.content.length > 50 ? notification.content.substring(0, 50) + '...' : notification.content,
                    content: notification.content,
                    type: getNotificationType(notification.content),
                    isRead: notification.isViewed,
                    createDate: notification.createDate
                }));
                setNotifications(transformedNotifications);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        } finally {
            setNotificationLoading(false);
        }
    };

    // Helper function to determine notification type based on content
    const getNotificationType = (content) => {
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes('payment') || lowerContent.includes('paid') || lowerContent.includes('invoice')) {
            return 'payment';
        }
        if (lowerContent.includes('booking') || lowerContent.includes('rental')) {
            return 'booking';
        }
        return 'info';
    };

    // Get unread notifications count
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            await axiosInstance.patch(NOTIFICATION_ENDPOINTS.PATCH_NOTIFICATION_MARK_AS_READ(notificationId));
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Fetch notifications when user authentication status changes
    useEffect(() => {
        fetchNotifications();
    }, [isAuthenticated]);

    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Remove readonly on focus to allow typing
        const input = searchInputRef.current;
        if (input) {
            const handleFocus = () => {
                input.removeAttribute('readonly');
            };
            input.addEventListener('focus', handleFocus);
            return () => input.removeEventListener('focus', handleFocus);
        }
    }, []);

    return (
        <>
            <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            MORENT
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    name="search-query"
                                    id="search-query"
                                    placeholder={t('search')}
                                    readOnly
                                    onFocus={(e) => e.target.removeAttribute('readonly')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const params = new URLSearchParams();
                                            if (searchQuery.trim()) params.set('q', searchQuery.trim());
                                            navigate(`/search?${params.toString()}`);
                                        }
                                    }}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsFilterOpen(true)}
                                        aria-label="Open filters"
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        {/* Filter funnel icon */}
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 10h12M10 16h4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title={i18n.language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
                        >
                            {i18n.language === 'en' ? (
                                // UK Flag
                                <svg className="h-6 w-6" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                                    <clipPath id="s">
                                        <path d="M0,0 v30 h60 v-30 z" />
                                    </clipPath>
                                    <clipPath id="t">
                                        <path d="M30,15 h30 v15 z v-15 h-30 z h-30 v15 z v-15 h30 z" />
                                    </clipPath>
                                    <g clipPath="url(#s)">
                                        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                                        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                                        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
                                        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                                        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
                                    </g>
                                </svg>
                            ) : (
                                // Vietnam Flag
                                <svg className="h-6 w-6" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="30" height="20" fill="#DA251D" />
                                    <polygon points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85" fill="#FFFF00" />
                                </svg>
                            )}
                        </button>

                        {/* Heart/Favorites */}
                        <Link
                            to={isAuthenticated ? "/profile/favourite_car" : "/auth"}
                            className="p-2 text-gray-400 hover:text-gray-600 relative"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </Link>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                type="button"
                                onClick={() => setIsNotificationOpen((v) => !v)}
                                aria-haspopup="menu"
                                aria-expanded={isNotificationOpen}
                                className="p-2 text-gray-400 hover:text-gray-600 relative"
                            >
                                <svg fill="#9ca3af" stroke="currentColor" className="h-6 w-6" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 611.999 611.999">
                                    <g>
                                        <g>
                                            <g>
                                                <path d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203
				C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578
				c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626
				h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856
				c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626
				C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32
				c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082
				c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z
				 M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826
				c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485
				c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"/>
                                                <path d="M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258
				c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258
				C323.259,126.96,315.532,119.235,306.001,119.235z"/>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                {/* Notification badge - only show if there are unread notifications */}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-medium">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    </span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <div
                                    role="menu"
                                    aria-label="Notifications"
                                    className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900">{t('notification')}</p>
                                        {unreadCount > 0 && (
                                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                                {unreadCount} {t('unread')}
                                            </span>
                                        )}
                                    </div>
                                    <ul className="max-h-80 overflow-auto">
                                        {notificationLoading && (
                                            <li className="px-4 py-4 text-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                                <p className="text-sm text-gray-500 mt-2">{t('loading')}</p>
                                            </li>
                                        )}
                                        {!notificationLoading && notifications.length === 0 && (
                                            <li className="px-4 py-4 text-sm text-gray-500 text-center">{t('noNotifications')}</li>
                                        )}
                                        {!notificationLoading && notifications.slice(0, 5).map((notification) => (
                                            <li 
                                                key={notification.id} 
                                                className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer ${
                                                    !notification.isRead ? 'bg-blue-50' : ''
                                                }`}
                                                onClick={() => {
                                                    if (!notification.isRead) {
                                                        markAsRead(notification.id);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Notification icon based on type */}
                                                    <span className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full ${
                                                        notification.type === 'payment' ? 'bg-green-100' :
                                                        notification.type === 'booking' ? 'bg-blue-100' : 'bg-gray-100'
                                                    }`}>
                                                        {notification.type === 'payment' ? (
                                                            <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M20 6L9 17l-5-5" />
                                                            </svg>
                                                        ) : notification.type === 'booking' ? (
                                                            <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <path d="m9 12 2 2 4-4" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(notification.createDate).toLocaleString()}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        {!notificationLoading && notifications.length > 5 && (
                                            <li className="px-4 py-3 text-center border-t border-gray-100">
                                                <Link 
                                                    to="/profile/notification" 
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                    onClick={() => setIsNotificationOpen(false)}
                                                >
                                                    {t('viewAllNotifications')}
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        {/* <button className="p-2 text-gray-400 hover:text-gray-600">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button> */}

                        {/* Auth buttons or Profile */}
                        {!isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/auth"
                                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    {t('signIn')}
                                </Link>
                                <Link
                                    to="/auth"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    {t('signUp')}
                                </Link>
                            </div>
                        ) : (
                            <Link to="/profile" className="flex items-center gap-3 group">
                                <img
                                    src={user?.imageAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"}
                                    alt={user?.username || 'Profile'}
                                    className="h-10 w-10 rounded-full border-2 border-gray-200 group-hover:border-blue-500 transition-colors cursor-pointer object-cover"
                                />
                                <span className="text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
                                    {user?.username || user?.name || 'User'}
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Filter Modal */}
            <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('filters')}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('carName')}</label>
                            <input
                                type="text"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                placeholder={t('carNamePlaceholder')}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('minPrice')}</label>
                                <input type="number" placeholder="$0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('maxPrice')}</label>
                                <input type="number" placeholder="$500" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('fuelType')}</label>
                                <select
                                    value={filterFuel}
                                    onChange={(e) => setFilterFuel(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">{t('any')}</option>
                                    <option value="electric">{t('electric')}</option>
                                    <option value="hybrid">{t('hybrid')}</option>
                                    <option value="gasoline">{t('gasoline')}</option>
                                    <option value="diesel">{t('diesel')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('seats')}</label>
                                <select
                                    value={filterSeats}
                                    onChange={(e) => setFilterSeats(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">{t('any')}</option>
                                    <option value="2">2</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7+</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen(false)}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const params = new URLSearchParams();
                                const q = (filterName || searchQuery).trim();
                                if (q) params.set('q', q);
                                if (filterFuel) params.set('fuel', filterFuel);
                                if (filterSeats) params.set('seats', filterSeats);
                                setIsFilterOpen(false);
                                navigate(`/search?${params.toString()}`);
                            }}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {t('apply')}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default NavBar;