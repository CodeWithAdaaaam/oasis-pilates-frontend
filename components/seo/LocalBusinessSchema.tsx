export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],

    // ⚠️ Ces 3 champs (NAP) doivent être IDENTIQUES à votre fiche Google Business
    "name": "Oasis Pilates Studio",
    "telephone": "+212-663-600408",  // ← votre numéro réel
    "email": "oasispilatespc@gmail.com",

    "description": "Studio de Pilates premium à Casablanca proposant des cours Reformer, mat Pilates et coaching personnalisé pour tous niveaux.",

    "address": {
      "@type": "PostalAddress",
      "streetAddress": "The Gold Center, Bd El Qods, Casablanca 20600",   // ← ex: "123 Boulevard Anfa"
      "addressLocality": "Casablanca",
      "addressRegion": "Casablanca-Settat",
      "postalCode": "20600",
      "addressCountry": "MA"
    },

    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.5340835",    // ← copiez depuis Google Maps
      "longitude": "-7.6126909"
    },

    "url": "https://oasis-pilates.vercel.app",
    "image": "https://oasis-pilates.vercel.app/images/og-image.jpg",
    "priceRange": "MAD",
    "currenciesAccepted": "MAD",
    "paymentAccepted": "Cash, Carte bancaire",

    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "09:30",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:30",
        "closes": "12:30"
      }
    ],

    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cours Oasis Pilates Casablanca",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cours Pilates Reformer Casablanca",
            "description": "Séances sur machine Reformer, tous niveaux, studio Casablanca"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cours Pilates Tapis Casablanca",
            "description": "Cours de Pilates mat en groupe à Casablanca"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Coaching Pilates Privé Casablanca",
            "description": "Séances individuelles avec coach certifié à Casablanca"
          }
        }
      ]
    },

    "areaServed": {
      "@type": "City",
      "name": "Casablanca",
      "sameAs": "https://www.wikidata.org/wiki/Q24206"
    },

    "sameAs": [
      // ← ajoutez vos liens réseaux sociaux réels
      "https://www.instagram.com/oasispilatesstudio_/"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}