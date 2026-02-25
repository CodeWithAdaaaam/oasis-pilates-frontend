'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { 
  Users, Clock, Calendar, Phone, 
  ChevronRight, UserCheck, Loader2, Inbox 
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

// --- TYPES ---
interface Participant {
    user: {
        nom: string;
        prenom: string;
        telephone: string;
    };
}

interface CoachSchedule {
    id: number;
    title: string;
    dayOfWeek: number;
    startTime: string;
    duration: number;
    level: string;
    capacity: number;
    reservations: Participant[];
}

const DAYS_MAP = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function CoachDashboard() {
    const [schedules, setSchedules] = useState<CoachSchedule[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCoachData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/coach/dashboard');
            setSchedules(res.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération du planning");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoachData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-sage">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold uppercase tracking-widest text-xs">Chargement de vos cours...</p>
            </div>
        );
    }

    if (schedules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
                <Inbox size={60} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Aucun cours ne vous est assigné.</p>
                <p className="text-sm">Contactez l'administration si cela semble être une erreur.</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-gray-800 font-serif">Mon Planning</h1>
                <p className="text-sage font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <UserCheck size={16} /> Coach Connecté
                </p>
            </div>

            {/* Liste des cours groupés par jour */}
            <div className="grid grid-cols-1 gap-8">
                {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                    const dayClasses = schedules.filter(s => s.dayOfWeek === dayNum);
                    if (dayClasses.length === 0) return null;

                    return (
                        <div key={dayNum} className="space-y-4">
                            <h2 className="text-xl font-black text-sage border-b-2 border-sage/10 pb-2 flex items-center gap-2">
                                <Calendar size={20} /> {DAYS_MAP[dayNum]}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {dayClasses.map((cls) => (
                                    <CoachClassCard key={cls.id} cls={cls} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// --- SOUS-COMPOSANT : CARTE DE COURS ---
function CoachClassCard({ cls }: { cls: CoachSchedule }) {
    const [isOpen, setIsOpen] = useState(false);
    const seatsLeft = cls.capacity - cls.reservations.length;

    return (
        <div className={`bg-white rounded-[2rem] border-2 transition-all overflow-hidden ${isOpen ? 'border-sage shadow-xl' : 'border-gray-50 shadow-sm'}`}>
            {/* Header de la carte */}
            <div 
                className="p-6 cursor-pointer flex justify-between items-center" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="bg-sage text-white px-3 py-1 rounded-lg text-xs font-black tracking-tighter">
                            {cls.startTime}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${cls.level === 'BEGINNER' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                            {cls.level === 'BEGINNER' ? 'Débutant' : 'Avancé'}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">{cls.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase">
                        <span className="flex items-center gap-1"><Clock size={12}/> {cls.duration} min</span>
                        <span className="flex items-center gap-1"><Users size={12}/> {cls.reservations.length}/{cls.capacity}</span>
                    </div>
                </div>
                <ChevronRight className={`text-gray-300 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </div>

            {/* Détails : Liste des participants */}
            {isOpen && (
                <div className="px-6 pb-6 space-y-4 animate-slide-down">
                    <div className="h-px bg-gray-50 w-full mb-4"></div>
                    
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between">
                            <span>Élèves inscrits</span>
                            <span className={seatsLeft > 0 ? 'text-orange-400' : 'text-red-500'}>
                                {seatsLeft} places libres
                            </span>
                        </p>
                        
                        {cls.reservations.length > 0 ? (
                            <div className="grid gap-2">
                                {cls.reservations.map((res, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-700">
                                                {res.user.prenom} {res.user.nom}
                                            </span>
                                        </div>
                                        <a href={`tel:${res.user.telephone}`} className="p-2 bg-white text-sage rounded-xl shadow-sm hover:scale-110 transition-transform active:scale-95">
                                            <Phone size={14} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs italic text-gray-300 py-4 text-center">Aucune inscription pour le moment.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}