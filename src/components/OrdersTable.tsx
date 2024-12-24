import React, { useState, useEffect } from 'react';
import { FaSort, FaSearch, FaTrash, FaEye, FaFilePdf, FaTimes } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Order {
  OrderId: string;
  ProductsBought: string;
  Quantity: string;
  Total: string;
  Status: string;
  Comments: string;
  DateOfCreation: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Address: string;
  ZipCode: string;
  Country: string;
  PaymentMethod: string;
}

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' }>({
    key: 'DateOfCreation',
    direction: 'desc',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://respizenmedical.com/fiori/get_orders.php');
        const data = await response.json();

        if (data.status === 'success') {
          setOrders(data.data);
          setFilteredOrders(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Échec de la récupération des commandes.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = orders.filter(order =>
      ['FirstName', 'LastName', 'OrderId', 'Email'].some(key =>
        (order[key as keyof Order] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Sort functionality
  const handleSort = (key: keyof Order) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sorted = [...filteredOrders].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredOrders(sorted);
  };

  // Handle deleting an order
  const handleDelete = async () => {
    if (!orderToDelete) return;

    try {
      const response = await fetch('https://respizenmedical.com/fiori/delete_orders.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ OrderId: orderToDelete }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setOrders(prev => prev.filter(order => order.OrderId !== orderToDelete));
        setFilteredOrders(prev => prev.filter(order => order.OrderId !== orderToDelete));
        setOrderToDelete(null);
        setIsDeleteConfirmModalOpen(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert('Échec de la suppression de la commande.');
    }
  };

  // Generate PDF of order details
  const generatePDF = (order: Order) => {
    const doc = new jsPDF();

    // Title and styles
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(112, 0, 0); // Set #700100
    doc.text(`Détails de la commande #${order.OrderId}`, 14, 20);

    // Table with order details
    doc.autoTable({
      startY: 30,
      head: [['Propriété', 'Valeur']],
      body: [
        ['N° Commande', order.OrderId],
        ['Nom du Client', `${order.FirstName} ${order.LastName}`],
        ['Adresse Email', order.Email],
        ['Numéro de Téléphone', order.PhoneNumber],
        ['Adresse', order.Address],
        ['Code Postal', order.ZipCode],
        ['Pays', order.Country],
        ['Méthode de Paiement', order.PaymentMethod],
        ['Quantité', order.Quantity],
        ['Total', order.Total],
        ['Statut', order.Status],
        ['Date de Création', new Date(order.DateOfCreation).toLocaleDateString('fr-FR')],
        ['Commentaires', order.Comments || 'Pas de commentaires'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [112, 0, 0] }, // #700100
    });

    doc.save(`Commande_${order.OrderId}.pdf`);
  };

  if (isLoading) return <div className="flex justify-center p-8">Chargement des commandes...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">

      {/* Search Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#700100]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#700100] text-white">
            <tr>
              <th onClick={() => handleSort('OrderId')} className="px-6 py-3 text-left cursor-pointer">N° Commande</th>
              <th onClick={() => handleSort('FirstName')} className="px-6 py-3 text-left cursor-pointer">Client</th>
              <th onClick={() => handleSort('Total')} className="px-6 py-3 text-left cursor-pointer">Total</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.OrderId}>
                <td className="px-6 py-4">{order.OrderId}</td>
                <td className="px-6 py-4">{`${order.FirstName} ${order.LastName}`}</td>
                <td className="px-6 py-4">{order.Total}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order); // Set selected order
                      setIsModalOpen(true);   // Open modal
                    }}
                    className="p-2 bg-[#700100] text-white rounded hover:bg-red-800"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      setOrderToDelete(order.OrderId);
                      setIsDeleteConfirmModalOpen(true);
                    }}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => generatePDF(order)}
                    className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <FaFilePdf />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-[#700100] mb-4">Détails de la commande #{selectedOrder.OrderId}</h2>
            <div className="space-y-2">
              {Object.entries(selectedOrder).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
