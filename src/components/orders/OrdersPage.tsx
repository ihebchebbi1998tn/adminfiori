import React from 'react';
import OrdersTable from './OrdersTable';
import { Package } from 'lucide-react';

const OrdersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#5a0c1a]/10 rounded-lg">
            <Package className="w-6 h-6 text-[#5a0c1a]" />
          </div>
          <h2 className="text-2xl font-bold text-[#5a0c1a]">Orders Management</h2>
        </div>
      </div>
      <OrdersTable />
    </div>
  );
};

export default OrdersPage;