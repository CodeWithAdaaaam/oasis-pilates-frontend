// frontend/services/api.ts
import axios from 'axios';

const api = axios.create({
  // CORRECTION : On pointe vers le chemin /api relatif au domaine principal.
  // Exemple : une requête vers '/users/me' ira sur 'mon-site.railway.app/api/users/me'
  baseURL: '/api', 
  
  // Cette option reste cruciale pour l'envoi des cookies
  withCredentials: true, 
});

// Helper pour afficher les images (doit aussi être simplifié)
export const getImageUrl = (path: string | null | undefined, name: string = "Coach") => {
  // 1. Si on a une string Base64 valide (commence par data:image)
  if (path && path.startsWith('data:image')) {
    return path;
  }

  // 2. Si on a un chemin vers le dossier uploads (ancien système)
  if (path && path.startsWith('/uploads')) {
    return `http://localhost:5000${path}`;
  }

  // 3. Fallback : Avatar avec les initiales réelles du coach au lieu de "OS"
  const formattedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${formattedName}&background=5F7C73&color=fff&size=128`;
};

export default api;