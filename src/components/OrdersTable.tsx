import React, { useState, useEffect } from 'react';
import { FaSort, FaSearch, FaTrash, FaEye, FaFilePdf, FaTimes, FaCheckCircle, FaClock, FaBan } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/logo.png'; // You'll need to add your logo

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

  useEffect(() => {
    const filtered = orders.filter(order =>
      ['FirstName', 'LastName', 'OrderId', 'Email'].some(key =>
        (order[key as keyof Order] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'cancelled':
        return <FaBan className="text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generatePDF = (order: Order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(112, 0, 0);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Company Logo & Info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('COMPANY NAME', 20, 25);
    
    // Order Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text(`Commande #${order.OrderId}`, 20, 60);
    
    // Customer Details Section
    doc.setFontSize(12);
    doc.setTextColor(112, 0, 0);
    doc.text('INFORMATIONS CLIENT', 20, 80);
    doc.setTextColor(0, 0, 0);
    doc.text(`${order.FirstName} ${order.LastName}`, 20, 90);
    doc.text(order.Address, 20, 100);
    doc.text(`${order.ZipCode}, ${order.Country}`, 20, 110);
    doc.text(`Email: ${order.Email}`, 20, 120);
    doc.text(`Tél: ${order.PhoneNumber}`, 20, 130);

    // Order Details
    doc.setTextColor(112, 0, 0);
    doc.text('DÉTAILS DE LA COMMANDE', 20, 150);
    
    // Products Table
    const products = order.ProductsBought.split(', ');
    const tableData = products.map(product => [product, '1', order.Total]);
    
    doc.autoTable({
      startY: 160,
      head: [['Produit', 'Quantité', 'Prix']],
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

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Date de commande: ${formatDate(order.DateOfCreation)}`, 20, finalY);
    doc.text(`Méthode de paiement: ${order.PaymentMethod}`, 20, finalY + 10);
    doc.text(`Status: ${order.Status}`, 20, finalY + 20);

    // Save PDF
    doc.save(`Commande_${order.OrderId}.pdf`);
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
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#700100] bg-gray-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#700100]">
            <tr>
              <th onClick={() => handleSort('OrderId')} 
                  className="group px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                <div className="flex items-center gap-2">
                  N° Commande
                  <FaSort className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th onClick={() => handleSort('FirstName')} 
                  className="group px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                <div className="flex items-center gap-2">
                  Client
                  <FaSort className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th onClick={() => handleSort('Status')} 
                  className="group px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                <div className="flex items-center gap-2">
                  Status
                  <FaSort className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th onClick={() => handleSort('Total')} 
                  className="group px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                <div className="flex items-center gap-2">
                  Total
                  <FaSort className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.OrderId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.OrderId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{`${order.FirstName} ${order.LastName}`}</span>
                    <span className="text-xs text-gray-500">{order.Email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.Status)}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.Status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' :
                      order.Status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.Status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(order.Total))}
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
                      <FaEye />
                    </button>
                    <button
                      onClick={() => generatePDF(order)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="Générer PDF"
                    >
                      <FaFilePdf />
                    </button>
                    <button
                      onClick={() => {
                        setOrderToDelete(order.OrderId);
                        setIsDeleteConfirmModalOpen(true);
                      }}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#700100]">
                Commande #{selectedOrder.OrderId}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-[#700100]">Informations Client</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nom:</span> {selectedOrder.FirstName} {selectedOrder.LastName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.Email}</p>
                  <p><span className="font-medium">Téléphone:</span> {selectedOrder.PhoneNumber}</p>
                  <p><span className="font-medium">Adresse:</span> {selectedOrder.Address}</p>
                  <p><span className="font-medium">Code Postal:</span> {selectedOrder.ZipCode}</p>
                  <p><span className="font-medium">Pays:</span> {selectedOrder.Country}</p>
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-[#700100]">Détails de la Commande</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Produits:</span> {selectedOrder.ProductsBought}</p>
                  <p><span className="font-medium">Quantité:</span> {selectedOrder.Quantity}</p>
                  <p><span className="font-medium">Total:</span> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(selectedOrder.Total))}</p>
                  <p><span className="font-medium">Méthode de Paiement:</span> {selectedOrder.PaymentMethod}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.DateOfCreation)}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedOrder.Status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedOrder.Status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedOrder.Status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            {selectedOrder.Comments && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg text-[#700100] mb-2">Commentaires</h3>
                <p className="text-gray-600">{selectedOrder.Comments}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => generatePDF(selectedOrder)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaFilePdf /> Générer PDF
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteConfirmModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FaTrash /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;