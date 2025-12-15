"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { currentUser } from "@/data/user";
import { getUserReservations, cancelReservation, updateUser, getMe } from "@/lib/api";
export default function MyReservations() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  
  // États pour les données
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour la Modale
  const [selectedResa, setSelectedResa] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- CHARGEMENT DES DONNÉES RÉELLES ---
  useEffect(() => {
    async function loadData() {
      const data = await getUserReservations(currentUser.email);
      setReservations(data);
      setLoading(false);
    }
    loadData();
  }, []);

const [user, setUser] = useState<any>(null);

useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
        getMe(token).then(u => {
            setUser(u);
            // Une fois qu'on a l'user, on charge ses réservations
            if(u) getUserReservations(u.email).then(data => {
                setReservations(data);
                setLoading(false);
            });
        });
    }
}, []);

  // Filtrer les listes (Logique Frontend)
  const upcomingList = reservations.filter(r => r.status === 'confirmed');
  const historyList = reservations.filter(r => r.status === 'cancelled' || r.status === 'completed');

  const handleCancelClick = (resa: any) => {
    setSelectedResa(resa);
    setIsModalOpen(true);
  };

  // --- ANNULATION RÉELLE ---
  const confirmCancel = async () => {
    if (!selectedResa || !user) return;
    
    try {
      // 1. Annuler dans Strapi
      await cancelReservation(selectedResa.documentId); 

      // 2. Rendre 1 séance (Créditer)
      const newBalance = user.sessions_remaining + 1;
      await updateUser(user.id, { sessions_remaining: newBalance });
      
      // Mettre à jour l'user localement
      setUser({ ...user, sessions_remaining: newBalance });

      // 3. Mettre à jour la liste visuelle
      setReservations(prev => prev.map(r => 
        r.id === selectedResa.id ? { ...r, status: 'cancelled' } : r
      ));
      
      setIsModalOpen(false);
      setSelectedResa(null);
      
      alert(`Réservation annulée. Votre nouveau solde est de ${newBalance} séances.`);
    } catch (error) {
      alert("Erreur lors de l'annulation");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* EN-TÊTE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sage">Mes Réservations</h1>
          <p className="text-sage/60 text-sm">Gérez vos séances et votre planning.</p>
        </div>
        <Link href="/dashboard/planning">
          <button className="bg-sage text-cream px-6 py-2.5 rounded-full font-bold text-sm hover:bg-sage/90 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Réserver un cours
          </button>
        </Link>
      </div>

      {/* ONGLETS */}
      <div className="flex border-b border-sage/10">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-6 text-sm font-bold transition-all relative ${
            activeTab === 'upcoming' ? 'text-sage' : 'text-sage/40 hover:text-sage/70'
          }`}
        >
          Confirmés ({upcomingList.length})
          {activeTab === 'upcoming' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sage rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-6 text-sm font-bold transition-all relative ${
            activeTab === 'history' ? 'text-sage' : 'text-sage/40 hover:text-sage/70'
          }`}
        >
          Historique / Annulés
          {activeTab === 'history' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sage rounded-t-full"></span>
          )}
        </button>
      </div>

      {/* LISTE */}
      {loading ? (
        <div className="text-center py-10 text-sage/50">Chargement...</div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'upcoming' ? (
            upcomingList.length > 0 ? (
              upcomingList.map((resa) => (
                <ReservationCard key={resa.id} resa={resa} onCancel={() => handleCancelClick(resa)} />
              ))
            ) : (
              <EmptyState message="Vous n'avez aucun cours confirmé." />
            )
          ) : (
            historyList.length > 0 ? (
              historyList.map((resa) => (
                <HistoryCard key={resa.id} resa={resa} />
              ))
            ) : (
              <EmptyState message="Aucun historique disponible." />
            )
          )}
        </div>
      )}

      {/* MODALE */}
      {isModalOpen && selectedResa && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-sage/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-sage/10 animate-scale-in">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="font-serif text-xl font-bold">Annuler ce cours ?</h3>
            </div>
            <p className="text-sage/70 text-sm mb-6">
              Vous êtes sur le point d'annuler <strong>{selectedResa.title}</strong>.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-sage/10 font-bold text-sage/60 hover:bg-sage/5 transition-colors"
              >
                Retour
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- PETITS COMPOSANTS ---

function ReservationCard({ resa, onCancel }: { resa: any, onCancel: () => void }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-sage/10 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-sage/10 w-14 h-14 rounded-lg flex flex-col items-center justify-center text-sage">
          <span className="material-symbols-outlined text-2xl">event</span>
        </div>
        <div>
          <h3 className="font-bold text-lg text-sage">{resa.title}</h3>
          <p className="text-sm text-sage/60 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span> {resa.courseDate} à {resa.time} • {resa.coach}
          </p>
        </div>
      </div>
      <button onClick={onCancel} className="text-red-400 hover:text-red-600 text-sm font-bold border border-red-100 hover:border-red-200 bg-red-50 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto">
        Annuler
      </button>
    </div>
  );
}

function HistoryCard({ resa }: { resa: any }) {
  const isCancelled = resa.status === 'cancelled';
  return (
    <div className="bg-sage/5 p-4 rounded-xl border border-sage/5 flex justify-between items-center opacity-70">
      <div className="flex items-center gap-4">
        <div className="text-sage/40 font-serif font-bold text-lg w-10 text-center">
            <span className="material-symbols-outlined">history</span>
        </div>
        <div>
          <h4 className="font-bold text-sage/80">{resa.title}</h4>
          <p className="text-xs text-sage/50">{resa.courseDate} à {resa.time}</p>
        </div>
      </div>
      <div>
        {isCancelled ? (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">Annulé</span>
        ) : (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold">Terminé</span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 border-2 border-dashed border-sage/10 rounded-xl">
      <span className="material-symbols-outlined text-4xl text-sage/20 mb-2">event_busy</span>
      <p className="text-sage/40">{message}</p>
    </div>
  );
}