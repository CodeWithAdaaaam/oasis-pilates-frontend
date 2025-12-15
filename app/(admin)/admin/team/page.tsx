// app/(admin)/admin/team/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';
import { Coach } from '@/types';
import Image from 'next/image';
import { getImageUrl } from '@/services/api';
import CoachModal from '@/app/(admin)/components/CoachModal';

export default function ManageTeamPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pour gérer l'ouverture du modal et le coach à éditer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coachToEdit, setCoachToEdit] = useState<Coach | null>(null);

  const fetchCoaches = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Coach[]>('/coaches');
      setCoaches(response.data);
    } catch (err) {
      setError("Impossible de charger l'équipe.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);
  
  const handleOpenCreateModal = () => {
    setCoachToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coach: Coach) => {
    setCoachToEdit(coach);
    setIsModalOpen(true);
  };
  
  const handleModalSave = (savedCoach: Coach) => {
    setCoaches(prev => {
        const index = prev.findIndex(c => c.id === savedCoach.id);
        if (index > -1) {
            const newCoaches = [...prev];
            newCoaches[index] = savedCoach;
            return newCoaches;
        }
        return [...prev, savedCoach];
    });
    setIsModalOpen(false);
  };

  const handleDelete = async (coachId: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce coach ?')) return;
    try {
      await api.delete(`/coaches/${coachId}`); // Endpoint à créer
      setCoaches(prev => prev.filter(c => c.id !== coachId));
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) return <div><h1 className="font-serif text-4xl font-bold text-sage mb-4">Équipe</h1><p>Chargement...</p></div>;
  if (error) return <div><h1 className="font-serif text-4xl font-bold text-sage mb-4">Équipe</h1><p className="text-red-500">{error}</p></div>;

  return (
    <div>
       {isModalOpen && <CoachModal coachToEdit={coachToEdit} onClose={() => setIsModalOpen(false)} onSave={handleModalSave} />} 
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-4xl font-bold text-sage">Gestion de l'Équipe</h1>
        <button onClick={handleOpenCreateModal} className="bg-sage text-white font-bold py-2 px-4 rounded-lg">
          + Ajouter un membre
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coaches.map(coach => (
          <div key={coach.id} className="bg-white rounded-xl shadow-md p-6 text-center flex flex-col">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-sage/10">
              <Image 
                src={getImageUrl(coach.photoUrl)} 
                alt={`${coach.prenom} ${coach.nom}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h3 className="text-xl font-bold text-sage">{coach.prenom} {coach.nom}</h3>
            <p className="text-sm text-green-600 font-semibold mb-2">{coach.specialites}</p>
            <p className="text-sm text-sage/70 flex-grow">{coach.bio}</p>
            <div className="mt-6 flex justify-center gap-2">
              <button onClick={() => handleOpenEditModal(coach)} className="text-sm bg-gray-200 px-4 py-2 rounded-lg font-semibold">Modifier</button>
              <button onClick={() => handleDelete(coach.id)} className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}