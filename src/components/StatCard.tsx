import React from 'react';
import { AlertCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  alert?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, alert }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-red-200/20">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          
          {alert && (
            <p className="text-sm text-orange-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {alert}
            </p>
          )}
        </div>
        
        <div className="p-3 bg-red-500/10 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;