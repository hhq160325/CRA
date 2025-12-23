import { useTranslation } from 'react-i18next';

const RegDocStatusSummary = ({ regDocStatusData }) => {
  const { t } = useTranslation();

  const statusData = [
    {
      title: t('approved'),
      value: regDocStatusData?.Approved || 0,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      valueColor: 'text-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: t('pendingApproval'),
      value: regDocStatusData?.Pending || 0,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      valueColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: t('denied'),
      value: regDocStatusData?.Denied || 0,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      valueColor: 'text-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: t('noUpload'),
      value: regDocStatusData?.['No Upload'] || 0,
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-500',
      textColor: 'text-gray-700',
      valueColor: 'text-gray-600',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('registrationDocumentStatus')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statusData.map((status, index) => (
          <div key={index} className={`${status.bgColor} rounded-lg p-4 border-l-4 ${status.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${status.textColor}`}>{status.title}</p>
                <p className={`text-2xl font-bold ${status.valueColor}`}>{status.value}</p>
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
    </div>
  );
};

export default RegDocStatusSummary;