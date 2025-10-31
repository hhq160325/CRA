const SettingsPage = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
      <p className="text-gray-600 mb-6">Manage your profile preferences and account configuration.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Profile</h3>
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-700">Display name</span>
              <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Your name" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Phone</span>
              <input type="tel" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="(+84) 000-000-000" />
            </label>
            <button type="button" className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save changes</button>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Security</h3>
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-700">New password</span>
              <input type="password" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="••••••" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Confirm password</span>
              <input type="password" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="••••••" />
            </label>
            <button type="button" className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Update password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;


