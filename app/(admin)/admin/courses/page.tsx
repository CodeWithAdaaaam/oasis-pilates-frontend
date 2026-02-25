'use client';

import { useEffect, useState, useMemo, FormEvent } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { addDays, format, set, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Plus, Users, X, Lock, Unlock, UserPlus, 
  Trash2, Phone, Loader2, Moon, Sun, Globe, CheckCircle, Edit3, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- INTERFACES ---
interface Schedule { 
    id: number; 
    title: string; 
    dayOfWeek: number; 
    startTime: string; 
    duration: number; 
    coachName: string; 
    capacity: number; 
    level: string; 
    period: string; 
}
interface Participant { 
    id: number; 
    nom: string; 
    prenom: string; 
    telephone: string; 
    reservationId: number; 
}
interface SelectedSession { 
    schedule: Schedule; 
    date: Date; 
    participants: Participant[]; 
    isBlocked: boolean; 
}
interface Client { id: number; nom: string; prenom: string; }

export default function AdminPlanningPage() {
    const { user } = useAuth();
    
    // États
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [availability, setAvailability] = useState<any>({});
    const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Périodes
    const [currentViewPeriod, setCurrentViewPeriod] = useState<'NORMAL' | 'RAMADAN'>('NORMAL');
    const [activeGlobalPeriod, setActiveGlobalPeriod] = useState<'NORMAL' | 'RAMADAN' | null>(null);
    
    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [sessionToView, setSessionToView] = useState<SelectedSession | null>(null);

    // Formulaire
    const [formData, setFormData] = useState({ 
        id: null as number | null,
        title: '', dayOfWeek: '1', startTime: '10:00', 
        duration: 50, coachName: '', capacity: 5, level: 'ALL_LEVELS'
    });

    const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)), []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sRes, aRes, bRes, pRes] = await Promise.all([
                api.get(`/admin/schedules?period=${currentViewPeriod}`),
                api.get('/planning/availability'),
                api.get('/admin/planning/blocked'),
                api.get('/schedule/period')
            ]);
            setSchedules(sRes.data.schedules || sRes.data);
            setAvailability(aRes.data);
            setBlockedSlots(bRes.data);
            setActiveGlobalPeriod(pRes.data.period);
        } catch (e) {
            toast.error("Erreur de chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [currentViewPeriod]);

    const handleActivatePeriod = async () => {
        if (!confirm(`Basculer tout le studio en mode ${currentViewPeriod} ?`)) return;
        try {
            await api.put('/schedule/period', { period: currentViewPeriod });
            setActiveGlobalPeriod(currentViewPeriod);
            toast.success(`Studio passé en mode ${currentViewPeriod}`);
        } catch (e) {
            toast.error("Erreur de bascule.");
        }
    };

    const handleEditInit = (schedule: Schedule) => {
        setFormData({
            id: schedule.id,
            title: schedule.title,
            dayOfWeek: schedule.dayOfWeek.toString(),
            startTime: schedule.startTime,
            duration: schedule.duration,
            coachName: schedule.coachName,
            capacity: schedule.capacity,
            level: schedule.level
        });
        setIsCreateModalOpen(true);
    };

    const handleOpenSession = async (schedule: Schedule, date: Date) => {
        const [h, m] = schedule.startTime.split(':');
        const sessionDate = set(date, { hours: parseInt(h), minutes: parseInt(m), seconds: 0, milliseconds: 0 });
        const dStr = sessionDate.toISOString().split('T')[0];
        const isBlocked = blockedSlots.some(bs => bs.scheduleId === schedule.id && bs.date.startsWith(dStr));
        
        try {
            const res = await api.get(`/admin/sessions/${sessionDate.toISOString()}/${schedule.id}/participants`);
            setSessionToView({ schedule, date: sessionDate, participants: res.data, isBlocked });
        } catch (e) {
            toast.error("Erreur participants.");
        }
    };

    const handleSaveSchedule = async (e: FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Enregistrement...");
        try {
            const payload = { ...formData, period: currentViewPeriod };
            if (formData.id) await api.put(`/admin/schedules/${formData.id}`, payload);
            else await api.post('/admin/schedules', payload);
            toast.success("Enregistré !", { id: tid });
            setIsCreateModalOpen(false);
            fetchData();
        } catch (e) {
            toast.error("Erreur.", { id: tid });
        }
    };

    if (loading && schedules.length === 0) return (
        <div className="flex flex-col items-center justify-center h-screen text-sage">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p className="font-bold uppercase text-xs tracking-widest">Chargement...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-20">
            {/* HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-sage font-serif">Planning {currentViewPeriod === 'RAMADAN' ? '🌙' : '🗓️'}</h1>
                    <div className="flex bg-gray-100 p-1 rounded-lg border mt-2 w-fit">
                        <button onClick={() => setCurrentViewPeriod('NORMAL')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${currentViewPeriod === 'NORMAL' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>Standard</button>
                        <button onClick={() => setCurrentViewPeriod('RAMADAN')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${currentViewPeriod === 'RAMADAN' ? 'bg-indigo-900 text-white shadow-sm' : 'text-gray-400'}`}>Ramadan</button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Statut Live</span>
                            <div className="flex items-center gap-2 font-bold text-sm text-gray-700">
                                {activeGlobalPeriod === 'NORMAL' ? <Sun size={14} className="text-orange-500"/> : <Moon size={14} className="text-indigo-600"/>}
                                {activeGlobalPeriod}
                            </div>
                        </div>
                        {activeGlobalPeriod !== currentViewPeriod && (
                            <button onClick={handleActivatePeriod} className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all animate-pulse">
                                <Globe size={16} />
                            </button>
                        )}
                    </div>

                    <button 
                        onClick={() => { setFormData({ id: null, title: '', dayOfWeek: '1', startTime: '10:00', duration: 50, coachName: '', capacity: 5, level: 'ALL_LEVELS' }); setIsCreateModalOpen(true); }}
                        className="flex items-center gap-2 bg-sage text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-xs uppercase"
                    >
                        <Plus size={18} /> Nouveau Créneau
                    </button>
                </div>
            </div>

            {/* GRILLE */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {weekDays.map(date => {
                    const dOfWeek = getDay(date) === 0 ? 7 : getDay(date);
                    const daySchedules = schedules.filter(s => s.dayOfWeek === dOfWeek).sort((a,b) => a.startTime.localeCompare(b.startTime));

                    return (
                        <div key={date.toISOString()} className="flex flex-col gap-2">
                            <div className="bg-white border p-3 rounded-xl text-center shadow-sm">
                                <p className="font-bold capitalize text-sage text-sm">{format(date, 'eeee', { locale: fr })}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{format(date, 'd MMM')}</p>
                            </div>
                            <div className="space-y-2">
                                {daySchedules.length === 0 ? (
                                    <div className="h-20 border border-dashed rounded-xl flex items-center justify-center text-gray-200 text-[10px] uppercase font-bold italic">Repos</div>
                                ) : (
                                    daySchedules.map(s => {
                                        const dStr = date.toISOString().split('T')[0];
                                        const isBlocked = blockedSlots.some(bs => bs.scheduleId === s.id && bs.date.startsWith(dStr));
                                        const count = availability[`${s.id}-${dStr}`] || 0;
                                        return (
                                            <div key={s.id} onClick={() => handleOpenSession(s, date)} className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md bg-white relative ${isBlocked ? 'border-orange-200 bg-orange-50' : 'border-gray-100 hover:border-sage'}`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-black text-sage text-xs">{s.startTime}</span>
                                                    {isBlocked && <Lock size={12} className="text-orange-400"/>}
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-700 truncate">{s.title}</p>
                                                <div className="mt-2 flex justify-between items-center text-[8px] font-black uppercase">
                                                    <span className={`px-1 rounded ${s.level === 'BEGINNER' ? 'text-green-500 bg-green-50' : s.level === 'ADVANCED' ? 'text-purple-500 bg-purple-50' : 'text-blue-500 bg-blue-50'}`}>{s.level}</span>
                                                    <span className="text-gray-400">{count}/{s.capacity} <Users size={8} className="inline"/></span>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL PARTICIPANTS & SUPPRESSION */}
            {sessionToView && (
                <ParticipantsModal 
                    session={sessionToView} 
                    onClose={() => setSessionToView(null)} 
                    onRefresh={fetchData} 
                    onEdit={(s) => { setSessionToView(null); handleEditInit(s); }} 
                />
            )}

            {/* MODAL CRÉATION */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] w-full max-w-lg shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-sage">{formData.id ? 'Modifier' : 'Nouveau cours'}</h3>
                            <button onClick={() => setIsCreateModalOpen(false)}><X/></button>
                        </div>
                        <form onSubmit={handleSaveSchedule} className="space-y-4">
                            <input required placeholder="Titre" value={formData.title} className="w-full border-2 p-3 rounded-xl outline-none focus:border-sage" onChange={e => setFormData({...formData, title: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="w-full border-2 p-3 rounded-xl bg-white" value={formData.dayOfWeek} onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}>
                                    <option value="1">Lundi</option><option value="2">Mardi</option><option value="3">Mercredi</option><option value="4">Jeudi</option><option value="5">Vendredi</option><option value="6">Samedi</option><option value="7">Dimanche</option>
                                </select>
                                <input required type="time" className="w-full border-2 p-3 rounded-xl" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                            </div>
                            <select className="w-full border-2 p-3 rounded-xl bg-white font-bold text-sage" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                                <option value="ALL_LEVELS">🔓 TOUS NIVEAUX</option>
                                <option value="BEGINNER">🌱 DÉBUTANT</option>
                                <option value="ADVANCED">🛡️ AVANCÉ</option>
                            </select>
                            <input required placeholder="Coach" value={formData.coachName} className="w-full border-2 p-3 rounded-xl" onChange={e => setFormData({...formData, coachName: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" placeholder="Durée" value={formData.duration} className="w-full border-2 p-3 rounded-xl" onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} />
                                <input required type="number" placeholder="Capacité" value={formData.capacity} className="w-full border-2 p-3 rounded-xl" onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
                            </div>
                            <button type="submit" className="w-full bg-sage text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg">Sauvegarder</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- MODAL PARTICIPANTS ---
function ParticipantsModal({ session, onClose, onRefresh, onEdit }: any) {
    const [clients, setClients] = useState<Client[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => { if (showAddForm) api.get('/admin/clients').then(res => setClients(res.data)); }, [showAddForm]);

    const handleAction = async (promise: Promise<any>, successMsg: string) => {
        setLoadingAction(true);
        try { await promise; toast.success(successMsg); onRefresh(); onClose(); } 
        catch (e: any) { toast.error(e.response?.data?.message || "Erreur"); } 
        finally { setLoadingAction(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative animate-scale-in">
                {loadingAction && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-[2.5rem]"><Loader2 className="animate-spin text-sage" size={32}/></div>}
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-gray-600"><X size={24}/></button>
                
                <h3 className="text-xl font-bold text-sage">{session.schedule.title}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 mt-1 flex items-center gap-2">
                    <Calendar size={12}/> {format(session.date, 'eeee d MMMM à HH:mm', { locale: fr })}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    <button onClick={() => onEdit(session.schedule)} className="flex items-center gap-1.5 px-4 py-2 bg-sage/10 text-sage rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-sage/20 transition-all">
                        <Edit3 size={12}/> Modifier
                    </button>
                    
                    {/* ✅ BOUTON SUPPRIMER LE COURS */}
                    <button 
                        onClick={() => { if(confirm("⚠️ SUPPRIMER CE COURS DÉFINITIVEMENT ?\nCela annulera aussi toutes les réservations liées.")) { handleAction(api.delete(`/admin/schedules/${session.schedule.id}`), "Cours supprimé"); } }} 
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                        <Trash2 size={12}/> Supprimer
                    </button>

                    <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">
                        <UserPlus size={12}/> Inscrire
                    </button>
                    
                    <button onClick={() => handleAction(api.post(`/admin/planning/${session.isBlocked ? 'unblock' : 'block'}`, { scheduleId: session.schedule.id, date: session.date }), "Statut mis à jour")} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${session.isBlocked ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        {session.isBlocked ? <Unlock size={12}/> : <Lock size={12}/>} {session.isBlocked ? 'Débloquer' : 'Bloquer'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="mb-6 p-4 bg-blue-50/30 rounded-2xl flex gap-2 border border-blue-50">
                        <select className="flex-1 p-2 rounded-xl text-sm bg-white outline-none" value={selectedId} onChange={e => setSelectedId(e.target.value)}><option value="">Choisir un client...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}</select>
                        <button onClick={() => handleAction(api.post('/reservations', { scheduleId: session.schedule.id, date: session.date.toISOString(), clientId: selectedId }), "Inscrit !")} disabled={!selectedId} className="bg-blue-600 text-white px-4 rounded-xl font-bold text-xs">OK</button>
                    </div>
                )}

                <div className="space-y-3">
                    <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest ml-1">Participants ({session.participants.length}/{session.schedule.capacity})</h4>
                    <div className="max-h-60 overflow-y-auto border-2 border-gray-50 rounded-[2rem] divide-y divide-gray-50 custom-scrollbar">
                        {session.participants.length > 0 ? session.participants.map(p => (
                            <div key={p.id} className="p-4 flex justify-between items-center hover:bg-gray-50 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center text-sage font-black text-[10px]">{p.prenom[0]}{p.nom[0]}</div>
                                    <div><p className="font-bold text-gray-800 text-sm">{p.prenom} {p.nom}</p><p className="text-[10px] text-gray-400 flex items-center gap-1"><Phone size={10}/> {p.telephone}</p></div>
                                </div>
                                <button onClick={() => { if(confirm("Annuler réservation ?")) handleAction(api.delete(`/admin/reservations/${p.reservationId}`), "Annulée"); }} className="p-2 text-red-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                            </div>
                        )) : <div className="p-10 text-center text-gray-300 italic text-xs">Aucun participant</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}