'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Subscription, Reservation } from '@/types';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface HistoryData {
  subscriptions: Subscription[];
  reservations: Reservation[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null); // Pour l'état de chargement du bouton

  const fetchHistory = async () => {
    try {
      const response = await api.get<HistoryData>('/client/history');
      setHistory(response.data);
    } catch (error) {
      console.error("Erreur chargement historique", error);
      toast.error("Impossible de charger l'historique.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // --- NOUVELLE FONCTION POUR ANNULER ---
  const handleCancel = async (reservationId: number) => {
    if (!confirm("Voulez-vous vraiment annuler cette séance ?\n\nN'oubliez pas : si le cours est dans moins de 4h, la séance sera décomptée.")) {
        return;
    }
    setCancellingId(reservationId);
    try {
        const res = await api.delete(`/reservations/${reservationId}`);
        toast.success(res.data.message); // Affiche si la séance est recréditée ou non
        fetchHistory(); // Rafraîchit tout l'historique
    } catch (err: any) {
        toast.error(err.response?.data?.message || "L'annulation a échoué.");
    } finally {
        setCancellingId(null);
    }
  };


  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!history) {
    return <div className="p-8 text-center text-red-500">Erreur de chargement.</div>;
  }


  return (
    <div className="space-y-12">
      <h1 className="font-serif text-3xl font-bold text-sage">Mon Historique</h1>

      {/* SECTION 1 : HISTORIQUE DES PACKS ET PAIEMENTS */}
      <section>
        <h2 className="text-xl font-bold text-sage mb-4 pb-2 border-b-2 border-sage/10">Mes Packs & Paiements</h2>
        <div className="space-y-6">
          {history.subscriptions.map(sub => (
            <div key={sub.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-sage">{sub.type.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-400">Acheté le {new Date(sub.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                    sub.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {sub.status}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t pt-4">
                <div>
                  <p className="text-xs text-gray-500">Prix Total</p>
                  <p className="font-bold">{sub.price.toFixed(2)} DH</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Montant Payé</p>
                  <p className="font-bold text-green-600">{(sub.amountPaid || 0).toFixed(2)} DH</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Montant Dû</p>
                  <p className={`font-bold ${(sub.amountDue || 0) > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {(sub.amountDue || 0).toFixed(2)} DH
                  </p>
                </div>
                 <div>
                  <p className="text-xs text-gray-500">Séances</p>
                  <p className="font-bold">{sub.sessionsLeft} / {sub.sessionsTotal}</p>
                </div>
              </div>

              {/* Détail des paiements pour ce pack */}
              {sub.payments && sub.payments.length > 0 && (
                <div className="mt-4 border-t pt-2">
                    <p className="text-xs font-bold text-gray-400 mb-2">Détail des paiements :</p>
                    <ul className="space-y-1">
                        {sub.payments.map(p => (
                            <li key={p.id} className="text-xs flex justify-between text-gray-600">
                                <span>{new Date(p.paymentDate).toLocaleDateString('fr-FR')} - {p.method}</span>
                                <span className="font-mono">{p.amount.toFixed(2)} DH</span>
                            </li>
                        ))}
                    </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 : HISTORIQUE DES SÉANCES */}
      <section>
        <h2 className="text-xl font-bold text-sage mb-4 pb-2 border-b-2 border-sage/10">Mes Séances</h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {history.reservations.map(res => {
              const now = new Date();
              const courseDate = new Date(res.reservationDate);
              const isPast = courseDate < now;
              const isCancellable = res.status === 'CONFIRMED' && !isPast;

              let statusText = 'Confirmé';
              if (res.status === 'CANCELLED') statusText = 'Annulé';
              else if (isPast) statusText = 'Terminé';

              return (
                <div key={res.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-bold text-sage">{res.schedule.title}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar size={14} />
                      {courseDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* AFFICHER LE BOUTON "ANNULER" UNIQUEMENT SI LE COURS EST FUTUR ET CONFIRMÉ */}
                    {isCancellable && (
                        <button 
                            onClick={() => handleCancel(res.id)}
                            disabled={cancellingId === res.id}
                            className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-200 transition disabled:opacity-50"
                        >
                            {cancellingId === res.id ? 'Annulation...' : 'Annuler'}
                        </button>
                    )}

                    {/* Affichage du statut */}
                    {statusText === 'Annulé' && <span className="text-xs bg-red-100 text-red-700 ..."><XCircle size={14}/> {statusText}</span>}
                    {statusText === 'Terminé' && <span className="text-xs bg-gray-100 text-gray-600 ..."><CheckCircle size={14}/> {statusText}</span>}
                    {statusText === 'Confirmé' && isPast === false && <span className="text-xs bg-blue-100 text-blue-700 ..."><Clock size={14}/> {statusText}</span>}
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