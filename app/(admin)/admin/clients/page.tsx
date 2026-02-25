'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { UserPlus, Search, Download, CircleUserRound, Calendar, XCircle, Loader2, CreditCard, Mail, Phone, User as UserIcon } from 'lucide-react';
import { User, Subscription } from '@/types';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Import du composant Modal réutilisable
import BuyPackModal from '@/components/admin/BuyPackModal';

// --- TYPES LOCAUX ---
interface Client extends User {
  subscriptions?: Subscription[];
}

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // États des Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [buyModalClient, setBuyModalClient] = useState<{ id: number, name: string } | null>(null);

  // État simplifié pour la création : Uniquement les infos de base
  const [newClient, setNewClient] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const resClients = await api.get('/admin/clients');
      setClients(resClients.data);
    } catch (error) {
      toast.error("Impossible de charger les membres.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CRÉATION DU COMPTE ET REDIRECTION ---
  const handleCreateAccount = async (e: FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Création du compte client...");

    try {
      // On envoie uniquement les infos d'identité
      const res = await api.post('/admin/clients', newClient);
      const createdUser = res.data;

      setIsCreateModalOpen(false);
      setNewClient({ nom: '', prenom: '', email: '', telephone: '' });

      toast.success("Compte créé avec succès ! Redirection...", { id: toastId });

      // ✅ REDIRECTION AUTOMATIQUE vers la page du client pour acheter le pack
      router.push(`/admin/clients/${createdUser.id}`);

    } catch (err: any) {
      toast.error(err.response?.data?.message || "La création a échoué.", { id: toastId });
    }
  };

  const handleExport = async () => {
    const toastId = toast.loading("Génération de l'export Excel...");
    try {
      const response = await api.get('/admin/export/clients', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.body.appendChild(document.createElement('a'));
      link.href = url;
      link.setAttribute('download', `export_clients_${new Date().toISOString().slice(0, 10)}.xlsx`);
      link.click();
      link.remove();
      toast.success("Export terminé !", { id: toastId });
    } catch (error) {
      toast.error("L'export a échoué.", { id: toastId });
    }
  };

  const filteredClients = clients.filter(c =>
    `${c.prenom} ${c.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen text-sage">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="font-bold uppercase tracking-widest text-[10px]">Chargement de la base clients...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sage leading-tight">Gestion des Clients</h1>
          <p className="text-gray-500 text-sm">Créez un compte ou gérez les abonnements existants.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-bold shadow-sm transition-all text-xs uppercase tracking-wider">
            <Download size={16} /> Export
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-sage text-white px-6 py-2.5 rounded-xl hover:bg-sage/90 flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95 text-xs uppercase tracking-wider">
            <UserPlus size={16} /> Nouveau Client
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher un membre..."
          className="w-full p-4 pl-12 border-2 border-gray-100 rounded-2xl outline-none focus:border-sage transition-all shadow-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            onClick={() => router.push(`/admin/clients/${client.id}`)}
            onQuickSell={(e) => {
              e.stopPropagation();
              setBuyModalClient({ id: client.id, name: `${client.prenom} ${client.nom}` });
            }}
          />
        ))}
      </div>

      {/* MODAL VENTE RAPIDE (Pour les clients existants) */}
      {buyModalClient && (
        <BuyPackModal
          clientId={buyModalClient.id}
          clientName={buyModalClient.name}
          onClose={() => setBuyModalClient(null)}
          onSuccess={fetchData}
        />
      )}

      {/* --- MODAL CRÉATION DE COMPTE (SIMPLIFIÉ) --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative animate-scale-in overflow-hidden">

            <div className="bg-sage/10 p-8 border-b border-sage/5">
              <h2 className="text-2xl font-bold font-serif text-sage">Nouveau Compte</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Étape 1 : Identité du membre</p>
            </div>

            <form onSubmit={handleCreateAccount} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Prénom</label>
                  <input required placeholder="ex: Sofia" className="w-full border-2 border-gray-50 p-3 rounded-xl outline-none focus:border-sage transition-all text-sm font-bold" value={newClient.prenom} onChange={e => setNewClient({ ...newClient, prenom: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nom</label>
                  <input required placeholder="ex: Alami" className="w-full border-2 border-gray-50 p-3 rounded-xl outline-none focus:border-sage transition-all text-sm font-bold" value={newClient.nom} onChange={e => setNewClient({ ...newClient, nom: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-gray-300" />
                  <input required type="email" placeholder="client@email.com" className="w-full border-2 border-gray-50 p-3 pl-10 rounded-xl outline-none focus:border-sage transition-all text-sm font-bold" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Téléphone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3.5 text-gray-300" />
                  <input required placeholder="06..." className="w-full border-2 border-gray-50 p-3 pl-10 rounded-xl outline-none focus:border-sage transition-all text-sm font-bold" value={newClient.telephone} onChange={e => setNewClient({ ...newClient, telephone: e.target.value })} />
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <button type="submit" className="w-full py-4 bg-sage text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-sage/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Créer et passer à la vente
                </button>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="w-full py-3 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-gray-600 transition-colors">
                  Annuler
                </button>
              </div>
            </form>

            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SOUS-COMPOSANT CLIENT CARD ---
function ClientCard({ client, onClick, onQuickSell }: { client: Client, onClick: () => void, onQuickSell: (e: any) => void }) {
  const currentSub = client.subscriptions?.find(s => s.status === 'ACTIVE') || client.subscriptions?.[0];

  const getPhotoDisplay = () => {
    if (!client.photoUrl) return null;
    if (client.photoUrl.startsWith('data:image')) return client.photoUrl;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${backendUrl}${client.photoUrl}`;
  };
  const photo = getPhotoDisplay();

  return (
    <div onClick={onClick} className="bg-white p-5 rounded-[2rem] shadow-sm border-2 border-gray-50 hover:border-sage hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-sage/10 text-sage flex items-center justify-center overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
          {photo ? (
            <img src={photo} alt={`${client.prenom}`} className="w-full h-full object-cover" />
          ) : (
            <CircleUserRound size={32} strokeWidth={1.5} />
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-sage transition-colors leading-tight">{client.prenom} {client.nom}</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">{client.telephone || client.email}</p>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-50 flex justify-between items-end relative z-10">
        {currentSub ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${currentSub.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-orange-400'}`}></span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                {currentSub.status === 'ACTIVE' ? 'Actif' : 'Expiré'}
              </span>
            </div>
            <p className="font-bold text-gray-700 text-xs truncate max-w-[140px]">{currentSub.type}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Aucun forfait</p>
          </div>
        )}

        <button
          onClick={onQuickSell}
          className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-sage hover:text-white transition-all shadow-sm group/btn"
          title="Vendre un abonnement"
        >
          <CreditCard size={18} className="group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}