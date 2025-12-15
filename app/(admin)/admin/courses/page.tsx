'use client';
import { useEffect, useState, useMemo, FormEvent } from 'react'; // Ajout de FormEvent
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { addDays, format, set, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Users, X } from 'lucide-react';

interface Schedule { id: number; title: string; dayOfWeek: number; startTime: string; duration: number; coachName: string; capacity: number; }
interface Participant { id: number; nom: string; prenom: string; telephone: string; }
interface SelectedSession { schedule: Schedule; date: Date; participants: Participant[]; }

export default function AdminPlanningPage() {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [availability, setAvailability] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [sessionToView, setSessionToView] = useState<SelectedSession | null>(null);

    const [formData, setFormData] = useState({ title: '', dayOfWeek: '1', startTime: '18:00', duration: 60, coachName: '', capacity: 5 });

    const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)), []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [schedulesRes, availabilityRes] = await Promise.all([
                api.get('/admin/schedules'),
                api.get('/planning/availability'),
            ]);
            setSchedules(schedulesRes.data.sort((a: Schedule, b: Schedule) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)));
            setAvailability(availabilityRes.data);
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    };
    
    useEffect(() => { fetchData(); }, []);
    
    // RENOMMÉ : handleCreateSubmit -> handleSubmit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/schedules', formData);
            setCreateModalVisible(false);
            fetchData();
        } catch (err) { alert("Erreur lors de la sauvegarde."); }
    };

    const openCreateModal = () => {
        setFormData({ title: '', dayOfWeek: '1', startTime: '18:00', duration: 60, coachName: '', capacity: 5 });
        setCreateModalVisible(true);
    };

    const handleViewParticipants = async (schedule: Schedule, date: Date) => {
        const [hour, minute] = schedule.startTime.split(':');
        const sessionDate = set(date, { hours: parseInt(hour), minutes: parseInt(minute) });
        try {
            const response = await api.get<Participant[]>(`/admin/sessions/${sessionDate.toISOString()}/${schedule.id}/participants`);
            setSessionToView({ schedule, date: sessionDate, participants: response.data });
        } catch (error) { alert("Impossible de charger les participants."); }
    };
    
    if (loading) return <p>Chargement...</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-serif text-3xl font-bold text-sage">Planning de la Semaine</h1>
                {user && user.role === 'ADMIN' && (
                    <button onClick={openCreateModal} className="flex items-center gap-2 bg-oasis-green text-white px-4 py-2 rounded-lg shadow-md">
                        <Plus size={20} /> Nouveau Créneau
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-1 bg-gray-200 rounded-xl p-1 shadow-inner">
              {weekDays.map(date => {
                const dayOfWeek = getDay(date) === 0 ? 7 : getDay(date);
                const daySchedules = schedules.filter(s => s.dayOfWeek === dayOfWeek);

                return (
                  <div key={date.toISOString()} className="bg-white rounded-lg p-3">
                    <h2 className="font-bold text-center capitalize">{format(date, 'eee', { locale: fr })} <span className="text-gray-400 font-normal">{format(date, 'd')}</span></h2>
                    <div className="space-y-2 mt-2">
                      {daySchedules.map(schedule => {
                        const reservationDate = set(date, { hours: parseInt(schedule.startTime.split(':')[0]), minutes: parseInt(schedule.startTime.split(':')[1]) });
                        const availabilityKey = `${schedule.id}-${reservationDate.toISOString().split('T')[0]}`;
                        const placesTaken = availability[availabilityKey] || 0;
                        
                        return (
                          <div key={schedule.id} onClick={() => handleViewParticipants(schedule, date)} 
                               className="bg-gray-50 p-3 rounded-lg border-l-4 border-sage/50 cursor-pointer hover:bg-sage/10 transition-colors">
                            <p className="font-bold text-sm text-sage">{schedule.startTime}</p>
                            <p className="text-xs text-gray-700">{schedule.title}</p>
                            <p className={`text-xs mt-2 font-bold flex items-center gap-1 ${placesTaken > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                              <Users size={12}/> {placesTaken} / {schedule.capacity}
                            </p>
                          </div>
                        );
                      })}
                       {daySchedules.length === 0 && <div className="h-24"></div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MODAL DES PARTICIPANTS */}
            {sessionToView && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
                        <button onClick={() => setSessionToView(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"><X size={24}/></button>
                        <h3 className="font-bold text-lg text-sage">{sessionToView.schedule.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{format(sessionToView.date, 'eeee d MMMM yyyy \'à\' HH:mm', { locale: fr })}</p>
                        <h4 className="font-bold text-sm mb-2">Participants ({sessionToView.participants.length} / {sessionToView.schedule.capacity})</h4>
                        {sessionToView.participants.length > 0 ? (
                            <ul className="divide-y max-h-60 overflow-y-auto border-t">
                                {sessionToView.participants.map(p => (
                                    <li key={p.id} className="py-2 flex justify-between items-center">
                                        <span>{p.prenom} {p.nom}</span>
                                        <a href={`tel:${p.telephone}`} className="text-xs text-blue-500 hover:underline">{p.telephone}</a>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-sm text-gray-400 italic border-t pt-4">Aucun participant.</p>}
                    </div>
                </div>
            )}
            {isCreateModalVisible && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
                        <h3 className="font-bold text-xl mb-6">{formData.id ? 'Modifier' : 'Ajouter'} un créneau récurrent</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required placeholder="Titre (ex: Pilates Débutant)" className="w-full border p-2 rounded"
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Jour de la semaine</label>
                                    <select required className="w-full border p-2 rounded mt-1 bg-white"
                                        value={formData.dayOfWeek} onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}>
                                        <option value="1">Lundi</option>
                                        <option value="2">Mardi</option>
                                        <option value="3">Mercredi</option>
                                        <option value="4">Jeudi</option>
                                        <option value="5">Vendredi</option>
                                        <option value="6">Samedi</option>
                                        <option value="7">Dimanche</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Heure de début</label>
                                    <input required type="time" className="w-full border p-2 rounded mt-1"
                                        value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                                </div>
                            </div>
                            
                            <input required placeholder="Nom du Coach" className="w-full border p-2 rounded"
                                value={formData.coachName} onChange={e => setFormData({...formData, coachName: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Durée (minutes)</label>
                                    <input required type="number" className="w-full border p-2 rounded mt-1"
                                        value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 0})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Capacité (places)</label>
                                    <input required type="number" className="w-full border p-2 rounded mt-1"
                                        value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 mt-2 border-t">
                                <button type="button" onClick={() => setCreateModalVisible(false)} className="px-4 py-2 text-gray-600">Annuler</button>
                                <button type="submit" className="px-4 py-2 bg-sage text-white rounded font-bold">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}