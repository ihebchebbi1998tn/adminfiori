import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProductsPage from './components/products/ProductsPage';
import OrdersTable from './components/OrdersTable';
import VisitorsPage from './components/visitors/VisitorsPage';
import SettingsForm from './components/settings/SettingsForm';
import LoginScreen from './components/auth/LoginScreen';
import DashboardOverview from './components/dashboard/DashboardOverview';
import ClientsPage from './components/clients/ClientsPage';  // Import ClientsPage
import NewsLetter from './components/NewsLetter';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>('dashboard');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    setIsLoading(true);
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      setIsAuthenticated(false);
      setActivePage('dashboard');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setActivePage('dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5a0c1a] border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />
      
      <main className="ml-0 lg:ml-64 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activePage === 'dashboard' && <DashboardOverview />}
          {activePage === 'products' && <ProductsPage />}
          {activePage === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#5a0c1a]">Orders</h2>
              <OrdersTable orders={[]} />
            </div>
          )}
          {activePage === 'visitors' && <VisitorsPage />}
          {activePage === 'clients' && (
            <div className="space-y-6">
              <ClientsPage />
            </div>
          )}

   {activePage === 'newsletter' && (
            <div className="space-y-6">
              <NewsLetter />
            </div>
          )} 
        </div>
      </main>
    </div>
  );
}

export default App;
