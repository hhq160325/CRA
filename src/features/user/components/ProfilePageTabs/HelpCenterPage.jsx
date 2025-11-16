const HelpCenterPage = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Help & Center</h2>
      <p className="text-gray-600 mb-6">Find answers, get support, and learn how to use the app.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button type="button" className="text-left w-full border rounded-lg p-4 hover:shadow">
          <h3 className="font-medium text-gray-900">Account & Profile</h3>
          <p className="text-sm text-gray-600 mt-1">Update account info, password, and preferences.</p>
        </button>
        <button type="button" className="text-left w-full border rounded-lg p-4 hover:shadow">
          <h3 className="font-medium text-gray-900">Booking & Rentals</h3>
          <p className="text-sm text-gray-600 mt-1">Create bookings, manage trips, and payments.</p>
        </button>
        <button type="button" className="text-left w-full border rounded-lg p-4 hover:shadow">
          <h3 className="font-medium text-gray-900">Troubleshooting</h3>
          <p className="text-sm text-gray-600 mt-1">Fix common issues and contact support.</p>
        </button>
      </div>

      <div className="mt-8">
        <h3 className="font-medium text-gray-900 mb-2">Still need help?</h3>
        <div className="flex items-center gap-3">
          <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Contact support</button>
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Open a ticket</button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;


