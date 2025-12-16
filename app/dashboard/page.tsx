// app/dashboard/page.tsx
'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Reservation, Subscription, User } from "@/types";

// Le type Reservation dans types/index.ts doit maintenant avoir 'schedule'
interface UserProfile extends User {
  subscriptions: Subscription[];
}

export default function Dashboard() {
  const { user } = useAuth();
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [nextReservation, setNextReservation] = useState<Reservation | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // Les appels API ne changent pas
          const [userProfileResponse, reservationsResponse] = await Promise.all([
            api.get<UserProfile>('/users/me'),
            api.get<Reservation[]>('/reservations/me') // On s'attend à recevoir schedule
          ]);

          const allSubs = userProfileResponse.data.subscriptions;
          if (allSubs && allSubs.length > 0) {
            const activeSub = allSubs.find(sub => sub.status === 'ACTIVE');
            const pendingSub = allSubs.find(sub => sub.status === 'PENDING');
            setSubscription(activeSub || pendingSub || null);
          }

          // --- CORRECTION LOGIQUE ICI ---
          // On filtre en utilisant 'reservationDate' et non 'course.startTime'
          const futureReservations = reservationsResponse.data
            .filter(r => new Date(r.reservationDate) > new Date() && r.status === 'CONFIRMED')
            .sort((a, b) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime());
          
          if (futureReservations.length > 0) {
            setNextReservation(futureReservations[0]);
          }

        } catch (error) {
          console.error("Erreur chargement dashboard", error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();
    }
  }, [user]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1 className="font-serif text-4xl font-bold text-sage mb-4">
        Bienvenue, {user.prenom || user.nom}!
      </h1>
      <p className="text-sage/70 mb-8">
        Résumé de votre activité.
      </p>

      {loadingData ? (
        <p>Chargement de vos données...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CARTE ABONNEMENT (Pas de changement majeur) */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-sage/10">
            <h3 className="font-bold text-sage mb-2">Mon Abonnement</h3>
            {subscription ? (
              <div>
                {subscription.status === 'ACTIVE' && (
                  <>
                    <p className="text-sm text-sage/80 font-bold">{subscription.type.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold text-green-600 my-2">{subscription.sessionsLeft} <span className="text-sm font-normal text-sage/60">séances</span></p>
                    {subscription.endDate && (
                        <p className="text-xs text-sage/50">Expire le: {new Date(subscription.endDate).toLocaleDateString('fr-FR')}</p>
                    )}
                  </>
                )}
                {subscription.status === 'PENDING' && (
                  <div className="text-center bg-yellow-50 p-4 rounded-lg">
                     <p className="text-sm font-bold text-yellow-700">En attente de validation</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-sage/60">Aucun pack actif.</p>
                <Link href="/dashboard/subscription" className="text-green-600 font-bold text-sm mt-4 inline-block">Voir les packs</Link>
              </div>
            )}
          </div>

          {/* CARTE PROCHAINE RÉSERVATION - CORRIGÉE */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-sage/10">
             <h3 className="font-bold text-sage mb-2">Prochaine Réservation</h3>
             {nextReservation ? (
               <div>
                  {/* On lit le titre depuis 'schedule.title' */}
                  <p className="text-sm font-bold text-sage/80">{nextReservation.schedule.title}</p>
                  <p className="text-lg font-bold text-green-600 my-2">
                    {/* On utilise 'reservationDate' pour l'affichage */}
                    {new Date(nextReservation.reservationDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-sm font-semibold text-sage/60">
                    à {new Date(nextReservation.reservationDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                   <Link href="/dashboard/reservations" className="text-green-600 font-bold text-sm mt-4 inline-block">
                     Voir mes réservations
                   </Link>
               </div>
             ) : (
                <div>
                  <p className="text-sm text-sage/60">Aucune réservation à venir.</p>
                  <Link href="/dashboard/planning" className="text-green-600 font-bold text-sm mt-4 inline-block">
                    Réserver un cours
                  </Link>
                </div>
             )}
          </div>

        </div>
      )}
    </div>
  );
}