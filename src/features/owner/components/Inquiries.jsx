import { useState } from 'react';

const Inquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');

  // Mock data for inquiries
  const inquiries = [
    {
      id: 1,
      inquiryId: 'INQ001',
      customer: 'John Doe',
      customerEmail: 'john.doe@email.com',
      customerPhone: '+1 (555) 111-2222',
      subject: 'Question about Tesla Model 3 availability',
      message: 'Hello, I\'m interested in renting the Tesla Model 3. Could you tell me if it\'s available for November 15-20? Also, what is the charging time?',
      carName: 'Tesla Model 3',
      carId: 'C001',
      date: '2024-10-07 10:30',
      status: 'pending',
      priority: 'medium',
      response: null,
      responseDate: null
    },
    {
      id: 2,
      inquiryId: 'INQ002',
      customer: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      customerPhone: '+1 (555) 222-3333',
      subject: 'BMW X5 rental inquiry',
      message: 'Hi, I need a large SUV for a family trip. Is the BMW X5 available for October 20-25? What is the maximum capacity?',
      carName: 'BMW X5',
      carId: 'C002',
      date: '2024-10-06 14:15',
      status: 'responded',
      priority: 'high',
      response: 'Hello Jane, the BMW X5 is available for those dates. It can seat up to 7 people comfortably. The daily rate is $155/day. Let me know if you\'d like to proceed with the booking!',
      responseDate: '2024-10-06 15:45'
    },
    {
      id: 3,
      inquiryId: 'INQ003',
      customer: 'Mike Johnson',
      customerEmail: 'mike.johnson@email.com',
      customerPhone: '+1 (555) 333-4444',
      subject: 'Honda Civic - Fuel efficiency question',
      message: 'I\'m planning a long road trip and considering the Honda Civic. What is the average fuel consumption?',
      carName: 'Honda Civic',
      carId: 'C003',
      date: '2024-10-05 09:20',
      status: 'responded',
      priority: 'low',
      response: 'Hi Mike, the Honda Civic has excellent fuel efficiency with an average of 35-40 MPG on the highway. It\'s perfect for long road trips!',
      responseDate: '2024-10-05 10:00'
    },
    {
      id: 4,
      inquiryId: 'INQ004',
      customer: 'Sarah Williams',
      customerEmail: 'sarah.williams@email.com',
      customerPhone: '+1 (555) 444-5555',
      subject: 'Mercedes C-Class availability',
      message: 'Is the Mercedes C-Class available for this weekend (October 12-14)? I need it for a special event.',
      carName: 'Mercedes C-Class',
      carId: 'C004',
      date: '2024-10-04 16:30',
      status: 'pending',
      priority: 'high',
      response: null,
      responseDate: null
    },
    {
      id: 5,
      inquiryId: 'INQ005',
      customer: 'Tom Brown',
      customerEmail: 'tom.brown@email.com',
      customerPhone: '+1 (555) 555-6666',
      subject: 'Toyota Camry - Insurance coverage',
      message: 'Does the rental include insurance? What coverage is provided?',
      carName: 'Toyota Camry',
      carId: 'C005',
      date: '2024-10-03 11:45',
      status: 'responded',
      priority: 'medium',
      response: 'Hello Tom, yes, basic insurance is included in the rental price. We also offer optional comprehensive coverage for additional protection. I can provide more details if you\'re interested.',
      responseDate: '2024-10-03 13:20'
    },
    {
      id: 6,
      inquiryId: 'INQ006',
      customer: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      customerPhone: '+1 (555) 666-7777',
      subject: 'Tesla Model 3 - Charging station locations',
      message: 'I\'m interested in the Tesla Model 3. Where are the nearest charging stations?',
      carName: 'Tesla Model 3',
      carId: 'C001',
      date: '2024-10-02 08:15',
      status: 'responded',
      priority: 'low',
      response: 'Hi Emily, there are several charging stations nearby. I can provide you with a map of charging locations. The car also comes with a charging adapter for standard outlets.',
      responseDate: '2024-10-02 09:00'
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'responded':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'closed':
        return `${baseClasses} bg-gray-100 text-gray-800`;
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

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setResponseText(inquiry.response || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
    setResponseText('');
  };

  const handleSendResponse = () => {
    if (selectedInquiry && responseText.trim()) {
      // Handle send response logic
      console.log('Sending response to inquiry:', selectedInquiry.id, responseText);
      closeModal();
    }
  };

  const handleMarkAsClosed = (inquiryId) => {
    // Handle mark as closed logic
    console.log('Marking inquiry as closed:', inquiryId);
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.inquiryId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalInquiries = inquiries.length;
  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const respondedCount = inquiries.filter(i => i.status === 'responded').length;
  const highPriorityCount = inquiries.filter(i => i.priority === 'high' && i.status === 'pending').length;

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600">Receive inquiries and send responses to customers</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inquiries</p>
              <p className="text-2xl font-bold text-blue-600">{totalInquiries}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-green-600">{respondedCount}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by customer, subject, or inquiry ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Inquiry ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Subject</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Car</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Priority</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInquiries.map((inquiry) => (
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
                    <div className="font-medium text-gray-900 text-sm max-w-xs truncate">{inquiry.subject}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{inquiry.message}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{inquiry.carName}</div>
                    <div className="text-xs text-gray-500">{inquiry.carId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{inquiry.date.split(' ')[0]}</div>
                    <div className="text-xs text-gray-500">{inquiry.date.split(' ')[1]}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getPriorityBadge(inquiry.priority)}>
                      {inquiry.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(inquiry.status)}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(inquiry)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {inquiry.status === 'pending' ? 'Respond' : 'View'}
                      </button>
                      {inquiry.status === 'responded' && (
                        <button
                          onClick={() => handleMarkAsClosed(inquiry.id)}
                          className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                        >
                          Close
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
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
            </div>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
          </div>
        </div>
      </div>

      {/* Modal for viewing/responding to inquiry */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Inquiry Details - {selectedInquiry.inquiryId}</h2>
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
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{selectedInquiry.date}</p>
                  </div>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Subject</h3>
                  <div className="flex items-center space-x-2">
                    <span className={getPriorityBadge(selectedInquiry.priority)}>{selectedInquiry.priority}</span>
                    <span className={getStatusBadge(selectedInquiry.status)}>{selectedInquiry.status}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{selectedInquiry.subject}</p>
                <div className="bg-white rounded p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Car:</span> {selectedInquiry.carName} ({selectedInquiry.carId})
                </div>
              </div>

              {/* Previous Response */}
              {selectedInquiry.response && (
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Your Previous Response</h3>
                    <span className="text-xs text-gray-500">{selectedInquiry.responseDate}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInquiry.response}</p>
                </div>
              )}

              {/* Response Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedInquiry.response ? 'Update Response' : 'Your Response'}
                </label>
                <textarea
                  rows="6"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your response here..."
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {selectedInquiry.response ? 'Update Response' : 'Send Response'}
                </button>
                {selectedInquiry.status === 'responded' && (
                  <button
                    onClick={() => handleMarkAsClosed(selectedInquiry.id)}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Mark as Closed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;

