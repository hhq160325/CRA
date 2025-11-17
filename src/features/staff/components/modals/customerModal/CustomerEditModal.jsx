import { useTranslation } from 'react-i18next';

const CustomerEditModal = ({ selectedCustomer, onEdit, onClose}) => {
  const { t } = useTranslation();
  
  return (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                onEdit(Object.fromEntries(formData));
              }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={selectedCustomer.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={selectedCustomer.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={selectedCustomer.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                      <select
                        name="status"
                        defaultValue={selectedCustomer.status}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">{t('active')}</option>
                        <option value="pending">{t('pending')}</option>
                        <option value="suspended">{t('suspended')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('verificationStatus')}</label>
                      <select
                        name="verificationStatus"
                        defaultValue={selectedCustomer.verificationStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="verified">{t('verified')}</option>
                        <option value="pending">{t('pending')}</option>
                        <option value="rejected">{t('rejected')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('complianceIssues')}</label>
                      <input
                        type="number"
                        name="complianceIssues"
                        min="0"
                        defaultValue={selectedCustomer.complianceIssues}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t('saveChanges')}
                    </button>
                  </div>
                </div>
              </form>
  );
};
export default CustomerEditModal