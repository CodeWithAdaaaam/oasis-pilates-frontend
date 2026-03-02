'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';
import Image from 'next/image';
import { getImageUrl } from '@/services/api';
import CoachModal from '@/app/(admin)/components/CoachModal';
import toast from 'react-hot-toast';
import { Loader2, UserPlus, Trash2, Edit3 } from 'lucide-react';

// ✅ Définition de l'interface correspondant à la nouvelle structure
interface TeamMember {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  coachProfile?: {
    bio: string;
    specialites: string;
    photoUrl: string;
  };
}

export default function ManageTeamPage() {
  const [coaches, setCoaches] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coachToEdit, setCoachToEdit] = useState<TeamMember | null>(null);

  const fetchCoaches = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Correction de la route et du type de retour
      const response = await api.get<TeamMember[]>('/admin/coaches');
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

  const handleOpenEditModal = (coach: TeamMember) => {
    setCoachToEdit(coach);
    setIsModalOpen(true);
  };
  
  const handleModalSave = () => {
    // Rechargement complet pour garantir la cohérence des données
    fetchCoaches();
    setIsModalOpen(false);
  };

  const handleDelete = async (coachId: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce coach ?')) return;
    try {
      // ✅ Correction de l'URL pour correspondre au backend
      await api.delete(`/admin/coaches/${coachId}`); 
      setCoaches(prev => prev.filter(c => c.id !== coachId));
      toast.success("Membre supprimé avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-sage">
        <Loader2 className="animate-spin mb-2" />
        <p className="text-xs font-bold uppercase tracking-widest">Chargement de l'équipe...</p>
    </div>
  );

  if (error) return <div className="p-8 text-red-500 font-bold">{error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
       {isModalOpen && (
         <CoachModal 
            coachToEdit={coachToEdit} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleModalSave} 
         />
       )} 
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-4xl font-bold text-sage leading-tight">Gestion de l'Équipe</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les comptes des instructeurs du studio.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal} 
          className="flex items-center gap-2 bg-sage text-white font-black uppercase text-[10px] tracking-widest py-4 px-8 rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <UserPlus size={16} /> Ajouter un membre
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coaches.map((coach) => (
          <div key={coach.id} className="bg-white rounded-[2.5rem] shadow-sm border-2 border-gray-50 p-8 text-center flex flex-col hover:border-sage hover:shadow-2xl transition-all group">
            
            <div className="relative w-32 h-32 mx-auto rounded-[2.5rem] overflow-hidden mb-6 border-4 border-white shadow-lg group-hover:scale-105 transition-transform bg-gray-100">
              <Image 
                src={getImageUrl(coach.coachProfile?.photoUrl, `${coach.prenom} ${coach.nom}`)} 
                alt={`${coach.prenom} ${coach.nom}`}
                fill
                sizes="128px"
                className="object-cover"
                unoptimized={true} 
              />
            </div>

            <h3 className="text-xl font-black text-gray-800">{coach.prenom} {coach.nom}</h3>
            <p className="text-[10px] font-black text-sage uppercase tracking-[0.2em] mt-2 mb-4">
                {coach.coachProfile?.specialites || 'Instructeur'}
            </p>
            
            <div className="text-left bg-gray-50/50 p-5 rounded-3xl mb-6 flex-grow border border-gray-100">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Expertise & Bio</p>
                 <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed italic">
                    {coach.coachProfile?.bio ? `"${coach.coachProfile.bio}"` : "Aucune biographie renseignée."}
                 </p>
            </div>

            <div className="flex justify-center gap-2 mt-auto">
              <button 
                onClick={() => handleOpenEditModal(coach)} 
                className="flex-1 flex items-center justify-center gap-2 text-[10px] bg-gray-100 text-gray-600 px-4 py-3 rounded-xl font-black uppercase hover:bg-sage hover:text-white transition-all"
              >
                <Edit3 size={14}/> Modifier
              </button>
              <button 
                onClick={() => handleDelete(coach.id)} 
                className="flex items-center justify-center p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={16}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}