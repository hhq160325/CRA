import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// Components
import InquiryModal from './InquiryModal';
import InquiryTable from './InquiryTable';
import InquiryFilters from './InquiryFilters';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

// Hooks
import { useInquiries } from '../hooks/useInquiries';
import { useInquiryFilters } from '../hooks/useInquiryFilters';

const Inquiries = () => {
  const { t } = useTranslation();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom hooks
  const { inquiries, loading, error, updateInquiry } = useInquiries();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredInquiries
  } = useInquiryFilters(inquiries);

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
  };

  const handleMarkAsClosed = (inquiryId) => {
    console.log(t('inquiries.markClosedMessage'), inquiryId);
    toast.info(t('inquiries.markClosedFeature'));
  };

  // Loading and error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('inquiries.title')}</h1>
            <p className="text-gray-600">{t('inquiries.subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            {/* <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              {t('inquiries.exportReport')}
            </button> */}
          </div>
        </div>

        {/* Filters */}
        <InquiryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredCount={filteredInquiries.length}
          totalCount={inquiries.length}
        />

        {/* Inquiries Table */}
        <InquiryTable
          inquiries={filteredInquiries}
          onViewInquiry={openModal}
          onMarkAsClosed={handleMarkAsClosed}
        />
      </div>
      {/* Modal */}
      <InquiryModal
        inquiry={selectedInquiry}
        isOpen={isModalOpen}
        onClose={closeModal}
        onUpdate={updateInquiry}
      />
    </>
  );
};

export default Inquiries;

