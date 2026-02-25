'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import toast from "react-hot-toast";
import { LogOut, HeartPulse, Camera, X, Check, Loader2, User as UserIcon } from 'lucide-react';
import HealthProfileModal from "@/components/HealthProfileModal";
import Cropper from 'react-easy-crop'; 
import { getCroppedImg } from "@/utils/cropImage"; 

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const [formData, setFormData] = useState({ nom: '', prenom: '', telephone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isHealthModalOpen, setHealthModalOpen] = useState(false);

  // États pour le Recadrage (Cropping)
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: user.telephone || '',
      });
    }
  }, [user]);

  if (!user) return (
    <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-sage" size={40} />
    </div>
  );

  // --- LOGIQUE PHOTO (BASE64 & RESIZING) ---

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const handleUploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    const toastId = toast.loading('Compression et enregistrement...');
    
    try {
      // 1. Recadrage + Redimensionnement (400x400px)
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // 2. Conversion en Base64 léger
      const base64Photo = await blobToBase64(croppedImageBlob);

      // 3. Envoi JSON au backend
      await api.put('/users/me/photo', { photo: base64Photo });
      
      toast.success("Photo de profil mise à jour !", { id: toastId });
      setImageSrc(null); 
      refreshUser(); 
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- AFFICHAGE DE LA PHOTO ---
  const getDisplayPhoto = () => {
    if (!user.photoUrl) return null;
    // Si c'est du Base64, on l'affiche direct
    if (user.photoUrl.startsWith('data:image')) return user.photoUrl;
    // Sinon, c'est une ancienne URL du backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${backendUrl}${user.photoUrl}`;
  };

  const finalPhotoUrl = getDisplayPhoto();

  // --- LOGIQUE FORMULAIRE ---
  const handleSaveInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Sauvegarde...');
    try {
      await api.put('/users/me', formData);
      toast.success("Profil mis à jour !", { id: toastId });
      refreshUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10 px-4">
      
      {/* MODAL DE RECADRAGE */}
      {imageSrc && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-lg aspect-square bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            
            <div className="mt-8 w-full max-w-xs space-y-6">
                <div className="space-y-2">
                    <p className="text-white/50 text-[10px] font-black uppercase text-center tracking-[0.2em]">Zoomer / Ajuster</p>
                    <input 
                        type="range" value={zoom} min={1} max={3} step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-sage"
                    />
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setImageSrc(null)} className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all">
                        Annuler
                    </button>
                    <button onClick={handleUploadCroppedImage} disabled={isUploading} className="flex-1 py-4 bg-sage text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
                        {isUploading ? "Envoi..." : "Appliquer"}
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl font-bold text-sage uppercase tracking-tight">Mon Profil</h1>
          <p className="text-sage/60 text-sm">Gérez vos accès et informations personnelles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-sage/10 text-center shadow-sm relative group">
            <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-full border-4 border-cream overflow-hidden shadow-xl bg-gray-50 flex items-center justify-center">
                    {finalPhotoUrl ? (
                        <img src={finalPhotoUrl} alt="Profil" className="w-full h-full object-cover"/>
                    ) : (
                        <div className="text-4xl font-black text-sage/20 uppercase italic">
                            {user.prenom?.[0]}{user.nom?.[0]}
                        </div>
                    )}
                </div>
                
                <label className="absolute bottom-0 right-0 p-3 bg-sage text-white rounded-2xl cursor-pointer shadow-lg hover:scale-110 transition-transform active:scale-95 border-4 border-white">
                    <Camera size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                </label>
            </div>
            
            <h2 className="font-serif text-2xl font-bold text-sage capitalize">{user.prenom} {user.nom}</h2>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Adhérent Oasis Studio</p>
          </div>

          <div className="space-y-3">
            <button 
                onClick={() => setHealthModalOpen(true)} 
                className="w-full flex items-center justify-center gap-3 bg-blue-50 text-blue-600 font-black py-4 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all text-[10px] uppercase tracking-widest"
            >
                <HeartPulse size={18} /> Fiche Santé
            </button>
            <button 
                onClick={logout} 
                className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-500 font-black py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-all text-[10px] uppercase tracking-widest"
            >
                <LogOut size={18} /> Déconnexion
            </button>
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div className="md:col-span-2">
          <form onSubmit={handleSaveInfo} className="bg-white p-8 md:p-10 rounded-[3rem] border border-sage/10 shadow-sm space-y-8">
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-sage border-b border-sage/10 pb-4">Détails du compte</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                  <input 
                    name="prenom" type="text" 
                    value={formData.prenom ?? ''} 
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})} 
                    className="w-full border-2 border-gray-50 rounded-2xl px-4 py-3 outline-none focus:border-sage transition-all font-bold text-gray-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                  <input 
                    name="nom" type="text" 
                    value={formData.nom ?? ''} 
                    onChange={(e) => setFormData({...formData, nom: e.target.value})} 
                    className="w-full border-2 border-gray-50 rounded-2xl px-4 py-3 outline-none focus:border-sage transition-all font-bold text-gray-700" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email (Identifiant)</label>
                  <input type="email" value={user.email ?? ''} disabled className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-4 py-3 text-gray-400 font-bold cursor-not-allowed" />
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone de contact</label>
                  <input 
                    name="telephone" type="tel" 
                    value={formData.telephone ?? ''} 
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})} 
                    className="w-full border-2 border-gray-50 rounded-2xl px-4 py-3 outline-none focus:border-sage transition-all font-bold text-gray-700" 
                  />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
               <button 
                 type="submit" 
                 disabled={isLoading} 
                 className="bg-sage text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-sage/20 hover:bg-sage/90 transition-all active:scale-95 disabled:opacity-50"
               >
                 {isLoading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
               </button>
            </div>
          </form>
        </div>
      </div>

      <HealthProfileModal 
        isOpen={isHealthModalOpen} 
        onClose={() => setHealthModalOpen(false)} 
      />
    </div>
  );
}