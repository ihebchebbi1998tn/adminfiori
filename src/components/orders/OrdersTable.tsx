import React, { useState, useEffect } from 'react';
import { FaSort, FaSearch, FaEye, FaFilePdf } from 'react-icons/fa';
import OrderDetailsModal from './OrderDetailsModal';
import { generateOrderPDF } from '../../utils/pdfGenerator';
import { Badge } from '../ui/Badge';
import { formatDate, formatCurrency } from '../../utils/formatters';

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

const OrdersTable = () => {
  // ... (keep existing state and effects)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[200px] max-w-md relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]/20"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              onChange={(e) => handleSearch(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]/20 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('OrderId')}>
                <div className="flex items-center gap-2">
                  Order ID
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('FirstName')}>
                <div className="flex items-center gap-2">
                  Customer
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('Total')}>
                <div className="flex items-center gap-2">
                  Total
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('Status')}>
                <div className="flex items-center gap-2">
                  Status
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('DateOfCreation')}>
                <div className="flex items-center gap-2">
                  Date
                  <FaSort className="text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.OrderId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-[#5a0c1a]">#{order.OrderId}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{order.FirstName} {order.LastName}</div>
                    <div className="text-gray-500">{order.Email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(parseFloat(order.Total))}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getStatusColor(order.Status)}>
                    {order.Status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {formatDate(order.DateOfCreation)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-[#5a0c1a] hover:bg-[#5a0c1a]/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => generateOrderPDF(order)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <FaFilePdf className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersTable;