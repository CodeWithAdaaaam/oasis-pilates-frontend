// app/(admin)/admin/components/CoachModal.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Coach } from '@/types';

interface CoachModalProps {
  coachToEdit?: Coach | null;
  onClose: () => void;
  onSave: (savedCoach: Coach) => void;
}

export default function CoachModal({ coachToEdit, onClose, onSave }: CoachModalProps) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    bio: '',
    specialites: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (coachToEdit) {
      setFormData({
        prenom: coachToEdit.prenom,
        nom: coachToEdit.nom,
        bio: coachToEdit.bio,
        specialites: coachToEdit.specialites,
      });
    }
  }, [coachToEdit]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = new FormData();
    data.append('prenom', formData.prenom);
    data.append('nom', formData.nom);
    data.append('bio', formData.bio);
    data.append('specialites', formData.specialites);
    if (photoFile) {
      data.append('photo', photoFile);
    }
    
    try {
      let savedCoach: Coach;
      if (coachToEdit) {
        // CORRECTION ICI : Ajout de /admin
        const response = await api.put<Coach>(`/admin/coaches/${coachToEdit.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        savedCoach = response.data;
      } else {
        // CORRECTION ICI : Ajout de /admin
        const response = await api.post<Coach>('/admin/coaches', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        savedCoach = response.data;
      }
      onSave(savedCoach);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg relative text-sage">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
        <h2 className="font-serif text-3xl font-bold mb-6">
          {coachToEdit ? 'Modifier le profil' : 'Nouveau Membre'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="prenom" type="text" placeholder="Prénom" value={formData.prenom} onChange={handleTextChange} required className="w-full p-3 border rounded-lg" />
          <input name="nom" type="text" placeholder="Nom" value={formData.nom} onChange={handleTextChange} required className="w-full p-3 border rounded-lg" />
          <textarea name="bio" placeholder="Biographie" value={formData.bio} onChange={handleTextChange} required className="w-full p-3 border rounded-lg h-24" />
          <input name="specialites" type="text" placeholder="Spécialités (ex: Pilates, Yoga Vinyasa)" value={formData.specialites} onChange={handleTextChange} required className="w-full p-3 border rounded-lg" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
            <input type="file" name="photo" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sage/10 file:text-sage hover:file:bg-sage/20"/>
            <p className="text-xs text-gray-400 mt-1">Laissez vide si vous ne souhaitez pas changer la photo.</p>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg font-bold">Annuler</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-sage text-white rounded-lg font-bold disabled:bg-sage/50">
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}