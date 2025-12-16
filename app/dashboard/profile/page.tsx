'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import toast from "react-hot-toast";
import { User } from "@/types";
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user,  logout } = useAuth();
  const [formData, setFormData] = useState({ nom: '', prenom: '', telephone: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Pré-remplir le formulaire quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: user.telephone || '',
      });
    }
  }, [user]);

  if (!user) return <div className="p-10 text-center text-sage">Chargement du profil...</div>;

  const memberSince = user.email // Utilisons une donnée qui existe toujours
    ? 'Récemment' // Simplifié, on pourrait le rajouter au backend si besoin
    : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put<User>('/users/me', formData);
      toast.success("Profil mis à jour !");
      window.location.reload(); 

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-sage">Mon Profil</h1>
        <p className="text-sage/60 text-sm">Gérez vos informations personnelles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-sage/10 text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-sage text-cream text-3xl font-bold flex items-center justify-center mx-auto mb-4 border-4 border-cream shadow-lg uppercase">
              {user.prenom ? user.prenom[0] : user.nom[0]}
            </div>
            <h2 className="font-serif text-xl font-bold text-sage capitalize">{user.prenom} {user.nom}</h2>
            <p className="text-xs text-sage/50 mt-1">Membre depuis {memberSince}</p>
            <div className="mt-4 inline-block px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
              Compte Actif
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>

        {/* COLONNE DROITE : Formulaire */}
        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-2xl border border-sage/10 shadow-sm space-y-8">
            
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-sage border-b border-sage/10 pb-2">Informations Personnelles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-sage/60 uppercase">Prénom</label>
                  <input name="prenom" type="text" value={formData.prenom} onChange={handleChange} className="w-full bg-white border border-sage/20 rounded-lg px-3 py-2 text-sage focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-sage/60 uppercase">Nom</label>
                  <input name="nom" type="text" value={formData.nom} onChange={handleChange} className="w-full bg-white border border-sage/20 rounded-lg px-3 py-2 text-sage focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold text-sage/60 uppercase">Email</label>
                  <input type="email" value={user.email} disabled className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sage/50 cursor-not-allowed" />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-bold text-sage/60 uppercase">Téléphone</label>
                  <input name="telephone" type="tel" value={formData.telephone} onChange={handleChange} className="w-full bg-white border border-sage/20 rounded-lg px-3 py-2 text-sage focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-all" />
              </div>
            </div>

            {/* Messages et Bouton */}
            <div className="pt-4 flex items-center justify-end">
               <button 
                type="submit" 
                disabled={isLoading}
                className="bg-sage text-cream px-8 py-3 rounded-full font-bold hover:bg-sage/90 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
               >
                 {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                 {isLoading ? 'Enregistrement...' : 'Sauvegarder'}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}