'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPeriodSwitcher() {
  const [activePeriod, setActivePeriod] = useState<'NORMAL' | 'RAMADAN' | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Charger l'état actuel au montage
  useEffect(() => {
    const fetchPeriod = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/schedule/period'); // Vérifie ton PORT
        const data = await res.json();
        setActivePeriod(data.period);
      } catch (error) {
        console.error("Erreur chargement période", error);
      }
    };
    fetchPeriod();
  }, []);

  // 2. Fonction pour changer la période
  const togglePeriod = async (targetPeriod: 'NORMAL' | 'RAMADAN') => {
    if (activePeriod === targetPeriod || loading) return;

    if (!confirm(`Voulez-vous vraiment basculer le planning en mode ${targetPeriod} ? Cela affectera l'affichage pour tous les clients.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/schedule/period', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: targetPeriod }),
      });

      if (res.ok) {
        setActivePeriod(targetPeriod);
        router.refresh(); // Rafraîchit les données de la page actuelle
        alert(`Studio basculé avec succès en mode ${targetPeriod}`);
      } else {
        alert("Erreur lors du changement de période");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (!activePeriod) return <div className="animate-pulse h-10 w-48 bg-gray-200 rounded-full"></div>;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
        Mode du Studio
      </span>
      
      <div className="bg-gray-100 p-1 rounded-full inline-flex relative w-fit border border-gray-200 shadow-inner">
        {/* Fond animé (Optionnel, ici géré par simple background conditionnel) */}
        
        {/* BOUTON NORMAL */}
        <button
          onClick={() => togglePeriod('NORMAL')}
          disabled={loading}
          className={`
            relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${activePeriod === 'NORMAL' 
              ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-200' 
              : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          <Sun size={16} className={activePeriod === 'NORMAL' ? "fill-orange-100" : ""} />
          <span>Normal</span>
        </button>

        {/* BOUTON RAMADAN */}
        <button
          onClick={() => togglePeriod('RAMADAN')}
          disabled={loading}
          className={`
            relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${activePeriod === 'RAMADAN' 
              ? 'bg-indigo-900 text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          {loading && activePeriod !== 'RAMADAN' ? (
             <Loader2 size={16} className="animate-spin" />
          ) : (
             <Moon size={16} className={activePeriod === 'RAMADAN' ? "fill-indigo-300" : ""} />
          )}
          <span>Ramadan</span>
        </button>
      </div>
      
      <p className="text-[10px] text-gray-400 max-w-[250px]">
        Le mode actif détermine quel planning est visible par défaut pour les clients.
      </p>
    </div>
  );
}