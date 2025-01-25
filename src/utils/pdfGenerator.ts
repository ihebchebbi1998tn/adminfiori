import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Order } from '../types/order';
import { formatCurrency, formatDate } from '../utils/formatters';

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 0;

  const addNewPage = () => {
    doc.addPage();
    yPosition = 0;
    addHeader();
  };

  const checkAndAddNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > doc.internal.pageSize.height - 20) {
      addNewPage();
      return true;
    }
    return false;
  };

  const addHeader = () => {
    doc.setFillColor(112, 1, 0);
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`Commande ${order.order_id}`, 10, 15);
    doc.setFontSize(10);
    doc.text(`Créée le ${formatDate(order.created_at)}`, 10, 25);
    
    yPosition = 40;
  };

  addHeader();

  // Customer Information Section
  doc.setFillColor(247, 247, 247);
  doc.rect(10, yPosition, pageWidth - 20, 70, 'F');
  
  doc.setTextColor(112, 1, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Informations client', 15, yPosition + 10);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');

  const customerInfo = [
    [`Nom: ${order.user_details.first_name} ${order.user_details.last_name}`, `Email: ${order.user_details.email}`],
    [`Téléphone: ${order.user_details.phone}`, `Adresse: ${order.user_details.address}, ${order.user_details.zip_code}`],
    [`Pays: ${order.user_details.country}`, order.user_details.order_note !== "-" ? `Note: ${order.user_details.order_note}` : '']
  ];

  let customerY = yPosition + 20;
  customerInfo.forEach(row => {
    doc.text(row[0], 15, customerY);
    doc.text(row[1], pageWidth / 2, customerY);
    customerY += 10;
  });

  yPosition = customerY + 20;

  // Ordered Items Section
  checkAndAddNewPage(60);
  
  doc.setFillColor(247, 247, 247);
  doc.rect(10, yPosition, pageWidth - 20, 30, 'F');
  
  doc.setTextColor(112, 1, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  yPosition += 10;
  // Items Table
  const itemsTableHeaders = [['Article', 'Taille', 'Couleur', 'Personalisation', 'Qté', 'Prix unit.', 'Total']];
  const itemsTableData = order.items.map(item => [
    item.name,
    item.size,
    item.color,
    item.personalization,
    item.quantity.toString(),
    formatCurrency(item.price),
    formatCurrency(item.total_price)
  ]);

  doc.autoTable({
    startY: yPosition,
    head: itemsTableHeaders,
    body: itemsTableData,
    margin: { left: 10, right: 10 },
    styles: { fontSize: 9 },
    headStyles: { fillColor: [112, 1, 0] }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Price Details Section
  checkAndAddNewPage(80);
  
  doc.setFillColor(247, 247, 247);
  doc.rect(10, yPosition, pageWidth - 20, 60, 'F');

  doc.setTextColor(112, 1, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Détails du prix', 15, yPosition + 10);

  const priceDetails = [
    ['Sous-total:', formatCurrency(order.price_details.subtotal)],
    ['Frais de livraison:', formatCurrency(order.price_details.shipping_cost)],
    ...(order.price_details.has_newsletter_discount ? [['Réduction newsletter:', `-${formatCurrency(order.price_details.newsletter_discount_amount)}`]] : []),
    ['Total:', formatCurrency(order.price_details.final_total)]
  ];

  let priceY = yPosition + 20;
  priceDetails.forEach((detail, index) => {
    doc.setFont(undefined, index === priceDetails.length - 1 ? 'bold' : 'normal');
    doc.text(detail[0], 15, priceY);
    doc.text(detail[1], pageWidth - 60, priceY);
    priceY += 10;
  });

  yPosition = priceY + 20;

  // Payment and Order Status Section
  checkAndAddNewPage(80);
  
  // Payment Information
  doc.setFillColor(247, 247, 247);
  doc.rect(10, yPosition, pageWidth / 2 - 15, 60, 'F');
  
  doc.setTextColor(112, 1, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Informations de paiement', 15, yPosition + 10);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Méthode: ${order.payment.method === 'credit_card' ? 'Carte bancaire' : order.payment.method}`, 15, yPosition + 25);
  doc.text(`Statut: ${order.payment.status === 'completed' ? 'Complété' : order.payment.status}`, 15, yPosition + 35);
  
  if (order.payment.completed_at) {
    doc.text(`Payé le: ${formatDate(order.payment.completed_at)}`, 15, yPosition + 45);
  }

  // Order Status
  doc.setFillColor(247, 247, 247);
  doc.rect(pageWidth / 2 + 5, yPosition, pageWidth / 2 - 15, 60, 'F');
  
  doc.setTextColor(112, 1, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Statut de la commande', pageWidth / 2 + 10, yPosition + 10);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Statut: ${order.order_status.status}`, pageWidth / 2 + 10, yPosition + 25);
  
  if (order.order_status.shipped_at) {
    doc.text(`Expédié le: ${formatDate(order.order_status.shipped_at)}`, pageWidth / 2 + 10, yPosition + 35);
  }
  
  if (order.order_status.delivered_at) {
    doc.text(`Livré le: ${formatDate(order.order_status.delivered_at)}`, pageWidth / 2 + 10, yPosition + 45);
  }

  // Footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} sur ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  // Save the PDF
  doc.save(`Commande_${order.order_id}.pdf`);
};
