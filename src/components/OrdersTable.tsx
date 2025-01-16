import React, { useState, useEffect } from 'react';
import { Search, SortAsc, Eye, FileText, X, CheckCircle, Clock, Truck, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Types
interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  zip_code: string;
  order_note: string;
}

interface OrderItem {
  item_id: string; // Matches "item_id" from the API
  name: string; // Matches "name" from the API
  price: number; // Matches "price" from the API
  quantity: number; // Matches "quantity" from the API
  total_price: number; // Matches "total_price" from the API
  image: string; // Matches "image" from the API
  size: string; // Matches "size" from the API
  color: string; // Matches "color" from the API
  personalization: string; // Matches "personalization" from the API
  pack: string; // Matches "pack" from the API
  box: string; // Matches "box" from the API
}


interface PriceDetails {
  subtotal: number;
  shipping_cost: number;
  has_newsletter_discount: boolean;
  newsletter_discount_amount: number;
  final_total: number;
}

interface Payment {
  method: string;
  status: string;
  konnect_payment_url: string | null;
  completed_at: string | null;
}

interface OrderStatus {
  status: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

interface Order {
  id: number;
  order_id: string;
  created_at: string;
  user_details: UserDetails;
  items: OrderItem[];
  price_details: PriceDetails;
  payment: Payment;
  order_status: OrderStatus;
  updated_at: string;
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND'
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Internal Components
const OrderStatusTimeline: React.FC<{ orderStatus: OrderStatus }> = ({ orderStatus }) => {
  const steps = [
    { 
      label: 'En traitement', 
      icon: Package, 
      completed: true,
      date: null 
    },
    { 
      label: 'Expédié', 
      icon: Truck, 
      completed: !!orderStatus.shipped_at,
      date: orderStatus.shipped_at
    },
    { 
      label: 'Livré', 
      icon: CheckCircle, 
      completed: !!orderStatus.delivered_at,
      date: orderStatus.delivered_at
    }
  ];

  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium mt-2">{step.label}</div>
            {step.date && (
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(step.date)}
              </div>
            )}
            {index < steps.length - 1 && (
              <div className={`absolute top-5 left-10 w-[calc(100%-2.5rem)] h-0.5 ${
                steps[index + 1].completed ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderItemsList: React.FC<{ items: OrderItem[] }> = ({ items }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-lg text-[#700100] mb-4">Articles commandés</h3>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.item_id} className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
              }}
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <div className="text-sm text-gray-500 mt-1">
                <span className="mr-4">Taille: {item.size}</span>
                <span>Couleur: {item.color}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                <span className="mr-4">Personnalisation: {item.personalization}</span>
                <span>Pack: {item.pack}</span>
                <span className="ml-4">Box: {item.box}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Quantité: {item.quantity}</span>
                <span className="font-medium">{formatCurrency(item.total_price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const OrderDetailsModal: React.FC<{
  order: Order;
  onClose: () => void;
  onGeneratePDF: () => void;
}> = ({ order, onClose, onGeneratePDF }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#700100]">
            Commande {order.order_id}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-[#700100] mb-4">Informations client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-medium">{`${order.user_details.first_name} ${order.user_details.last_name}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{order.user_details.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium">{order.user_details.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Adresse</p>
                <p className="font-medium">{`${order.user_details.address}, ${order.user_details.zip_code}, ${order.user_details.country}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Note</p>
                <p className="font-medium">{order.user_details.order_note}</p>
              </div>
            </div>
          </div>

          <OrderItemsList items={order.items} />

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-[#700100] mb-4">Détails du prix</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{formatCurrency(order.price_details.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de livraison</span>
                <span className="font-medium">{formatCurrency(order.price_details.shipping_cost)}</span>
              </div>
              {order.price_details.has_newsletter_discount && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction newsletter</span>
                  <span>-{formatCurrency(order.price_details.newsletter_discount_amount)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.price_details.final_total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-[#700100] mb-4">Informations de paiement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Méthode de paiement</p>
                <p className="font-medium capitalize">{order.payment.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut du paiement</p>
                <p className="font-medium capitalize">{order.payment.status}</p>
              </div>
              {order.payment.completed_at && (
                <div>
                  <p className="text-sm text-gray-600">Paiement effectué le</p>
                  <p className="font-medium">{formatDate(order.payment.completed_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onGeneratePDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Générer PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'created_at',
    direction: 'desc',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://respizenmedical.com/fiori/get_users_orders.php');
        const data = await response.json();
        if (data.data) {
          setOrders(data.data);
          setFilteredOrders(data.data);
        } else {
          setError('Aucune commande trouvée');
        }
      } catch (error) {
        setError('Échec du chargement des commandes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      Object.values(order.user_details).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ) || order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sorted = [...filteredOrders].sort((a, b) => {
      let aValue = key.includes('.') ? key.split('.').reduce((obj, k) => obj[k], a) : a[key];
      let bValue = key.includes('.') ? key.split('.').reduce((obj, k) => obj[k], b) : b[key];
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredOrders(sorted);
  };

  const generatePDF = (order: Order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(112, 0, 0);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Company Info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('NOM DE LA SOCIÉTÉ', 20, 25);
    
    // Order Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text(`Commande ${order.order_id}`, 20, 60);
    
    // Customer Details
    doc.setFontSize(12);
    doc.setTextColor(112, 0, 0);
    doc.text('INFORMATIONS CLIENT', 20, 80);
    doc.setTextColor(0, 0, 0);
    doc.text(`${order.user_details.first_name} ${order.user_details.last_name}`, 20, 90);
    doc.text(order.user_details.address, 20, 100);
    doc.text(`${order.user_details.zip_code}, ${order.user_details.country}`, 20, 110);
    doc.text(`Email: ${order.user_details.email}`, 20, 120);
    doc.text(`Téléphone: ${order.user_details.phone}`, 20, 130);

    // Order Items
    doc.setTextColor(112, 0, 0);
    doc.text('ARTICLES COMMANDÉS', 20, 150);
    
    const tableData = order.items.map(item => [
      item.name,
      item.size,
      item.color,
      item.quantity.toString(),
      formatCurrency(item.price),
      formatCurrency(item.price * item.quantity)
    ]);
    
    doc.autoTable({
      startY: 160,
      head: [['Produit', 'Taille', 'Couleur', 'Quantité', 'Prix', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [112, 0, 0],
        fontSize: 12,
        halign: 'center'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      }
    });

    // Price Details
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Sous-total: ${formatCurrency(order.price_details.subtotal)}`, 20, finalY);
    doc.text(`Frais de livraison: ${formatCurrency(order.price_details.shipping_cost)}`, 20, finalY + 10);
    if (order.price_details.has_newsletter_discount) {
      doc.text(`Réduction newsletter: -${formatCurrency(order.price_details.newsletter_discount_amount)}`, 20, finalY + 20);
    }
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total final: ${formatCurrency(order.price_details.final_total)}`, 20, finalY + 35);

    // Save PDF
    doc.save(`Commande_${order.order_id}.pdf`);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="text-green-500" />;
      case 'processing':
        return <Clock className="text-yellow-500" />;
      case 'shipped':
        return <Truck className="text-blue-500" />;
      default:
        return <Package className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'Livré';
      case 'processing':
        return 'En traitement';
      case 'shipped':
        return 'Expédié';
      default:
        return status;
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#700100]"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par ID de commande, nom ou email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#700100] bg-gray-50"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#700100]">
            <tr>
              <th onClick={() => handleSort('order_id')} 
                  className="group px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                <div className="flex items-center gap-2">
                  ID Commande
                  <SortAsc className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th onClick={() => handleSort('user_details.first_name')} 
                  className="group px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                <div className="flex items-center gap-2">
                  Client
                  <SortAsc className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th onClick={() => handleSort('order_status.status')} 
                  className="group px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                <div className="flex items-center gap-2">
                  Statut
                  <SortAsc className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th onClick={() => handleSort('price_details.final_total')} 
                  className="group px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                <div className="flex items-center gap-2">
                  Total
                  <SortAsc className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.order_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {`${order.user_details.first_name} ${order.user_details.last_name}`}
                    </span>
                    <span className="text-xs text-gray-500">{order.user_details.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.order_status.status)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.order_status.status)}`}>
                      {getStatusText(order.order_status.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(order.price_details.final_total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-[#700100] text-white rounded-lg hover:bg-red-800 transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => generatePDF(order)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="Générer PDF"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
          onGeneratePDF={() => generatePDF(selectedOrder)}
        />
      )}
    </div>
  );
};

export default OrdersTable;
