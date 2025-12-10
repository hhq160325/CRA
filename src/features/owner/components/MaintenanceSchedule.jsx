import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { CAR_ENDPOINTS, SCHEDULE_ENDPOINTS } from '../../../config/api';
import { getUserIdFromToken } from '../../user/api';

const MaintenanceSchedule = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    note: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMaintenanceSchedules();
  }, []);

  const fetchMaintenanceSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user ID
      const currentUserId = getUserIdFromToken();

      // Fetch all cars
      const carsResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
      const allCars = carsResponse.data || [];

      // Filter cars owned by current user and with Inactive status (in maintenance)
      const inactiveCars = allCars.filter(car =>
        car.owner.id === currentUserId && car.status?.toLowerCase() === 'inactive'
      );

      // Fetch schedules for each inactive car
      const schedulePromises = inactiveCars.map(car =>
        axiosInstance.get(SCHEDULE_ENDPOINTS.GET_CAR_SCHEDULES(car.id))
          .then(response => ({
            car,
            schedules: response.data || []
          }))
          .catch(err => {
            console.error(`Error fetching schedule for car ${car.id}:`, err);
            return { car, schedules: [] };
          })
      );

      const carSchedulesData = await Promise.all(schedulePromises);

      // Process and format the data
      const formattedSchedules = [];
      let idCounter = 1;

      carSchedulesData.forEach(({ car, schedules }) => {
        if (schedules.length > 0) {
          // Process each schedule for the car
          schedules.forEach(schedule => {
            const startDate = new Date(schedule.startDate);
            const endDate = new Date(schedule.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Calculate days until maintenance
            const daysUntil = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

            // Determine status based on dates
            let status = 'upcoming';
            let priority = 'low';

            if (today > endDate) {
              status = 'overdue';
              priority = 'high';
            } else if (today >= startDate && today <= endDate) {
              status = 'due';
              priority = 'high';
            } else if (daysUntil <= 7) {
              priority = 'high';
            } else if (daysUntil <= 14) {
              priority = 'medium';
            }

            formattedSchedules.push({
              id: idCounter++,
              carId: car.id,
              carName: `${car.manufacturer || ''} ${car.model || ''}`.trim() || t('maintenanceSchedule.unknownCarModel'),
              carModel: car.yearofManufacture?.toString() || 'N/A',
              licensePlate: car.licensePlate || 'N/A',
              startDateMaintenanceDate: schedule.startDate ? new Date(schedule.startDate).toISOString().split('T')[0] : 'N/A',
              endDateMaintenanceDate: schedule.endDate ? new Date(schedule.endDate).toISOString().split('T')[0] : 'N/A',
              pickupTime: schedule.startDate ? new Date(schedule.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A',
              returnTime: schedule.endDate ? new Date(schedule.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A',
              mileageAtLastService: car.mileage || 0,
              currentMileage: car.mileage || 0,
              maintenanceType: t('maintenanceSchedule.periodicMaintenance'),
              status: status,
              daysUntil: daysUntil,
              priority: priority,
              scheduleId: schedule.id
            });
          });
        } else {
          // Car is inactive but has no schedule data
          formattedSchedules.push({
            id: idCounter++,
            carId: car.id,
            carName: car.model || t('maintenanceSchedule.unknownCarModel'),
            carModel: car.year?.toString() || 'N/A',
            licensePlate: car.licensePlate || 'N/A',
            lastMaintenanceDate: 'N/A',
            nextMaintenanceDate: 'N/A',
            mileageAtLastService: car.mileage || 0,
            currentMileage: car.mileage || 0,
            maintenanceType: t('maintenanceSchedule.needsMaintenance'),
            status: 'due',
            daysUntil: 0,
            priority: 'high',
            scheduleId: null
          });
        }
      });

      setMaintenanceSchedules(formattedSchedules);
    } catch (err) {
      console.error('Error fetching maintenance schedules:', err);
      setError(t('maintenanceSchedule.errorLoadingSchedules'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'upcoming':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'due':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
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

  const openModal = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleMarkCompleted = (id) => {
    // Handle mark as completed logic
    console.log('Marking maintenance as completed for car:', id);
    closeModal();
  };

  const handleScheduleMaintenance = (schedule) => {
    // Open schedule modal with car info
    setSelectedCar(schedule);
    setIsScheduleModalOpen(true);
    setIsModalOpen(false);
    
    // Pre-fill form with existing data if available
    if (schedule.startDateMaintenanceDate !== 'N/A') {
      setScheduleFormData({
        title: schedule.maintenanceType || '',
        location: '',
        startDate: schedule.startDateMaintenanceDate,
        endDate: schedule.endDateMaintenanceDate,
        note: ''
      });
    }
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedCar(null);
    setScheduleFormData({
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      note: ''
    });
  };

  const handleScheduleFormChange = (e) => {
    const { name, value } = e.target;
    setScheduleFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSchedule = async (e) => {
    e.preventDefault();
    
    if (!selectedCar) return;
    
    try {
      setSubmitting(true);
      
      // Format dates to ISO 8601 format with time
      const startDateTime = `${scheduleFormData.startDate}T00:00:00.000Z`;
      const endDateTime = `${scheduleFormData.endDate}T23:59:59.000Z`;
      
      const scheduleData = {
        title: scheduleFormData.title,
        location: scheduleFormData.location,
        startDate: startDateTime,
        endDate: endDateTime,
        note: scheduleFormData.note,
        carId: selectedCar.carId
      };

      await axiosInstance.post(SCHEDULE_ENDPOINTS.CREATE_CAR_SCHEDULES, scheduleData);
      
      // Show success message
      alert(t('maintenanceSchedule.scheduleCreatedSuccessfully'));
      
      // Close modal and refresh data
      closeScheduleModal();
      fetchMaintenanceSchedules();
      
    } catch (err) {
      console.error('Error creating maintenance schedule:', err);
      alert(t('maintenanceSchedule.errorCreatingSchedule'));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSchedules = maintenanceSchedules.filter(schedule => {
    const matchesSearch = schedule.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.carId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const overdueCount = maintenanceSchedules.filter(s => s.status === 'overdue').length;
  const dueCount = maintenanceSchedules.filter(s => s.status === 'due').length;
  const upcomingCount = maintenanceSchedules.filter(s => s.status === 'upcoming').length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('maintenanceSchedule.loadingSchedules')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-full bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={fetchMaintenanceSchedules}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
{t('maintenanceSchedule.tryAgain')}
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
          <h1 className="text-2xl font-bold text-gray-900">{t('maintenanceSchedule.title')}</h1>
          <p className="text-gray-600">{t('maintenanceSchedule.subtitle')}</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
{t('maintenanceSchedule.exportReport')}
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
{t('maintenanceSchedule.addMaintenanceRecord')}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Due Now</p>
              <p className="text-2xl font-bold text-yellow-600">{dueCount}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cars</p>
              <p className="text-2xl font-bold text-green-600">{maintenanceSchedules.length}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
          </div>
        </div>
      </div> */}

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
                placeholder={t('maintenanceSchedule.searchPlaceholder')}
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
              <option value="all">{t('maintenanceSchedule.allStatuses')}</option>
              <option value="overdue">{t('maintenanceSchedule.overdue')}</option>
              <option value="due">{t('maintenanceSchedule.due')}</option>
              <option value="upcoming">{t('maintenanceSchedule.upcoming')}</option>
              <option value="completed">{t('maintenanceSchedule.completed')}</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
{t('maintenanceSchedule.showingResults', { 
              filtered: filteredSchedules.length, 
              total: maintenanceSchedules.length 
            })}
          </div>
        </div>
      </div>

      {/* Maintenance Schedule Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.carInfo')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.maintenanceDate')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.maintenanceTime')}</th>
                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Mileage</th> */}
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.maintenanceType')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.status')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.priority')}</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('maintenanceSchedule.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{schedule.carName}</div>
                    <div className="text-xs text-gray-500">{schedule.carModel} • {schedule.licensePlate}</div>
                    <div className="text-xs text-gray-400">{schedule.carId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{t('maintenanceSchedule.fromTo', { 
                      start: schedule.startDateMaintenanceDate, 
                      end: schedule.endDateMaintenanceDate 
                    })}</div>
                    {/* <div className="text-xs text-gray-500">{schedule.mileageAtLastService.toLocaleString()} km</div> */}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">{t('maintenanceSchedule.timeFromTo', { 
                      start: schedule.pickupTime, 
                      end: schedule.returnTime 
                    })}</div>
                    {/* {schedule.daysUntil >= 0 ? (
                      <div className="text-xs text-gray-500">In {schedule.daysUntil} days</div>
                    ) : (
                      <div className="text-xs text-red-600 font-medium">{Math.abs(schedule.daysUntil)} days overdue</div>
                    )} */}
                  </td>
                  {/* <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{schedule.currentMileage.toLocaleString()} km</div>
                    <div className="text-xs text-gray-500">
                      {schedule.currentMileage - schedule.mileageAtLastService} km since last service
                    </div>
                  </td> */}
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{schedule.maintenanceType}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(schedule.status)}>
                      {t(`maintenanceSchedule.${schedule.status}`)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getPriorityBadge(schedule.priority)}>
                      {t(`maintenanceSchedule.${schedule.priority}`)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(schedule)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
{t('maintenanceSchedule.view')}
                      </button>
                      <button
                        onClick={() => handleScheduleMaintenance(schedule)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
{t('maintenanceSchedule.schedule')}
                      </button>
                      {schedule.status === 'due' || schedule.status === 'overdue' ? (
                        <button
                          onClick={() => handleMarkCompleted(schedule.id)}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
{t('maintenanceSchedule.complete')}
                        </button>
                      ) : null}
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
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('maintenanceSchedule.previous')}</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
            </div>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('maintenanceSchedule.next')}</button>
          </div>
        </div>
      </div>
      </div>

      {/* Modal for creating/editing maintenance schedule */}
      {isScheduleModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{t('maintenanceSchedule.scheduleMaintenanceTitle')}</h2>
                <button
                  onClick={closeScheduleModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmitSchedule} className="p-6 space-y-4">
              {/* Car Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">{t('maintenanceSchedule.carInfo')}</p>
                <p className="font-medium text-gray-900">{selectedCar.carName}</p>
                <p className="text-sm text-gray-600">{selectedCar.licensePlate} • {selectedCar.carId}</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
{t('maintenanceSchedule.title')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={scheduleFormData.title}
                  onChange={handleScheduleFormChange}
                  required
                  placeholder={t('maintenanceSchedule.titlePlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
{t('maintenanceSchedule.location')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={scheduleFormData.location}
                  onChange={handleScheduleFormChange}
                  required
                  placeholder={t('maintenanceSchedule.locationPlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
{t('maintenanceSchedule.startDate')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={scheduleFormData.startDate}
                    onChange={handleScheduleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
{t('maintenanceSchedule.endDate')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={scheduleFormData.endDate}
                    onChange={handleScheduleFormChange}
                    required
                    min={scheduleFormData.startDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
{t('maintenanceSchedule.notes')}
                </label>
                <textarea
                  name="note"
                  value={scheduleFormData.note}
                  onChange={handleScheduleFormChange}
                  rows="3"
                  placeholder={t('maintenanceSchedule.notesPlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeScheduleModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={submitting}
                >
{t('maintenanceSchedule.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  disabled={submitting}
                >
{submitting ? t('maintenanceSchedule.creating') : t('maintenanceSchedule.createSchedule')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for viewing maintenance details */}
      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{t('maintenanceSchedule.maintenanceDetails')}</h2>
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
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('maintenanceSchedule.carName')}</p>
                  <p className="font-medium text-gray-900">{selectedCar.carName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('maintenanceSchedule.licensePlate')}</p>
                  <p className="font-medium text-gray-900">{selectedCar.licensePlate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('maintenanceSchedule.currentMileage')}</p>
                  <p className="font-medium text-gray-900">{selectedCar.currentMileage.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('maintenanceSchedule.maintenanceType')}</p>
                  <p className="font-medium text-gray-900">{selectedCar.maintenanceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('maintenanceSchedule.lastMaintenanceDate')}</p>
                  <p className="font-medium text-gray-900">{selectedCar.lastMaintenanceDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('maintenanceSchedule.nextMaintenanceDate')}</p>
                  <p className="font-medium text-gray-900">{selectedCar.nextMaintenanceDate}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <span className={getStatusBadge(selectedCar.status)}>{t(`maintenanceSchedule.${selectedCar.status}`)}</span>
                  <span className={getPriorityBadge(selectedCar.priority)}>{t('maintenanceSchedule.priorityLevel')} {t(`maintenanceSchedule.${selectedCar.priority}`)}</span>
                </div>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  onClick={() => handleScheduleMaintenance(selectedCar)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
{t('maintenanceSchedule.scheduleMaintenance')}
                </button>
                {(selectedCar.status === 'due' || selectedCar.status === 'overdue') && (
                  <button
                    onClick={() => handleMarkCompleted(selectedCar.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
{t('maintenanceSchedule.markAsCompleted')}
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

export default MaintenanceSchedule;

