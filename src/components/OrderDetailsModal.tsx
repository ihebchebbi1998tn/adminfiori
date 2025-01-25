import React from 'react';
import { X, FileText } from 'lucide-react';
import { Order } from '../types/order';
import { OrderItemsList } from './OrderItemsList';
import { formatCurrency, formatDate } from '../utils/formatters';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onGeneratePDF: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onGeneratePDF,
}) => {
  // Calculate the total personalization cost
  const personalizationPrice = 30; // Assuming each personalization costs $5
  const personalizationCount = order.items.filter(
    (item) => item.personalization !== '-'
  ).length;
  const personalizationTotalCost = personalizationCount * personalizationPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#700100]">
              Commande {order.order_id}
            </h2>
            <p className="text-sm text-gray-500">
              Créée le {formatDate(order.created_at)}
            </p>
          </div>
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
              {order.user_details.order_note !== "-" && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Note</p>
                  <p className="font-medium">{order.user_details.order_note}</p>
                </div>
              )}
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
              {personalizationCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de personnalisation ({personalizationCount} items)</span>
                  <span className="font-medium">{formatCurrency(personalizationTotalCost)}</span>
                </div>
              )}
              {order.price_details.has_newsletter_discount && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction newsletter</span>
                  <span>-{formatCurrency(order.price_details.newsletter_discount_amount)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    {formatCurrency(
                      order.price_details.final_total + personalizationTotalCost
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-[#700100] mb-4">Informations de paiement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Méthode de paiement</p>
                <p className="font-medium capitalize">{order.payment.method === 'credit_card' ? 'Carte bancaire' : order.payment.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut du paiement</p>
                <p className="font-medium capitalize">{order.payment.status === 'completed' ? 'Complété' : order.payment.status}</p>
              </div>
              {order.payment.completed_at && (
                <div>
                  <p className="text-sm text-gray-600">Paiement effectué le</p>
                  <p className="font-medium">{formatDate(order.payment.completed_at)}</p>
                </div>
              )}
              {order.payment.konnect_payment_url && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Lien de paiement Konnect</p>
                  <a 
                    href={order.payment.konnect_payment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Voir le lien de paiement
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-[#700100] mb-4">Statut de la commande</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Statut actuel</p>
                <p className="font-medium capitalize">{order.order_status.status}</p>
              </div>
              {order.order_status.shipped_at && (
                <div>
                  <p className="text-sm text-gray-600">Date d'expédition</p>
                  <p className="font-medium">{formatDate(order.order_status.shipped_at)}</p>
                </div>
              )}
              {order.order_status.delivered_at && (
                <div>
                  <p className="text-sm text-gray-600">Date de livraison</p>
                  <p className="font-medium">{formatDate(order.order_status.delivered_at)}</p>
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
