'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

const adminNavLinks = [
  { name: 'Tableau de bord', href: '/admin', icon: 'dashboard', roles: ['ADMIN', 'RECEPTIONIST'] },
  { name: 'Gestion Clients', href: '/admin/clients', icon: 'group', roles: ['ADMIN', 'RECEPTIONIST'] },
  { name: 'Planning & Cours', href: '/admin/courses', icon: 'calendar_month', roles: ['ADMIN', 'RECEPTIONIST'] },
  { name: 'Trésorerie', href: '/admin/treasury', icon: 'account_balance', roles: ['ADMIN', 'RECEPTIONIST'] },
  { name: "Gestion Packs", href: "/admin/packs", icon: "inventory_2", roles: ['ADMIN'] },
  { name: "Coaches", href: "/admin/team", icon: "badge", roles: ['ADMIN'] },
];

// Composant pour le contenu de la sidebar (évite la répétition)
const SidebarContent = ({ user, pathname, onLinkClick }: any) => (
    <>
        <div className="mb-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cream text-sage flex items-center justify-center">
                <span className="material-symbols-outlined">shield_person</span>
            </div>
            <div>
                <h2 className="font-serif font-bold text-lg leading-none">OASIS</h2>
                <p className="text-xs text-cream/60 uppercase tracking-widest">Administration</p>
            </div>
        </div>
        <nav className="flex-1 space-y-2">
            {adminNavLinks
                .filter(link => user && link.roles.includes(user.role))
                .map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.name} href={link.href} onClick={onLinkClick}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${ isActive ? "bg-cream text-sage font-bold" : "text-cream/80 hover:bg-white/10" }`}>
                            <span className="material-symbols-outlined">{link.icon}</span>
                            <span className="text-sm">{link.name}</span>
                        </Link>
                    );
                })}
        </nav>
    </>
);


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'RECEPTIONIST')) {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || (user.role !== 'ADMIN' && user.role !== 'RECEPTIONIST')) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-cream font-sans flex text-sage">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-sage text-cream h-screen fixed left-0 top-0 p-6 shadow-2xl">
        <div className="flex-1 flex flex-col">
            <SidebarContent user={user} pathname={pathname} />
        </div>
        <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-300 hover:text-red-100">
            <LogOut size={16}/> <span className="text-sm">Déconnexion</span>
        </button>
      </aside>

      {/* SIDEBAR MOBILE */}
      {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
              <aside className="w-64 bg-sage text-cream h-full p-6 shadow-xl flex flex-col">
                 <div className="flex-1 flex flex-col">
                    <SidebarContent 
                        user={user} pathname={pathname}
                        onLinkClick={() => setIsMobileMenuOpen(false)}
                    />
                 </div>
                 <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-300 hover:text-red-100">
                     <LogOut size={16}/> <span className="text-sm">Déconnexion</span>
                 </button>
              </aside>
              <div className="flex-1 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
      )}      

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 w-full md:ml-64">
        {/* HEADER MOBILE - CORRIGÉ */}
        <header className="md:hidden bg-white p-4 border-b sticky top-0 z-40 flex justify-between items-center">
            <h2 className="font-serif font-bold text-lg text-sage">OASIS Admin</h2>
            <div className="flex items-center gap-4">
                <button onClick={logout} title="Déconnexion">
                    <LogOut className="text-red-500" size={20} />
                </button>
                {/* On remet le bouton Burger ici */}
                <button onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu className="text-sage" />
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