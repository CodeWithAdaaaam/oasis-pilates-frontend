'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// --- CHANGEMENTS IMPORTATIONS ---
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      // --- CHANGEMENT LOGIQUE : On mappe les noms pour correspondre au backend ---
      const payload = {
        prenom: formData.firstname,
        nom: formData.lastname,
        email: formData.email,
        telephone: formData.phone,
        password: formData.password,
      };

      // On appelle notre nouvelle API avec le bon format de données
      await api.post('/auth/register', payload);
      
      // On utilise toast pour une meilleure expérience utilisateur
      toast.success("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      router.push('/login');

    } catch (err: any) {
      // On affiche l'erreur spécifique du backend
      setError(err.response?.data?.error || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- TON JSX RESTE EXACTEMENT LE MÊME, AUCUN CHANGEMENT CI-DESSOUS ---
  return (
    <div className="min-h-screen bg-sage text-cream font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-cream/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-cream/10 shadow-2xl relative z-10 my-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-bold tracking-wider inline-block mb-2">OASIS</Link>
          <h2 className="text-xl font-serif">Créer un compte</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wide text-cream/70 ml-1">Prénom</label>
              <input type="text" id="firstname" onChange={handleChange} required className="w-full bg-sage/50 border border-cream/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cream" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wide text-cream/70 ml-1">Nom</label>
              <input type="text" id="lastname" onChange={handleChange} required className="w-full bg-sage/50 border border-cream/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cream" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-cream/70 ml-1">Email</label>
            <input type="email" id="email" onChange={handleChange} required className="w-full bg-sage/50 border border-cream/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cream" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-cream/70 ml-1">Téléphone</label>
            <input type="tel" id="phone" onChange={handleChange} required className="w-full bg-sage/50 border border-cream/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cream" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-cream/70 ml-1">Mot de passe</label>
            <input type="password" id="password" onChange={handleChange} required className="w-full bg-sage/50 border border-cream/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cream" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wide text-cream/70 ml-1">Confirmer</label>
            <input type="password" id="confirmPassword" onChange={handleChange} required className="w-full bg-sage/50 border border-cream/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cream" />
          </div>

          {error && <p className="text-red-300 text-sm text-center bg-red-900/20 p-2 rounded">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full mt-4 bg-cream text-sage font-bold py-3.5 rounded-xl hover:bg-white transition-all transform hover:scale-[1.02] shadow-lg shadow-sage/50">
            {isLoading ? 'Création...' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-cream/60">
          Déjà membre ? <Link href="/login" className="text-cream font-bold hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}