import { MetadataRoute } from 'next';

const BASE_URL = 'https://oasis-pilates.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PAGES PUBLIQUES OASIS PILATES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      // Accueil — page la plus importante
    },
    {
      url: `${BASE_URL}/cours`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      // Mots-clés principaux : "cours pilates casablanca"
    },
    {
      url: `${BASE_URL}/planning`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      // Mis à jour fréquemment → daily justifié
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      // Crucial pour SEO local Casablanca
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      // Rich snippets Google → valeur SEO forte
    },
  ];
}