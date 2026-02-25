'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { addDays, format, set, getDay, isSameWeek, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, Lock, CheckCircle, AlertCircle, Calendar, Trophy } from 'lucide-react';
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
  level: string; // Ajout du niveau
  isLocked?: boolean;
}

interface Progress {
  count: number;
  required: number;
  isUnlocked: boolean;
}

interface MyReservation {
  id: number;
  reservationDate: string;
  scheduleId: number;
  status: 'CONFIRMED' | 'CANCELLED';
}

interface UserProfile {
  subscriptions: any[];
  reservations: MyReservation[];
}

export default function BookingPage() {
  const { user: authUser } = useAuth();
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [availability, setAvailability] = useState<{ [key: string]: number }>({});
  const [userProfile, setUserProfile] = useState<UserProfile>({ subscriptions: [], reservations: [] });
  const [progress, setProgress] = useState<Progress>({ count: 0, required: 5, isUnlocked: false });
  
  const [selectedSchedule, setSelectedSchedule] = useState<{ schedule: Schedule, date: Date } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)), []);

  const fetchData = useCallback(async () => {
    try {
        const [schedulesRes, availabilityRes, profileRes] = await Promise.all([
          api.get('/client/schedules'), // ✅ On appelle la route sécurisée
          api.get('/planning/availability'),
          api.get<UserProfile>('/users/me')
      ]);

        const rawData = schedulesRes.data;

        // Gestion universelle de la réponse (Tableau vs Objet)
        if (Array.isArray(rawData)) {
            setSchedules(rawData); // Ancien format ou Admin
        } else if (rawData && typeof rawData === 'object') {
            setSchedules(rawData.schedules || []); // Nouveau format Client
            if (rawData.progress) {
                setProgress(rawData.progress);
            }
        } else {
            setSchedules([]);
        }

        setAvailability(availabilityRes.data || {});
        setUserProfile(profileRes.data || { subscriptions: [], reservations: [] });
        
    } catch (error) {
        console.error("Erreur chargement planning:", error);
        toast.error("Erreur de connexion au planning");
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authUser) fetchData();
  }, [authUser, fetchData]);

  const activeSub = userProfile?.subscriptions?.find(sub => sub.status === 'ACTIVE');
  const isUnlimited = activeSub?.type === 'UNLIMITED';

  const getReservationsCountForWeek = (targetDate: Date) => {
    return (userProfile?.reservations || []).filter(r => 
      r.status === 'CONFIRMED' && 
      isSameWeek(parseISO(r.reservationDate), targetDate, { weekStartsOn: 1 })
    ).length;
  };

  const handleBookClick = (schedule: Schedule, date: Date) => {
    setSelectedSchedule({ schedule, date });
    setIsModalOpen(true);
    setFeedback(null);
  };

  const confirmBooking = async () => {
    if (!selectedSchedule || !authUser) return;
    setBookingLoading(true);
    const { schedule, date } = selectedSchedule;
    const [hour, minute] = schedule.startTime.split(':');
    const reservationDate = set(date, { hours: parseInt(hour), minutes: parseInt(minute), seconds: 0, milliseconds: 0 });
    
    try {
      await api.post('/reservations', { scheduleId: schedule.id, date: reservationDate.toISOString() });
      setFeedback({ type: 'success', message: 'Place réservée !' });
      await fetchData(); // Recharge pour mettre à jour la jauge
      setTimeout(() => { setIsModalOpen(false); setFeedback(null); }, 1500);
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.response?.data?.error || "Erreur de réservation" });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col items-center md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sage">Réserver un cours</h1>
          <p className="text-sage/60 text-sm">Choisissez votre créneau et rejoignez-nous.</p>
        </div>
        
        {!loading && activeSub && (
          <div className="bg-sage/10 px-5 py-3 rounded-2xl border border-sage/10 text-right">
            <p className="text-[10px] font-black uppercase text-sage/50 tracking-widest">Votre formule</p>
            <p className="font-bold text-sage text-sm mt-0.5">
              {isUnlimited ? "🚀 Illimité" : "📅 2 cours / sem."}
            </p>
          </div>
        )}
      </div>
      
      {/* --- BARRE DE PROGRESSION (Débutants uniquement) --- */}
      {!loading && !progress.isUnlocked && (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-sage/10 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-[-10px] top-[-10px] p-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Trophy size={120} className="text-sage" />
          </div>
          
          <div className="relative z-10">
              <div className="flex justify-between items-end mb-3">
                  <div>
                      <h3 className="text-lg font-bold text-sage flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                        Niveau Débutant
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Complétez encore <strong className="text-sage">{progress.required - progress.count} cours</strong> pour débloquer le niveau Avancé.
                      </p>
                  </div>
                  <span className="text-3xl font-black text-sage">
                      {progress.count}<span className="text-sm text-gray-300 font-medium">/{progress.required}</span>
                  </span>
              </div>

              {/* Jauge animée */}
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                      className="h-full bg-gradient-to-r from-sage to-green-400 transition-all duration-1000 ease-out rounded-full relative"
                      style={{ width: `${Math.min(100, (progress.count / progress.required) * 100)}%` }}
                  ></div>
              </div>
          </div>
        </div>
      )}

      {/* --- CALENDRIER --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-sage">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p className="text-xs font-bold uppercase tracking-widest">Chargement du planning...</p>
          </div>
        ) : (
          weekDays.map((date) => {
            const dayOfWeek = getDay(date) === 0 ? 7 : getDay(date);
            const daySchedules = (Array.isArray(schedules) ? schedules : [])
              .filter(s => s.dayOfWeek === dayOfWeek)
              .sort((a,b) => a.startTime.localeCompare(b.startTime));
            
            const resThisWeek = getReservationsCountForWeek(date);

            return (
              <div key={date.toISOString()} className="flex flex-col gap-3">
                <div className={`text-center py-3 rounded-xl border ${format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-sage text-white border-sage shadow-lg shadow-sage/20' : 'bg-white border-sage/10 text-sage'}`}>
                  <h3 className="font-serif text-lg font-bold capitalize">{format(date, 'eee', { locale: fr })}</h3>
                  <p className="text-xs opacity-80 font-medium">{format(date, 'd MMM')}</p>
                </div>
                
                <div className="flex flex-col gap-3 h-full">
                  {daySchedules.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-2xl min-h-[100px]">
                      <p className="text-gray-300 text-[10px] uppercase font-bold tracking-widest">Repos</p>
                    </div>
                  ) : (
                    daySchedules.map((schedule) => {
                      const [hour, minute] = schedule.startTime.split(':');
                      const reservationDate = set(date, { hours: parseInt(hour), minutes: parseInt(minute), seconds: 0, milliseconds: 0 });
                      const availabilityKey = `${schedule.id}-${format(reservationDate, 'yyyy-MM-dd')}`;
                      const placesTaken = availability[availabilityKey] || 0;
                      
                      const isBooked = userProfile?.reservations?.some(r => 
                        r.scheduleId === schedule.id && 
                        format(parseISO(r.reservationDate), 'yyyy-MM-dd HH:mm') === format(reservationDate, 'yyyy-MM-dd HH:mm') &&
                        r.status === 'CONFIRMED'
                      );

                      return (
                        <BookingCard 
                          key={`${schedule.id}-${date}`} 
                          schedule={schedule} 
                          placesTaken={placesTaken} 
                          isUnlimited={isUnlimited}
                          resThisWeek={resThisWeek}
                          isBooked={isBooked || false} 
                          onBook={() => handleBookClick(schedule, date)} 
                        />
                      );
                    })
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- MODAL DE CONFIRMATION --- */}
      {isModalOpen && selectedSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full animate-scale-in relative overflow-hidden">
            
            {feedback?.type === 'success' ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
                    <CheckCircle size={40} />
                </div>
                <h3 className="font-serif text-3xl font-bold text-sage">Confirmé !</h3>
                <p className="text-gray-500 text-sm">Votre place est réservée.</p>
              </div>
            ) : feedback?.type === 'error' ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                    <AlertCircle size={40} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-red-500">Oups !</h3>
                <p className="text-gray-500 text-sm px-4">{feedback.message}</p>
                <button onClick={() => { setIsModalOpen(false); setFeedback(null); }} className="w-full py-4 bg-gray-100 rounded-2xl font-bold hover:bg-gray-200 transition-colors">Fermer</button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-bold text-sage text-center mb-6">Confirmer la séance ?</h3>
                
                <div className="bg-sage/5 p-6 rounded-3xl space-y-3 mb-8 border border-sage/10">
                  <div className="flex justify-center">
                      <Calendar size={32} className="text-sage/40 mb-2"/>
                  </div>
                  <p className="text-center font-black text-sage text-lg leading-tight uppercase tracking-wide">{selectedSchedule.schedule.title}</p>
                  <div className="w-10 h-1 bg-sage/20 mx-auto rounded-full"></div>
                  <p className="text-center text-sm text-gray-500 font-medium capitalize">
                    {format(selectedSchedule.date, 'eeee d MMMM', {locale: fr})} à <span className="text-sage font-bold">{selectedSchedule.schedule.startTime}</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-colors">Annuler</button>
                  <button onClick={confirmBooking} disabled={bookingLoading} className="flex-1 py-4 rounded-2xl bg-sage text-white font-bold shadow-xl shadow-sage/20 hover:scale-[1.02] active:scale-95 transition-all">
                    {bookingLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Confirmer'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- SOUS-COMPOSANT CARTE ---
function BookingCard({ schedule, placesTaken, isUnlimited, resThisWeek, isBooked, onBook }: { schedule: Schedule, placesTaken: number, isUnlimited: boolean, resThisWeek: number, isBooked: boolean, onBook: () => void }) {
  const placesAvailable = schedule.capacity - placesTaken;
  const isFull = placesAvailable <= 0;
  
  let statusText = "Réserver";
  let isDisabled = false;

  // Logique d'affichage des boutons
  if (schedule.isLocked) {
    statusText = "Verrouillé";
    isDisabled = true;
  } else if (isBooked) {
    statusText = "Inscrit";
    isDisabled = true;
  } else if (!isUnlimited && resThisWeek >= 2) {
    statusText = "Quota atteint"; // Semaine pleine
    isDisabled = true;
  } else if (isFull) {
    statusText = "Complet";
    isDisabled = true;
  }

  let levelLabel = "Tous Niveaux";
  let levelColor = "bg-blue-100 text-blue-700"; // Bleu pour tous niveaux

  if (schedule.level === 'BEGINNER') {
      levelLabel = "Débutant";
      levelColor = "bg-green-100 text-green-700";
  } else if (schedule.level === 'ADVANCED') {
      levelLabel = "Avancé";
      levelColor = "bg-purple-100 text-purple-700";
  }


  return (
    <div className={`
        relative overflow-hidden bg-white p-5 rounded-[1.5rem] border transition-all duration-300 group
        ${isDisabled && !isBooked 
            ? 'border-gray-100 opacity-60 grayscale-[0.5]' 
            : 'border-sage/10 hover:border-sage hover:shadow-lg hover:-translate-y-1'}
    `}>
        {/* Badge Niveau (Débutant/Avancé) */}
        <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[9px] font-black uppercase tracking-widest ${levelColor}`}>
            {levelLabel}
        </div>

        <div className="flex justify-between items-start mb-2 mt-2">
          <span className="font-serif text-2xl font-bold text-gray-800">{schedule.startTime}</span>
          <span className="text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-lg text-gray-500 font-bold tracking-wide">{schedule.duration} min</span>
        </div>
        
        <h4 className="text-sm font-bold text-sage leading-tight mb-1 truncate">{schedule.title}</h4>
        <p className="text-[10px] text-gray-400 font-medium mb-4">avec {schedule.coachName}</p>
        
        <button 
          onClick={onBook} 
          disabled={isDisabled} 
          className={`
            w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all
            ${schedule.isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
              isBooked ? 'bg-green-500 text-white shadow-md shadow-green-200' : 
              isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
              'bg-sage text-white hover:bg-sage/90 shadow-lg shadow-sage/20 active:scale-95'}
          `}
        >
            {schedule.isLocked ? <Lock size={12}/> : isBooked ? <CheckCircle size={12}/> : null}
            {statusText}
        </button>
        
        {!isFull && !isDisabled && !schedule.isLocked && !isBooked && (
          <div className="mt-3 flex justify-center items-center gap-1 text-[10px] text-sage font-bold uppercase tracking-wide opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            {placesAvailable} places
          </div>
        )}
    </div>
  );
}