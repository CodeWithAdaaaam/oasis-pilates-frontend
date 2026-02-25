import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // --- CONFIGURATION DES IMAGES EXTERNES ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
      // Si tu as encore besoin de charger des photos depuis le dossier uploads du backend
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },

  // --- REWRITES POUR LE DÉVELOPPEMENT LOCAL ---
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;