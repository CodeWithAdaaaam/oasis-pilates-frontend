'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { getImageUrl } from '@/services/api'; // ✅ Importé pour gérer l'aperçu photo
import { X, Mail, Lock, Sparkles, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageCropper from '@/components/ImageCropper'; 

interface CoachModalProps {
  coachToEdit?: any | null;
  onClose: () => void;
  onSave: (savedCoach: any) => void;
}

export default function CoachModal({ coachToEdit, onClose, onSave }: CoachModalProps) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    bio: '',
    specialites: '',
  });

  // États pour la gestion de l'image (Base64)
  const [tempImage, setTempImage] = useState<string | null>(null); // Image brute avant crop
  const [finalBase64, setFinalBase64] = useState<string | null>(null); // Image finale recadrée
  const [isLoading, setIsLoading] = useState(false);

  // Initialisation lors de la modification
  useEffect(() => {
    if (coachToEdit) {
      setFormData({
        prenom: coachToEdit.prenom || '',
        nom: coachToEdit.nom || '',
        email: coachToEdit.email || '',
        password: '', 
        bio: coachToEdit.coachProfile?.bio || '',
        specialites: coachToEdit.coachProfile?.specialites || '',
      });
      // Si une photo existe déjà en base de données
      if (coachToEdit.coachProfile?.photoUrl) {
        setFinalBase64(coachToEdit.coachProfile.photoUrl);
      }
    }
  }, [coachToEdit]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Déclenché quand l'utilisateur choisit un fichier : ouvre le cropper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // ✅ ON ENVOIE DU JSON MAINTENANT (Le Base64 est une simple string)
    const payload = {
      ...formData,
      photo: finalBase64, // On envoie la string Base64 recadrée
    };
    
    // Pour le mot de passe : requis à la création, optionnel à la modif
    if (!formData.password && !coachToEdit) {
      toast.error("Le mot de passe est obligatoire pour un nouveau compte.");
      setIsLoading(false);
      return;
    }

    try {
      let result;
      if (coachToEdit) {
        // Envoi en JSON vers l'API PUT
        const response = await api.put(`/admin/coaches/${coachToEdit.id}`, payload);
        result = response.data;
        toast.success("Profil coach mis à jour !");
      } else {
        // Envoi en JSON vers l'API POST
        const response = await api.post('/admin/coaches', payload);
        result = response.data;
        toast.success("Compte coach créé avec succès !");
      }
      onSave(result);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'enregistrement';
      toast.error(msg);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      {/* AFFICHER LE CROPPER SI UNE IMAGE EST SÉLECTIONNÉE */}
      {tempImage && (
        <ImageCropper 
          image={tempImage} 
          onCropComplete={(croppedBase64: string) => {
            setFinalBase64(croppedBase64); // Sauvegarde le résultat recadré
            setTempImage(null); // Ferme le cropper
          }}
          onCancel={() => setTempImage(null)}
        />
      )}

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl relative overflow-hidden animate-scale-in">
          
          {/* HEADER */}
          <div className="bg-sage/10 p-8 flex justify-between items-center">
              <div>
                  <h2 className="font-serif text-3xl font-bold text-sage">
                      {coachToEdit ? 'Modifier le profil' : 'Nouveau Coach'}
                  </h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Identité et accès studio</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
                  <X size={24} />
              </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* SECTION PHOTO AVEC PREVIEW CIRCULAIRE */}
            <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
               <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200 flex items-center justify-center">
                      {finalBase64 ? (
                        /* ✅ On utilise getImageUrl ici pour gérer le Base64 ou les anciennes URLs */
                        <img src={getImageUrl(finalBase64)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="text-gray-400" />
                      )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-sage text-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <RefreshCw size={14} />
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </label>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase mt-3 tracking-widest">Photo de profil (Recadrage 400x400)</p>
            </div>

            {/* SECTION IDENTITÉ */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Prénom</label>
                  <input name="prenom" type="text" placeholder="Sarah" value={formData.prenom} onChange={handleTextChange} required className="w-full p-3 border-2 border-gray-50 rounded-xl focus:border-sage outline-none transition-all font-medium" />
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nom</label>
                  <input name="nom" type="text" placeholder="Benali" value={formData.nom} onChange={handleTextChange} required className="w-full p-3 border-2 border-gray-50 rounded-xl focus:border-sage outline-none transition-all font-medium" />
              </div>
            </div>

            {/* SECTION ACCÈS */}
            <div className="bg-sage/5 p-6 rounded-3xl space-y-4 border border-sage/10">
                <p className="text-[10px] font-black text-sage uppercase tracking-widest flex items-center gap-2">
                    <Lock size={12} /> Identifiants de connexion
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3.5 text-gray-300" />
                      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleTextChange} required className="w-full p-3 pl-10 border-2 border-white rounded-xl focus:border-sage outline-none text-sm" />
                  </div>
                  <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3.5 text-gray-300" />
                      <input 
                          name="password" 
                          type="password" 
                          placeholder={coachToEdit ? "Changer le mdp" : "Mot de passe"} 
                          value={formData.password} 
                          onChange={handleTextChange} 
                          required={!coachToEdit}
                          className="w-full p-3 pl-10 border-2 border-white rounded-xl focus:border-sage outline-none text-sm" 
                      />
                  </div>
                </div>
            </div>

            {/* SECTION PRO */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1.5"><Sparkles size={12}/> Spécialités</label>
              <input name="specialites" type="text" placeholder="Pilates Reformer, Matwork, Yoga..." value={formData.specialites} onChange={handleTextChange} required className="w-full p-3 border-2 border-gray-50 rounded-xl focus:border-sage outline-none font-medium text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Biographie</label>
              <textarea name="bio" placeholder="Expériences et parcours..." value={formData.bio} onChange={handleTextChange} required className="w-full p-3 border-2 border-gray-50 rounded-xl focus:border-sage outline-none h-28 text-sm leading-relaxed" />
            </div>

            {/* BOUTONS ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
              <button type="button" onClick={onClose} className="px-6 py-3 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-gray-600 transition-colors">Annuler</button>
              <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-8 py-3 bg-sage text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-sage/20 active:scale-95 transition-all flex items-center gap-2"
              >
                  {isLoading ? <Loader2 className="animate-spin" size={16}/> : coachToEdit ? 'Enregistrer' : 'Créer le coach'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}