import React from 'react';
import { Users, Globe, Clock, MousePointer } from 'lucide-react';
import { Visitor } from '../../types/visitors';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend !== undefined && (
          <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% par rapport à la semaine dernière
          </p>
        )}
      </div>
      <div className="p-3 bg-[#5a0c1a]/10 rounded-lg h-fit">
        {icon}
      </div>
    </div>
  </div>
);

interface Props {
  visitors: Visitor[];
}

export const VisitorMetrics: React.FC<Props> = ({ visitors }) => {
  const totalVisitors = visitors.length;
  const uniqueCountries = new Set(visitors.map(v => v.country_visitors)).size;
  const uniqueCities = new Set(visitors.map(v => v.city_visitors)).size;
  const uniquePages = new Set(visitors.map(v => v.page_visitors)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Visiteurs Totals"
        value={totalVisitors}
        icon={<Users className="w-6 h-6 text-[#5a0c1a]" />}
        trend={12}
      />
      <MetricCard
        title="Pays Atteints"
        value={uniqueCountries}
        icon={<Globe className="w-6 h-6 text-[#5a0c1a]" />}
      />
      <MetricCard
        title="Villes"
        value={uniqueCities}
        icon={<Clock className="w-6 h-6 text-[#5a0c1a]" />}
      />
      <MetricCard
        title="Pages Visitées"
        value={uniquePages}
        icon={<MousePointer className="w-6 h-6 text-[#5a0c1a]" />}
        trend={-5}
      />
    </div>
  );
};
