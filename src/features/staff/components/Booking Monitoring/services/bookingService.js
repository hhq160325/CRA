import { getAllBookings } from '../../../api/bookingApi';
import { getAllPayments } from '../../../api/paymentApi';

export const createPaymentMap = (paymentsArray) => {
  const paymentMap = {};
  paymentsArray.forEach(payment => {
    const invoiceId = payment.invoiceId || payment.orderCode;
    if (invoiceId) {
      paymentMap[invoiceId] = payment;
    }
  });
  return paymentMap;
};

export const mapPaymentStatus = (payosStatus) => {
  const status = String(payosStatus).toLowerCase();
  if (status === 'paid' || status === 'success' || status === 'completed') {
    return 'paid';
  } else if (status === 'cancelled' || status === 'canceled') {
    return 'failed';
  } else if (status === 'pending' || status === 'processing') {
    return 'pending';
  }
  return status || 'pending';
};

export const transformBookingData = (bookingsArray, paymentMap) => {
  return bookingsArray.map((booking, index) => {
    const bookingStatus = booking.status ? String(booking.status).toLowerCase() : 'pending';
    let paymentStatus = 'pending';
    let paidAmount = null;

    if (booking.invoiceId && paymentMap[booking.invoiceId]) {
      const paymentData = paymentMap[booking.invoiceId];
      const payosStatus = paymentData.status ? String(paymentData.status).toLowerCase() : '';
      
      paidAmount = paymentData.paidAmount || paymentData.amount || paymentData.totalAmount || null;
      paymentStatus = mapPaymentStatus(payosStatus);
    } else if (booking.paymentStatus) {
      paymentStatus = String(booking.paymentStatus).toLowerCase();
    }
    console.log(paymentMap);
    
    return {
      id: booking.id || index + 1,
      // bookingId: `BK${String(booking.id || index + 1).padStart(3, '0')}`,
      bookingNumber: booking.bookingNumber,
      customer: booking.customerName || 'N/A',
      carOwner: booking.car.owner.fullname || 'N/A',
      car: booking.carModel || booking.carName || 'N/A',
      status: bookingStatus,
      startDate: booking.pickupTime ? new Date(booking.pickupTime).toISOString().split('T')[0] : 'N/A',
      endDate: booking.dropoffTime ? new Date(booking.dropoffTime).toISOString().split('T')[0] : 'N/A',
      // totalAmount: booking.totalPrice || booking.totalAmount || 0,
      paidAmount: paidAmount,
      paymentStatus: paymentStatus,
      createDate: booking.createDate ? new Date(booking.createDate).toLocaleString() : 'N/A',
      notes: booking.notes || '',
      invoiceId: booking.invoiceId
    };
  });
};

export const fetchBookingsWithPayments = async () => {
  const bookingsData = await getAllBookings();
  
  let paymentsData = [];
  try {
    paymentsData = await getAllPayments();
    console.log('Successfully fetched payments');
  } catch (paymentError) {
    console.warn('Failed to fetch payments (continuing without payment data):', paymentError.message);
  }

  const bookingsArray = Array.isArray(bookingsData) ? bookingsData : [];
  const paymentsArray = Array.isArray(paymentsData) ? paymentsData : [];
  
  const paymentMap = createPaymentMap(paymentsArray);
  return transformBookingData(bookingsArray, paymentMap);
};