'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { format, isAfter, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  XCircle,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Reservation {
  id: number;
  reservationDate: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  schedule: {
    title: string;
    startTime: string;
  };
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeSub, setActiveSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [resRes, profileRes] = await Promise.all([
        api.get<Reservation[]>('/reservations/me'),
        api.get('/users/me')
      ]);
      
      // Trier les réservations par date (les plus proches en premier)
      const sorted = resRes.data.sort((a, b) => 
        new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime()
      );
      setReservations(sorted);

      // Récupérer l'abonnement actif
      const sub = profileRes.data.subscriptions?.find((s: any) => s.status === 'ACTIVE');
      setActiveSub(sub);
    } catch (error) {
      toast.error("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Voulez-vous vraiment annuler votre place pour ce cours ?")) return;
    
    setCancellingId(id);
    const tid = toast.loading("Annulation...");
    try {
      await api.delete(`/reservations/${id}`);
      toast.success("Réservation annulée", { id: tid });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'annulation", { id: tid });
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  
  // Séparer les cours à venir des cours passés
  const upcoming = reservations.filter(r => 
    r.status === 'CONFIRMED' && isAfter(parseISO(r.reservationDate), now)
  );
  
  const history = reservations.filter(r => 
    r.status !== 'CONFIRMED' || !isAfter(parseISO(r.reservationDate), now)
  ).reverse(); // Inverser pour avoir le plus récent en haut de l'historique

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-sage">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium">Chargement de vos réservations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-10">
      
      {/* HEADER & RÉSUMÉ ABONNEMENT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-sage font-serif">Mes Réservations</h1>
          <p className="text-gray-500 text-sm">Gérez votre planning et consultez vos activités.</p>
        </div>
        <Link 
          href="/dashboard/planning" 
          className="flex items-center gap-2 bg-sage text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-sage/90 transition-all active:scale-95 text-sm"
        >
          Réserver un cours <ArrowRight size={16} />
        </Link>
      </div>

      {/* CARTE STATUT ABONNEMENT */}
      <div className="bg-white border border-sage/10 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
          <Calendar size={120} />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-sage/10 p-4 rounded-2xl text-sage">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-sage/40 tracking-widest">Forfait Actif</p>
            <h2 className="text-xl font-bold text-gray-800">
              {activeSub?.packageName || "Aucun abonnement actif"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2 py-0.5 bg-sage/10 text-sage rounded-md uppercase">
                {activeSub?.type === 'UNLIMITED' ? '♾️ Illimité' : '📅 2 séances / semaine'}
              </span>
            </div>
          </div>
        </div>
        {activeSub?.endDate && (
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Valable jusqu'au</p>
            <p className="font-bold text-gray-700">
              {format(parseISO(activeSub.endDate), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>
        )}
      </div>

      {/* SECTION : À VENIR */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 ml-2">
          <Clock size={20} className="text-sage" /> Mes prochains cours
        </h3>
        
        {upcoming.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {upcoming.map((res) => (
              <div 
                key={res.id} 
                className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-center group gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="bg-sage/5 text-sage p-3 rounded-2xl group-hover:bg-sage group-hover:text-white transition-colors">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-lg leading-tight">{res.schedule.title}</p>
                        <p className="text-sm text-gray-500 capitalize mt-1">
                            {format(parseISO(res.reservationDate), 'eeee d MMMM', { locale: fr })} à {res.schedule.startTime}
                        </p>
                    </div>
                </div>
                <button 
                  onClick={() => handleCancel(res.id)}
                  disabled={cancellingId === res.id}
                  className="w-full sm:w-auto px-6 py-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {cancellingId === res.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Annuler
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <AlertCircle className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-gray-400 font-medium">Vous n'avez pas encore de réservations à venir.</p>
            <Link href="/dashboard/planning" className="text-sage font-bold text-sm hover:underline mt-2 inline-block">
              Consulter le planning →
            </Link>
          </div>
        )}
      </section>

      {/* SECTION : HISTORIQUE */}
      {history.length > 0 && (
        <section className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-2">Historique de mes séances</h3>
            <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-50">
                {history.map((res) => (
                    <div key={res.id} className="p-4 flex justify-between items-center group hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={res.status === 'CANCELLED' ? 'text-gray-300' : 'text-sage/40'}>
                             {res.status === 'CANCELLED' ? <XCircle size={18}/> : <CheckCircle size={18}/>}
                           </div>
                           <div>
                              <p className={`font-bold text-sm ${res.status === 'CANCELLED' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                {res.schedule.title}
                              </p>
                              <p className="text-[10px] text-gray-400 uppercase">
                                {format(parseISO(res.reservationDate), 'dd MMM yyyy', { locale: fr })}
                              </p>
                           </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                            res.status === 'CANCELLED' 
                            ? 'bg-red-50 text-red-400' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                            {res.status === 'CANCELLED' ? 'Annulé' : 'Terminé'}
                        </span>
                    </div>
                ))}
            </div>
        </section>
      )}
    </div>
  );
}