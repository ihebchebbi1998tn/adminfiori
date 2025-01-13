import React from 'react';
import { BarChart, Globe, MousePointer } from 'lucide-react';

interface VisitorStatsProps {
  dailyVisits: Record<string, number>;
  pageViews: Record<string, number>;
  regionalStats: Array<{
    region: string;
    count: number;
    percentage: number;
    flag: string;
  }>;
}

const VisitorStats: React.FC<VisitorStatsProps> = ({
  dailyVisits = {},
  pageViews = {},
  regionalStats = [],
}) => {
  const sortedDailyVisits = Object.entries(dailyVisits)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-[#5a0c1a]/20">
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="w-5 h-5 text-[#5a0c1a]" />
          <h3 className="text-lg font-semibold">Visites quotidiennes</h3>
        </div>
        <div className="space-y-4">
          {sortedDailyVisits.length > 0 ? (
            sortedDailyVisits.map(([date, count]) => (
              <div key={date} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{new Date(date).toLocaleDateString()}</span>
                  <span className="font-semibold">{count} visiteurs</span>
                </div>
                <div className="h-2 bg-[#5a0c1a]/10 rounded-full">
                  <div
                    className="h-full bg-[#5a0c1a] rounded-full transition-all"
                    style={{
                      width: `${(count / Math.max(...Object.values(dailyVisits))) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div>Aucune donnée de visites quotidiennes disponible</div>
          )}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-[#5a0c1a]/20">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-[#5a0c1a]" />
          <h3 className="text-lg font-semibold">Répartition régionale</h3>
        </div>
        <div className="space-y-4">
          {regionalStats.length > 0 ? (
            regionalStats.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{region.flag}</span>
                    <span>{region.region}</span>
                  </span>
                  <span className="font-semibold">{region.count}</span>
                </div>
                <div className="h-2 bg-[#5a0c1a]/10 rounded-full">
                  <div
                    className="h-full bg-[#5a0c1a] rounded-full transition-all"
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div>Aucune donnée régionale disponible</div>
          )}
        </div>
      </div>

      <div className="md:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-[#5a0c1a]/20">
        <div className="flex items-center gap-2 mb-4">
          <MousePointer className="w-5 h-5 text-[#5a0c1a]" />
          <h3 className="text-lg font-semibold">Vues des pages</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(pageViews).length > 0 ? (
            Object.entries(pageViews).map(([page, views]) => (
              <div key={page} className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-sm text-gray-600 capitalize">{page}</h4>
                <p className="text-2xl font-bold mt-1">{views}</p>
              </div>
            ))
          ) : (
            <div>Aucune donnée de vues des pages disponible</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;
