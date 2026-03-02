'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X, CalendarCheck, UserCircle, LayoutDashboard, Users, Badge,Loader2 } from 'lucide-react';

// --- LIENS POUR LES ADMINS / RÉCEPTIONNISTES ---

interface NavLink {
  name: string;
  href: string;
  icon: string;
  roles?: string[]; // Le "?" signifie que c'est optionnel
}

const adminNavLinks: NavLink[] = [
  { name: 'Tableau de bord', href: '/admin', icon: 'dashboard', roles: ['ADMIN', 'RECEPTIONIST'] },
  { name: 'Gestion Clients', href: '/admin/clients', icon: 'group', roles: ['ADMIN', 'RECEPTIONIST'] },
  { name: 'Planning & Cours', href: '/admin/courses', icon: 'calendar_month', roles: ['ADMIN', 'RECEPTIONIST'] },
  { name: 'Trésorerie', href: '/admin/treasury', icon: 'account_balance', roles: ['ADMIN', 'RECEPTIONIST'] },
  { name: "Gestion Packs", href: "/admin/packs", icon: "inventory_2", roles: ['ADMIN'] },
  { name: "Coaches", href: "/admin/team", icon: "badge", roles: ['ADMIN'] },
];

const coachNavLinks: NavLink[] = [
    { name: 'Mon Planning', href: '/dashboard/coach', icon: 'calendar_today' },
    { name: 'Ma Bio / Profil', href: '/dashboard/coach/profile', icon: 'person_outline' },
];

// Composant pour le contenu de la sidebar
const SidebarContent = ({ user, pathname, onLinkClick }: any) => {
    // On choisit quel menu afficher selon le rôle
    const links = user?.role === 'COACH' ? coachNavLinks : adminNavLinks;
    const isStaff = user?.role === 'ADMIN' || user?.role === 'RECEPTIONIST';

    return (
        <>
            <div className="mb-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cream text-sage flex items-center justify-center">
                    <span className="material-symbols-outlined">
                        {user?.role === 'COACH' ? 'fitness_center' : 'shield_person'}
                    </span>
                </div>
                <div>
                    <h2 className="font-serif font-bold text-lg leading-none">OASIS</h2>
                    <p className="text-xs text-cream/60 uppercase tracking-widest">
                        {user?.role === 'COACH' ? 'Espace Coach' : 'Administration'}
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {links
                    // Pour l'admin, on filtre encore par sous-rôle (ex: admin vs réceptionniste)
                    .filter(link => user && (user.role === 'COACH' || !link.roles || link.roles.includes(user.role)))
                    .map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.name} href={link.href} onClick={onLinkClick}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${ isActive ? "bg-cream text-sage font-bold shadow-lg" : "text-cream/80 hover:bg-white/10" }`}>
                                <span className="material-symbols-outlined">{link.icon}</span>
                                <span className="text-sm">{link.name}</span>
                            </Link>
                        );
                    })}
            </nav>
        </>
    );
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      // ✅ CORRECTION : On autorise maintenant les COACHS
      const authorizedRoles = ['ADMIN', 'RECEPTIONIST', 'COACH'];
      if (!user || !authorizedRoles.includes(user.role)) {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Chargement ou accès refusé
  const authorizedRoles = ['ADMIN', 'RECEPTIONIST', 'COACH'];
  if (loading || !user || !authorizedRoles.includes(user.role)) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-sage">
            <Loader2 className="animate-spin mb-2" />
            <span className="text-xs font-bold uppercase tracking-widest">Vérification des accès...</span>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-sans flex text-sage">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-sage text-cream h-screen fixed left-0 top-0 p-6 shadow-2xl">
        <div className="flex-1 flex flex-col">
            <SidebarContent user={user} pathname={pathname} />
        </div>
        <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-300 hover:text-red-100 transition-colors mt-auto">
            <LogOut size={16}/> <span className="text-sm font-bold uppercase tracking-widest">Déconnexion</span>
        </button>
      </aside>

      {/* SIDEBAR MOBILE */}
      {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex animate-fade-in">
              <aside className="w-64 bg-sage text-cream h-full p-6 shadow-xl flex flex-col animate-slide-right">
                 <div className="flex-1 flex flex-col">
                    <SidebarContent 
                        user={user} pathname={pathname}
                        onLinkClick={() => setIsMobileMenuOpen(false)}
                    />
                 </div>
                 <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-300 hover:text-red-100">
                     <LogOut size={16}/> <span className="text-sm font-bold uppercase tracking-widest">Déconnexion</span>
                 </button>
              </aside>
              <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
      )}      

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 w-full md:ml-64">
        {/* HEADER MOBILE */}
        <header className="md:hidden bg-white p-4 border-b sticky top-0 z-40 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sage text-cream flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">
                        {(user.role as string) === 'COACH' ? 'fitness_center' : 'shield_person'}
                    </span>
                </div>
                <h2 className="font-serif font-bold text-lg text-sage">OASIS</h2>
            </div>
            
            <div className="flex items-center gap-4">
                <button onClick={logout} title="Déconnexion" className="p-2 text-red-500 bg-red-50 rounded-lg">
                    <LogOut size={20} />
                </button>
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-gray-50 rounded-lg">
                    <Menu className="text-sage" size={24} />
                </button>
            </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}