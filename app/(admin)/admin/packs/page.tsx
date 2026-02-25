'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { 
  Plus, Edit, Trash2, Percent, BadgePercent, Save, X, 
  TrendingUp, Users, Calendar, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// --- INTERFACES ---
interface PackConfig {
  id: number;
  name: string;
  code: string;
  category: string;
  type: string;
  price: number;
  months: number;
  bonusDays: number;
  isActive: boolean;
  isPromoActive: boolean;
  promoName: string | null;
  promoPrice: number | null;
  promoMonths: number | null;
  promoBonusDays: number | null;
  promoStartDate: string | null;
  promoEndDate: string | null;
}

interface PromoStat {
    id: number;
    packName: string;
    promoName: string;
    count: number;
    revenue: number;
    endDate: string;
}

// --- UTILITAIRE : ÉVITE LES ERREURS NaN / NULL DANS LES INPUTS ---
const cleanValue = (val: any) => {
  if (val === null || val === undefined || Number.isNaN(val)) return '';
  return val;
};

export default function PacksPage() {
  const [packs, setPacks] = useState<PackConfig[]>([]);
  const [promoStats, setPromoStats] = useState<PromoStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    id: null,
    name: '',
    code: '',
    category: 'PILATES',
    type: 'TWO_PER_WEEK',
    price: 0,
    months: 1,
    bonusDays: 0,
    isActive: true,
    isPromoActive: false,
    promoName: '',
    promoPrice: 0,
    promoMonths: 1,
    promoBonusDays: 0,
    promoStartDate: '',
    promoEndDate: ''
  });

  const fetchData = async () => {
    try {
      const [packsRes, statsRes] = await Promise.all([
        api.get('/admin/packs'),
        api.get('/admin/promo-stats') // Assurez-vous que cette route existe au backend
      ]);
      setPacks(packsRes.data);
      setPromoStats(statsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenCreate = () => {
    setFormData({
      id: null, name: '', code: '', category: 'PILATES', type: 'TWO_PER_WEEK',
      price: 0, months: 1, bonusDays: 0, isActive: true,
      isPromoActive: false, promoName: '', promoPrice: 0,
      promoMonths: 1, promoBonusDays: 0, promoStartDate: '', promoEndDate: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pack: PackConfig) => {
    setFormData({
      ...pack,
      name: pack.name ?? '',
      code: pack.code ?? '',
      promoName: pack.promoName ?? '',
      promoPrice: pack.promoPrice ?? 0,
      promoMonths: pack.promoMonths ?? 1,
      promoBonusDays: pack.promoBonusDays ?? 0,
      promoStartDate: pack.promoStartDate ? pack.promoStartDate.split('T')[0] : '',
      promoEndDate: pack.promoEndDate ? pack.promoEndDate.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce pack ?")) return;
    try {
      await api.delete(`/admin/packs/${id}`);
      toast.success("Pack supprimé");
      fetchData();
    } catch (err: any) {
      toast.error("Impossible de supprimer : ce pack est déjà utilisé.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tid = toast.loading("Enregistrement...");
    try {
      if (formData.id) {
        await api.put(`/admin/packs/${formData.id}`, formData);
      } else {
        await api.post('/admin/packs', formData);
      }
      toast.success("Enregistré avec succès", { id: tid });
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error("Erreur lors de l'enregistrement", { id: tid });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-10 animate-fade-in pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-sage flex items-center gap-2">
            <BadgePercent size={32} /> Gestion des Tarifs & Promos
          </h1>
          <p className="text-gray-500 text-sm">Analysez vos performances et configurez vos offres.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-sage text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all font-bold"
        >
          <Plus size={20} /> Nouveau Pack
        </button>
      </div>

      {/* --- SECTION 1 : STATS PROMO --- */}
      {!isLoading && promoStats.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={16} className="text-orange-500" /> Performances des Promotions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {promoStats.map((stat) => (
              <div key={stat.id} className="bg-orange-500 text-white p-6 rounded-3xl shadow-xl shadow-orange-100 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                  <BadgePercent size={100} />
                </div>
                <p className="text-[10px] font-bold uppercase opacity-80 mb-1">{stat.promoName}</p>
                <h3 className="text-lg font-bold leading-tight mb-4 truncate">{stat.packName}</h3>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-black">{stat.count}</p>
                    <p className="text-[10px] font-bold uppercase">Clients inscrits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{stat.revenue.toLocaleString()} DH</p>
                    <p className="text-[10px] font-bold uppercase opacity-80">Total généré</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/20 text-[9px] font-bold flex justify-between">
                  <span>FIN : {stat.endDate ? format(new Date(stat.endDate), 'dd/MM/yy') : 'N/A'}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded">CAMPAGNE ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 2 : GRILLE DES PACKS --- */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
           Tous vos forfaits
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
            {[1, 2].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {packs.map((pack) => (
              <div key={pack.id} className={`bg-white rounded-3xl border-2 transition-all p-6 relative overflow-hidden ${pack.isPromoActive ? 'border-orange-200 shadow-lg shadow-orange-50' : 'border-gray-100 shadow-sm'}`}>
                
                {pack.isPromoActive && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1.5 rounded-bl-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    <Percent size={10} /> Promo en ligne
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${pack.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <h3 className="text-xl font-bold text-gray-800">{pack.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono bg-gray-50 border px-2 py-0.5 rounded mt-1 inline-block text-gray-400 uppercase">{pack.code}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(pack)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors" title="Modifier"><Edit size={22}/></button>
                    <button onClick={() => handleDelete(pack.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors" title="Supprimer"><Trash2 size={22}/></button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Prix Standard</p>
                    <p className="text-xl font-bold text-sage">{pack.price} <span className="text-xs">DH</span></p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Validité</p>
                    <p className="text-xl font-bold text-gray-700">{pack.months}M <span className="text-[10px] text-gray-400">+{pack.bonusDays}j</span></p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100 flex flex-col justify-center">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Accès</p>
                    <p className="text-[10px] font-black text-gray-600 uppercase leading-none">{pack.type === 'UNLIMITED' ? '♾️ Illimité' : '📅 2 / semaine'}</p>
                  </div>
                </div>

                {/* Résumé visuel de la promo si active */}
                {pack.isPromoActive && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-2xl border-2 border-dashed border-orange-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{pack.promoName || 'Vente Flash'}</p>
                      </div>
                      <p className="text-2xl font-black text-orange-700">{pack.promoPrice} DH <span className="text-xs text-orange-300 line-through font-normal ml-1">{pack.price} DH</span></p>
                    </div>
                    <div className="text-right text-[10px] text-orange-500 font-bold space-y-0.5">
                      <p className="flex items-center justify-end gap-1"><Calendar size={10}/> Du {pack.promoStartDate ? format(new Date(pack.promoStartDate), 'dd/MM') : '?'}</p>
                      <p className="flex items-center justify-end gap-1 text-orange-700"><Calendar size={10}/> Au {pack.promoEndDate ? format(new Date(pack.promoEndDate), 'dd/MM') : '?'}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL : CRÉATION / ÉDITION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl my-auto relative animate-scale-in">
            
            <div className="p-8 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold font-serif text-sage">{formData.id ? 'Modifier le Pack' : 'Nouveau Forfait'}</h2>
                <p className="text-xs text-gray-400">Remplissez les informations pour configurer l'offre.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* CONFIGURATION DE BASE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <label className="block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nom public du forfait</span>
                    <input required className="w-full mt-1.5 border-2 border-gray-100 p-3 rounded-2xl outline-none focus:border-sage transition-colors" 
                      value={cleanValue(formData.name)} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="ex: Pilates 3 mois" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Code Technique (Unique)</span>
                    <input required disabled={!!formData.id} className="w-full mt-1.5 border-2 border-gray-100 p-3 rounded-2xl bg-gray-50 uppercase font-mono text-sm" 
                      value={cleanValue(formData.code)} onChange={e => setFormData({...formData, code: e.target.value.replace(/\s/g, '_').toUpperCase()})} placeholder="ex: PIL_3M" />
                  </label>
                </div>
                <div className="space-y-5">
                  <label className="block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Discipline</span>
                    <select className="w-full mt-1.5 border-2 border-gray-100 p-3 rounded-2xl bg-white outline-none focus:border-sage" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="PILATES">🧘 PILATES</option>
                      <option value="YOGA">🕉️ YOGA</option>
                      <option value="BELLY_DANCE">💃 BELLY DANCE</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Règle de Quota</span>
                    <select className="w-full mt-1.5 border-2 border-gray-100 p-3 rounded-2xl bg-white outline-none focus:border-sage" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="TWO_PER_WEEK">📅 2 SÉANCES / SEMAINE</option>
                      <option value="UNLIMITED">♾️ ACCÈS ILLIMITÉ</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-b pb-8">
                <label className="block">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Prix Standard</span>
                  <input required type="number" className="w-full mt-1.5 border-2 border-gray-100 p-3 rounded-2xl outline-none focus:border-sage" value={cleanValue(formData.price)} 
                    onChange={e => setFormData({...formData, price: e.target.value === '' ? 0 : parseFloat(e.target.value)})} />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Durée (Mois)</span>
                  <input required type="number" className="w-full mt-1.5 border-2 border-gray-100 p-3 rounded-2xl outline-none focus:border-sage" value={cleanValue(formData.months)} 
                    onChange={e => setFormData({...formData, months: e.target.value === '' ? 0 : parseInt(e.target.value)})} />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Jours Bonus</span>
                  <input required type="number" className="w-full mt-1.5 border-2 border-gray-100 p-3 rounded-2xl outline-none focus:border-sage" value={cleanValue(formData.bonusDays)} 
                    onChange={e => setFormData({...formData, bonusDays: e.target.value === '' ? 0 : parseInt(e.target.value)})} />
                </label>
              </div>

              {/* SECTION PROMOTION (LE BOUTON ON/OFF) */}
              <div className={`p-8 rounded-[2rem] transition-all border-2 ${formData.isPromoActive ? 'bg-orange-50/50 border-orange-200' : 'bg-gray-50 border-transparent'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${formData.isPromoActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      <Percent size={20}/>
                    </div>
                    <div>
                        <h3 className={`font-black uppercase text-sm ${formData.isPromoActive ? 'text-orange-700' : 'text-gray-400'}`}>Campagne Promotionnelle</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Appliquez un tarif spécial temporaire</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, isPromoActive: !formData.isPromoActive})}
                    className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.isPromoActive ? 'bg-orange-500' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${formData.isPromoActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>

                {formData.isPromoActive && (
                  <div className="space-y-5 animate-fade-in">
                    <label className="block">
                      <span className="text-[10px] font-bold text-orange-600 uppercase ml-1">Nom commercial (ex: Pack Ramadan)</span>
                      <input className="w-full mt-1.5 border-2 border-orange-100 p-3 rounded-2xl outline-none focus:border-orange-400" 
                        value={cleanValue(formData.promoName)} onChange={e => setFormData({...formData, promoName: e.target.value})} placeholder="ex: Offre Été 2025" />
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <label>
                        <span className="text-[10px] font-bold text-orange-600 uppercase ml-1">Prix Promo</span>
                        <input type="number" className="w-full mt-1.5 border-2 border-orange-100 p-3 rounded-2xl outline-none focus:border-orange-400" value={cleanValue(formData.promoPrice)} 
                          onChange={e => setFormData({...formData, promoPrice: e.target.value === '' ? 0 : parseFloat(e.target.value)})} />
                      </label>
                      <label>
                        <span className="text-[10px] font-bold text-orange-600 uppercase ml-1">Mois Promo</span>
                        <input type="number" className="w-full mt-1.5 border-2 border-orange-100 p-3 rounded-2xl outline-none focus:border-orange-400" value={cleanValue(formData.promoMonths)} 
                          onChange={e => setFormData({...formData, promoMonths: e.target.value === '' ? 0 : parseInt(e.target.value)})} />
                      </label>
                      <label>
                        <span className="text-[10px] font-bold text-orange-600 uppercase ml-1">Bonus Jours</span>
                        <input type="number" className="w-full mt-1.5 border-2 border-orange-100 p-3 rounded-2xl outline-none focus:border-orange-400" value={cleanValue(formData.promoBonusDays)} 
                          onChange={e => setFormData({...formData, promoBonusDays: e.target.value === '' ? 0 : parseInt(e.target.value)})} />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <label>
                        <span className="text-[10px] font-bold text-orange-600 uppercase ml-1 flex items-center gap-1"><Calendar size={12}/> Date de début</span>
                        <input type="date" className="w-full mt-1.5 border-2 border-orange-100 p-3 rounded-2xl outline-none bg-white" 
                          value={cleanValue(formData.promoStartDate)} onChange={e => setFormData({...formData, promoStartDate: e.target.value})} />
                      </label>
                      <label>
                        <span className="text-[10px] font-bold text-orange-600 uppercase ml-1 flex items-center gap-1"><Calendar size={12}/> Date de fin</span>
                        <input type="date" className="w-full mt-1.5 border-2 border-orange-100 p-3 rounded-2xl outline-none bg-white" 
                          value={cleanValue(formData.promoEndDate)} onChange={e => setFormData({...formData, promoEndDate: e.target.value})} />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase text-xs tracking-widest">Annuler</button>
                <button type="submit" className="flex items-center justify-center gap-2 bg-sage text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-sage/90 transition-all active:scale-95 uppercase text-xs tracking-widest">
                  <Save size={18}/> {formData.id ? 'Mettre à jour le pack' : 'Créer le pack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
