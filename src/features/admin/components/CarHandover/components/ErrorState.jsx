const ErrorState = ({ error }) => {
  return (
    <div className="p-8 space-y-6 space-y-reverse-0 min-h-full bg-gray-50">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-gray-600">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;