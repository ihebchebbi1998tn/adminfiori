import React, { useState, useEffect } from 'react';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import StatCard from '../StatCard';
import { calculateTotalRevenue } from '../../utils/calculations';
import RecentProducts from './RecentProducts';
import VisitorChart from './VisitorChart';

const VueDEnsembleTableauDeBord = () => {
  const [produits, setProduits] = useState([]);
  const [visiteurs, setVisiteurs] = useState([]);
  const [nombreCommandes, setNombreCommandes] = useState(0);
  const [revenuTotal, setRevenuTotal] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const recupererDonnees = async () => {
      try {
        const [produitsRes, visiteursRes, commandesRes, ordersRes] = await Promise.all([
          fetch('https://respizenmedical.com/fiori/get_all_articles.php'),
          fetch('https://respizenmedical.com/fiori/get_visitors.php'),
          fetch('https://respizenmedical.com/fiori/get_orders.php'),
          fetch('https://respizenmedical.com/fiori/get_users_orders.php')
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

        if (Array.isArray(donneesOrders)) {
          const totalRevenue = donneesOrders.reduce((sum, order) => {
            return sum + (order?.price_details?.final_total || 0);
          }, 0);
          setRevenuTotal(totalRevenue);
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
          value={`${revenuTotal} TND`}
          icon={<DollarSign className="w-6 h-6 text-[#5a0c1a]" />}
        />
        <StatCard
          title="Total Produits"
          value={totalProduits}
          icon={<Package className="w-6 h-6 text-[#5a0c1a]" />}
          alert={produitsFaibleStock > 0 ? `${produitsFaibleStock} produits en stock faible` : undefined}
        />
        <StatCard
          title="Commandes Actives"
          value={nombreCommandes.toString()}
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
        {produits.length > 0 && <RecentProducts products={produits.slice(0, 5)} />}
      </div>
    </div>
  );
};

export default VueDEnsembleTableauDeBord;
