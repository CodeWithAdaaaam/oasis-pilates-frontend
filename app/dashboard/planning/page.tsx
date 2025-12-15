// app/dashboard/planning/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { addDays, format, set, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

// --- NOUVELLES INTERFACES ---
interface Schedule {
  id: number;
  title: string;
  dayOfWeek: number;
  startTime: string;
  duration: number;
  coachName: string;
  capacity: number;
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
  
  const [selectedSchedule, setSelectedSchedule] = useState<{ schedule: Schedule, date: Date } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Générer les 7 prochains jours
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)), []);

  // Charger toutes les données
  useEffect(() => {
    if (authUser) {
      const loadData = async () => {
        setLoading(true);
        try {
          const [schedulesRes, availabilityRes, profileRes] = await Promise.all([
            api.get('/schedules'), // Route publique des créneaux
            api.get('/planning/availability'), // Route publique des places
            api.get<UserProfile>('/users/me') // Profil du client
          ]);
          setSchedules(schedulesRes.data);
          setAvailability(availabilityRes.data);
          setUserProfile(profileRes.data);
        } catch (error) {
          console.error("Erreur chargement données planning", error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [authUser]);

  const activeSubscription = userProfile?.subscriptions.find(sub => sub.status === 'ACTIVE');
  const userCredits = activeSubscription?.sessionsLeft || 0;
  const hasFutureReservation = userProfile?.reservations?.some(r => new Date(r.reservationDate) > new Date() && r.status === 'CONFIRMED');

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
      await api.post('/reservations', {
        scheduleId: schedule.id,
        date: reservationDate.toISOString(),
      });
      
      setFeedback({ type: 'success', message: 'Réservation confirmée !' });

      // Recharger le profil pour mettre à jour solde et réservations
      const profileRes = await api.get<UserProfile>('/users/me');
      setUserProfile(profileRes.data);
      // Recharger la dispo
      const availabilityRes = await api.get('/planning/availability');
      setAvailability(availabilityRes.data);

      setTimeout(() => setIsModalOpen(false), 2000);

    } catch (error: any) {
      setFeedback({ type: 'error', message: error.response?.data?.message || "Erreur de réservation" });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col items-center md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sage">Réserver un cours</h1>
          <p className="text-sage/60 text-sm">Cliquez sur un créneau pour réserver.</p>
        </div>
        <div className="bg-sage/10 px-6 py-2 rounded-full flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-sage/60">Mon Solde :</span>
          {loading ? (
             <span className="text-sage/40 text-sm">Chargement...</span>
          ) : (
             <span className={`font-bold text-lg ${userCredits <= 2 ? 'text-orange-500' : 'text-sage'}`}>
               {userCredits} séances
             </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {loading ? <p className="col-span-7 text-center">Chargement du planning...</p> : weekDays.map((date) => {
          const dayOfWeek = getDay(date) === 0 ? 7 : getDay(date);
          const daySchedules = schedules
            .filter(s => s.dayOfWeek === dayOfWeek)
            .sort((a,b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={date.toISOString()} className="flex flex-col gap-3">
              <div className="text-center py-3 bg-white rounded-lg border border-sage/10 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-sage capitalize">{format(date, 'eee', { locale: fr })}.</h3>
                <p className="text-xs text-gray-500">{format(date, 'd MMM', { locale: fr })}</p>
              </div>
              <div className="flex flex-col gap-3 h-full">
                {daySchedules.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-4 rounded-lg border border-dashed border-sage/10 min-h-[80px]">
                    <p className="text-sage/30 text-xs italic">Repos</p>
                  </div>
                ) : (
                  daySchedules.map((schedule) => {
                    const [hour, minute] = schedule.startTime.split(':');
                    const reservationDate = set(date, { hours: parseInt(hour), minutes: parseInt(minute) });
                    
                    const availabilityKey = `${schedule.id}-${reservationDate.toISOString().split('T')[0]}`;
                    const placesTaken = availability[availabilityKey] || 0;
                    
                    const isBooked = userProfile?.reservations?.some(r => 
                        r.scheduleId === schedule.id && 
                        new Date(r.reservationDate).getTime() === reservationDate.getTime() &&
                        r.status === 'CONFIRMED'
                    );

                    return (
                        <BookingCard 
                            key={schedule.id} 
                            schedule={schedule} 
                            placesTaken={placesTaken}
                            userCredits={userCredits}
                            hasFutureReservation={hasFutureReservation || false}
                            isBooked={isBooked || false}
                            onBook={() => handleBookClick(schedule, date)} 
                        />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedSchedule && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-sage/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-scale-in relative">
            {feedback?.type === 'success' ? (
              <div className="text-center py-4"><h3 className="font-serif text-2xl font-bold text-sage">Réservé !</h3><p className="text-sage/60 text-sm mt-2">{feedback.message}</p></div>
            ) : feedback?.type === 'error' ? (
              <div className="text-center py-4"><h3 className="font-serif text-2xl font-bold text-red-600">Erreur</h3><p className="text-sage/60 text-sm mt-2">{feedback.message}</p><button onClick={() => setIsModalOpen(false)} className="mt-4 w-full py-3 rounded-xl border border-sage/10 font-bold text-sage/60">Fermer</button></div>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-bold text-sage mb-1">Confirmer</h3>
                <div className="bg-sage/5 p-4 rounded-xl space-y-3 mb-6">
                  <p><span className="font-bold text-sage">{selectedSchedule.schedule.title}</span></p>
                  <p><span className="text-sm text-sage/60">Le </span><span className="font-bold text-sage">{format(selectedSchedule.date, 'eeee d MMMM', {locale: fr})} à {selectedSchedule.schedule.startTime}</span></p>
                  <p><span className="text-sm text-sage/60">Solde après : </span><span className="font-bold text-orange-500">{userCredits - 1} séances</span></p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border">Annuler</button>
                  <button onClick={confirmBooking} disabled={bookingLoading} className="flex-1 py-3 rounded-xl bg-sage text-cream font-bold shadow-lg disabled:bg-gray-400">
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

function BookingCard({ schedule, placesTaken, userCredits, hasFutureReservation, isBooked, onBook }: { schedule: Schedule, placesTaken: number, userCredits: number, hasFutureReservation: boolean, isBooked: boolean, onBook: () => void }) {
  const placesAvailable = schedule.capacity - placesTaken;
  const isFull = placesAvailable <= 0;
  const hasCredits = userCredits > 0;

  let statusText = "Réserver";
  let isDisabled = false;

  if (isBooked) {
    statusText = "Inscrit";
    isDisabled = true;
  } else if (hasFutureReservation) {
    statusText = "1 résa. active";
    isDisabled = true;
  } else if (isFull) {
    statusText = "Complet";
    isDisabled = true;
  } else if (!hasCredits) {
    statusText = "Solde 0";
    isDisabled = true;
  }

  return (
    <div className={`bg-white p-4 rounded-xl border transition-all group ${isDisabled && !isBooked ? 'border-gray-100 opacity-70' : 'border-sage/10 hover:border-sage/40 hover:shadow-md'}`}>
        <div className="flex justify-between items-start mb-2">
            <span className="font-bold text-lg text-sage">{schedule.startTime}</span>
            <span className="text-[10px] uppercase bg-sage/5 px-2 py-1 rounded text-sage/60">{schedule.duration}min</span>
        </div>
        <h4 className="font-serif text-md font-bold text-sage leading-tight mb-4">{schedule.title}</h4>
        <button onClick={onBook} disabled={isDisabled} className={`w-full py-2 rounded-lg text-xs font-bold uppercase ${
            isBooked ? 'bg-green-100 text-green-700' :
            isDisabled ? 'bg-gray-100 text-gray-400' :
            'bg-sage text-cream hover:bg-sage/90'
        }`}>{statusText}</button>
        {!isFull && !isDisabled && <div className="mt-2 text-center"><span className="text-[10px] text-sage/40">{placesAvailable} places</span></div>}
    </div>
  );
}