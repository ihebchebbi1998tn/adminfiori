import React from 'react';
import { OrderItem } from '../types/order';
import { formatCurrency } from '../utils/formatters';

interface OrderItemsListProps {
  items: OrderItem[];
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
  // Constant price for personalization
  const PERSONALIZATION_PRICE = 30;

  // Calculate the total personalization cost
  const totalPersonalizationCost = items.reduce((acc, item) => {
    return item.personalization !== '-' ? acc + PERSONALIZATION_PRICE : acc;
  }, 0);

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-lg text-[#700100] mb-4">Articles commandés</h3>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.product_id} className="flex items-center gap-4 p-4 bg-white rounded-lg">
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
              {item.personalization !== '-' && (
                <div className="text-sm text-gray-600 mt-2">
                  <span>Prix personnalisation: TND {PERSONALIZATION_PRICE} </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {totalPersonalizationCost > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg text-right font-medium text-gray-900">
          <span>Total Personnalisation: TND {totalPersonalizationCost} </span>
        </div>
      )}
    </div>
  );
};
