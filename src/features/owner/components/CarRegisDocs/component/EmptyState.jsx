import { useTranslation } from 'react-i18next';

const EmptyState = ({ filter }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('carRegisDocs.noCarsFound')}</h3>
      <p className="text-gray-600">
        {filter === 'all' && t('carRegisDocs.noRegisteredCars')}
        {filter === 'no-upload' && t('carRegisDocs.noUploadCars')}
        {filter === 'pending' && t('carRegisDocs.noPendingCars', { status: t('carRegisDocs.pending') })}
        {filter === 'approved' && t('carRegisDocs.noApprovedCars', { status: 'approved' })}
        {filter === 'denied' && t('carRegisDocs.noDeniedCars')}
      </p>
    </div>
  );
};

export default EmptyState;