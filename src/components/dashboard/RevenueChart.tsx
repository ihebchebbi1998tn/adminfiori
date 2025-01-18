import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

interface RevenueData {
  date: string;
  amount: number;
}

interface RevenueChartProps {
  dailyRevenue: RevenueData[];
  monthlyRevenue: RevenueData[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateStr: string, isMonthly = false) => {
  const date = new Date(dateStr);
  if (isMonthly) {
    return new Intl.DateTimeFormat('fr-TN', { year: 'numeric', month: 'long' }).format(date);
  }
  return new Intl.DateTimeFormat('fr-TN', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
};

const RevenueChart = ({ dailyRevenue, monthlyRevenue }: RevenueChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly'>('daily');
  
  const maxDailyRevenue = Math.max(...dailyRevenue.map(d => d.amount), 1);
  const maxMonthlyRevenue = Math.max(...monthlyRevenue.map(d => d.amount), 1);
  
  const currentData = selectedPeriod === 'daily' ? dailyRevenue : monthlyRevenue;
  const maxRevenue = selectedPeriod === 'daily' ? maxDailyRevenue : maxMonthlyRevenue;
  
  const totalRevenue = currentData.reduce((sum, data) => sum + data.amount, 0);
  const averageRevenue = totalRevenue / (currentData.length || 1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-[#5a0c1a]" />
          <h3 className="text-lg font-semibold text-gray-900">Analyse des Revenus</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('daily')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === 'daily'
                ? 'bg-[#5a0c1a] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Quotidien
          </button>
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === 'monthly'
                ? 'bg-[#5a0c1a] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Mensuel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Revenu Total</p>
          <p className="text-xl font-bold text-[#5a0c1a]">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Moyenne par {selectedPeriod === 'daily' ? 'jour' : 'mois'}</p>
          <p className="text-xl font-bold text-[#5a0c1a]">{formatCurrency(averageRevenue)}</p>
        </div>
      </div>

      <div className="relative">
        <div className="h-64 flex items-end space-x-1">
          {currentData.map((data, index) => {
            const height = (data.amount / maxRevenue) * 100;
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center group"
                style={{ minWidth: '20px' }}
              >
                <div className="w-full px-1">
                  <div
                    className="w-full bg-[#5a0c1a] rounded-t transition-all duration-300 ease-in-out relative group-hover:bg-opacity-80"
                    style={{ 
                      height: `${Math.max(height, 2)}%`,
                      backgroundImage: 'linear-gradient(180deg, rgba(90,12,26,0.9) 0%, rgba(90,12,26,1) 100%)'
                    }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        <div className="font-semibold">{formatCurrency(data.amount)}</div>
                        <div className="text-gray-300 text-[10px]">
                          {formatDate(data.date, selectedPeriod === 'monthly')}
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-gray-800 rotate-45 absolute left-1/2 transform -translate-x-1/2 top-full -mt-1"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 transform -rotate-45 origin-top-left">
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {selectedPeriod === 'monthly' 
                      ? new Date(data.date).toLocaleDateString('fr-TN', { month: 'short' })
                      : new Date(data.date).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {currentData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400 flex flex-col items-center">
              <Calendar className="w-12 h-12 mb-2" />
              <p>Aucune donnée disponible pour cette période</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;