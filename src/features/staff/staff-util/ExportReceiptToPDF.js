import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export rental receipt to PDF
 * @param {Object} rental - Rental data object
 * @param {Object} options - Additional options for PDF generation
 */
export const exportReceiptToPDF = (rental, options = {}) => {
  const {
    companyName = 'Car Rental Service',
    companyAddress = '123 Main Street, City, State 12345',
    companyPhone = '+1 (555) 000-0000',
    companyEmail = 'info@carrental.com',
    logoUrl = null,
  } = options;

  const doc = new jsPDF('p', 'mm', 'a4'); // Explicitly set A4 format
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15; // Reduced top margin

  // Determine receipt type based on booking status
  const isCompleted = rental.status?.toLowerCase() === 'completed';
  const isConfirmed = rental.status?.toLowerCase() === 'confirmed';
  const receiptType = isCompleted ? 'FINAL PAYMENT RECEIPT' : isConfirmed ? 'BOOKING FEE RECEIPT' : 'RENTAL RECEIPT';

  // Header - Company Info
  doc.setFontSize(16); // Reduced from 20
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 6; // Reduced spacing
  doc.setFontSize(9); // Reduced from 10
  doc.setFont('helvetica', 'normal');
  doc.text(companyAddress, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 4; // Reduced spacing
  doc.text(`Phone: ${companyPhone} | Email: ${companyEmail}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 6; // Reduced spacing
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, pageWidth - 15, yPosition);

  // Receipt Title
  yPosition += 7; // Reduced spacing
  doc.setFontSize(14); // Reduced from 16
  doc.setFont('helvetica', 'bold');
  doc.text(receiptType, pageWidth / 2, yPosition, { align: 'center' });

  // Booking Information
  yPosition += 7; // Reduced spacing
  doc.setFontSize(10); // Reduced from 11
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Information', 15, yPosition);

  yPosition += 5; // Reduced spacing
  doc.setFontSize(9); // Reduced from 10
  doc.setFont('helvetica', 'normal');

  const bookingInfo = [
    ['Booking ID:', rental.bookingId],
    ['Invoice ID:', rental.invoiceId || 'N/A'],
    ['Booking Date:', new Date(rental.startDate).toLocaleDateString()],
    ['Status:', rental.status.toUpperCase()],
  ];

  bookingInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPosition);
    yPosition += 5; // Reduced from 6
  });

  // Customer Information
  yPosition += 3; // Reduced spacing
  doc.setFontSize(10); // Reduced from 11
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Information', 15, yPosition);

  yPosition += 5; // Reduced spacing
  doc.setFontSize(9); // Reduced from 10
  doc.setFont('helvetica', 'normal');

  const customerInfo = [
    ['Name:', rental.customer],
    ['Email:', rental.customerEmail],
    ['Phone:', rental.customerPhone],
  ];

  customerInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPosition);
    yPosition += 5; // Reduced from 6
  });

  // Vehicle Information
  yPosition += 3; // Reduced spacing
  doc.setFontSize(10); // Reduced from 11
  doc.setFont('helvetica', 'bold');
  doc.text('Vehicle Information', 15, yPosition);

  yPosition += 5; // Reduced spacing
  doc.setFontSize(9); // Reduced from 10
  doc.setFont('helvetica', 'normal');

  const vehicleInfo = [
    ['Car Model:', rental.carName],
    ['License Plate:', rental.licensePlate],
    ['Car ID:', rental.carId],
  ];

  vehicleInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPosition);
    yPosition += 5; // Reduced from 6
  });

  // Rental Period - TEMPORARILY COMMENTED OUT
  // yPosition += 3; // Reduced spacing
  // doc.setFontSize(10); // Reduced from 11
  // doc.setFont('helvetica', 'bold');
  // doc.text('Rental Period', 15, yPosition);

  // yPosition += 5; // Reduced spacing
  // doc.setFontSize(9); // Reduced from 10
  // doc.setFont('helvetica', 'normal');

  // const rentalPeriod = [
  //   ['Pickup Date:', rental.pickupDate],
  //   ['Return Date:', rental.returnDate],
  //   ['Duration:', `${rental.duration} days`],
  // ];

  // rentalPeriod.forEach(([label, value]) => {
  //   doc.setFont('helvetica', 'bold');
  //   doc.text(label, 15, yPosition);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text(value, 60, yPosition);
  //   yPosition += 5; // Reduced from 6
  // });

  // Payment Details Table
  yPosition += 5; // Reduced spacing
  
  if (isCompleted) {
    // Final Payment Receipt - Show only paid/success fees
    const tableData = [];
    
    // Add booking fee if paid/success
    if (rental.bookingFeePaid > 0 && (rental.bookingFeeStatus === 'paid' || rental.bookingFeeStatus === 'success')) {
      tableData.push(['Booking Fee Payment', `${rental.bookingFeePaid.toLocaleString()} VND`]);
    }
    
    // Add rental fee if paid/success
    if (rental.rentalFeePaid > 0 && (rental.rentalFeeStatus === 'paid' || rental.rentalFeeStatus === 'success')) {
      tableData.push(['Rental Fee Payment', `${rental.rentalFeePaid.toLocaleString()} VND`]);
    }
    
    // Add additional fees if they exist and are paid/success
    if (rental.hasAdditionalFee && rental.additionalFeePaid > 0 && 
        (rental.additionalFeeStatus === 'paid' || rental.additionalFeeStatus === 'success')) {
      tableData.push(['Additional Fee Payment', `${rental.additionalFeePaid.toLocaleString()} VND`]);
    }
    
    // Add extend booking fees if they exist and are paid/success
    if (rental.hasExtendBookingFee && rental.extendBookingFeePaid > 0 && 
        (rental.extendBookingFeeStatus === 'paid' || rental.extendBookingFeeStatus === 'success')) {
      tableData.push(['Extend Booking Fee Payment', `${rental.extendBookingFeePaid.toLocaleString()} VND`]);
    }
    
    // Use the pre-calculated totalPaidAmount from rental data
    const totalPaid = rental.totalPaidAmount || 0;
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Description', 'Amount']],
      body: tableData,
      foot: [
        ['Total Paid:', `${totalPaid.toLocaleString()} VND`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      footStyles: { fillColor: [34, 139, 34], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      margin: { left: 15, right: 15 },
      styles: { cellPadding: 3 }, // Reduced padding
    });
  } else if (isConfirmed) {
    // Booking Fee Receipt - Show only paid/success fees
    const tableData = [];
    
    // Add booking fee if paid/success
    if (rental.bookingFeePaid > 0 && (rental.bookingFeeStatus === 'paid' || rental.bookingFeeStatus === 'success')) {
      tableData.push(['Booking Fee Payment', `${rental.bookingFeePaid.toLocaleString()} VND`]);
      // tableData.push(['Booking Fee Status', (rental.bookingFeeStatus || 'N/A').toUpperCase()]);
      // tableData.push(['Booking Fee Method', rental.bookingFeePaymentMethod || 'N/A']);
    }
    
    // Add rental fee if paid/success
    if (rental.rentalFeePaid > 0 && (rental.rentalFeeStatus === 'paid' || rental.rentalFeeStatus === 'success')) {
      tableData.push(['Rental Fee Payment', `${rental.rentalFeePaid.toLocaleString()} VND`]);
      // tableData.push(['Rental Fee Status', (rental.rentalFeeStatus || 'N/A').toUpperCase()]);
      // tableData.push(['Rental Fee Method', rental.rentalFeePaymentMethod || 'N/A']);
    }
    
    // Add additional fees if they exist and are paid/success
    if (rental.hasAdditionalFee && rental.additionalFeePaid > 0 && 
        (rental.additionalFeeStatus === 'paid' || rental.additionalFeeStatus === 'success')) {
      tableData.push(['Additional Fee Payment', `${rental.additionalFeePaid.toLocaleString()} VND`]);
      // tableData.push(['Additional Fee Status', (rental.additionalFeeStatus || 'N/A').toUpperCase()]);
      // tableData.push(['Additional Fee Method', rental.additionalFeePaymentMethod || 'N/A']);
    }
    
    // Add extend booking fees if they exist and are paid/success
    if (rental.hasExtendBookingFee && rental.extendBookingFeePaid > 0 && 
        (rental.extendBookingFeeStatus === 'paid' || rental.extendBookingFeeStatus === 'success')) {
      tableData.push(['Extend Booking Fee Payment', `${rental.extendBookingFeePaid.toLocaleString()} VND`]);
      // tableData.push(['Extend Booking Fee Status', (rental.extendBookingFeeStatus || 'N/A').toUpperCase()]);
      // tableData.push(['Extend Booking Fee Method', rental.bookingExtensionFeePaymentMethod || 'N/A']);
    }
    
    // Use the pre-calculated totalPaidAmount from rental data
    const totalPaid = rental.totalPaidAmount || 0;
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Description', 'Amount']],
      body: tableData,
      foot: [
        ['Paid Now:', `${totalPaid.toLocaleString()} VND`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      footStyles: { fillColor: [34, 139, 34], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      margin: { left: 15, right: 15 },
      styles: { cellPadding: 3 }, // Reduced padding
    });
  } else {
    // Default Receipt - Show only paid/success fees
    const tableData = [];
    // Use the pre-calculated totalPaidAmount from rental data
    let totalPaid = rental.totalPaidAmount || 0;
    
    // Add booking fee if paid/success
    if (rental.bookingFeePaid > 0 && (rental.bookingFeeStatus === 'paid' || rental.bookingFeeStatus === 'success')) {
      tableData.push(['Booking Fee Payment', `${rental.bookingFeePaid.toLocaleString()} VND`]);
    }
    
    // Add rental fee if paid/success
    if (rental.rentalFeePaid > 0 && (rental.rentalFeeStatus === 'paid' || rental.rentalFeeStatus === 'success')) {
      tableData.push(['Rental Fee Payment', `${rental.rentalFeePaid.toLocaleString()} VND`]);
    }
    
    // Add additional fees if they exist and are paid/success
    if (rental.hasAdditionalFee && rental.additionalFeePaid > 0 && 
        (rental.additionalFeeStatus === 'paid' || rental.additionalFeeStatus === 'success')) {
      tableData.push(['Additional Fee Payment', `${rental.additionalFeePaid.toLocaleString()} VND`]);
    }
    
    // Add extend booking fees if they exist and are paid/success
    if (rental.hasExtendBookingFee && rental.extendBookingFeePaid > 0 && 
        (rental.extendBookingFeeStatus === 'paid' || rental.extendBookingFeeStatus === 'success')) {
      tableData.push(['Extend Booking Fee Payment', `${rental.extendBookingFeePaid.toLocaleString()} VND`]);
    }
    
    // If no paid fees, show a message
    if (tableData.length === 0) {
      tableData.push(['No Paid Fees', 'N/A']);
    }
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Description', 'Amount']],
      body: tableData,
      foot: [
        ['Total Amount:', `${totalPaid.toLocaleString()} VND`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', fontSize: 9 },
      margin: { left: 15, right: 15 },
      styles: { cellPadding: 3 }, // Reduced padding
    });
  }

  yPosition = doc.lastAutoTable.finalY + 5; // Reduced spacing

  // Payment Information
  doc.setFontSize(10); // Reduced from 11
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Information', 15, yPosition);

  yPosition += 5; // Reduced spacing
  doc.setFontSize(9); // Reduced from 10
  doc.setFont('helvetica', 'normal');

  const paymentInfo = [
    ['Payment Type:', isCompleted ? 'Final Payment' : isConfirmed ? 'Booking Fee' : 'Payment'],
  ];

  // Only add fee information if the fee is paid/success
  if (rental.bookingFeeStatus === 'paid' || rental.bookingFeeStatus === 'success') {
    paymentInfo.push(['Booking Fee Status:', (rental.bookingFeeStatus || 'N/A').toUpperCase()]);
    // paymentInfo.push(['Booking Fee Method:', rental.bookingFeePaymentMethod || 'N/A']);
  }

  if (rental.rentalFeeStatus === 'paid' || rental.rentalFeeStatus === 'success') {
    paymentInfo.push(['Rental Fee Status:', (rental.rentalFeeStatus || 'N/A').toUpperCase()]);
    // paymentInfo.push(['Rental Fee Method:', rental.rentalFeePaymentMethod || 'N/A']);
  }

  // Add additional fee information only if it exists and is paid/success
  if (rental.hasAdditionalFee && (rental.additionalFeeStatus === 'paid' || rental.additionalFeeStatus === 'success')) {
    paymentInfo.push(['Additional Fee Status:', (rental.additionalFeeStatus || 'N/A').toUpperCase()]);
    // paymentInfo.push(['Additional Fee Method:', rental.additionalFeePaymentMethod || 'N/A']);
  }

  // Add extend booking fee information only if it exists and is paid/success
  if (rental.hasExtendBookingFee && (rental.extendBookingFeeStatus === 'paid' || rental.extendBookingFeeStatus === 'success')) {
    paymentInfo.push(['Extend Booking Fee Status:', (rental.extendBookingFeeStatus || 'N/A').toUpperCase()]);
    // paymentInfo.push(['Extend Booking Fee Method:', rental.bookingExtensionFeePaymentMethod || 'N/A']);
  }

  // Use the pre-calculated totalPaidAmount from rental data
  const totalPaidAmount = rental.totalPaidAmount || 0;

  paymentInfo.push(['Total Paid Amount:', `${totalPaidAmount.toLocaleString()} VND`]);

  if (isConfirmed && rental.remainingPayment > 0) {
    paymentInfo.push(['Remaining Balance:', `${rental.remainingPayment.toLocaleString()} VND (Due at checkout)`]);
  }

  paymentInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPosition);
    yPosition += 5; // Reduced from 6
  });
  
  // Footer - Only add if there's space, otherwise skip
  const footerHeight = 20;
  const minYPosition = yPosition + 10;
  
  if (minYPosition + footerHeight < pageHeight - 10) {
    yPosition = pageHeight - footerHeight;
  } else {
    yPosition += 8;
  }
  
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, pageWidth - 15, yPosition);

  yPosition += 5;
  doc.setFontSize(8); // Reduced from 9
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 4;
  doc.setFontSize(7); // Reduced from 8
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });

  // Save the PDF
  doc.save(`Receipt_${rental.bookingId}_${new Date().getTime()}.pdf`);
};

/**
 * Print rental receipt
 * @param {Object} rental - Rental data object
 * @param {Object} options - Additional options for printing
 */
export const printReceipt = (rental, options = {}) => {
  const {
    companyName = 'Car Rental Service',
    companyAddress = '123 Main Street, City, State 12345',
    companyPhone = '+1 (555) 000-0000',
    companyEmail = 'info@carrental.com',
  } = options;

  // Determine receipt type based on booking status
  const isCompleted = rental.status?.toLowerCase() === 'completed';
  const isConfirmed = rental.status?.toLowerCase() === 'confirmed';
  const receiptType = isCompleted ? 'FINAL PAYMENT RECEIPT' : isConfirmed ? 'BOOKING FEE RECEIPT' : 'RENTAL RECEIPT';

  const printWindow = window.open('', '_blank');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${receiptType} - ${rental.bookingId}</title>
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          font-size: 12px;
          color: #666;
        }
        .receipt-title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .info-row {
          display: flex;
          padding: 5px 0;
        }
        .info-label {
          font-weight: bold;
          width: 200px;
          color: #555;
          word-wrap: break-word;
        }
        .info-value {
          flex: 1;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #428bca;
          color: white;
          font-weight: bold;
        }
        tfoot td {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #333;
          font-size: 12px;
          color: #666;
        }
        .print-button {
          text-align: center;
          margin: 20px 0;
        }
        .print-button button {
          background-color: #428bca;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
        }
        .print-button button:hover {
          background-color: #3071a9;
        }
      </style>
    </head>
    <body>
  
      <div class="header">
        <h1>${companyName}</h1>
        <p>${companyAddress}</p>
        <p>Phone: ${companyPhone} | Email: ${companyEmail}</p>
      </div>
      
      <div class="receipt-title">${receiptType}</div>
      
      <div class="section">
        <div class="section-title">Booking Information</div>
        <div class="info-row">
          <div class="info-label">Booking ID:</div>
          <div class="info-value">${rental.bookingId}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Invoice ID:</div>
          <div class="info-value">${rental.invoiceId || 'N/A'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Booking Date:</div>
          <div class="info-value">${new Date(rental.startDate).toLocaleDateString()}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Status:</div>
          <div class="info-value">${rental.status.toUpperCase()}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="info-row">
          <div class="info-label">Name:</div>
          <div class="info-value">${rental.customer}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-value">${rental.customerEmail}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Phone:</div>
          <div class="info-value">${rental.customerPhone}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Vehicle Information</div>
        <div class="info-row">
          <div class="info-label">Car Model:</div>
          <div class="info-value">${rental.carName}</div>
        </div>
        <div class="info-row">
          <div class="info-label">License Plate:</div>
          <div class="info-value">${rental.licensePlate}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Car ID:</div>
          <div class="info-value">${rental.carId}</div>
        </div>
      </div>
      
      <!-- Rental Period - TEMPORARILY COMMENTED OUT -->
      <!--
      <div class="section">
        <div class="section-title">Rental Period</div>
        <div class="info-row">
          <div class="info-label">Pickup Date:</div>
          <div class="info-value">${rental.pickupDate}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Return Date:</div>
          <div class="info-value">${rental.returnDate}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Duration:</div>
          <div class="info-value">${rental.duration} days</div>
        </div>
      </div>
      -->
      
      ${isCompleted ? `
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(rental.bookingFeePaid > 0 && (rental.bookingFeeStatus === 'paid' || rental.bookingFeeStatus === 'success')) ? `
          <tr>
            <td>Booking Fee Payment</td>
            <td>${(rental.bookingFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(rental.rentalFeePaid > 0 && (rental.rentalFeeStatus === 'paid' || rental.rentalFeeStatus === 'success')) ? `
          <tr>
            <td>Rental Fee Payment</td>
            <td>${(rental.rentalFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(rental.hasAdditionalFee && rental.additionalFeePaid > 0 && (rental.additionalFeeStatus === 'paid' || rental.additionalFeeStatus === 'success')) ? `
          <tr>
            <td>Additional Fee Payment</td>
            <td>${(rental.additionalFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(rental.hasExtendBookingFee && rental.extendBookingFeePaid > 0 && (rental.extendBookingFeeStatus === 'paid' || rental.extendBookingFeeStatus === 'success')) ? `
          <tr>
            <td>Extend Booking Fee Payment</td>
            <td>${(rental.extendBookingFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
        </tbody>
        <tfoot>
          <tr>
            <td style="text-align: right; background-color: #228b22; color: white;">Total Paid:</td>
            <td style="background-color: #228b22; color: white;">${(rental.totalPaidAmount || 0).toLocaleString()} VND</td>
          </tr>
        </tfoot>
      </table>
      ` : isConfirmed ? `
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(rental.bookingFeePaid > 0 && (rental.bookingFeeStatus === 'paid' || rental.bookingFeeStatus === 'success')) ? `
          <tr>
            <td>Booking Fee Payment</td>
            <td>${(rental.bookingFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(rental.rentalFeePaid > 0 && (rental.rentalFeeStatus === 'paid' || rental.rentalFeeStatus === 'success')) ? `
          <tr>
            <td>Rental Fee Payment</td>
            <td>${(rental.rentalFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(rental.hasAdditionalFee && rental.additionalFeePaid > 0 && (rental.additionalFeeStatus === 'paid' || rental.additionalFeeStatus === 'success')) ? `
          <tr>
            <td>Additional Fee Payment</td>
            <td>${(rental.additionalFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(rental.hasExtendBookingFee && rental.extendBookingFeePaid > 0 && (rental.extendBookingFeeStatus === 'paid' || rental.extendBookingFeeStatus === 'success')) ? `
          <tr>
            <td>Extend Booking Fee Payment</td>
            <td>${(rental.extendBookingFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
        </tbody>
        <tfoot>
          <tr>
            <td style="text-align: right; background-color: #228b22; color: white;">Total Paid:</td>
            <td style="background-color: #228b22; color: white;">${(rental.totalPaidAmount || 0).toLocaleString()} VND</td>
          </tr>
        </tfoot>
      </table>
      ` : `
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(rental.bookingFeePaid > 0 && (rental.bookingFeeStatus === 'paid' || rental.bookingFeeStatus === 'success')) ? `
          <tr>
            <td>Booking Fee Payment</td>
            <td>${(rental.bookingFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(rental.rentalFeePaid > 0 && (rental.rentalFeeStatus === 'paid' || rental.rentalFeeStatus === 'success')) ? `
          <tr>
            <td>Rental Fee Payment</td>
            <td>${(rental.rentalFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(rental.hasAdditionalFee && rental.additionalFeePaid > 0 && (rental.additionalFeeStatus === 'paid' || rental.additionalFeeStatus === 'success')) ? `
          <tr>
            <td>Additional Fee Payment</td>
            <td>${(rental.additionalFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(rental.hasExtendBookingFee && rental.extendBookingFeePaid > 0 && (rental.extendBookingFeeStatus === 'paid' || rental.extendBookingFeeStatus === 'success')) ? `
          <tr>
            <td>Extend Booking Fee Payment</td>
            <td>${(rental.extendBookingFeePaid || 0).toLocaleString()} VND</td>
          </tr>
          ` : ''}
          ${(() => {
            let hasPaidFees = false;
            if (rental.bookingFeeStatus === 'paid' || rental.bookingFeeStatus === 'success') hasPaidFees = true;
            if (rental.rentalFeeStatus === 'paid' || rental.rentalFeeStatus === 'success') hasPaidFees = true;
            if (rental.hasAdditionalFee && (rental.additionalFeeStatus === 'paid' || rental.additionalFeeStatus === 'success')) hasPaidFees = true;
            if (rental.hasExtendBookingFee && (rental.extendBookingFeeStatus === 'paid' || rental.extendBookingFeeStatus === 'success')) hasPaidFees = true;
            
            if (!hasPaidFees) {
              return '<tr><td>No Paid Fees</td><td>N/A</td></tr>';
            }
            return '';
          })()}
        </tbody>
        <tfoot>
          <tr>
            <td style="text-align: right;">Total Amount:</td>
            <td>${(rental.totalPaidAmount || 0).toLocaleString()} VND</td>
          </tr>
        </tfoot>
      </table>
      `}
      
      <div class="section">
        <div class="section-title">Payment Information</div>
        <div class="info-row">
          <div class="info-label">Payment Type:</div>
          <div class="info-value">${isCompleted ? 'Final Payment' : isConfirmed ? 'Booking Fee' : 'Payment'}</div>
        </div>
        ${(rental.bookingFeeStatus === 'paid' || rental.bookingFeeStatus === 'success') ? `
        <div class="info-row">
          <div class="info-label">Booking Fee Status:</div>
          <div class="info-value">${(rental.bookingFeeStatus || 'N/A').toUpperCase()}</div>
        </div>
        ` : ''}
        ${(rental.rentalFeeStatus === 'paid' || rental.rentalFeeStatus === 'success') ? `
        <div class="info-row">
          <div class="info-label">Rental Fee Status:</div>
          <div class="info-value">${(rental.rentalFeeStatus || 'N/A').toUpperCase()}</div>
        </div>
        ` : ''}
        ${(rental.hasAdditionalFee && (rental.additionalFeeStatus === 'paid' || rental.additionalFeeStatus === 'success')) ? `
        <div class="info-row">
          <div class="info-label">Additional Fee Status:</div>
          <div class="info-value">${(rental.additionalFeeStatus || 'N/A').toUpperCase()}</div>
        </div>
        ` : ''}
        ${(rental.hasExtendBookingFee && (rental.extendBookingFeeStatus === 'paid' || rental.extendBookingFeeStatus === 'success')) ? `
        <div class="info-row">
          <div class="info-label">Extend Booking Fee Status:</div>
          <div class="info-value">${(rental.extendBookingFeeStatus || 'N/A').toUpperCase()}</div>
        </div>
        ` : ''}
        <div class="info-row">
          <div class="info-label">Total Paid Amount:</div>
          <div class="info-value">${(rental.totalPaidAmount || 0).toLocaleString()} VND</div>
        </div>
        ${isConfirmed && rental.remainingPayment > 0 ? `
        <div class="info-row">
          <div class="info-label">Remaining Balance:</div>
          <div class="info-value">${rental.remainingPayment.toLocaleString()} VND (Due at checkout)</div>
        </div>
        ` : ''}
      </div>
      
      <div class="footer">
        <p><strong>Thank you for your business!</strong></p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
      </div>

            <div class="print-button no-print">
        <button onclick="window.print()">Print Receipt</button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export default {
  exportReceiptToPDF,
  printReceipt,
};
