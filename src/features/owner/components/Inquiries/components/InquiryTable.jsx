import { useTranslation } from 'react-i18next';
import { getStatusBadge, getStatusText } from '../utils';

const InquiryTable = ({ inquiries, onViewInquiry, onMarkAsClosed }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('inquiries.inquiryCode')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('inquiries.customer')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('inquiries.subject')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('inquiries.date')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('inquiries.status')}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('inquiries.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{inquiry.inquiryId}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{inquiry.customer}</div>
                  <div className="text-xs text-gray-500">{inquiry.customerEmail}</div>
                  <div className="text-xs text-gray-400">{inquiry.customerPhone}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm max-w-xs truncate">
                    {inquiry.subject}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                    {inquiry.message}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900">{inquiry.date.split(' ')[0]}</div>
                  <div className="text-xs text-gray-500">{inquiry.date.split(' ')[1]}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={getStatusBadge(inquiry.status)}>
                    {getStatusText(inquiry.status, t)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewInquiry(inquiry)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {inquiry.status === 'pending' ? t('inquiries.respond') : t('inquiries.view')}
                    </button>
                    {inquiry.status === 'responded' && (
                      <button
                        onClick={() => onMarkAsClosed(inquiry.id)}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        {t('inquiries.close')}
                      </button>
                    )}
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
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
            {t('inquiries.previous')}
          </button>
          <div className="flex space-x-1">
            <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
            <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
          </div>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
            {t('inquiries.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryTable;