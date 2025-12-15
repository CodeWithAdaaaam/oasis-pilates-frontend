// app/dashboard/reservations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api'; // On utilise notre service api centralisé
import { Reservation } from '@/types';
import { CheckCircle, XCircle, } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

// On n'a plus besoin d'importer currentUser, getUserReservations, etc.

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Fonction pour charger les réservations depuis notre nouvelle API
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get<Reservation[]>('/reservations/me');
      // Trier par date, les plus récentes en premier
      setReservations(response.data.sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime()));
    } catch (error) {
      toast.error("Impossible de charger vos réservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Fonction pour annuler une réservation
  const handleCancel = async (reservationId: number) => {
    if (!confirm("Voulez-vous vraiment annuler cette séance ?\n\nN'oubliez pas la règle des 4 heures.")) {
        return;
    }
    setCancellingId(reservationId);
    try {
        const res = await api.delete(`/reservations/${reservationId}`);
        toast.success(res.data.message);
        fetchReservations(); // On rafraîchit la liste
    } catch (err: any) {
        toast.error(err.response?.data?.message || "L'annulation a échoué.");
    } finally {
        setCancellingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }
  
  const now = new Date();
  const upcomingList = reservations.filter(r => new Date(r.reservationDate) >= now && r.status === 'CONFIRMED');
  const historyList = reservations.filter(r => new Date(r.reservationDate) < now || r.status !== 'CONFIRMED');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sage">Mes Réservations</h1>
          <p className="text-sage/60 text-sm">Gérez vos séances à venir et consultez votre historique.</p>
        </div>
        <Link href="/dashboard/planning" className="bg-sage text-white px-6 py-2.5 rounded-full font-bold text-sm ...">
            Réserver un cours
        </Link>
      </div>

      {/* Réservations à venir */}
      <section>
        <h2 className="text-xl font-bold text-sage mb-4">À venir</h2>
        <div className="space-y-4">
          {upcomingList.length > 0 ? (
            upcomingList.map(res => (
              <div key={res.id} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <p className="font-bold text-sage">{res.schedule.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(res.reservationDate).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
                  </p>
                </div>
                <button 
                  onClick={() => handleCancel(res.id)} 
                  disabled={cancellingId === res.id}
                  className="w-full sm:w-auto text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg border ..."
                >
                  {cancellingId === res.id ? 'Annulation...' : 'Annuler'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 p-8 border-2 border-dashed rounded-xl">Aucune réservation à venir.</p>
          )}
        </div>
      </section>

      {/* Historique */}
      <section>
        <h2 className="text-xl font-bold text-sage mb-4">Historique</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="divide-y">
            {historyList.map(res => {
              const isPast = new Date(res.reservationDate) < now;
              const status = res.status === 'CANCELLED' ? 'Annulé' : 'Terminé';
              return (
                <div key={res.id} className="p-4 flex justify-between items-center opacity-80">
                  <div>
                    <p className="font-semibold text-gray-800">{res.schedule.title}</p>
                    <p className="text-xs text-gray-500">{new Date(res.reservationDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    {status === 'Annulé' && <span className="... bg-red-100 text-red-700"><XCircle size={14}/> {status}</span>}
                    {status === 'Terminé' && <span className="... bg-gray-100 text-gray-600"><CheckCircle size={14}/> {status}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}