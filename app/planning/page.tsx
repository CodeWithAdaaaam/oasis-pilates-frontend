'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import api from '@/services/api';
import { useRouter } from 'next/navigation'; // Import du routeur
import { addDays, format, set, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
// Note : on n'a plus besoin de useAuth ou Loader2 ici

interface Schedule {
  id: number;
  title: string;
  dayOfWeek: number;
  startTime: string;
  duration: number;
  coachName: string;
  capacity: number;
}

export default function PlanningPage() {
  const router = useRouter(); // On initialise le routeur
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [availability, setAvailability] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)), []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // On ne charge que les données publiques
        const [schedulesRes, availabilityRes] = await Promise.all([
          api.get('/schedules'),
          api.get('/planning/availability'),
        ]);
        setSchedules(schedulesRes.data);
        setAvailability(availabilityRes.data);
      } catch (err) {
        console.error("Impossible de charger le planning", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // La fonction de "réservation" est maintenant une simple redirection
  const handleRedirectToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-sage text-cream font-sans flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Planning des Cours</h1>
            <p className="text-cream/80 max-w-xl mx-auto">Connectez-vous pour réserver votre place.</p>
          </div>
          {loading ? (
            <div className="text-center py-20"><p>Chargement...</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {weekDays.map(date => {
                const dayOfWeek = getDay(date) === 0 ? 7 : getDay(date);
                const daySchedules = schedules
                  .filter(s => s.dayOfWeek === dayOfWeek)
                  .sort((a,b) => a.startTime.localeCompare(b.startTime));
                return (
                  <div key={date.toString()} className="flex flex-col gap-3">
                    <div className="text-center py-4 bg-cream/5 rounded-lg border border-cream/5">
                      <h3 className="font-serif text-xl font-bold tracking-wide capitalize">{format(date, 'eee', { locale: fr })}.</h3>
                      <p className="text-xs">{format(date, 'd MMM', { locale: fr })}</p>
                    </div>
                    <div className="flex flex-col gap-3 h-full">
                      {daySchedules.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center ...">
                          <p className="text-cream/30 text-xs italic">Repos</p>
                        </div>
                      ) : (
                        daySchedules.map(schedule => {
                          const [hour, minute] = schedule.startTime.split(':');
                          const reservationDate = set(date, { hours: parseInt(hour), minutes: parseInt(minute) });
                          const availabilityKey = `${schedule.id}-${reservationDate.toISOString().split('T')[0]}`;
                          const placesTaken = availability[availabilityKey] || 0;
                          return (
                            <CardHoverCourse 
                                key={`${schedule.id}-${date.toISOString()}`}
                                schedule={schedule} 
                                placesTaken={placesTaken}
                                onRedirect={handleRedirectToLogin}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Composant Carte simplifié
function CardHoverCourse({ schedule, placesTaken, onRedirect }: { schedule: Schedule, placesTaken: number, onRedirect: () => void }) {
  const placesAvailable = schedule.capacity - placesTaken;
  const isFull = placesAvailable <= 0;

  return (
    <div 
      onClick={!isFull ? onRedirect : undefined}
      className={`
        group relative overflow-hidden rounded-xl border transition-all duration-300 ease-out 
        ${isFull ? 'bg-sage/20 border-cream/5 opacity-60 grayscale cursor-not-allowed' : 'bg-sage/40 border-cream/20 hover:bg-cream hover:border-cream cursor-pointer'}
        hover:scale-105 hover:shadow-2xl hover:shadow-cream/10 hover:z-10
      `}
    >
      {/* VUE NORMALE */}
      <div className="p-4 flex flex-col items-center justify-center text-center transition-opacity duration-300 group-hover:opacity-10">
        <span className="font-serif text-2xl font-bold">{schedule.startTime}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-1">{schedule.title}</span>
        {isFull ? (
          <span className="text-xs font-bold text-red-300/50 mt-2">Complet</span>
        ) : (
          <span className="text-xs font-bold text-cream/50 mt-2">{placesAvailable} places</span>
        )}
      </div>

      {/* VUE AU SURVOL */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-sage transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h4 className="font-serif text-lg font-bold leading-tight mb-2">{schedule.title}</h4>
          <p className="text-xs text-sage/70 mb-3">Coach: {schedule.coachName}</p>
          
          {isFull ? (
            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">COMPLET</span>
          ) : (
            <button className="bg-sage text-cream text-xs font-bold py-1.5 px-4 rounded-full">RÉSERVER</button>
          )}
        </div>
      </div>
    </div>
  );
}