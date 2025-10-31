
const PendingVerifications = () => {
  // Mock data for pending verifications
  const pendingItems = [
    {
      id: 1,
      type: 'Car Owner',
      name: 'John Smith',
      email: 'john.smith@email.com',
      submittedAt: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'Car Owner',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      submittedAt: '4 hours ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'Customer',
      name: 'Mike Wilson',
      email: 'mike.w@email.com',
      submittedAt: '1 day ago',
      priority: 'low'
    },
    {
      id: 4,
      type: 'Car Owner',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      submittedAt: '2 days ago',
      priority: 'medium'
    }
  ];

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

  const getTypeIcon = (type) => {
    if (type === 'Car Owner') {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Pending Verifications</h2>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
          {pendingItems.length} pending
        </span>
      </div>

      <div className="space-y-4">
        {pendingItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              {getTypeIcon(item.type)}
              <div>
                <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.email}</p>
                <p className="text-xs text-gray-400">{item.submittedAt}</p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span className={getPriorityBadge(item.priority)}>
                {item.priority}
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                Review
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All Pending Verifications
        </button>
      </div>
    </div>
  );
};

export default PendingVerifications;