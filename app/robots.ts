import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/api/'], // On cache les zones privées
    },
    sitemap: 'https://oasis-pilates.vercel.app/sitemap.xml',
  };
}