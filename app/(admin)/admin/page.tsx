'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Subscription } from '@/types';
import ValidationModal from '../components/ValidationModal';

interface DashboardStats {
  totalClients: number; activeSubs: number; todayReservations: number; pendingRenewals: number;
}

interface PendingSubscription extends Subscription {
  user: { nom: string; prenom: string; email?: string; telephone?: string };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingSubscriptions, setPendingSubscriptions] = useState<PendingSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<PendingSubscription | null>(null); // Pour le modal

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, pendingSubsRes] = await Promise.all([
        api.get<DashboardStats>('/admin/stats'),
        api.get<PendingSubscription[]>('/subscriptions/pending'),
      ]);
      setStats(statsRes.data);
      setPendingSubscriptions(pendingSubsRes.data);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleValidatePack = async (data: any) => {
    try {
      await api.put(`/admin/subscriptions/validate/${data.subscriptionId}`, data);
      setSelectedSub(null); // Ferme le modal au succès
      fetchData(); // Rafraîchit les données de la page
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la validation du pack.");
    }
  };

  if (loading) return <div><h1 className="font-serif text-4xl font-bold text-sage mb-4">Tableau de bord</h1><p className="text-sage/70">Chargement...</p></div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h1 className="font-serif text-4xl font-bold text-sage mb-4">Tableau de bord Administrateur</h1>
      <p className="text-sage/70 mb-8">Vue d'ensemble de l'activité du studio.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Clients Actifs" value={stats?.totalClients || 0} icon="group" />
        <StatCard title="Abonnements Actifs" value={stats?.activeSubs || 0} icon="subscriptions" />
        <StatCard title="Réservations du Jour" value={stats?.todayReservations || 0} icon="today" />
        <StatCard title="Validations en Attente" value={stats?.pendingRenewals || 0} icon="pending_actions" isAlert />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-sage/10">
        <h2 className="text-2xl font-bold text-sage mb-4">Packs en attente de validation</h2>
        {pendingSubscriptions.length === 0 ? (
          <p className="text-sage/60">Aucune demande de renouvellement pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sage/80">
              <thead>
                <tr className="border-b border-sage/10">
                  <th className="p-3 font-bold text-sage">Client</th>
                  <th className="p-3 font-bold text-sage">Pack demandé</th>
                  <th className="p-3 font-bold text-sage text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingSubscriptions.map(sub => (
                  <tr key={sub.id} className="border-b border-sage/5 hover:bg-sage/5">
                    <td className="p-3">{sub.user.prenom} {sub.user.nom}</td>
                    <td className="p-3 font-mono">{sub.type.replace('_', ' ')}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => setSelectedSub(sub)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
                        Valider Paiement
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Le Modal s'affichera ici quand selectedSub n'est pas null */}
      {selectedSub && (
        <ValidationModal 
          subscription={selectedSub}
          onClose={() => setSelectedSub(null)}
          onValidate={handleValidatePack}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, isAlert = false }: { title: string, value: number, icon: string, isAlert?: boolean }) {
    const bgColor = isAlert ? "bg-orange-500" : "bg-sage";
    return (
      <div className={`p-6 rounded-xl shadow-lg text-white ${bgColor}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-4xl font-bold">{value}</p>
            <p className="text-sm opacity-80 mt-1">{title}</p>
          </div>
          <span className="material-symbols-outlined text-5xl opacity-30">{icon}</span>
        </div>
      </div>
    );
  }