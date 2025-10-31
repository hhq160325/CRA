export const Placeholder = ({ title, description }) => (
  <div className="p-8 min-h-full bg-gray-50">
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export const MaintenanceSchedule = () => (
  <Placeholder title="Maintenance Schedule" description="Track maintenance schedule and view notifications for each car." />
);

export const UsageTracking = () => (
  <Placeholder title="Usage & Mileage" description="Monitor car usage, mileage and utilization details." />
);

export const RentalHistory = () => (
  <Placeholder title="Car Rental History" description="Browse historical rentals, filter by car and date." />
);

export const CustomerFeedback = () => (
  <Placeholder title="Customer Feedback" description="Read feedback left by customers for your cars." />
);

export const Inquiries = () => (
  <Placeholder title="Inquiries" description="Receive inquiries and send responses to customers." />
);

export const BookingManagement = () => (
  <Placeholder title="Booking Management (Check In/Out)" description="Handle check-in and check-out for active bookings." />
);

export const Payments = () => (
  <Placeholder title="Payments" description="View and manage payouts and payments." />
);


