import React, { useState, useEffect } from 'react';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import VisitorChart from './VisitorChart';

interface Order {
  created_at: string;
  price_details: {
    final_total: number;
  };
}

interface RevenueData {
  date: string;
  amount: number;
}

const VueDEnsembleTableauDeBord = () => {
  const [produits, setProduits] = useState([]);
  const [visiteurs, setVisiteurs] = useState([]);
  const [nombreCommandes, setNombreCommandes] = useState(0);
  const [revenuTotal, setRevenuTotal] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState<RevenueData[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenueData[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const recupererDonnees = async () => {
      try {
        const timestamp = new Date().getTime(); // Generate a unique timestamp
  
        const [produitsRes, visiteursRes, commandesRes, ordersRes] = await Promise.all([
          fetch(`https://www.fioriforyou.com/backfiori/get_all_articlesback.php?cache_buster=${timestamp}`),
          fetch(`https://www.fioriforyou.com/backfiori/get_visitors.php?cache_buster=${timestamp}`),
          fetch(`https://www.fioriforyou.com/backfiori/get_orders.php?cache_buster=${timestamp}`),
          fetch(`https://www.fioriforyou.com/backfiori/get_users_orders.php?cache_buster=${timestamp}`)
        ]);
  
        const donneesProduits = await produitsRes.json();
        const donneesVisiteurs = await visiteursRes.json();
        const donneesCommandes = await commandesRes.json();
        const donneesOrders = await ordersRes.json();
  
        if (Array.isArray(donneesProduits)) {
          setProduits(donneesProduits);
        } else if (donneesProduits.status === 'success' && Array.isArray(donneesProduits.products)) {
          setProduits(donneesProduits.products);
        }
  
        if (donneesVisiteurs.status === 'success' && Array.isArray(donneesVisiteurs.data)) {
          setVisiteurs(donneesVisiteurs.data);
        }
  
        if (donneesCommandes.status === 'success' && Array.isArray(donneesCommandes.data)) {
          setNombreCommandes(donneesCommandes.data.length);
        }
  
        if (donneesOrders.success && Array.isArray(donneesOrders.data)) {
          // Calculate total revenue
          setNombreCommandes(donneesOrders.data.length);
  
          const total = donneesOrders.data.reduce((sum, order) => {
            let additionalFee = 0;
            if (order.items) {
              order.items.forEach((item) => {
                if (item.personalization && item.personalization !== '-') {
                  additionalFee += 30;
                }
              });
            }
            return sum + (order.price_details?.final_total || 0) + additionalFee;
          }, 0);
          setRevenuTotal(total);
  
          // Process daily revenue
          const dailyRevenueMap = new Map<string, number>();
          const monthlyRevenueMap = new Map<string, number>();
  
          donneesOrders.data.forEach((order: Order) => {
            const date = new Date(order.created_at);
            const dailyKey = date.toISOString().split('T')[0];
            const monthlyKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  
            let additionalFee = 0;
            if (order.items) {
              order.items.forEach((item) => {
                if (item.personalization && item.personalization !== '-') {
                  additionalFee += 30;
                }
              });
            }
  
            const amount = (order.price_details?.final_total || 0) + additionalFee;
  
            dailyRevenueMap.set(dailyKey, (dailyRevenueMap.get(dailyKey) || 0) + amount);
            monthlyRevenueMap.set(monthlyKey, (monthlyRevenueMap.get(monthlyKey) || 0) + amount);
          });
  
          // Convert to arrays and sort
          const dailyData = Array.from(dailyRevenueMap, ([date, amount]) => ({
            date,
            amount
          })).sort((a, b) => a.date.localeCompare(b.date));
  
          const monthlyData = Array.from(monthlyRevenueMap, ([date, amount]) => ({
            date,
            amount
          })).sort((a, b) => a.date.localeCompare(b.date));
  
          setDailyRevenue(dailyData);
          setMonthlyRevenue(monthlyData);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données du tableau de bord :', err);
        setErreur('Échec de la récupération des données du tableau de bord');
      } finally {
        setChargement(false);
      }
    };
  
    recupererDonnees();
  }, []);
  
  if (chargement) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5a0c1a] border-t-transparent"></div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        {erreur}
      </div>
    );
  }

  const totalProduits = produits.length;
  const totalVisiteurs = visiteurs.length;
  const produitsFaibleStock = produits.filter(p => parseInt(p.qnty_product) < 10).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#5a0c1a]">Vue d'ensemble du tableau de bord</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
  title="Revenu Total"
  value={`${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND' }).format(revenuTotal)}`}
  icon={<DollarSign className="w-6 h-6 text-[#5a0c1a]" />}
/>

        <StatCard
          title="Total Produits"
          value={totalProduits}
          icon={<Package className="w-6 h-6 text-[#5a0c1a]" />}
          alert={produitsFaibleStock > 0 ? `${produitsFaibleStock} produits en stock faible` : undefined}
        />
         <StatCard
          title="Commandes"
          value={`${nombreCommandes} ${nombreCommandes > 1 ? 'commandes' : 'commande'}`}
          icon={<ShoppingCart className="w-6 h-6 text-[#5a0c1a]" />}
        />
        <StatCard
          title="Total Visiteurs"
          value={totalVisiteurs}
          icon={<Users className="w-6 h-6 text-[#5a0c1a]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorChart visitors={visiteurs} />
        <RevenueChart dailyRevenue={dailyRevenue} monthlyRevenue={monthlyRevenue} />
      </div>
    </div>
  );
};

export default VueDEnsembleTableauDeBord;