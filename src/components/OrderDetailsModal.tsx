import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Order Details"
      className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-12"
      overlayClassName="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
    >
      <h3 className="text-xl font-bold mb-4">Order Details</h3>
      <p><strong>Order ID:</strong> {order.order_id}</p>
      <p>
        <strong>Customer:</strong> {order.user_details.first_name} {order.user_details.last_name}
      </p>
      <p><strong>Email:</strong> {order.user_details.email}</p>
      <p><strong>Phone:</strong> {order.user_details.phone}</p>
      <p><strong>Address:</strong> {order.user_details.address}, {order.user_details.country}</p>
      <p><strong>Total:</strong> ${order.price_details.final_total.toFixed(2)}</p>
      <h4 className="text-lg font-semibold mt-4">Items:</h4>
      <ul className="list-disc pl-6">
        {Array.isArray(order.items) ? (
          order.items.map((item) => (
            <li key={item.item_id} className="mb-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md mb-2" />
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${item.price}</p>
              <p><strong>Total Price:</strong> ${item.total_price}</p>
              <p><strong>Size:</strong> {item.size}</p>
              <p><strong>Color:</strong> {item.color}</p>
              <p><strong>Personalization:</strong> {item.personalization}</p>
              <p><strong>Pack:</strong> {item.pack}</p>
              <p><strong>Box:</strong> {item.box}</p>
            </li>
          ))
        ) : (
          <li>No items found</li>
        )}
      </ul>
      <button
        onClick={onClose}
        className="bg-red-500 text-white px-4 py-2 rounded-md mt-6 hover:bg-red-600"
      >
        Close
      </button>
    </Modal>
  );
};

export default OrderDetailsModal;
