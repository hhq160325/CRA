const CustomerViewModal = ({
    selectedCustomer,
    getStatusBadge,
    getVerificationBadge,
    onChangeModeltype
}) => {
    return (
        <>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <p className="text-gray-900">{selectedCustomer.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900">{selectedCustomer.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p className="text-gray-900">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={getStatusBadge(selectedCustomer.status)}>
                            {selectedCustomer.status}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                        <p className="text-gray-900">{selectedCustomer.registrationDate}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                        <span className={getVerificationBadge(selectedCustomer.verificationStatus)}>
                            {selectedCustomer.verificationStatus}
                        </span>
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Tier</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCustomerTier(selectedCustomer.totalSpent).class}`}>
                            {getCustomerTier(selectedCustomer.totalSpent).tier}
                        </span>
                    </div> */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Bookings</label>
                        <p className="text-gray-900">{selectedCustomer.totalBookings}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent</label>
                        <p className="text-gray-900">${(selectedCustomer.totalSpent || 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Booking</label>
                        <p className="text-gray-900">{selectedCustomer.lastBooking || 'No bookings yet'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Issues</label>
                        <p className="text-gray-900">
                            {selectedCustomer.complianceIssues > 0 ? (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    {selectedCustomer.complianceIssues} issues
                                </span>
                            ) : (
                                <span className="text-green-600">No issues</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CustomerViewModal;