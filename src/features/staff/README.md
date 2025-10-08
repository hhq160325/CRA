# Staff Management Interface

A comprehensive staff management interface that reuses the admin design patterns for consistency and ease of use.

## Features

### 1. Staff Dashboard (`/staff`)
- Platform overview with key metrics
- Pending verifications widget
- Recent activities feed
- Consistent layout with admin dashboard

### 2. Car Owner Management (`/staff/car-owners`)
- View and manage all car owner accounts
- Filter by status (active, pending, suspended)
- Search functionality
- Account status management
- Verification status tracking

### 3. Booking Monitoring (`/staff/bookings`)
- Real-time booking activity monitoring
- Filter by status, date, customer, or car
- Update booking status and add notes
- Payment status tracking
- Export functionality

### 4. Customer Management (`/staff/customers`)
- Comprehensive customer account management
- Customer tier system (Bronze, Silver, Gold)
- Compliance issue tracking
- Bulk messaging capabilities
- Account verification management

### 5. Notification Center (`/staff/notifications`)
- Send system-wide notifications
- Target specific audiences (all users, customers, car owners)
- Priority levels and delivery methods
- Notification history and analytics
- Schedule notifications for later

## Design Patterns

The staff interface reuses the following admin design patterns:

- **Layout Structure**: Same sidebar navigation and main content area
- **Color Scheme**: Consistent blue primary color and gray backgrounds
- **Component Styling**: Matching cards, tables, badges, and buttons
- **Typography**: Same font weights and sizes
- **Spacing**: Consistent padding and margins
- **Interactive Elements**: Hover states and transitions

## Components

### Layout Components
- `StaffLayout`: Main layout with sidebar navigation
- `StaffDashboard`: Dashboard with metrics and activities

### Management Components
- `CarOwnerManagement`: Car owner account management
- `CustomerManagement`: Customer account management
- `BookingMonitoring`: Booking activity monitoring
- `NotificationCenter`: System notification management

### Widget Components
- `DashboardMetrics`: Platform overview metrics
- `PendingVerifications`: Pending verification items
- `RecentActivities`: Recent platform activities

## State Management

Uses Redux Toolkit with the following slices:
- `staffSlice`: Manages all staff-related state
- Actions for updating car owner status, customer accounts, booking status, and notifications

## Routes

```javascript
/staff                    - Staff Dashboard
/staff/car-owners        - Car Owner Management
/staff/customers         - Customer Management  
/staff/bookings          - Booking Monitoring
/staff/notifications     - Notification Center
```

## Usage

1. Import the staff components in your router:
```javascript
import { StaffLayout, StaffDashboard, CarOwnerManagement, CustomerManagement, BookingMonitoring, NotificationCenter } from '../features/staff';
```

2. Add the staff routes:
```javascript
<Route path="/staff" element={<StaffLayout />}>
  <Route index element={<StaffDashboard />} />
  <Route path="car-owners" element={<CarOwnerManagement />} />
  <Route path="customers" element={<CustomerManagement />} />
  <Route path="bookings" element={<BookingMonitoring />} />
  <Route path="notifications" element={<NotificationCenter />} />
</Route>
```

3. Add the staff reducer to your store:
```javascript
import { staffSlice } from '../features/staff/staffSlice';

const store = configureStore({
  reducer: {
    // ... other reducers
    staff: staffSlice.reducer,
  },
});
```

## Mock Data

All components include mock data for demonstration purposes. Replace with actual API calls in production.