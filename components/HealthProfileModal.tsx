'use client';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface HealthProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HealthProfileModal({ isOpen, onClose }: HealthProfileModalProps) {
    const { user, refreshUser } = useAuth();
    
    // État local pour le formulaire
    const [formData, setFormData] = useState({
        goals: '',
        hasBackPain: false, hasNeckPain: false, hasJointPain: false,
        isPregnant: false, isPostNatal: false, hasScoliosis: false, hasHerniatedDisc: false, hasOsteoporosis: false, hasHighPressure: false,
        recentInjuries: '', otherInfo: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    // NOUVEL ÉTAT : Pour gérer l'affichage du message de succès
    const [isSuccess, setIsSuccess] = useState(false);
    
    useEffect(() => {
        if (user?.healthProfile) {
            const profile = user.healthProfile;
            setFormData({
                goals: profile.goals || '',
                hasBackPain: profile.hasBackPain || false,
                hasNeckPain: profile.hasNeckPain || false,
                hasJointPain: profile.hasJointPain || false,
                isPregnant: profile.isPregnant || false,
                isPostNatal: profile.isPostNatal || false,
                hasScoliosis: profile.hasScoliosis || false,
                hasHerniatedDisc: profile.hasHerniatedDisc || false,
                hasOsteoporosis: profile.hasOsteoporosis || false,
                hasHighPressure: profile.hasHighPressure || false,
                recentInjuries: profile.recentInjuries || '',
                otherInfo: profile.otherInfo || '',
            });
        }
    }, [user?.healthProfile, isOpen]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // On retire le toast de chargement ici pour laisser l'UI gérer le succès
        
        try {
            await api.post('/client/health-profile', formData);
            
            // 1. On met à jour le contexte global (pour débloquer le site)
            await refreshUser(); 
            
            // 2. On affiche la vue de succès au lieu de fermer
            setIsSuccess(true); 
            
            toast.success("Enregistré avec succès !");
        } catch (error) {
            toast.error("Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fonction pour fermer complètement
    const handleCloseFinal = () => {
        onClose();
        // Petit délai pour reset l'état si on rouvre le modal plus tard sans recharger la page
        setTimeout(() => setIsSuccess(false), 500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white p-6 md:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                
                {/* --- CAS 1 : SUCCÈS --- */}
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-fadeIn">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-gray-800">C'est tout bon !</h2>
                        
                        <p className="text-gray-600 text-center text-lg max-w-md">
                            Votre fiche santé a bien été enregistrée.<br/>
                            Vous pouvez maintenant accéder au planning et réserver vos séances.
                        </p>

                        <button 
                            onClick={handleCloseFinal}
                            className="mt-6 px-8 py-3 bg-sage text-white font-bold rounded-lg shadow-lg hover:bg-sage/90 transition-transform transform hover:scale-105"
                        >
                            Fermer et accéder au site
                        </button>
                    </div>
                ) : (
                    
                /* --- CAS 2 : FORMULAIRE --- */
                <>
                    <h2 className="text-2xl font-bold mb-2">Fiche Santé</h2>
                    <p className="text-gray-600 mb-6">Ces informations sont confidentielles et aident votre coach à adapter les exercices pour votre sécurité.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="font-bold block mb-2 text-gray-700">Quel est votre objectif principal ?</label>
                            <input name="goals" value={formData.goals} onChange={handleChange} type="text" placeholder="Ex: Renforcement, posture, post-natal..." className="w-full border p-2 rounded focus:ring-2 focus:ring-sage focus:border-transparent outline-none"/>
                        </div>
                        
                        <div>
                            <label className="font-bold block mb-2 text-gray-700">Signalez-vous des douleurs chroniques ?</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                <label className="flex items-center gap-2 cursor-pointer hover:text-sage transition-colors"><input type="checkbox" name="hasBackPain" checked={formData.hasBackPain} onChange={handleCheckboxChange} className="accent-sage w-5 h-5"/> Mal de dos</label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-sage transition-colors"><input type="checkbox" name="hasNeckPain" checked={formData.hasNeckPain} onChange={handleCheckboxChange} className="accent-sage w-5 h-5"/> Mal de nuque</label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-sage transition-colors"><input type="checkbox" name="hasJointPain" checked={formData.hasJointPain} onChange={handleCheckboxChange} className="accent-sage w-5 h-5"/> Douleurs articulaires</label>
                            </div>
                        </div>
                        
                        <div>
                            <label className="font-bold block mb-2 text-gray-700">Avez-vous (ou avez-vous eu) l'une de ces conditions ?</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                <label className="flex items-center gap-2 cursor-pointer hover:text-sage transition-colors"><input type="checkbox" name="isPregnant" checked={formData.isPregnant} onChange={handleCheckboxChange} className="accent-sage w-5 h-5"/> Enceinte</label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-sage transition-colors"><input type="checkbox" name="isPostNatal" checked={formData.isPostNatal} onChange={handleCheckboxChange} className="accent-sage w-5 h-5"/> Post-natal</label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-sage transition-colors"><input type="checkbox" name="hasScoliosis" checked={formData.hasScoliosis} onChange={handleCheckboxChange} className="accent-sage w-5 h-5"/> Scoliose</label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-sage transition-colors"><input type="checkbox" name="hasHerniatedDisc" checked={formData.hasHerniatedDisc} onChange={handleCheckboxChange} className="accent-sage w-5 h-5"/> Hernie discale</label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-sage transition-colors"><input type="checkbox" name="hasOsteoporosis" checked={formData.hasOsteoporosis} onChange={handleCheckboxChange} className="accent-sage w-5 h-5"/> Ostéoporose</label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-sage transition-colors"><input type="checkbox" name="hasHighPressure" checked={formData.hasHighPressure} onChange={handleCheckboxChange} className="accent-sage w-5 h-5"/> Hypertension</label>
                            </div>
                        </div>

                        <div>
                            <label className="font-bold block mb-2 text-gray-700">Blessures récentes ou chirurgies ?</label>
                            <textarea name="recentInjuries" value={formData.recentInjuries} onChange={handleChange} placeholder="Ex: Entorse cheville (2 mois), Opération genou (2021)..." className="w-full border p-2 rounded h-20 focus:ring-2 focus:ring-sage focus:border-transparent outline-none"/>
                        </div>
                        <div>
                            <label className="font-bold block mb-2 text-gray-700">Autre information que le coach devrait savoir ?</label>
                            <textarea name="otherInfo" value={formData.otherInfo} onChange={handleChange} className="w-full border p-2 rounded h-20 focus:ring-2 focus:ring-sage focus:border-transparent outline-none"/>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-2">
                            {/* On cache le bouton Annuler si c'est la première connexion obligatoire, sinon on le laisse */}
                            {!user?.healthProfile && (
                                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-gray-600">
                                    Plus tard (déconnexion)
                                </button>
                            )}
                            <button type="submit" disabled={isLoading} className="bg-sage text-white px-8 py-3 rounded-lg font-bold hover:bg-sage/90 disabled:bg-gray-400 transition-all shadow-md">
                                {isLoading ? 'Enregistrement...' : 'Enregistrer ma fiche'}
                            </button>
                        </div>
                    </form>
                </>
                )}
            </div>
        </div>
    );
}