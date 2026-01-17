import { useState } from 'react';

const CustomerFeedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [carFilter, setCarFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for customer feedback
  const feedbacks = [
    {
      id: 1,
      bookingId: 'BK001',
      carId: 'C001',
      carName: 'Tesla Model 3',
      licensePlate: 'ABC-1234',
      customer: 'Alice Cooper',
      customerEmail: 'alice.cooper@email.com',
      rating: 5,
      feedback: 'Great experience! The car was in excellent condition and the owner was very responsive. Highly recommend!',
      date: '2024-10-05',
      rentalPeriod: '2024-10-01 to 2024-10-05',
      status: 'published',
      ownerResponse: 'Thank you for your kind words! We\'re glad you enjoyed your trip.',
      ownerResponseDate: '2024-10-05'
    },
    {
      id: 2,
      bookingId: 'BK002',
      carId: 'C002',
      carName: 'BMW X5',
      licensePlate: 'XYZ-5678',
      customer: 'Bob Johnson',
      customerEmail: 'bob.johnson@email.com',
      rating: 4,
      feedback: 'Nice car, had a great trip. The only issue was a minor scratch on the rear bumper which I reported.',
      date: '2024-09-30',
      rentalPeriod: '2024-09-25 to 2024-09-30',
      status: 'published',
      ownerResponse: 'Thank you for your feedback. We\'ve noted the issue and will address it in the next maintenance.',
      ownerResponseDate: '2024-09-30'
    },
    {
      id: 3,
      bookingId: 'BK003',
      carId: 'C003',
      carName: 'Honda Civic',
      licensePlate: 'DEF-9012',
      customer: 'Carol Smith',
      customerEmail: 'carol.smith@email.com',
      rating: 5,
      feedback: 'Clean and fuel efficient car. Perfect for city driving. Owner was very helpful with the pickup process.',
      date: '2024-09-23',
      rentalPeriod: '2024-09-20 to 2024-09-23',
      status: 'published',
      ownerResponse: null,
      ownerResponseDate: null
    },
    {
      id: 4,
      bookingId: 'BK004',
      carId: 'C004',
      carName: 'Mercedes C-Class',
      licensePlate: 'GHI-3456',
      customer: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      rating: 5,
      feedback: 'Luxury car experience, highly recommend. Everything was perfect from booking to return.',
      date: '2024-09-18',
      rentalPeriod: '2024-09-15 to 2024-09-18',
      status: 'published',
      ownerResponse: 'Thank you for choosing our service. We appreciate your business!',
      ownerResponseDate: '2024-09-18'
    },
    {
      id: 5,
      bookingId: 'BK005',
      carId: 'C005',
      carName: 'Toyota Camry',
      licensePlate: 'JKL-7890',
      customer: 'Eva Brown',
      customerEmail: 'eva.brown@email.com',
      rating: 5,
      feedback: 'Reliable and comfortable car. Great value for money. Will definitely rent again!',
      date: '2024-09-12',
      rentalPeriod: '2024-09-10 to 2024-09-12',
      status: 'published',
      ownerResponse: null,
      ownerResponseDate: null
    },
    {
      id: 6,
      bookingId: 'BK006',
      carId: 'C001',
      carName: 'Tesla Model 3',
      licensePlate: 'ABC-1234',
      customer: 'Frank Miller',
      customerEmail: 'frank.miller@email.com',
      rating: 4,
      feedback: 'Electric car saves a lot on fuel. Charging stations were easy to find. Only wish it had more range.',
      date: '2024-09-02',
      rentalPeriod: '2024-08-28 to 2024-09-02',
      status: 'pending',
      ownerResponse: null,
      ownerResponseDate: null
    },
    {
      id: 7,
      bookingId: 'BK007',
      carId: 'C002',
      carName: 'BMW X5',
      licensePlate: 'XYZ-5678',
      customer: 'Grace Lee',
      customerEmail: 'grace.lee@email.com',
      rating: 5,
      feedback: 'Spacious and comfortable SUV. Perfect for family trips. Owner was very accommodating with schedule.',
      date: '2024-08-24',
      rentalPeriod: '2024-08-20 to 2024-08-24',
      status: 'published',
      ownerResponse: 'Thank you! We\'re happy you and your family enjoyed the trip.',
      ownerResponseDate: '2024-08-24'
    }
  ];

  // Get unique car names for filter
  const uniqueCars = [...new Set(feedbacks.map(feedback => feedback.carName))];

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">{rating}/5</span>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'hidden':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleRespond = (feedbackId, response) => {
    // Handle response logic
    // console.log('Responding to feedback:', feedbackId, response);
    closeModal();
  };

  // const handleHideFeedback = (feedbackId) => {
  //   // Handle hide feedback logic
  //   console.log('Hiding feedback:', feedbackId);
  // };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || feedback.rating.toString() === ratingFilter;
    const matchesCar = carFilter === 'all' || feedback.carName === carFilter;
    return matchesSearch && matchesRating && matchesCar;
  });

  // Calculate statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks).toFixed(1);
  const publishedCount = feedbacks.filter(f => f.status === 'published').length;
  const pendingResponseCount = feedbacks.filter(f => !f.ownerResponse && f.status === 'published').length;

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
          <p className="text-gray-600">Read feedback left by customers for your cars</p>
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
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-blue-600">{totalFeedbacks}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 8l-4-4V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{averageRating} ⭐</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Response</p>
              <p className="text-2xl font-bold text-orange-600">{pendingResponseCount}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
                placeholder="Search by customer, car, or booking ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={carFilter}
              onChange={(e) => setCarFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Cars</option>
              {uniqueCars.map((car) => (
                <option key={car} value={car}>{car}</option>
              ))}
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{feedback.customer}</h3>
                      <p className="text-sm text-gray-500">{feedback.customerEmail}</p>
                    </div>
                    <div className="flex items-center">
                      {getRatingStars(feedback.rating)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={getStatusBadge(feedback.status)}>{feedback.status}</span>
                    <span className="text-sm text-gray-500">{feedback.date}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">{feedback.carName}</span>
                    <span className="text-gray-400">•</span>
                    <span>{feedback.licensePlate}</span>
                    <span className="text-gray-400">•</span>
                    <span>{feedback.rentalPeriod}</span>
                  </div>
                  <p className="text-gray-700 italic">"{feedback.feedback}"</p>
                </div>

                {feedback.ownerResponse && (
                  <div className="bg-blue-50 rounded-lg p-4 mt-3 border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-semibold text-blue-900">Your Response</span>
                      <span className="text-xs text-gray-500">({feedback.ownerResponseDate})</span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.ownerResponse}</p>
                  </div>
                )}

                {!feedback.ownerResponse && feedback.status === 'published' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => openModal(feedback)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Respond to Feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center py-4">
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

      {/* Modal for responding to feedback */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Respond to Feedback</h2>
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
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="mb-2">
                  <span className="font-semibold text-gray-900">{selectedFeedback.customer}</span>
                  <span className="text-sm text-gray-500 ml-2">{selectedFeedback.date}</span>
                </div>
                <div className="mb-2">{getRatingStars(selectedFeedback.rating)}</div>
                <p className="text-gray-700 italic">"{selectedFeedback.feedback}"</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your response here..."
                  defaultValue={selectedFeedback.ownerResponse || ''}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const response = document.querySelector('textarea').value;
                    handleRespond(selectedFeedback.id, response);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerFeedback;

