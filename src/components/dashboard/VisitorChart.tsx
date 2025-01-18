import React from 'react';
import { BarChart } from 'lucide-react';

interface Visitor {
  id_visitors: string;
  page_visitors: string;
  date_visitors: string;
}

interface VisitorChartProps {
  visitors: Visitor[];
}

const VisitorChart: React.FC<VisitorChartProps> = ({ visitors }) => {
  // Group visitors by date
  const visitorsByDate = visitors.reduce((acc, visitor) => {
    const date = new Date(visitor.date_visitors).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get the last 7 days of data
  const sortedDates = Object.entries(visitorsByDate)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
    .slice(0, 7)
    .reverse();

  const maxVisitors = Math.max(...Object.values(visitorsByDate));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="w-5 h-5 text-[#5a0c1a]" />
        <h3 className="text-lg font-semibold">Visitor Trends</h3>
      </div>

      <div className="space-y-4">
        {sortedDates.map(([date, count]) => (
          <div key={date} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{date}</span>
              <span className="font-medium">{count} visitors</span>
            </div>
            <div className="h-2 bg-[#5a0c1a]/10 rounded-full">
              <div
                className="h-full bg-[#5a0c1a] rounded-full transition-all"
                style={{
                  width: `${(count / maxVisitors) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitorChart;