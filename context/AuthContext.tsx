'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import api from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifier si un token existe au chargement de l'app
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await api.get<User>('/users/me');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  // Fonction de connexion centralisée
  const login = async (credentials: {email: string, password: string}) => {
    try {
      const response = await api.post<{ user: User }>('/auth/login', credentials);
      const userData = response.data.user;
      
      setUser(userData); // Met à jour le state

      // Redirection après succès
      if (userData.role === 'ADMIN' || userData.role === 'RECEPTIONIST') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Erreur de login dans le contexte", error);
      throw error; // Renvoie l'erreur pour que le formulaire puisse l'afficher
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Erreur déconnexion", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children} {/* Optionnel : n'affiche rien tant que le user n'est pas vérifié */}
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