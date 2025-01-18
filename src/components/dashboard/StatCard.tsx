import React from 'react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  alert?: string;
}

const StatCard = ({ title, value, icon, alert }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="p-2 bg-[#f8e5e8] rounded-full">{icon}</div>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {alert && (
          <p className="text-sm text-red-500">{alert}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;