'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Subscription } from '@/types';
import ValidationModal from '../components/ValidationModal';
import toast from 'react-hot-toast'; // Pour des notifications plus propres que alert()
import { Loader2 } from 'lucide-react';

interface DashboardStats {
  totalClients: number; 
  activeSubs: number; 
  todayReservations: number; 
  pendingRenewals: number;
}

interface PendingSubscription extends Subscription {
  user: { nom: string; prenom: string; email?: string; telephone?: string };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingSubscriptions, setPendingSubscriptions] = useState<PendingSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<PendingSubscription | null>(null);

  const fetchData = async () => {
    try {
      const [statsRes, pendingSubsRes] = await Promise.all([
        api.get<DashboardStats>('/admin/stats'),
        api.get<PendingSubscription[]>('/subscriptions/pending'),
      ]);
      setStats(statsRes.data);
      setPendingSubscriptions(pendingSubsRes.data);
    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
      setError('Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ FONCTION CORRIGÉE
  const handleValidatePack = async (formData: any) => {
    console.log("1. Déclenchement de handleValidatePack avec les données :", formData);

    if (!selectedSub || !selectedSub.id) {
        console.error("Erreur : selectedSub est null ou sans ID");
        toast.error("Erreur de sélection de l'abonnement.");
        return;
    }

    const tid = toast.loading("Communication avec le serveur...");

    try {
        const subId = selectedSub.id;
        console.log("2. Envoi de la requête PUT vers ID :", subId);

        const response = await api.put(`/admin/subscriptions/validate/${subId}`, formData);
        
        console.log("3. Réponse serveur reçue :", response.data);
        toast.success("Abonnement activé avec succès !", { id: tid });
        
        setSelectedSub(null); // Fermer le modal
        fetchData(); // Rafraîchir les statistiques et la liste
    } catch (error: any) {
        console.error("4. Erreur lors de l'appel API :", error);
        const message = error.response?.data?.message || "Erreur de validation sur le serveur.";
        toast.error(message, { id: tid });
    }
};

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 text-sage">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">Chargement du studio...</p>
    </div>
  );

  if (error) return <div className="p-8 text-red-500 bg-red-50 rounded-xl border border-red-100">{error}</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-4xl font-bold text-sage">Tableau de bord</h1>
        <p className="text-gray-500 text-sm">Bienvenue dans votre espace de gestion Oasis Pilates.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Clients Actifs" value={stats?.totalClients || 0} icon="group" />
        <StatCard title="Abonnements Actifs" value={stats?.activeSubs || 0} icon="subscriptions" />
        <StatCard title="Cours ce jour" value={stats?.todayReservations || 0} icon="today" />
        <StatCard 
            title="En attente" 
            value={stats?.pendingRenewals || 0} 
            icon="pending_actions" 
            isAlert={ (stats?.pendingRenewals || 0) > 0 } 
        />
      </div>

      {/* TABLE DES PACKS EN ATTENTE */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-sage/10">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Demandes de Packs</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                {pendingSubscriptions.length} à traiter
            </span>
        </div>

        {pendingSubscriptions.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 italic">Toutes les demandes ont été traitées.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b">
                  <th className="p-4">Client</th>
                  <th className="p-4">Forfait demandé</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pendingSubscriptions.map(sub => (
                  <tr key={sub.id} className="group hover:bg-sage/5 transition-colors">
                    <td className="p-4">
                        <p className="font-bold text-gray-800">{sub.user.prenom} {sub.user.nom}</p>
                        <p className="text-[10px] text-gray-400">{sub.user.telephone || sub.user.email}</p>
                    </td>
                    <td className="p-4 font-mono text-xs text-sage font-bold uppercase">{sub.type.replace(/_/g, ' ')}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedSub(sub)}
                        className="bg-sage text-white px-5 py-2 rounded-xl text-xs font-bold hover:shadow-lg hover:bg-sage/90 transition-all active:scale-95"
                      >
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
    return (
      <div className={`p-6 rounded-[2rem] shadow-sm border transition-all ${isAlert ? "bg-orange-500 text-white border-orange-400" : "bg-white text-gray-800 border-sage/10"}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-4xl font-black ${isAlert ? "text-white" : "text-sage"}`}>{value}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isAlert ? "text-white/80" : "text-gray-400"}`}>{title}</p>
          </div>
          <span className={`material-symbols-outlined text-3xl ${isAlert ? "text-white/30" : "text-sage/20"}`}>{icon}</span>
        </div>
      </div>
    );
}