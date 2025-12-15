'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Plus, Edit, CheckCircle, XCircle, Trash2 } from 'lucide-react'; // Ajout de Trash2

interface PackConfig {
  id: number;
  name: string;
  code: string;
  sessions: number;
  price: number;
  validityDays: number;
  isActive: boolean;
  description?: string;
}

export default function PacksPage() {
  const [packs, setPacks] = useState<PackConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null as number | null,
    name: '',
    code: '',
    sessions: 10,
    price: 0,
    validityDays: 30,
    isActive: true,
    description: ''
  });

  const fetchPacks = async () => {
    try {
      const res = await api.get('/admin/packs');
      setPacks(res.data);
    } catch (err) {
      console.error("Erreur chargement packs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPacks(); }, []);

  const handleOpenCreate = () => {
    setFormData({ id: null, name: '', code: '', sessions: 10, price: 0, validityDays: 30, isActive: true, description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pack: PackConfig) => {
    setFormData({
      id: pack.id,
      name: pack.name,
      code: pack.code,
      sessions: pack.sessions,
      price: pack.price,
      validityDays: pack.validityDays,
      isActive: pack.isActive,
      description: pack.description || ''
    });
    setIsModalOpen(true);
  };

  // --- NOUVELLE FONCTION DE SUPPRESSION ---
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce pack ? \n\nATTENTION : Si des clients ont déjà acheté ce pack, la suppression sera bloquée. Dans ce cas, désactivez-le plutôt.")) {
        return;
    }

    try {
        await api.delete(`/admin/packs/${id}`);
        // Si ça réussit, on rafraîchit la liste
        fetchPacks();
    } catch (err: any) {
        // Si le backend renvoie une erreur (ex: Foreign Key Constraint), on l'affiche
        alert(err.response?.data?.error || "Impossible de supprimer ce pack car il est lié à des abonnements existants. Veuillez le désactiver (Archiver) à la place.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/admin/packs/${formData.id}`, formData);
      } else {
        await api.post('/admin/packs', formData);
      }
      setIsModalOpen(false);
      fetchPacks();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-serif text-sage">Gestion des Packs</h1>
          <p className="text-sage/60 text-sm">Configurez les prix et durées de vos abonnements</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-sage text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Plus size={20} /> Nouveau Pack
        </button>
      </div>

      {isLoading ? <p>Chargement...</p> : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">Nom du Pack</th>
                <th className="p-4">Code</th>
                <th className="p-4 text-center">Séances</th>
                <th className="p-4 text-center">Validité</th>
                <th className="p-4 text-right">Prix</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {packs.map((pack) => (
                <tr key={pack.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-800">{pack.name}</td>
                  <td className="p-4 text-gray-500 font-mono text-xs">{pack.code}</td>
                  <td className="p-4 text-center">{pack.sessions === 999 ? 'Illimité' : pack.sessions}</td>
                  <td className="p-4 text-center">{pack.validityDays} jours</td>
                  <td className="p-4 text-right font-bold text-sage">{pack.price} DH</td>
                  <td className="p-4 text-center">
                    {pack.isActive 
                      ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold"><CheckCircle size={12}/> Actif</span>
                      : <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs"><XCircle size={12}/> Archivé</span>
                    }
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(pack)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Modifier">
                      <Edit size={18} />
                    </button>
                    {/* BOUTON SUPPRIMER */}
                    <button 
                        onClick={() => handleDelete(pack.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL (Identique à avant) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-4 font-serif">{formData.id ? 'Modifier le Pack' : 'Créer un Pack'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nom du pack</label>
                <input required type="text" className="w-full border p-2 rounded" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Pack Été 2025" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Code Unique</label>
                  <input required disabled={!!formData.id} type="text" className="w-full border p-2 rounded bg-gray-50" 
                    value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="Ex: ETE_2025" />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Prix (DH)</label>
                   <input required type="number" className="w-full border p-2 rounded" 
                    value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value === '' ? 0 : parseFloat(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Séances</label>
                   <input required type="number" className="w-full border p-2 rounded" 
                    value={formData.sessions || ''} onChange={e => setFormData({...formData, sessions: e.target.value === '' ? 0 : parseInt(e.target.value)})} />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Validité (Jours)</label>
                   <input required type="number" className="w-full border p-2 rounded" 
                    value={formData.validityDays || ''} onChange={e => setFormData({...formData, validityDays: e.target.value === '' ? 0 : parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description (Optionnel)</label>
                <textarea className="w-full border p-2 rounded" rows={2}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" className="w-4 h-4"
                  checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                <label htmlFor="active" className="text-sm font-medium">Pack Actif (Visible)</label>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Annuler</button>
                <button type="submit" className="px-6 py-2 bg-oasis-green text-white rounded font-bold hover:bg-green-700">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}