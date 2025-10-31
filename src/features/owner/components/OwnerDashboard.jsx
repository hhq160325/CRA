const OwnerDashboard = () => {
  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900">Car Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Maintenance</h2>
          <p className="text-gray-600">Track upcoming maintenance and receive notifications.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Usage & Mileage</h2>
          <p className="text-gray-600">Monitor mileage and usage statistics by car.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Rental Activity</h2>
          <p className="text-gray-600">View recent bookings and history.</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;


