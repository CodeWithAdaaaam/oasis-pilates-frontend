const nextConfig = {
  // Activer React Strict Mode est une bonne pratique
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Port de ton backend Express
        pathname: '/uploads/**', // Autorise toutes les images du dossier uploads
      },
    ],
  },
};

export default nextConfig;