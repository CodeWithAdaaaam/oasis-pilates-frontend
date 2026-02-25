'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types';
import api from '@/services/api';
import HealthProfileModal from '@/components/HealthProfileModal'; // Assurez-vous que le chemin est correct

// On étend le type User pour qu'il puisse contenir les données de la fiche santé
interface UserWithHealthProfile extends User {
  healthProfile?: any;
}

interface AuthContextType {
  user: UserWithHealthProfile | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithHealthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHealthModalForcedOpen, setHealthModalForcedOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Fonction pour vérifier l'utilisateur connecté (réutilisable)
  const verifyUser = async () => {
    try {
      // Le backend doit renvoyer l'utilisateur AVEC son healthProfile
      const response = await api.get<UserWithHealthProfile>(`/users/me?_t=${new Date().getTime()}`);
      const userData = response.data;
      setUser(userData);
      
      // Si c'est un client et qu'il n'a pas de profil santé, on force l'ouverture du modal
      if (userData && userData.role === 'CLIENT' && !userData.healthProfile) {
        setHealthModalForcedOpen(true);
      }
      
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Effet pour vérifier l'utilisateur au premier chargement
  useEffect(() => {
    if (pathname === '/login' || pathname === '/register') {
        setLoading(false);
        return;
    }
    verifyUser();
  }, [pathname]);

  // Fonction de connexion
  const login = async (credentials: {email: string, password: string}) => {
    try {
      const response = await api.post<{ user: UserWithHealthProfile }>('/auth/login', credentials);
      const userData = response.data.user;
      setUser(userData);
      
      // LOGIQUE DE REDIRECTION PAR RÔLE
      if (userData.role === 'ADMIN' || userData.role === 'RECEPTIONIST') {
        router.push('/admin');
      } 
      else if (userData.role === 'COACH') {
        router.push('/dashboard/coach'); // ✅ On envoie le coach sur son planning
      } 
      else {
        router.push('/dashboard'); // Client
        if (!userData.healthProfile) {
            setHealthModalForcedOpen(true);
        }
      }
    } catch (error) {
      console.error("Erreur de login", error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Erreur déconnexion", error);
    }
  };

  // Fonction pour rafraîchir l'utilisateur (appelée par le modal)
  const refreshUser = () => {
    setHealthModalForcedOpen(false); // On ferme d'abord le modal forcé
    verifyUser(); // Puis on recharge les données
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {/* Le modal s'affiche par-dessus tout si son état 'isOpen' est true */}
      <HealthProfileModal 
        isOpen={isHealthModalForcedOpen} 
        onClose={() => setHealthModalForcedOpen(false)} // Permet au 'X' de fonctionner
      />
      
      {/* On n'affiche le reste du site que si le chargement initial est terminé */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};