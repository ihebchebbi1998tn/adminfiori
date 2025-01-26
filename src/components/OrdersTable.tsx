import React, { useState, useEffect } from 'react';
import { Search, SortAsc, Eye, FileText, CheckCircle, Clock, Truck, Package } from 'lucide-react';
import { Order } from '../types/order';
import { OrderDetailsModal } from './OrderDetailsModal';
import { formatCurrency } from '../utils/formatters';
import { generateOrderPDF } from '../utils/pdfGenerator';

export const OrdersTable: React.FC = () => {
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
        const timestamp = new Date().getTime(); 
        const response = await fetch(`https://www.fioriforyou.com/backfiori/get_users_orders.php?cache_buster=${timestamp}`);
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'reussie':
        return <CheckCircle className="text-green-500" />;
      case 'processing':
        return <Clock className="text-yellow-500" />;
      case 'shipped':
        return <Truck className="text-blue-500" />;
      default:
        return <Package className="text-gray-500" />;
    }
  };

  const calculateFinalTotal = (order: Order) => {
    let additionalFee = 0;
    order.items.forEach(item => {
      if (item.personalization && item.personalization !== '-') {
        additionalFee += 30;
      }
    });
    return order.price_details.final_total + additionalFee;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'reussie':
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
      case 'reussie':
        return 'Réussie';
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
                  {formatCurrency(calculateFinalTotal(order))}
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
                      onClick={() => generateOrderPDF(order)}
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
          onGeneratePDF={() => generateOrderPDF(selectedOrder)}
        />
      )}
    </div>
  );
};

export default OrdersTable;
