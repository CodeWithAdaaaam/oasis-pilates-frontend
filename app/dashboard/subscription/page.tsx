'use client';

import { useState, useEffect } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Subscription } from "@/types";
import toast from "react-hot-toast";

// Interface pour les packs venant de l'API
interface Pack {
  id: number;
  code: string;
  name: string;
  price: number;
  description: string;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [pendingSubscription, setPendingSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState<string | null>(null);
  
  // NOUVEAU : État pour les packs dynamiques
  const [packs, setPacks] = useState<Pack[]>([]);

  // Charger les données (abonnements du client ET liste des packs disponibles)
  useEffect(() => {
    async function loadData() {
      if (user) {
        setIsLoading(true);
        try {
          // On charge tout en parallèle
          const [userProfileRes, packsRes] = await Promise.all([
            api.get('/users/me'),
            api.get('/packs/active') // On appelle la route publique des packs
          ]);

          const subs = userProfileRes.data.subscriptions || [];
          setActiveSubscription(subs.find((s: any) => s.status === 'ACTIVE') || null);
          setPendingSubscription(subs.find((s: any) => s.status === 'PENDING') || null);
          setPacks(packsRes.data);

        } catch (error) {
          toast.error("Impossible de charger les informations.");
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadData();
  }, [user]);

  // Fonction pour demander un pack (ne change pas, mais utilise le 'code')
  const handleRequestPack = async (packCode: string) => {
    setIsRequesting(packCode);
    try {
      await api.post('/subscriptions/request', { type: packCode });
      toast.success('Demande envoyée. Finalisez le paiement à l\'accueil.');
      // Recharger les données pour voir la nouvelle demande
      const userProfileRes = await api.get('/users/me');
      const subs = userProfileRes.data.subscriptions || [];
      setPendingSubscription(subs.find((s: any) => s.status === 'PENDING') || null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsRequesting(null);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1 className="font-serif text-4xl font-bold text-sage mb-6">Mon Abonnement</h1>
      
      {/* Affichage du pack actif (pas de changement) */}
      {activeSubscription && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200 mb-10">
          <h2 className="text-xl font-bold text-green-700">Votre Pack Actif</h2>
          {/* ... */}
        </div>
      )}

      {/* Affichage de la demande en attente (pas de changement) */}
      {pendingSubscription && (
        <div className="bg-yellow-50 p-6 rounded-xl shadow-lg border border-yellow-300 mb-10">
          <h2 className="text-xl font-bold text-yellow-800">Demande en attente</h2>
          {/* ... */}
        </div>
      )}

      {/* --- SECTION D'ACHAT DYNAMIQUE --- */}
      <div className="space-y-12 mt-10">
        <div>
          <h2 className="font-serif text-3xl font-bold text-sage mb-6 pb-2 border-b-2 border-sage/20">
            Nos Packs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* On boucle sur les packs chargés depuis l'API */}
            {packs.map((pack) => (
              <div key={pack.id} className="bg-white p-6 rounded-xl shadow-md ...">
                <h3 className="text-lg font-bold text-sage">{pack.name}</h3>
                <p className="text-3xl font-bold text-green-600 my-4">{pack.price} DH</p>
                <p className="text-sm text-sage/70 flex-grow">{pack.description}</p>
                <button
                  onClick={() => handleRequestPack(pack.code)} // On envoie le 'code'
                  disabled={isRequesting === pack.code || !!pendingSubscription}
                  className="w-full mt-6 bg-sage text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-all disabled:cursor-not-allowed"
                >
                  {isRequesting === pack.code ? 'Envoi...' : 'Demander ce pack'}
                </button>
              </div>
            ))}
          </div>
        </div>
        {pendingSubscription && (
          <p className="text-center mt-4 text-sm text-yellow-700">Vous avez déjà une demande en attente.</p>
        )}
      </div>
    </div>
  );
}