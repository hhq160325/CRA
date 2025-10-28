import { useState } from 'react';

const RentalHistoryPage = () => {
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
    <div>
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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${rental.status === 'Paid'
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
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${rental.status === 'Paid'
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
  );
};

export default RentalHistoryPage;