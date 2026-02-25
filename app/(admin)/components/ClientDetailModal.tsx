'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';
import { User, Subscription, Reservation, Payment } from '@/types';
import { CheckCircle, XCircle, Clock, HeartPulse } from 'lucide-react';
import toast from 'react-hot-toast';

// --- TYPES SPÉCIFIQUES À CE COMPOSANT ---
interface HealthProfile {
    goals?: string;
    hasBackPain?: boolean;
    backPainLevel?: number;
    hasNeckPain?: boolean;
    neckPainLevel?: number;
    hasJointPain?: boolean;
    jointPainLevel?: number;
    isPregnant?: boolean;
    isPostNatal?: boolean;
    hasScoliosis?: boolean;
    hasHerniatedDisc?: boolean;
    hasOsteoporosis?: boolean;
    hasHighPressure?: boolean;
    recentInjuries?: string;
    surgeries?: string;
    medications?: string;
    otherInfo?: string;
}
interface ClientProfile extends User {
  subscriptions: (Subscription & { payments: Payment[] })[];
  reservations: (Reservation & { schedule: { title: string } })[];
  healthProfile?: HealthProfile | null;
}
interface ClientDetailModalProps {
  clientId: number;
  onClose: () => void;
}

// ==========================================================
// COMPOSANT POUR LE FORMULAIRE DE PAIEMENT
// ==========================================================
function AddPaymentForm({ subscription, actualRemaining, onPaymentAdded }: { subscription: any, actualRemaining: number, onPaymentAdded: () => void }) {
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
            if (numAmount <= 0) { setError("Le montant doit être > 0."); setLoading(false); return; }
            if (numAmount > actualRemaining) { setError(`Le montant ne peut pas dépasser ${actualRemaining.toFixed(2)} DH.`); setLoading(false); return; }
            await api.post(`/admin/payments`, { subscriptionId: subscription.id, amount: numAmount, method, reference });
            toast.success("Paiement ajouté !");
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
                <label className="text-xs font-medium">Montant (Max : {actualRemaining.toFixed(2)} DH)</label>
                <input type="number" value={amount === '' ? '' : amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    max={actualRemaining} step="0.01" required 
                    className="w-full p-2 border rounded mt-1" />
            </div>
            <div>
                <label className="text-xs font-medium">Méthode</label>
                <select value={method} onChange={e => setMethod(e.target.value)} className="w-full p-2 border rounded bg-white mt-1">
                    <option value="CASH">Espèces</option>
                    <option value="VIREMENT">Virement</option>
                    <option value="CHEQUE">Chèque</option>
                </select>
            </div>
            {(method === 'VIREMENT' || method === 'CHEQUE') && (
                <div>
                    <label className="text-xs font-medium">Référence</label>
                    <input type="text" value={reference} onChange={e => setReference(e.target.value)} required className="w-full p-2 border rounded mt-1" />
                </div>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm ...">
                {loading ? '...' : 'Enregistrer'}
            </button>
        </form>
    );
}

// ==========================================================
// COMPOSANT POUR AFFICHER LA FICHE SANTÉ
// ==========================================================
function HealthProfileDisplay({ profile, onClose }: { profile: HealthProfile, onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <div className="bg-white p-6 rounded-xl max-w-2xl w-full relative animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">&times;</button>
                <h3 className="font-serif text-2xl font-bold text-sage mb-4 flex items-center gap-2"><HeartPulse/> Fiche Santé</h3>
                <div className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-4">
                    <InfoRow label="Objectifs" value={profile.goals} />
                    <InfoRow label="Blessures/Chirurgies" value={profile.recentInjuries || profile.surgeries} />
                    <InfoRow label="Médicaments" value={profile.medications} />
                    <InfoRow label="Autres informations" value={profile.otherInfo} />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4 mt-4">
                        <CheckRow label="Mal de dos" checked={profile.hasBackPain} />
                        <CheckRow label="Mal de nuque" checked={profile.hasNeckPain} />
                        <CheckRow label="Douleurs articulaires" checked={profile.hasJointPain} />
                        <CheckRow label="Enceinte" checked={profile.isPregnant} />
                        <CheckRow label="Post-natal" checked={profile.isPostNatal} />
                        <CheckRow label="Scoliose" checked={profile.hasScoliosis} />
                        <CheckRow label="Hernie discale" checked={profile.hasHerniatedDisc} />
                        <CheckRow label="Ostéoporose" checked={profile.hasOsteoporosis} />
                        <CheckRow label="Hypertension" checked={profile.hasHighPressure} />
                    </div>
                </div>
            </div>
        </div>
    );
}
const InfoRow = ({ label, value }: { label: string, value?: string | null }) => (
    <div>
        <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
        <p className="text-gray-800">{value || <span className="italic text-gray-400">Non renseigné</span>}</p>
    </div>
);
const CheckRow = ({ label, checked }: { label: string, checked?: boolean }) => (
    <div className={`flex items-center gap-2 p-2 rounded ${checked ? 'bg-red-50 text-red-700' : 'text-gray-400'}`}>
        {checked ? <CheckCircle size={14} /> : <XCircle size={14} />}
        <span>{label}</span>
    </div>
);

// ==========================================================
// COMPOSANT PRINCIPAL DU MODAL
// ==========================================================
export default function ClientDetailModal({ clientId, onClose }: ClientDetailModalProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingPaymentForSubId, setAddingPaymentForSubId] = useState<number | null>(null);
  const [isHealthModalOpen, setHealthModalOpen] = useState(false);

  const fetchClientDetails = useCallback(async () => {
    if (!clientId) return;
    try {
      const response = await api.get<ClientProfile>(`/admin/clients/${clientId}`);
      setClient(response.data);
    } catch (error) { console.error("Erreur chargement client:", error); } 
    finally { setLoading(false); }
  }, [clientId]);

  useEffect(() => { setLoading(true); fetchClientDetails(); }, [fetchClientDetails]);

  const handlePaymentAdded = () => { setAddingPaymentForSubId(null); fetchClientDetails(); };
  const handleForceActivate = async (subId: number) => { /* ... (identique) ... */ };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-5xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
        
        {loading && <p>Chargement...</p>}
        
        {client && (
          <div>
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <h2 className="font-serif text-3xl font-bold mb-1">{client.prenom} {client.nom}</h2>
                    <p className="text-gray-500">{client.email}</p>
                </div>
                {client.healthProfile ? (
                    <button onClick={() => setHealthModalOpen(true)} className="flex items-center gap-2 bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg">
                        <HeartPulse size={16} /> Voir Fiche Santé
                    </button>
                ) : (
                    <span className="text-xs text-gray-400 italic bg-gray-100 px-3 py-1 rounded">Fiche santé non remplie</span>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 mt-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg border-b pb-2">Historique des Abonnements</h3>
                {/* ... (votre JSX pour lister les abonnements) ... */}
              </div>
              <div className="space-y-6">
                <h3 className="font-bold text-lg border-b pb-2">Historique des Séances</h3>
                {/* ... (votre JSX pour lister les réservations) ... */}
              </div>
            </div>
          </div>
        )}
        
        {client?.healthProfile && isHealthModalOpen && (
            <HealthProfileDisplay profile={client.healthProfile} onClose={() => setHealthModalOpen(false)} />
        )}
      </div>
    </div>
  );
}