import React from 'react';
import { X, Package, MapPin, CreditCard, MessageSquare } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl relative overflow-hidden">
        {/* Header */}
        <div className="bg-[#5a0c1a] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Order #{order.OrderId}</h2>
              <p className="text-white/80 mt-1">{formatDate(order.DateOfCreation)}</p>
            </div>
            <Badge className={`text-sm ${
              order.Status === 'completed' ? 'bg-green-500 text-white' :
              order.Status === 'pending' ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {order.Status}
            </Badge>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#5a0c1a]">
                <Package className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Customer Information</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p><span className="text-gray-500">Name:</span> {order.FirstName} {order.LastName}</p>
                <p><span className="text-gray-500">Email:</span> {order.Email}</p>
                <p><span className="text-gray-500">Phone:</span> {order.PhoneNumber}</p>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#5a0c1a]">
                <MapPin className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Shipping Information</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p><span className="text-gray-500">Address:</span> {order.Address}</p>
                <p><span className="text-gray-500">Zip Code:</span> {order.ZipCode}</p>
                <p><span className="text-gray-500">Country:</span> {order.Country}</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#5a0c1a]">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Order Details</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p><span className="text-gray-500">Payment Method:</span> {order.PaymentMethod}</p>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="space-y-2">
                  {order.ProductsBought.split(',').map((product: string, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{product.trim()}</span>
                      <span className="text-gray-600">
                        x{order.Quantity.split(',')[index]?.trim() || '1'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 my-3"></div>
                <p className="text-xl font-bold text-[#5a0c1a]">
                  Total: {formatCurrency(parseFloat(order.Total))}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#5a0c1a]">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Additional Information</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 italic">
                  {order.Comments || 'No additional comments provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;