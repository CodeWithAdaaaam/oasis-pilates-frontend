'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { 
  Phone, Mail, ArrowLeft, Loader2, 
  CheckCircle, XCircle, DollarSign,
  TrendingUp, Trash2, Plus, X, Maximize2, Save, Activity
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

// 1. IMPORT DU NOUVEAU COMPOSANT MODAL RÉUTILISABLE
import BuyPackModal from '@/components/admin/BuyPackModal';

// ==========================================================
// COMPOSANT PRINCIPAL
// ==========================================================
export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // États des Modals
  const [modalType, setModalType] = useState<'PAYMENT' | 'BUY_PACK' | 'HEALTH' | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      // Nettoyé : on ne charge plus les packs ici, le modal le fait lui-même.
      const res = await api.get(`/admin/clients/${id}`);
      setClient(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement du dossier");
      router.push('/admin/clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchClientData();
  }, [id]);

  const handleDeleteClient = async () => {
    if (!confirm("⚠️ ATTENTION : Supprimer ce client effacera tout son historique (paiements, réservations). Continuer ?")) return;
    try {
      await api.delete(`/admin/clients/${id}`);
      toast.success("Client supprimé définitivement");
      router.push('/admin/clients');
    } catch (err) {
      toast.error("Erreur : Ce client a des données liées protégées.");
    }
  };

  const getPhotoUrl = () => {
    if (!client?.photoUrl) return null;
    if (client.photoUrl.startsWith('data:image')) return client.photoUrl;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${backendUrl}${client.photoUrl}`;
  };

  const photo = getPhotoUrl();

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-sage">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );

  if (!client) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* PHOTO PLEIN ÉCRAN */}
      {isPhotoOpen && photo && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
            <button 
                onClick={() => setIsPhotoOpen(false)}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full"
            >
                <X size={32} />
            </button>
            <img 
                src={photo} 
                alt="Plein écran" 
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain animate-scale-in"
            />
        </div>
      )}

      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button onClick={() => router.push('/admin/clients')} className="flex items-center gap-2 text-gray-400 hover:text-sage font-black text-[10px] uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Retour à la liste
        </button>

        <div className="flex gap-3">
            <button onClick={() => setModalType('HEALTH')} className="flex items-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-all">
                <Activity size={14}/> Modifier Santé
            </button>
            <button onClick={handleDeleteClient} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all">
                <Trash2 size={14}/> Supprimer Compte
            </button>
        </div>
      </div>

      {/* PROFIL CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-sage/10 flex flex-col md:flex-row items-center gap-8">
            <div 
                onClick={() => photo && setIsPhotoOpen(true)}
                className={`relative w-32 h-32 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl transition-transform active:scale-95 ${photo ? 'cursor-zoom-in hover:scale-105' : 'bg-sage/10 text-sage'}`}
            >
                {photo ? (
                    <>
                        <img src={photo} alt="Profil" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Maximize2 size={24} className="text-white" />
                        </div>
                    </>
                ) : (
                    <span className="text-4xl font-black">{client.prenom[0]}{client.nom[0]}</span>
                )}
            </div>

            <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-black text-gray-800 font-serif leading-tight">{client.prenom} {client.nom}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-400 text-sm font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Phone size={14} className="text-sage"/> {client.telephone}</span>
                    <span className="flex items-center gap-1.5"><Mail size={14} className="text-sage"/> {client.email}</span>
                </div>
            </div>
            
            <button 
                onClick={() => setModalType('BUY_PACK')}
                className="bg-sage text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-green-700 transition-all active:scale-95 flex items-center gap-2"
            >
                <Plus size={18}/> Vendre un forfait
            </button>
        </div>

        <div className="bg-sage p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
            <TrendingUp className="absolute right-[-10px] bottom-[-10px] size-32 opacity-10" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Encaissé</p>
            <p className="text-5xl font-black mt-2">
                {(client.subscriptions?.reduce((acc: any, s: any) => acc + (s.amountPaid || 0), 0) || 0).toLocaleString()} <span className="text-xl font-medium">DH</span>
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE : SANTÉ */}
        <div className="lg:col-span-4 space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-sage/10 space-y-6">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity size={18} className="text-red-400"/> État de Santé
                </h2>
                {client.healthProfile ? (
                    <div className="space-y-6">
                        <div className="bg-red-50/50 p-5 rounded-2xl text-sm text-red-700 font-bold border border-red-100">
                            {client.healthProfile.goals || "Aucun objectif spécifié"}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {client.healthProfile.hasBackPain && <HealthBadge text="Mal de dos"/>}
                            {client.healthProfile.hasNeckPain && <HealthBadge text="Nuque"/>}
                            {client.healthProfile.isPregnant && <HealthBadge text="Enceinte" color="pink"/>}
                            {client.healthProfile.hasHighPressure && <HealthBadge text="Tension" color="red"/>}
                        </div>
                        {client.healthProfile.otherInfo && (
                            <div className="text-xs text-gray-500 italic mt-4 bg-gray-50 p-4 rounded-xl leading-relaxed">
                                "{client.healthProfile.otherInfo}"
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fiche non remplie</p>
                    </div>
                )}
            </section>
        </div>

        {/* COLONNE DROITE : ABONNEMENTS & ACTIVITÉS */}
        <div className="lg:col-span-8 space-y-10">
            
            {/* ABONNEMENTS & PAIEMENTS */}
            <section className="space-y-6">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Historique des Forfaits</h2>
                {client.subscriptions?.length > 0 ? client.subscriptions.map((sub: any) => (
                    <div key={sub.id} className={`bg-white p-8 rounded-[3rem] border-2 transition-all ${sub.status === 'ACTIVE' ? 'border-sage shadow-lg shadow-sage/5' : 'border-gray-50 opacity-80'}`}>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-800">{sub.packageName}</h3>
                                <p className="text-[11px] font-black text-sage uppercase mt-1 tracking-widest">
                                    {sub.type === 'UNLIMITED' ? '♾️ Accès Illimité' : '📅 2 séances / semaine'}
                                </p>
                            </div>
                            <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${sub.status === 'ACTIVE' ? 'bg-sage text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {sub.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-gray-100">
                            <div><p className="text-[10px] font-black text-gray-300 uppercase">Prix</p><p className="text-lg font-bold">{sub.price} DH</p></div>
                            <div><p className="text-[10px] font-black text-gray-300 uppercase">Réglé</p><p className="text-lg font-bold text-blue-600">{sub.amountPaid} DH</p></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase">Reste dû</p>
                                <p className={`text-lg font-black ${sub.amountDue > 0 ? 'text-red-500' : 'text-green-500'}`}>{sub.amountDue} DH</p>
                            </div>
                            <div><p className="text-[10px] font-black text-gray-300 uppercase">Expiration</p><p className="text-lg font-bold">{format(parseISO(sub.endDate), 'dd/MM/yyyy')}</p></div>
                        </div>

                        <div className="mt-8 space-y-4">
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Historique de règlements</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {sub.payments?.map((p: any) => (
                                    <div key={p.id} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center group hover:bg-white transition-colors shadow-sm">
                                        <div className="text-[10px] font-bold text-gray-400">
                                            {format(parseISO(p.paymentDate), 'dd MMM yyyy')} • {p.method}
                                            {p.reference && <p className="text-[9px] text-sage">Réf: {p.reference}</p>}
                                        </div>
                                        <p className="font-black text-gray-700 text-sm">+{p.amount} DH</p>
                                    </div>
                                ))}
                             </div>
                             {sub.amountDue > 0 && (
                                <button 
                                    onClick={() => { setSelectedSubId(sub.id); setModalType('PAYMENT'); }}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                                >
                                    <DollarSign size={14}/> Encaisser le solde
                                </button>
                             )}
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest italic">Aucun abonnement enregistré</p>
                    </div>
                )}
            </section>

            {/* SECTION RÉSERVATIONS */}
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-sage/10">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Réservations récentes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {client.reservations?.length > 0 ? client.reservations.map((res: any) => (
                        <div key={res.id} className={`p-4 rounded-2xl border border-gray-50 flex justify-between items-center ${res.status === 'CONFIRMED' ? 'bg-gray-50/50' : 'opacity-50'}`}>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{res.schedule.title}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                                    {format(parseISO(res.reservationDate), 'eee dd MMM', {locale: fr})} • {res.schedule.startTime}
                                </p>
                            </div>
                            <span className={`p-1.5 rounded-full ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'}`}>
                                {res.status === 'CONFIRMED' ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                            </span>
                        </div>
                    )) : <p className="col-span-full text-center text-gray-300 py-4 italic text-sm">Aucun cours effectué</p>}
                </div>
            </section>
        </div>
      </div>

      {/* --- MODALS --- */}
      {modalType === 'PAYMENT' && <PaymentModal subId={selectedSubId!} onClose={() => {setModalType(null); fetchClientData();}} />}
      
      {/* 2. MODAL VENTE PACK (APPEL DU COMPOSANT CENTRAL) */}
      {modalType === 'BUY_PACK' && (
          <BuyPackModal 
            clientId={Number(id)}
            clientName={`${client.prenom} ${client.nom}`}
            onClose={() => setModalType(null)}
            onSuccess={() => {
                setModalType(null);
                fetchClientData();
            }}
          />
      )}

      {modalType === 'HEALTH' && <EditHealthModal client={client} onClose={() => {setModalType(null); fetchClientData();}} />}
    </div>
  );
}

// ==========================================================
// SOUS-COMPOSANTS LOGIQUES & MODALS (locales, car spécifiques à cette page)
// ==========================================================

function HealthBadge({ text, color = "gray" }: { text: string, color?: string }) {
    const colors: any = { gray: "bg-gray-100 text-gray-600", red: "bg-red-100 text-red-600", pink: "bg-pink-100 text-pink-600" };
    return <span className={`px-2 py-1 ${colors[color] || colors.gray} text-[9px] font-black rounded-md uppercase tracking-wider`}>{text}</span>;
}

// 1. MODAL PAIEMENT SOLDE
function PaymentModal({ subId, onClose }: { subId: number, onClose: () => void }) {
    const [form, setForm] = useState({ amount: '', method: 'CASH', reference: '' });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const tid = toast.loading("Enregistrement du paiement...");
        try {
            await api.post('/admin/payments', { 
                subscriptionId: subId, 
                amount: parseFloat(form.amount), 
                method: form.method, 
                reference: form.method === 'CASH' ? '' : form.reference 
            });
            toast.success("Paiement validé !", { id: tid });
            onClose();
        } catch (e: any) { toast.error(e.response?.data?.message || "Erreur", { id: tid }); }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative animate-scale-in">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X/></button>
                <h3 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Encaisser le solde</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input required type="number" placeholder="Montant (DH)" className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-sage font-bold" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                    <select className="w-full border-2 border-gray-100 p-4 rounded-2xl bg-white outline-none focus:border-sage font-bold" value={form.method} onChange={e => setForm({...form, method: e.target.value})}>
                        <option value="CASH">Espèces</option><option value="CHEQUE">Chèque</option><option value="VIREMENT">Virement</option>
                    </select>
                    {form.method !== 'CASH' && <input placeholder="N° Chèque / Réf Virement" className="w-full border-2 border-orange-100 p-4 rounded-2xl bg-orange-50/30 outline-none focus:border-orange-400 font-bold" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} required/>}
                    <button type="submit" className="w-full bg-sage text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-sage/20">Confirmer le règlement</button>
                </form>
            </div>
        </div>
    );
}

// 2. MODAL MODIFICATION SANTÉ
function EditHealthModal({ client, onClose }: { client: any, onClose: () => void }) {
    const [profile, setProfile] = useState(client.healthProfile || { goals: '', hasBackPain: false, hasNeckPain: false, isPregnant: false, otherInfo: '' });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const tid = toast.loading("Mise à jour...");
        try {
            await api.post('/client/health-profile', { ...profile, userId: client.id });
            toast.success("Fiche santé actualisée !", { id: tid });
            onClose();
        } catch (e) { toast.error("Erreur", { id: tid }); }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scale-in">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24}/></button>
                <h3 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
                    <Activity className="text-red-400"/> Fiche Santé de l'adhérent
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Objectifs et attentes</label>
                        <textarea className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-sage font-medium text-sm leading-relaxed" rows={3} value={profile.goals} onChange={e => setProfile({...profile, goals: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <HealthCheckbox label="Mal de dos" checked={profile.hasBackPain} onChange={v => setProfile({...profile, hasBackPain: v})} />
                        <HealthCheckbox label="Mal de nuque" checked={profile.hasNeckPain} onChange={v => setProfile({...profile, hasNeckPain: v})} />
                        <HealthCheckbox label="Enceinte" checked={profile.isPregnant} onChange={v => setProfile({...profile, isPregnant: v})} />
                        <HealthCheckbox label="Hypertension" checked={profile.hasHighPressure} onChange={v => setProfile({...profile, hasHighPressure: v})} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes importantes du coach</label>
                        <textarea placeholder="Blessures, opérations, médicaments..." className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-sage font-medium text-sm italic bg-gray-50" rows={2} value={profile.otherInfo} onChange={e => setProfile({...profile, otherInfo: e.target.value})} />
                    </div>

                    <button type="submit" className="w-full bg-sage text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-sage/20 flex items-center justify-center gap-2">
                        <Save size={16}/> Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
}

function HealthCheckbox({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-sage/20">
            <input type="checkbox" className="w-5 h-5 accent-sage cursor-pointer" checked={checked} onChange={e => onChange(e.target.checked)} />
            <span className="text-[10px] font-black text-gray-600 uppercase">{label}</span>
        </label>
    );
}