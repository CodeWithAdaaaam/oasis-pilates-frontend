import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: '/api-backend', 
  withCredentials: true, 
});

// --- ON A SUPPRIMÉ TOUTE LA LOGIQUE CSRF (fetchCsrfToken et l'intercepteur) ---
// Le navigateur gère tout automatiquement avec les cookies et le header Origin.

export const getImageUrl = (path?: string | null): string => {
  if (!path) {
    return '/images/placeholder.jpg';
  }
  if (path.startsWith('http')) {
    return path;
  }
  return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}${path}`;
};

export default api;