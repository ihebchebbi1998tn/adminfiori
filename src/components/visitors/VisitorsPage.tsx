import React, { useState, useEffect } from 'react';
import { Visitor } from '../../types/visitors';
import { VisitorMetrics } from './VisitorMetrics';
import { VisitorCharts } from './VisitorCharts';
import { VisitorsTable } from './VisitorsTable';

const VisitorsPage: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch(
          'https://www.fioriforyou.com/backfiori/get_visitors.php'
        );
        const result = await response.json();

        if (result.status === 'success' && Array.isArray(result.data)) {
          setVisitors(result.data);
        } else {
          throw new Error('Format de données invalide');
        }
      } catch (err) {
        setError('Échec de la récupération des données des visiteurs');
        console.error('Erreur lors de la récupération des visiteurs:', err);
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#5a0c1a]">Analyse des Visiteurs</h2>
      
      <VisitorMetrics visitors={visitors} />
      <VisitorCharts visitors={visitors} />
      <VisitorsTable visitors={visitors} />
    </div>
  );
};

export default VisitorsPage;
