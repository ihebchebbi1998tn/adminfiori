import React from 'react';
import { BarChart } from 'lucide-react';
import { Visitor } from '../../types/visitors';

interface Props {
  visitors: Visitor[];
}

export const VisitorCharts: React.FC<Props> = ({ visitors }) => {
  // Grouper les visiteurs par date
  const visitorsByDate = visitors.reduce((acc, visitor) => {
    const date = new Date(visitor.date_visitors).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Grouper par pays
  const visitorsByCountry = visitors.reduce((acc, visitor) => {
    acc[visitor.country_visitors] = (acc[visitor.country_visitors] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Grouper par page
  const visitorsByPage = visitors.reduce((acc, visitor) => {
    acc[visitor.page_visitors] = (acc[visitor.page_visitors] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Graphique des visiteurs quotidiens */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="font-semibold">Visiteurs quotidiens</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(visitorsByDate).map(([date, count]) => (
            <div key={date} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{date}</span>
                <span className="font-medium">{count} visiteurs</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-[#5a0c1a] rounded-full transition-all"
                  style={{
                    width: `${(count / Math.max(...Object.values(visitorsByDate))) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="font-semibold">Répartition géographique</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(visitorsByCountry).map(([country, count]) => (
            <div key={country} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{country}</span>
                <span className="font-medium">{count} visiteurs</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-[#5a0c1a] rounded-full transition-all"
                  style={{
                    width: `${(count / Math.max(...Object.values(visitorsByCountry))) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analyse des pages */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <BarChart className="w-5 h-5 text-[#5a0c1a]" />
          <h3 className="font-semibold">Analyse des pages</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(visitorsByPage).map(([page, count]) => (
            <div key={page} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm text-gray-600 mb-2">{page}</h4>
              <p className="text-2xl font-bold">{count}</p>
              <div className="mt-2 h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-[#5a0c1a] rounded-full"
                  style={{
                    width: `${(count / Math.max(...Object.values(visitorsByPage))) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
