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

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header - Company Info
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(companyAddress, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  doc.text(`Phone: ${companyPhone} | Email: ${companyEmail}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  
  // Receipt Title
  yPosition += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RENTAL RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
  
  // Booking Information
  yPosition += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Information', 15, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
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
    yPosition += 6;
  });
  
  // Customer Information
  yPosition += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Information', 15, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
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
    yPosition += 6;
  });
  
  // Vehicle Information
  yPosition += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Vehicle Information', 15, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
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
    yPosition += 6;
  });
  
  // Rental Period
  yPosition += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Rental Period', 15, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const rentalPeriod = [
    ['Pickup Date:', rental.pickupDate],
    ['Return Date:', rental.returnDate],
    ['Duration:', `${rental.duration} days`],
  ];
  
  rentalPeriod.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPosition);
    yPosition += 6;
  });
  
  // Payment Details Table
  yPosition += 10;
  autoTable(doc, {
    startY: yPosition,
    head: [['Description', 'Rate', 'Days', 'Amount']],
    body: [
      ['Daily Rental Rate', `$${rental.dailyRate}`, rental.duration, `$${(rental.dailyRate * rental.duration).toLocaleString()}`],
    ],
    foot: [
      ['', '', 'Total Amount:', `$${rental.paidAmount.toLocaleString()}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
    margin: { left: 15, right: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Payment Information
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Information', 15, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const paymentInfo = [
    ['Payment Status:', rental.paymentStatus.toUpperCase()],
    ['Payment Method:', rental.paymentMethod],
    ['Paid Amount:', `$${rental.paidAmount.toLocaleString()}`],
  ];
  
  paymentInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPosition);
    yPosition += 6;
  });
  
  // Footer
  yPosition = doc.internal.pageSize.getHeight() - 30;
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  
  yPosition += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  doc.setFontSize(8);
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

  const printWindow = window.open('', '_blank');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - ${rental.bookingId}</title>
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
          width: 150px;
          color: #555;
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
      <div class="print-button no-print">
        <button onclick="window.print()">Print Receipt</button>
      </div>
      
      <div class="header">
        <h1>${companyName}</h1>
        <p>${companyAddress}</p>
        <p>Phone: ${companyPhone} | Email: ${companyEmail}</p>
      </div>
      
      <div class="receipt-title">RENTAL RECEIPT</div>
      
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
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Rate</th>
            <th>Days</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Daily Rental Rate</td>
            <td>$${rental.dailyRate}</td>
            <td>${rental.duration}</td>
            <td>$${(rental.dailyRate * rental.duration).toLocaleString()}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align: right;">Total Amount:</td>
            <td>$${rental.paidAmount.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
      
      <div class="section">
        <div class="section-title">Payment Information</div>
        <div class="info-row">
          <div class="info-label">Payment Status:</div>
          <div class="info-value">${rental.paymentStatus.toUpperCase()}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Payment Method:</div>
          <div class="info-value">${rental.paymentMethod}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Paid Amount:</div>
          <div class="info-value">$${rental.paidAmount.toLocaleString()}</div>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>Thank you for your business!</strong></p>
        <p>This is a computer-generated receipt and does not require a signature.</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
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
