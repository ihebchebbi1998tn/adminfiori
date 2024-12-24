import React, { useState, useEffect } from 'react';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import StatCard from '../StatCard';
import { calculateTotalRevenue } from '../../utils/calculations';
import RecentProducts from './RecentProducts';
import VisitorChart from './VisitorChart';

const DashboardOverview = () => {
  const [products, setProducts] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, visitorsRes, ordersRes] = await Promise.all([
          fetch('https://respizenmedical.com/fiori/get_all_articles.php'),
          fetch('https://respizenmedical.com/fiori/get_visitors.php'),
          fetch('https://respizenmedical.com/fiori/get_orders.php')
        ]);

        const productsData = await productsRes.json();
        const visitorsData = await visitorsRes.json();
        const ordersData = await ordersRes.json();

        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (productsData.status === 'success' && Array.isArray(productsData.products)) {
          setProducts(productsData.products);
        }

        if (visitorsData.status === 'success' && Array.isArray(visitorsData.data)) {
          setVisitors(visitorsData.data);
        }

        if (ordersData.status === 'success' && Array.isArray(ordersData.data)) {
          setOrderCount(ordersData.data.length);
        }

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  const totalRevenue = "-";
  const totalProducts = products.length;
  const totalVisitors = visitors.length;
  const lowStockProducts = products.filter(p => parseInt(p.qnty_product) < 10).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#5a0c1a]">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`€${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-[#5a0c1a]" />}
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-6 h-6 text-[#5a0c1a]" />}
          alert={lowStockProducts > 0 ? `${lowStockProducts} products low in stock` : undefined}
        />
        <StatCard
          title="Active Orders"
          value={orderCount.toString()}
          icon={<ShoppingCart className="w-6 h-6 text-[#5a0c1a]" />}
        />
        <StatCard
          title="Total Visitors"
          value={totalVisitors}
          icon={<Users className="w-6 h-6 text-[#5a0c1a]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorChart visitors={visitors} />
        {products.length > 0 && <RecentProducts products={products.slice(0, 5)} />}
      </div>
    </div>
  );
};

export default DashboardOverview;