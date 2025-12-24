import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getStatusBadge, getStatusText } from '../utils/driverLicenseUtils';

const DriverLicenseModal = ({
    isOpen,
    selectedLicense,
    onClose,
    handleApprove,
    handleReject,
    driverLicenses
}) => {
    const { t } = useTranslation();

    if (!isOpen || !selectedLicense) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {t('driverLicenseDetails') || 'Driver License Details'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Customer Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('customerInformation') || 'Customer Information'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    {t('customer') || 'Customer'}
                                </label>
                                <p className="mt-1 text-gray-900">{selectedLicense.customerName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    {t('submittedDate') || 'Submitted Date'}
                                </label>
                                <p className="mt-1 text-gray-900">{selectedLicense.submittedDate}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    {t('status') || 'Status'}
                                </label>
                                <div className="mt-1">
                                    <span className={getStatusBadge(selectedLicense.status)}>
                                        {getStatusText(selectedLicense.status, t)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                    {t('actions') || 'Actions'}
                                </label>
                                <div className="flex items-center space-x-2">
                                    {(selectedLicense.status === 'active' || selectedLicense.status === 'needmanualcheck') ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    handleApprove(selectedLicense.id, driverLicenses, t);
                                                    toast.success(t('licenseApprovedSuccessfully') || 'License approved successfully');
                                                    onClose();
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                            >
                                                {t('approve') || 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleReject(selectedLicense.id, 'Rejected by staff', driverLicenses, t);
                                                    toast.success(t('licenseRejectedSuccessfully') || 'License rejected successfully');
                                                    onClose();
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                            >
                                                {t('reject') || 'Reject'}
                                            </button>
                                        </>
                                    ) : selectedLicense.status === 'approved' || selectedLicense.status === 'autoapproved' ? (
                                        <button
                                            disabled
                                            className="px-4 py-2 bg-green-100 text-green-800 rounded-lg cursor-not-allowed text-sm font-medium"
                                        >
                                            ✓ {t('approved') || 'Approved'}
                                        </button>
                                    ) : selectedLicense.status === 'rejected' ? (
                                        <button
                                            disabled
                                            className="px-4 py-2 bg-red-100 text-red-800 rounded-lg cursor-not-allowed text-sm font-medium"
                                        >
                                            ✗ {t('rejected') || 'Rejected'}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='flex flex-collum grid grid-cols-2'>
                        {/* License Images */}
                        {selectedLicense.urls && selectedLicense.urls.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    {t('licenseImages') || 'License Images'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    {selectedLicense.urls.map((imageUrl, index) => (
                                        <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
                                            <img
                                                src={imageUrl}
                                                alt={`Driver License ${index + 1}`}
                                                className="w-full h-auto"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* License Details */}
                        {(selectedLicense.licenseNumber || selectedLicense.licenseName || selectedLicense.licenseDoB ||
                            selectedLicense.licenseClass || selectedLicense.licenseIssue || selectedLicense.licenseExpiry) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        {t('licenseInformation') || 'License Information'}
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedLicense.licenseNumber && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {t('licenseNumber') || 'License Number'}
                                                    </label>
                                                    <p className="mt-1 text-gray-900 font-mono text-lg font-semibold">
                                                        {selectedLicense.licenseNumber}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLicense.licenseName && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {t('licenseName') || 'Full Name on License'}
                                                    </label>
                                                    <p className="mt-1 text-gray-900 font-semibold">
                                                        {selectedLicense.licenseName}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLicense.licenseDoB && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {t('dateOfBirth') || 'Date of Birth'}
                                                    </label>
                                                    <p className="mt-1 text-gray-900">
                                                        {new Date(selectedLicense.licenseDoB).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLicense.licenseClass && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {t('licenseClass') || 'License Class'}
                                                    </label>
                                                    <p className="mt-1">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                            {selectedLicense.licenseClass}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLicense.licenseIssue && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {t('issueDate') || 'Issue Date'}
                                                    </label>
                                                    <p className="mt-1 text-gray-900">
                                                        {new Date(selectedLicense.licenseIssue).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLicense.licenseExpiry && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {t('expiryDate') || 'Expiry Date'}
                                                    </label>
                                                    <p className="mt-1 text-gray-900">
                                                        {new Date(selectedLicense.licenseExpiry).toLocaleDateString()}
                                                        {new Date(selectedLicense.licenseExpiry) < new Date() && (
                                                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                {t('expired') || 'Expired'}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                    {/* License Details */}
                    {/* {(selectedLicense.licenseNumber || selectedLicense.licenseName || selectedLicense.licenseDoB ||
                        selectedLicense.licenseClass || selectedLicense.licenseIssue || selectedLicense.licenseExpiry) && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    {t('licenseInformation') || 'License Information'}
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedLicense.licenseNumber && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">
                                                    {t('licenseNumber') || 'License Number'}
                                                </label>
                                                <p className="mt-1 text-gray-900 font-mono text-lg font-semibold">
                                                    {selectedLicense.licenseNumber}
                                                </p>
                                            </div>
                                        )}
                                        {selectedLicense.licenseName && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">
                                                    {t('licenseName') || 'Full Name on License'}
                                                </label>
                                                <p className="mt-1 text-gray-900 font-semibold">
                                                    {selectedLicense.licenseName}
                                                </p>
                                            </div>
                                        )}
                                        {selectedLicense.licenseDoB && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">
                                                    {t('dateOfBirth') || 'Date of Birth'}
                                                </label>
                                                <p className="mt-1 text-gray-900">
                                                    {new Date(selectedLicense.licenseDoB).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                        {selectedLicense.licenseClass && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">
                                                    {t('licenseClass') || 'License Class'}
                                                </label>
                                                <p className="mt-1">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        {selectedLicense.licenseClass}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                        {selectedLicense.licenseIssue && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">
                                                    {t('issueDate') || 'Issue Date'}
                                                </label>
                                                <p className="mt-1 text-gray-900">
                                                    {new Date(selectedLicense.licenseIssue).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                        {selectedLicense.licenseExpiry && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">
                                                    {t('expiryDate') || 'Expiry Date'}
                                                </label>
                                                <p className="mt-1 text-gray-900">
                                                    {new Date(selectedLicense.licenseExpiry).toLocaleDateString()}
                                                    {new Date(selectedLicense.licenseExpiry) < new Date() && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            {t('expired') || 'Expired'}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )} */}

                    {/* License Images */}
                    {/* {selectedLicense.urls && selectedLicense.urls.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {t('licenseImages') || 'License Images'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {selectedLicense.urls.map((imageUrl, index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={`Driver License ${index + 1}`}
                                            className="w-full h-auto"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default DriverLicenseModal;