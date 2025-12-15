'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function TreasuryPage() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalBalance: 0, pendingChecks: 0 });
  const [showModal, setShowModal] = useState(false);
  
  // Formulaire ajout
  const [formData, setFormData] = useState({
    type: 'OUT',
    amount: '',
    category: 'Autre',
    description: '',
    method: 'CASH'
  });

  const fetchData = async () => {
    try {
      const res = await api.get('/treasury');
      setTransactions(res.data.transactions);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/treasury', formData);
      setShowModal(false);
      fetchData();
      setFormData({ type: 'OUT', amount: '', category: 'Autre', description: '', method: 'CASH' });
    } catch (err) { alert('Erreur'); }
  };

  const handleCashCheck = async (id: number) => {
    if(!confirm("Confirmer l'encaissement de ce chèque en banque ?")) return;
    try {
      await api.put(`/treasury/${id}/cash`);
      fetchData();
    } catch (err) { alert('Erreur'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-serif text-sage">Gestion de Caisse</h1>
        <button onClick={() => setShowModal(true)} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">
          - Nouvelle Dépense
        </button>
      </div>

      {/* Cartes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-oasis-green">
            <p className="text-gray-500 text-sm uppercase">Solde Disponible (Caisse + Banque)</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalBalance.toFixed(2)} DH</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-400">
            <p className="text-gray-500 text-sm uppercase">Chèques en attente (Portefeuille)</p>
            <p className="text-3xl font-bold text-gray-800">{stats.pendingChecks.toFixed(2)} DH</p>
        </div>
      </div>

      {/* Tableau Transactions */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Type</th>
              <th className="p-4">Catégorie / Description</th>
              <th className="p-4">Méthode</th>
              <th className="p-4 text-right">Montant</th>
              <th className="p-4 text-center">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((t: any) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">
                    {new Date(t.date).toLocaleDateString()}
                </td>
                <td className="p-4">
                    {t.type === 'IN' 
                        ? <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">ENTRÉE</span>
                        : <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold">SORTIE</span>
                    }
                </td>
                <td className="p-4">
                    <p className="font-bold text-gray-800">{t.category}</p>
                    <p className="text-xs text-gray-500">{t.description}</p>
                </td>
                <td className="p-4 text-sm">
                    {t.method === 'CHEQUE' ? 'Chèque' : t.method === 'CASH' ? 'Espèces' : 'Virement'}
                    {t.reference && <span className="block text-xs text-gray-400">Ref: {t.reference}</span>}
                </td>
                <td className={`p-4 text-right font-mono font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'IN' ? '+' : '-'}{t.amount.toFixed(2)} DH
                </td>
                <td className="p-4 text-center">
                    {t.status === 'PENDING' && t.method === 'CHEQUE' ? (
                        <button onClick={() => handleCashCheck(t.id)} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 border border-orange-200">
                            Encaisser ?
                        </button>
                    ) : (
                        <span className="text-gray-400 text-xs">Validé</span>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL AJOUT DÉPENSE */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="font-bold text-lg mb-4">Nouvelle Transaction</h3>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="type" checked={formData.type === 'OUT'} onChange={() => setFormData({...formData, type: 'OUT'})} />
                            <span className="text-red-600 font-bold">Dépense (Sortie)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="type" checked={formData.type === 'IN'} onChange={() => setFormData({...formData, type: 'IN'})} />
                            <span className="text-green-600 font-bold">Entrée (Autre)</span>
                        </label>
                    </div>

                    <input 
                        type="number" placeholder="Montant (DH)" required className="w-full border p-2 rounded"
                        value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
                    />

                    <select className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option>Loyer</option>
                        <option>Électricité/Eau</option>
                        <option>Salaire Coach</option>
                        <option>Salaire Réception</option>
                        <option>Matériel</option>
                        <option>Ménage</option>
                        <option>Marketing</option>
                        <option>Autre</option>
                    </select>

                    <input 
                        type="text" placeholder="Description (facultatif)" className="w-full border p-2 rounded"
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    />

                    <select className="w-full border p-2 rounded" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
                        <option value="CASH">Espèces</option>
                        <option value="VIREMENT">Virement</option>
                        <option value="CHEQUE">Chèque</option>
                    </select>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-sage text-white rounded">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}