import { useTranslation } from 'react-i18next';

const CustomerViewModal = ({
    selectedCustomer,
    getStatusBadge,
    getVerificationBadge,
    onChangeModeltype
}) => {
    const { t } = useTranslation();
    
    return (
        <>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                        <p className="text-gray-900">{selectedCustomer.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                        <p className="text-gray-900">{selectedCustomer.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                        <p className="text-gray-900">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                        <span className={getStatusBadge(selectedCustomer.status)}>
                            {t(selectedCustomer.status)}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('registrationDate')}</label>
                        <p className="text-gray-900">{selectedCustomer.registrationDate}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('verificationStatus')}</label>
                        <span className={getVerificationBadge(selectedCustomer.verificationStatus)}>
                            {t(selectedCustomer.verificationStatus)}
                        </span>
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Tier</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCustomerTier(selectedCustomer.totalSpent).class}`}>
                            {getCustomerTier(selectedCustomer.totalSpent).tier}
                        </span>
                    </div> */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('totalBookings')}</label>
                        <p className="text-gray-900">{selectedCustomer.totalBookings}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('totalSpent')}</label>
                        <p className="text-gray-900">${(selectedCustomer.totalSpent || 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('lastBooking')}</label>
                        <p className="text-gray-900">{selectedCustomer.lastBooking || t('noBookingsYet')}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('complianceIssues')}</label>
                        <p className="text-gray-900">
                            {selectedCustomer.complianceIssues > 0 ? (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    {selectedCustomer.complianceIssues} {t('issues')}
                                </span>
                            ) : (
                                <span className="text-green-600">{t('noIssues')}</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CustomerViewModal;