'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react"; // N'oublie pas d'importer React
import { useAuth } from '@/context/AuthContext';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // --- NOUVEAU : On récupère l'utilisateur, l'état de chargement et la fonction logout ---
  const { user, loading, logout } = useAuth(); 

  const menuItems = [
    { name: "Tableau de bord", href: "/dashboard", icon: "dashboard" },
    { name: "Planning & Réservation", href: "/dashboard/planning", icon: "calendar_month" },
    { name: "Mon Abonnement", href: "/dashboard/subscription", icon: "credit_card" },
    { name: "Historique", href: "/dashboard/history", icon: "credit_card" },
    { name: "Mon Profil", href: "/dashboard/profile", icon: "person" },
  ];

  // --- NOUVEAU : Écran de chargement pendant la vérification de la session ---
  if (loading) {
    return (
      <div className="min-h-screen bg-sage flex items-center justify-center">
        <p className="text-cream text-lg animate-pulse">Vérification de la session...</p>
      </div>
    );
  }

  // --- NOUVEAU : Protection de la route. Si pas d'utilisateur, on redirige ---
  if (!user) {
    React.useEffect(() => {
      router.push('/login');
    }, [router]);
    return null; // Affiche une page blanche le temps de la redirection
  }

  // --- Si l'utilisateur est bien là, on affiche le layout normal ---
  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col md:flex-row text-sage">
      
      {/* SIDEBAR (Bureau) */}
      <aside className="hidden md:flex flex-col w-64 bg-sage text-cream h-screen fixed left-0 top-0 p-6 shadow-2xl z-50">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cream text-sage flex items-center justify-center font-bold text-lg">
            {/* MODIFIÉ : On utilise l'initiale du prénom de l'utilisateur connecté */}
            {user?.prenom?.[0] || user?.nom?.[0] || 'U'}
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg leading-none">OASIS</h2>
            <p className="text-xs text-cream/60 uppercase tracking-widest">Espace Membre</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-cream text-sage font-bold shadow-lg" : "text-cream/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* MODIFIÉ : Le bouton de déconnexion appelle maintenant la fonction logout */}
        <button onClick={logout} className="mt-auto w-full flex items-center gap-4 px-4 py-3 text-red-300 hover:text-red-100 transition-colors text-left">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm">Déconnexion</span>
        </button>
      </aside>

      {/* HEADER MOBILE (Haut) */}
      <header className="md:hidden bg-sage text-cream p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <span className="font-serif font-bold text-xl">OASIS</span>
        <div className="w-8 h-8 rounded-full bg-cream text-sage flex items-center justify-center font-bold text-sm">
          {user?.prenom?.[0] || user?.nom?.[0] || 'U'}
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 mb-20 md:mb-0">
        {children}
      </main>

      {/* NAVIGATION MOBILE (Bas) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sage/10 px-6 py-3 flex justify-between items-center z-50 text-sage/60">
        {menuItems.map((item) => {
           const isActive = pathname === item.href;
           return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center gap-1 ${isActive ? "text-sage font-bold" : ""}`}>
              <span className={`material-symbols-outlined ${isActive ? "filled" : ""}`}>{item.icon}</span>
              <span className="text-[10px]">{item.name.split(' ')[0]}</span>
            </Link>
           )
        })}
      </nav>
    </div>
  );
}