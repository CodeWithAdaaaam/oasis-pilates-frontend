import { MetadataRoute } from 'next';

const BASE_URL = 'https://oasis-pilates.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}