
'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';
import { User, Subscription, Reservation, Payment } from '@/types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

// Interfaces étendues pour ce composant

interface ClientProfile extends User {
  subscriptions: Subscription[]; // Le type Subscription global inclut déjà les paiements
  reservations: Reservation[];   // Le type Reservation global inclut déjà schedule
}

interface ClientDetailModalProps {
  clientId: number;
  onClose: () => void;
}
export function AddPaymentForm({ subscription, actualRemaining, onPaymentAdded }: { subscription: any, actualRemaining: number, onPaymentAdded: () => void }) {
    
    // On initialise le state avec la valeur calculée par le parent
    const [amount, setAmount] = useState<number | string>(actualRemaining);
    const [method, setMethod] = useState('CASH'); 
    const [reference, setReference] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const numAmount = Number(amount);

            if (numAmount <= 0) {
                setError("Le montant doit être supérieur à 0.");
                setLoading(false);
                return;
            }

            // Sécurité visuelle basée sur la prop reçue
            if (numAmount > actualRemaining) {
                setError(`Le montant ne peut pas dépasser ${actualRemaining.toFixed(2)} DH.`);
                setLoading(false);
                return;
            }

            await api.post(`/admin/payments`, {
                subscriptionId: subscription.id,
                amount: numAmount,
                method,
                reference,
            });
            onPaymentAdded();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
            <h4 className="font-semibold text-sm text-blue-800">Encaisser un paiement</h4>
            
            <div>
                <label className="text-xs font-medium">
                    Montant à payer (Max : {actualRemaining.toFixed(2)} DH)
                </label>
                <input 
                    type="number" 
                    value={amount === '' ? '' : amount}
                    onChange={(e) => {
                        const val = e.target.value;
                        setAmount(val === '' ? '' : parseFloat(val));
                    }}
                    max={actualRemaining}
                    step="0.01"
                    required 
                    className="w-full p-2 border rounded mt-1" 
                />
            </div>

            <div>
                <label className="text-xs font-medium">Méthode</label>
                <select 
                    value={method} 
                    onChange={e => setMethod(e.target.value)} 
                    className="w-full p-2 border rounded bg-white mt-1"
                >
                    <option value="CASH">Espèces</option>
                    <option value="VIREMENT">Virement</option>
                    <option value="CHEQUE">Chèque</option>
                </select>
            </div>

            {(method === 'VIREMENT' || method === 'CHEQUE') && (
                <div>
                    <label className="text-xs font-medium">Référence</label>
                    <input 
                        type="text" 
                        value={reference}
                        onChange={e => setReference(e.target.value)}
                        required
                        className="w-full p-2 border rounded mt-1" 
                    />
                </div>
            )}
            
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-300">
                {loading ? 'Enregistrement...' : 'Enregistrer le Paiement'}
            </button>
        </form>
    );
}

// Composant principal du Modal
export default function ClientDetailModal({ clientId, onClose }: ClientDetailModalProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingPaymentForSubId, setAddingPaymentForSubId] = useState<number | null>(null);

  const fetchClientDetails = useCallback(async () => {
    if (!clientId) return;
    try {
      const response = await api.get<ClientProfile>(`/admin/clients/${clientId}`);
      setClient(response.data);
    } catch (error) { console.error("Erreur chargement client:", error); } 
    finally { setLoading(false); }
  }, [clientId]);

  useEffect(() => {
    setLoading(true);
    fetchClientDetails();
  }, [fetchClientDetails]);

  const handlePaymentAdded = () => {
    setAddingPaymentForSubId(null);
    fetchClientDetails();
  };
  
  const handleForceActivate = async (subId: number) => {
    if (!confirm("Activer ce pack manuellement ?")) return;
    try {
        await api.put(`/admin/subscriptions/${subId}/force-activate`);
        fetchClientDetails(); 
    } catch (error) { alert("Erreur d'activation."); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-5xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
        
        {loading && <p>Chargement...</p>}
        
        {client && (
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">{client.prenom} {client.nom}</h2>
            <p className="text-gray-500 mb-6">{client.email}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
              
              {/* --- COLONNE 1 : ABONNEMENTS --- */}
              <div className="space-y-6">
                <h3 className="font-bold text-lg border-b pb-2">Historique des Abonnements</h3>
                {client.subscriptions.length > 0 ? (
                  <ul className="space-y-4">
                    {client.subscriptions.map(sub => {
                      const amountRemaining = sub.amountDue ?? 0;
                      const isPayable = amountRemaining > 0.01;
                      const isPendingActivation = sub.status === 'PENDING';
                      
                      return (
                        <li key={sub.id} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{sub.type.replace('_', ' ')}</p>
                              <p className={`text-sm font-bold ${isPayable ? 'text-red-600' : 'text-green-600'}`}>
                                Reste à payer: {amountRemaining.toFixed(2)} DH
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {isPayable && (
                                <button onClick={() => setAddingPaymentForSubId(sub.id === addingPaymentForSubId ? null : sub.id)} className="...">
                                  {addingPaymentForSubId === sub.id ? 'Annuler' : '+ Paiement'}
                                </button>
                              )}
                              {isPendingActivation && (
                                  <button onClick={() => handleForceActivate(sub.id)} className="...">
                                      Forcer Activation
                                  </button>
                              )}
                            </div>
                          </div>
                          {addingPaymentForSubId === sub.id && (
                            <AddPaymentForm 
                                subscription={sub} 
                                actualRemaining={amountRemaining}
                                onPaymentAdded={handlePaymentAdded} 
                            />
                        )}
                        </li>
                      )})}
                  </ul>
                ) : <p className="text-sm text-gray-500 italic">Aucun abonnement.</p>}
              </div>

              {/* --- COLONNE 2 : RÉSERVATIONS --- */}
              <div className="space-y-6">
                <h3 className="font-bold text-lg border-b pb-2">Historique des Séances</h3>
                {client.reservations.length > 0 ? (
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 border rounded-lg p-2 bg-gray-50">
                     {client.reservations.map(res => {
                        const isPast = new Date(res.reservationDate) < new Date();
                        let statusText: 'Confirmé' | 'Terminé' | 'Annulé' = 'Confirmé';
                        if (res.status === 'CANCELLED') statusText = 'Annulé';
                        else if (isPast) statusText = 'Terminé';

                        return (
                           <div key={res.id} className="p-3 bg-white rounded-md flex justify-between items-center border">
                              <div>
                                {/* CORRECTION : On lit les infos de 'schedule' et 'reservationDate' */}
                                <p className="font-semibold text-sm">{res.schedule.title}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(res.reservationDate).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                              </div>
                              <div>
                                {statusText === 'Annulé' && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1"><XCircle size={12}/> {statusText}</span>}
                                {statusText === 'Terminé' && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12}/> {statusText}</span>}
                                {statusText === 'Confirmé' && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1"><Clock size={12}/> {statusText}</span>}
                              </div>
                           </div>
                        );
                     })}
                  </div>
                ) : <p className="text-sm text-gray-500 italic">Aucune réservation.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}