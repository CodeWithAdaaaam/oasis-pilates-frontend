// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Option pour React
  reactStrictMode: true,

  // Configuration pour les images externes (pour les photos des coachs, etc.)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      // IMPORTANT : Ajoutez aussi l'URL de votre backend Render ici pour la production
      {
        protocol: 'https',
        hostname: 'oasis-pilates-backend.onrender.com',
        port: '', // Pas de port pour l'URL de production
        pathname: '/uploads/**',
      }
    ],
  },
  
  // Configuration pour les rewrites (pour résoudre le problème de cookie sur iOS)
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: 'https://oasis-pilates-backend.onrender.com/api/:path*',
      },
    ]
  },
};

module.exports = nextConfig; // Utilisez module.exports pour la compatibilité