import { useState } from 'react';
import { Link } from 'react-router-dom';

const RentalHistoryPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [rentalHistory] = useState([
    {
      id: 1,
      carName: 'TOYOTA RAIZE 2023',
      type: 'SUV',
      brand: 'Toyota',
      plateNo: '30A-12345',
      rentDay: '2024-02-15',
      status: 'Paid',
      paymentDate: '2024-02-20'
    },
    {
      id: 2,
      carName: 'KIA CARNIVAL PREMIUM 2022',
      type: 'MPV',
      brand: 'Kia',
      plateNo: '51B-67890',
      rentDay: '2024-05-03',
      status: 'UnPaid',
      paymentDate: 'No Payment'
    },
    {
      id: 3,
      carName: 'HYUNDAI ACCENT 2021',
      type: 'Sedan',
      brand: 'Hyundai',
      plateNo: '43C-11223',
      rentDay: '2024-07-21',
      status: 'Paid',
      paymentDate: '2024-07-29'
    },
    {
      id: 4,
      carName: 'HYUNDAI KONA 2019',
      type: 'SUV',
      brand: 'Hyundai',
      plateNo: '50D-33446',
      rentDay: '2024-09-12',
      status: 'UnPaid',
      paymentDate: 'No Payment'
    },
    {
      id: 5,
      carName: 'SUZUKI ERTIGA 2022',
      type: 'MPV',
      brand: 'Suzuki',
      plateNo: '60E-55667',
      rentDay: '2024-12-28',
      status: 'Paid',
      paymentDate: '2024-12-28'
    },
    {
      id: 6,
      carName: 'MITSUBISHI XPANDER 2019',
      type: 'MPV',
      brand: 'Mitsubishi',
      plateNo: '34F-77889',
      rentDay: '2025-01-19',
      status: 'UnPaid',
      paymentDate: 'No Payment'
    },
    {
      id: 7,
      carName: 'KIA CERATO 2020',
      type: 'Sedan',
      brand: 'Kia',
      plateNo: '88G-99001',
      rentDay: '2025-03-07',
      status: 'Paid',
      paymentDate: '2025-03-07'
    },
    {
      id: 8,
      carName: 'TOYOTA COROLLA ALTIS 2022',
      type: 'Sedan',
      brand: 'Toyota',
      plateNo: '29H-22334',
      rentDay: '2025-04-25',
      status: 'UnPaid',
      paymentDate: 'No Payment'
    },
    {
      id: 9,
      carName: 'FORD ECOSPORT 2020',
      type: 'SUV',
      brand: 'Ford',
      plateNo: '47K-44556',
      rentDay: '2025-06-14',
      status: 'Paid',
      paymentDate: '2025-06-14'
    },
    {
      id: 10,
      carName: 'HYUNDAI CUSTIN LUXURY 2024',
      type: 'MPV',
      brand: 'Hyundai',
      plateNo: '15L-66778',
      rentDay: '2025-07-30',
      status: 'UnPaid',
      paymentDate: 'No Payment'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Rental History</h1>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <div className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-white shadow-sm min-h-screen lg:min-h-screen`}>
          <div className="px-6 pt-4">
            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">MAIN MENU</h2>
              <nav className="space-y-2">
                <Link to="/profile" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>
                <Link to="/profile/rental-history" className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Rental History
                </Link>
                <Link to="/profile/favourite-car" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favourite Car
                </Link>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Reimburse
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  Inbox
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Calendar
                </a>
              </nav>
            </div>

            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">PREFERENCES</h2>
              <nav className="space-y-2">
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help & Center
                </a>
                <div className="flex items-center px-3 py-2 text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="flex-1">Dark Mode</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-blue-600 rounded-full shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full shadow transform translate-x-5 translate-y-1"></div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            <div className="pt-4 border-t">
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h1 className="hidden lg:block text-xl font-semibold text-gray-900">Rental History</h1>
              <h1 className="lg:hidden text-lg font-semibold text-gray-900">Rental History</h1>
            </div>
            
            {/* Mobile Card View */}
            <div className="lg:hidden">
              {rentalHistory.map((rental) => (
                <div key={rental.id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{rental.carName}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      rental.status === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rental.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{rental.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brand:</span>
                      <span>{rental.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plate No:</span>
                      <span>{rental.plateNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rent Day:</span>
                      <span>{rental.rentDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Date:</span>
                      <span>{rental.paymentDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Plat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rentalHistory.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.carName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.plateNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.rentDay}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          rental.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {rental.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.paymentDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalHistoryPage;