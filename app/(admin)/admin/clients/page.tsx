'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import ClientDetailModal from '@/app/(admin)/components/ClientDetailModal';
// Vous pouvez utiliser Lucide ou garder vos classes material-symbols. Ici j'utilise Lucide pour la cohérence.
import { Plus, Search, UserPlus, Download, Eye } from 'lucide-react';

// Types
interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  subscriptions?: any[];
  dateInscription: string;
}

interface PackConfig {
  code: string;
  name: string;
  price: number;
  isActive: boolean;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [packs, setPacks] = useState<PackConfig[]>([]); // Liste des packs dynamique
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  // Formulaire Nouveau Client
  const [newClient, setNewClient] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    packType: '', 
    amountPaid: '', 
    paymentMethod: 'CASH',
    paymentRef: '',
    startDate: new Date().toISOString().slice(0, 10) // Aujourd'hui par défaut
  });

  // 1. Chargement Initial
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Récupérer les clients
      const resClients = await api.get('/admin/clients'); // ou /admin/clients/list selon votre route
      setClients(resClients.data);

      // Récupérer les packs (POUR LE MENU DÉROULANT)
      const resPacks = await api.get('/admin/packs');
      // On ne garde que les packs actifs pour la vente
      const activePacks = resPacks.data.filter((p: any) => p.isActive);
      setPacks(activePacks);

      // Pré-sélection du premier pack
      if (activePacks.length > 0) {
        setNewClient(prev => ({ ...prev, packType: activePacks[0].code }));
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Gestion Création Client
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/clients', newClient);
      setIsCreateModalOpen(false);
      // Reset du formulaire
      setNewClient({ 
        nom: '', prenom: '', email: '', telephone: '', 
        packType: packs[0]?.code || '', 
        amountPaid: '', 
        paymentMethod: 'CASH', 
        paymentRef: '',
        startDate: new Date().toISOString().slice(0, 10)
      });
      fetchData(); // Rafraîchir la liste
      alert("Client créé avec succès !");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  // 3. Gestion Export Excel
  const handleExport = async () => {
    try {
      const response = await api.get('/admin/export/clients', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clients_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) { alert("L'export a échoué."); }
  };

  // 4. Gestion Vue Détail
  const openDetail = (id: number) => {
    setSelectedClientId(id);
    setIsDetailModalOpen(true);
  };

  // Filtrage
  const filteredClients = clients.filter(c =>
    `${c.nom} ${c.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sage">Gestion des Clients</h1>
          <p className="text-sage/60">Gérez vos membres et leurs abonnements</p>
        </div>
        <div className="flex gap-3">
            <button onClick={handleExport} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download size={18} /> Export Excel
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90 flex items-center gap-2 font-bold shadow-md">
                <UserPlus size={18} /> Nouveau Client
            </button>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 max-w-md">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Rechercher (Nom, Email)..." 
          className="flex-1 outline-none text-sage"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Client</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Dernier Pack</th>
              <th className="p-4 text-center">Séances</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredClients.map(client => {
              const activeSub = client.subscriptions?.[0]; // Le plus récent grâce au backend
              return (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{client.prenom} {client.nom}</p>
                    <p className="text-xs text-gray-400">Inscrit le {new Date(client.dateInscription).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 text-gray-600">
                    <p>{client.email}</p>
                    <p className="text-xs">{client.telephone}</p>
                  </td>
                  <td className="p-4">
                    {activeSub ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeSub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {activeSub.type.replace('_', ' ')}
                      </span>
                    ) : <span className="text-gray-400 italic">Aucun</span>}
                  </td>
                  <td className="p-4 text-center font-bold">
                    {activeSub ? activeSub.sessionsLeft : '-'}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openDetail(client.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MODAL CRÉATION CLIENT (Avec Packs Dynamiques) --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 font-serif text-sage">Inscrire un nouveau client</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Prénom</label>
                  <input required className="w-full border p-2 rounded" value={newClient.prenom} onChange={e => setNewClient({...newClient, prenom: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Nom</label>
                  <input required className="w-full border p-2 rounded" value={newClient.nom} onChange={e => setNewClient({...newClient, nom: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                  <input required type="email" className="w-full border p-2 rounded" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Téléphone</label>
                  <input required className="w-full border p-2 rounded" value={newClient.telephone} onChange={e => setNewClient({...newClient, telephone: e.target.value})} />
                </div>
              </div>

              <hr className="my-4" />
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-bold text-sage">Abonnement & Paiement</h3>
                
                {/* LISTE DÉROULANTE DES PACKS DYNAMIQUES */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Choisir un Pack</label>
                        <select 
                            className="w-full border p-2 rounded bg-white mt-1"
                            value={newClient.packType}
                            onChange={e => setNewClient({...newClient, packType: e.target.value})}
                        >
                            {packs.map(pack => (
                            <option key={pack.code} value={pack.code}>
                                {pack.name} ({pack.price} DH)
                            </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Date de début</label>
                        <input 
                            type="date" 
                            className="w-full border p-2 rounded mt-1"
                            value={newClient.startDate}
                            onChange={e => setNewClient({...newClient, startDate: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Montant payé (DH)</label>
                    <input 
                      type="number" 
                      className="w-full border p-2 rounded mt-1" 
                      placeholder="0"
                      value={newClient.amountPaid}
                      onChange={e => setNewClient({...newClient, amountPaid: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Méthode</label>
                    <select 
                      className="w-full border p-2 rounded bg-white mt-1"
                      value={newClient.paymentMethod}
                      onChange={e => setNewClient({...newClient, paymentMethod: e.target.value})}
                    >
                      <option value="CASH">Espèces</option>
                      <option value="CHEQUE">Chèque</option>
                      <option value="VIREMENT">Virement</option>
                    </select>
                  </div>
                </div>

                {(newClient.paymentMethod === 'CHEQUE' || newClient.paymentMethod === 'VIREMENT') && (
                   <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Référence (N° Chèque/Virement)</label>
                    <input type="text" className="w-full border p-2 rounded mt-1" value={newClient.paymentRef} onChange={e => setNewClient({...newClient, paymentRef: e.target.value})} />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-sage text-white rounded font-bold hover:bg-green-700">Créer le client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DÉTAIL --- */}
      {isDetailModalOpen && selectedClientId && (
        <ClientDetailModal 
          clientId={selectedClientId} 
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedClientId(null);
            fetchData(); 
          }} 
        />
      )}
    </div>
  );
}