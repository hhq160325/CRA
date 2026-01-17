
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getAllRegDocs, getAllUsers, getAllCars } from '../../../api/carRegDocsApi';

const PendingVerifications = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carStats, setCarStats] = useState({
    totalCars: 0,
    approvedCars: 0,
    rejectedCars: 0,
    pendingCars: 0
  });

  useEffect(() => {
    fetchRegDocs();
  }, []);

  const fetchRegDocs = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [regDocsData, usersData, carsData] = await Promise.all([
        getAllRegDocs(),
        getAllUsers(),
        getAllCars()
      ]);
      
      const viewData = regDocsData?.view || [];
      const urlsData = regDocsData?.urls || [];
      
      const usersMap = new Map();
      const carsMap = new Map();
      
      if (Array.isArray(usersData)) {
        usersData.forEach(user => {
          if (user.id) {
            usersMap.set(user.id, user);
          }
        });
      }
      
      if (Array.isArray(carsData)) {
        carsData.forEach(car => {
          if (car.id) {
            carsMap.set(car.id, car);
          }
        });
      }
      
      const docsArray = Array.isArray(viewData) ? viewData : [];
      const transformedData = docsArray.map((doc, index) => {
        const urlString = urlsData[index];
        const imageUrls = urlString ? [urlString] : [];
        
        // Get user and car details
        const user = usersMap.get(doc.userId);
        const car = carsMap.get(doc.carId);
        // console.log("doc",doc);
        
        return {
          ...doc,
          urls: imageUrls,
          url: imageUrls[0] || null,
          userFullName: user?.fullName || user?.fullname || 'N/A',
          carModel: car?.model || 'N/A',
          carManufacturer: car?.manufacturer || 'N/A',
        };
      });


      
      const totalCars = Array.isArray(carsData) ? carsData.length : 0;
      
      const approvedCars = transformedData.filter(doc => doc.status === 'Approved').length;
      
      const rejectedCars = transformedData.filter(doc => doc.status === 'Denied').length;
      
      const pendingApprovalCars = transformedData.filter(doc => doc.status === 'Pending').length;
      
      const carsWithRegDocs = new Set(transformedData.map(doc => doc.carId));
      const carsWithoutRegDocs = totalCars - carsWithRegDocs.size;
      
      // Total pending cars = cars with Active status + cars without reg docs
      // const totalPendingCars = pendingApprovalCars + carsWithoutRegDocs;
      
      setCarStats({
        totalCars,
        approvedCars,
        rejectedCars,
        pendingCars: pendingApprovalCars
      });
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch registration documents');
      console.error('Error fetching registration documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusData = [
    {
      title: t('totalCars') || 'Total Cars',
      value: carStats.totalCars,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      valueColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: t('approved') || 'Approved',
      value: carStats.approvedCars,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      valueColor: 'text-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: t('pending') || 'Pending',
      value: carStats.pendingCars,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      valueColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: t('denied') || 'Denied',
      value: carStats.rejectedCars,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      valueColor: 'text-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  ];

  // Data for pie chart
  const pieData = [
    {
      name: t('approvedCars') || 'Approved Cars',
      value: carStats.approvedCars,
      color: '#10B981'
    },
    {
      name: t('pendingCars') || 'Pending Cars',
      value: carStats.pendingCars,
      color: '#F59E0B'
    },
    {
      name: t('rejectedCars') || 'Rejected Cars',
      value: carStats.rejectedCars,
      color: '#EF4444'
    }
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-xs text-gray-600">{`${((payload[0].value / carStats.totalCars) * 100).toFixed(1)}% of total cars`}</p>
        </div>
      );
    }
    return null;
  };



  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="text-center text-red-600">
          <p>Error loading data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('carRegistrationStatus') || 'Car Registration Status'}</h2> 
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="space-y-12">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusData.map((status, index) => (
            <div key={index} className={`${status.bgColor} rounded-lg p-4 border-l-4 ${status.borderColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${status.textColor}`}>{status.title}</p>
                  <p className={`text-2xl font-bold ${status.valueColor}`}>{status.value.toLocaleString()}</p>
                </div>
                <div className={`${status.iconBg} rounded-full p-3`}>
                  <div className={status.iconColor}>
                    {status.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pie Chart */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('carStatusDistribution') || 'Car Status Distribution'}
          </h3>
          {carStats.totalCars > 0 ? (
            <div className="flex items-center gap-6">
              {/* Legend on the left */}
              <div className="flex-shrink-0 space-y-3">
                {pieData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{entry.name}</div>
                      <div className="text-gray-600">
                        {entry.value} ({((entry.value / carStats.totalCars) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pie chart on the right */}
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <p>{t('noDataAvailable') || 'No data available'}</p>
            </div>
          )}
        </div>

        {/* Approval Rate */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">
              {t('approvalRate') || 'Approval Rate'}
            </h3>
            <span className="text-sm text-gray-600">
              {carStats.totalCars > 0 
                ? `${((carStats.approvedCars / carStats.totalCars) * 100).toFixed(1)}%`
                : '0%'
              }
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ 
                width: carStats.totalCars > 0 
                  ? `${(carStats.approvedCars / carStats.totalCars) * 100}%`
                  : '0%'
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {carStats.approvedCars} {t('of') || 'of'} {carStats.totalCars} {t('carsApproved') || 'cars approved'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingVerifications;