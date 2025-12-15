'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
// Plus besoin de useRouter ici si le contexte s'en occupe
// Plus besoin de User ou LoginResponse ici

export default function LoginPage() {
  const { login } = useAuth(); // On récupère la fonction du contexte

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // On appelle la fonction login du contexte avec les identifiants
      await login({ email: email.trim(), password });
      // La redirection est gérée par le contexte !

    } catch (err: any) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
      setIsLoading(false);
    } 
 
  };

  return (
    <div className="min-h-screen bg-sage text-cream font-sans flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-cream/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-cream/10 shadow-2xl relative z-10">
        
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-3xl font-bold tracking-wider inline-block mb-2">OASIS</Link>
          <p className="text-sm text-cream/60 tracking-widest uppercase">Espace Membre</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-wide text-cream/80 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-sage/50 border border-cream/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cream focus:bg-sage/70 transition-all placeholder-cream/30"
              placeholder="votre@email.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold tracking-wide text-cream/80">Mot de passe</label>
                <a href="#" className="text-xs text-cream/50 hover:text-cream transition-colors">Oublié ?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-sage/50 border border-cream/20 rounded-xl px-4 py-3 focus:outline-none focus:border-cream focus:bg-sage/70 transition-all placeholder-cream/30"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-red-300 text-sm text-center bg-red-900/20 p-2 rounded border border-red-500/20">{error}</div>}

          <button type="submit" disabled={isLoading} className="w-full mt-6 bg-cream text-sage font-bold py-3.5 rounded-xl hover:bg-white transition-all transform hover:scale-[1.02] shadow-lg shadow-sage/50 flex justify-center items-center gap-2">
             {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
             {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-cream/60">
          Pas encore membre ? <Link href="/register" className="text-cream font-bold hover:underline">Inscrivez vous</Link>
        </div>
      </div>
    </div>
  );
}