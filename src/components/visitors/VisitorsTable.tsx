import React, { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Visitor } from '../../types/visitors';

interface Props {
  visitors: Visitor[];
}

export const VisitorsTable: React.FC<Props> = ({ visitors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Visitor;
    direction: 'asc' | 'desc';
  }>({ key: 'date_visitors', direction: 'desc' });

  const handleSort = (key: keyof Visitor) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredVisitors = visitors
    .filter(visitor => 
      Object.values(visitor).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher des visiteurs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Page', 'Ville', 'Pays', 'Adresse IP', 'Date'].map((header, index) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(Object.keys(visitors[0])[index + 1] as keyof Visitor)}
                >
                  <div className="flex items-center gap-2">
                    {header}
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVisitors.map((visitor) => (
              <tr key={visitor.id_visitors} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{visitor.page_visitors}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.city_visitors}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.country_visitors}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{visitor.ip_visitors}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(visitor.date_visitors).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
