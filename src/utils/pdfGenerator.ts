import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate, formatCurrency } from './formatters';

export const generateOrderPDF = (order: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(90, 12, 26); // #5a0c1a
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Order Invoice', 20, 25);
  
  doc.setFontSize(12);
  doc.text(`#${order.OrderId}`, doc.internal.pageSize.width - 40, 25);

  // Customer Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text('Customer Information', 20, 60);
  
  doc.setFontSize(10);
  doc.text(`${order.FirstName} ${order.LastName}`, 20, 70);
  doc.text(order.Email, 20, 77);
  doc.text(order.PhoneNumber, 20, 84);
  
  // Shipping Address
  doc.setFontSize(14);
  doc.text('Shipping Address', 120, 60);
  
  doc.setFontSize(10);
  doc.text(order.Address, 120, 70);
  doc.text(`${order.ZipCode}, ${order.Country}`, 120, 77);

  // Order Details
  doc.setFontSize(14);
  doc.text('Order Details', 20, 110);

  // Products Table
  const products = order.ProductsBought.split(',').map((product: string) => product.trim());
  const quantities = order.Quantity.split(',').map((qty: string) => qty.trim());

  const tableData = products.map((product: string, index: number) => [
    product,
    quantities[index] || '',
    ''  // Price per unit (if available)
  ]);

  doc.autoTable({
    startY: 120,
    head: [['Product', 'Quantity', 'Price']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [90, 12, 26],
      textColor: [255, 255, 255]
    },
    styles: {
      fontSize: 10
    }
  });

  // Total and Payment Info
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(12);
  doc.text(`Payment Method: ${order.PaymentMethod}`, 20, finalY);
  doc.text(`Order Date: ${formatDate(order.DateOfCreation)}`, 20, finalY + 7);
  doc.text(`Status: ${order.Status}`, 20, finalY + 14);
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: ${formatCurrency(parseFloat(order.Total))}`, 
    doc.internal.pageSize.width - 60, 
    finalY + 14
  );

  // Footer
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for your business!', 
    doc.internal.pageSize.width / 2, 
    doc.internal.pageSize.height - 20, 
    { align: 'center' }
  );

  // Save the PDF
  doc.save(`Order_${order.OrderId}.pdf`);
};