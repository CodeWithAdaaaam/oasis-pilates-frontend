export default function HomeSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    "name": "Oasis Pilates Studio",
    "description": "Studio de Pilates premium à Casablanca — Reformer Flow, Mat Sculpt, Wunda Chair. Cours collectifs et privés pour tous niveaux.",
    "url": "https://oasis-pilates.vercel.app",
    "telephone": "+212663600408",
    "email": "oasispilatespc@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Boulevard El Qods, The Gold Center",
      "addressLocality": "Casablanca",
      "addressRegion": "Casablanca-Settat",
      "postalCode": "20000",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.53456694488635",
      "longitude": "-7.615137423565095"
    },
    "image": "https://oasis-pilates.vercel.app/images/og-image.jpg",
    "priceRange": "MAD",
    "areaServed": { "@type": "City", "name": "Casablanca" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}