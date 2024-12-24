import React, { useState, useEffect } from "react";
import { Visitor } from "../../types/visitors";
import { calculateDailyVisits } from "../../utils/visitorStats";

const VisitorsPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch(
          "https://respizenmedical.com/fiori/get_visitors.php"
        );
        const result = await response.json();

        if (result.status === "success" && Array.isArray(result.data)) {
          setVisitors(result.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError("Failed to fetch visitors data");
        console.error("Error fetching visitors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5a0c1a] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg text-center">
        {error}
      </div>
    );
  }

  const dailyVisits = calculateDailyVisits(visitors);
  const totalVisitors = visitors.length;

  return (
    <div className="container mx-auto px-4 space-y-6">
      <h2 className="text-2xl font-bold text-[#5a0c1a]">Visitors Analytics</h2>

      {/* Total Visitors Count */}
      <div className="p-4 bg-[#5a0c1a] text-white rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Visitors</h3>
        <p className="text-4xl font-bold mt-2">{totalVisitors}</p>
      </div>

      {/* Daily Visitors Statistics */}
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold text-[#5a0c1a]">
          Daily Visitors Statistics
        </h3>
        <div className="mt-4 space-y-2">
          {Object.entries(dailyVisits).map(([date, count]) => (
            <div key={date} className="flex items-center justify-between">
              <span>{new Date(date).toLocaleDateString()}</span>
              <div className="flex-grow h-2 bg-gray-100 mx-4 rounded-full">
                <div
                  className="h-full bg-[#5a0c1a] rounded-full"
                  style={{
                    width: `${
                      (count / Math.max(...Object.values(dailyVisits))) * 100
                    }%`,
                  }}
                />
              </div>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visitors Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-[#5a0c1a] text-white">
            <tr>
              <th className="py-2 px-4 text-left">Page</th>
              <th className="py-2 px-4 text-left">City</th>
              <th className="py-2 px-4 text-left">Country</th>
              <th className="py-2 px-4 text-left">IP Address</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr key={visitor.id_visitors} className="border-b">
                <td className="py-2 px-4">{visitor.page_visitors}</td>
                <td className="py-2 px-4">{visitor.city_visitors}</td>
                <td className="py-2 px-4">{visitor.country_visitors}</td>
                <td className="py-2 px-4">{visitor.ip_visitors}</td>
                <td className="py-2 px-4">
                  {new Date(visitor.date_visitors).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorsPage;
