// COMMENTED OUT: Booking API import (temporarily disabled)
// import { getAllBookings, getAllReports } from '../../../api/bookingApi';
import { getAllReports } from '../../../api/bookingApi';
// COMMENTED OUT: Payment API import (no longer needed for reports)
// import { getAllPayments } from '../../../api/paymentApi';
import { sortByLatest } from '../../../../../shared/utils/SortByLatest';
import axios from 'axios';
import { USER_ENDPOINTS, CAR_ENDPOINTS } from '../../../../../config/api';

// COMMENTED OUT: Payment mapping functions (no longer needed for reports)
// export const createPaymentMap = (paymentsArray) => {
//   const paymentMap = {};
//   paymentsArray.forEach(payment => {
//     const invoiceId = payment.invoiceId || payment.orderCode;
//     // Only include payments with "item": "Booking Fee"
//     if (invoiceId && payment.item === "Booking Fee") {
//       paymentMap[invoiceId] = payment;
//     }
//   });
//   return paymentMap;
// };

// export const mapPaymentStatus = (payosStatus) => {
//   const status = String(payosStatus).toLowerCase();
//   if (status === 'paid' || status === 'success' || status === 'completed') {
//     return 'success';
//   } else if (status === 'cancelled' || status === 'canceled' || status === 'failed') {
//     return 'cancelled';
//   } else if (status === 'pending' || status === 'processing') {
//     return 'pending';
//   }
//   return status || 'pending';
// };

// COMMENTED OUT: Booking data transformation (temporarily disabled)
// export const transformBookingData = (bookingsArray) => {
//   return bookingsArray.map((booking, index) => {
//     // COMMENTED OUT: Amount, Booking Status, Payment Status related code
//     // const bookingStatus = booking.status ? String(booking.status).toLowerCase() : 'pending';
//     // let paymentStatus = 'pending';
//     // let paidAmount = null;
//     console.log("bookingsArray", bookingsArray);
//
//     // COMMENTED OUT: Payment processing logic
//     // if (booking.invoiceId && paymentMap[booking.invoiceId]) {
//     //   const paymentData = paymentMap[booking.invoiceId];
//     //   // console.log("paymentData",paymentData);
//     //   
//     //   const payosStatus = paymentData.status ? String(paymentData.status).toLowerCase() : '';
//     //
//     //   paidAmount = paymentData.paidAmount || paymentData.amount || paymentData.totalAmount || null;
//     //   console.log("paidAmount",paymentData);
//     //   
//     //   paymentStatus = mapPaymentStatus(payosStatus);
//     // } else if (booking.paymentStatus) {
//     //   paymentStatus = String(booking.paymentStatus).toLowerCase();
//     // }
//     // console.log(paymentMap);
//
//     return {
//       id: booking.id || index + 1,
//       // bookingId: `BK${String(booking.id || index + 1).padStart(3, '0')}`,
//       bookingNumber: booking.bookingNumber,
//       customer: booking.customerName || 'N/A',
//       carOwner: booking.car.owner.fullname || 'N/A',
//       car: booking.carModel || booking.carName || 'N/A',
//       carId: booking.carId,
//       carLicensePlate: booking.carLicensePlate,
//       // COMMENTED OUT: Booking status
//       // status: bookingStatus,
//       startDate: booking.pickupTime ? new Date(booking.pickupTime).toISOString().split('T')[0] : 'N/A',
//       endDate: booking.dropoffTime ? new Date(booking.dropoffTime).toISOString().split('T')[0] : 'N/A',
//       // COMMENTED OUT: Amount fields
//       // totalAmount: booking.totalPrice || booking.totalAmount || 0,
//       // paidAmount: paidAmount,
//       // paymentStatus: paymentStatus,
//       customerPhone: booking.user.phoneNumber,
//       customerEmail: booking.user.email,
//       createDate: booking.createDate ? new Date(booking.createDate).toLocaleString() : 'N/A',
//       notes: booking.notes || '',
//       invoiceId: booking.invoiceId
//     };
//   });
// };

// COMMENTED OUT: Booking filtering function (temporarily disabled)
// export const fetchBookingsWithReports = async () => {
//   try {
//     // Fetch both reports and bookings data
//     const [reportsData, bookingsData] = await Promise.all([
//       getAllReports(),
//       getAllBookings()
//     ]);
//
//     const reportsArray = Array.isArray(reportsData) ? reportsData : [];
//     const bookingsArray = Array.isArray(bookingsData) ? bookingsData : [];
//
//     // Create a Set of carId-userId combinations from reports for efficient lookup
//     const reportedCarUserCombinations = new Set(
//       reportsArray.map(report => `${report.carId}-${report.userId}`)
//     );
//
//     // Also create separate sets for individual carIds and userIds for logging
//     const reportedCarIds = new Set(reportsArray.map(report => report.carId));
//     const reportedUserIds = new Set(reportsArray.map(report => report.userId));
//
//     console.log('Reported car IDs:', Array.from(reportedCarIds));
//     console.log('Reported user IDs:', Array.from(reportedUserIds));
//     console.log('Reported car-user combinations:', Array.from(reportedCarUserCombinations));
//
//     // Filter bookings to only include those where both carId AND userId match reports
//     const filteredBookings = bookingsArray.filter(booking => {
//       const bookingCombination = `${booking.carId}-${booking.userId}`;
//       return reportedCarUserCombinations.has(bookingCombination);
//     });
//
//     console.log('Filtered bookings count:', filteredBookings.length);
//     console.log('Total bookings count:', bookingsArray.length);
//
//     // Transform the filtered bookings
//     const transformedData = transformBookingData(filteredBookings);
//
//     // Sort bookings by createDate (latest first)
//     return sortByLatest(transformedData, 'createDate');
//   } catch (error) {
//     console.error('Failed to fetch bookings with reports:', error);
//     throw error;
//   }
// };

// Main function: Fetch reports data using GET_REPORT_CAR API with enriched user and car data
export const fetchBookingsWithReports = async () => {
  try {
    console.log('Fetching reports data using GET_REPORT_CAR API...');
    
    const token = localStorage.getItem('jwtToken');
    
    // Fetch reports, users, and cars data in parallel
    const [reportsData, usersResponse, carsResponse] = await Promise.all([
      getAllReports(),
      axios.get(USER_ENDPOINTS.GET_ALL_USERS, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
      axios.get(CAR_ENDPOINTS.GET_ALL_CARS, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ]);
    
    const reportsArray = Array.isArray(reportsData) ? reportsData : [];
    const allUsers = usersResponse.data;
    const allCars = carsResponse.data;
    
    console.log('Reports data fetched:', reportsArray.length, 'reports');
    console.log('Users data fetched:', allUsers.length, 'users');
    console.log('Cars data fetched:', allCars.length, 'cars');
    
    // Create user map by id
    const userMap = {};
    allUsers.forEach(user => {
      userMap[user.id] = user;
    });
    
    // Create car map by id
    const carMap = {};
    allCars.forEach(car => {
      carMap[car.id] = car;
    });
    
    // Transform reports with enriched user and car data
    const transformedData = transformReportDataWithEnrichment(reportsArray, userMap, carMap);
    
    console.log('Transformed report data:', transformedData);
    
    // Sort reports by createDate (latest first)
    return sortByLatest(transformedData, 'createDate');
  } catch (error) {
    console.error('Failed to fetch reports data:', error);
    throw error;
  }
};

// Transform report data for component consumption
export const transformReportData = (reportsArray) => {
  return reportsArray.map(report => ({
    id: report.id,
    reportNo: report.reportNo,
    title: report.title,
    content: report.content,
    createDate: new Date(report.createDate).toLocaleString(),
    status: report.status,
    reportedCarId: report.reportedCarId,
    reporterId: report.reporterId,
  }));
};

// Transform report data with enriched user and car information
export const transformReportDataWithEnrichment = (reportsArray, userMap, carMap) => {
  return reportsArray.map(report => {
    const user = userMap[report.reporterId];
    const car = carMap[report.reportedCarId];
    
    // Get reporter name - prioritize full name over username over email
    let reporterName = 'N/A';
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      if (fullName) {
        reporterName = fullName;
      } else if (user.username) {
        reporterName = user.username;
      } else if (user.email) {
        reporterName = user.email;
      } else {
        reporterName = report.reporterId ? `User ${report.reporterId.slice(0, 8)}` : 'Unknown User';
      }
    } else {
      reporterName = report.reporterId ? `User ${report.reporterId.slice(0, 8)}...` : 'Unknown User';
    }
    
    // Get car information
    const carName = car ? `${car.manufacturer || ''} ${car.model || ''}`.trim() : 'N/A';
    const carModel = car?.model || 'N/A';
    const carManufacturer = car?.manufacturer || 'N/A';
    const carLicensePlate = car?.licensePlate || 'N/A';
    const carOwner = car?.owner?.fullname || car?.owner?.username || 'N/A';
    const carEmail = car?.owner?.email || 'N/A';
    const carPhoneNumber = car?.owner?.phoneNumber || 'N/A';
    console.log("car", car?.owner);
    
    return {
      id: report.id,
      reportNo: report.reportNo,
      title: report.title,
      content: report.content,
      createDate: new Date(report.createDate).toLocaleString(),
      status: report.status,
      reportedCarId: report.reportedCarId,
      reporterId: report.reporterId,
      reporterName: reporterName,
      reporterEmail: user?.email || 'N/A',
      reporterPhone: user?.phoneNumber || 'N/A',
      carName: carName,
      carModel: carModel,
      carOwner: carOwner,
      carEmail: carEmail,
      carPhoneNumber: carPhoneNumber,
      carManufacturer: carManufacturer,
      carLicensePlate: carLicensePlate
    };
  });
};

// Fetch and transform car reports
export const fetchReportsData = async () => {
  try {
    const reportsData = await getAllReports();
    const reportsArray = Array.isArray(reportsData) ? reportsData : [];
    
    // Transform and sort reports by createDate (latest first)
    const transformedData = transformReportData(reportsArray);
    return sortByLatest(transformedData, 'createDate');
  } catch (error) {
    console.error('Failed to fetch reports data:', error);
    throw error;
  }
};