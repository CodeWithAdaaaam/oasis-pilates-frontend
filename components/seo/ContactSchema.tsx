export default function ContactSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Oasis Pilates Studio",
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
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "09:30",
        "closes": "20:05"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:30",
        "closes": "16:00"
      }
    ],
    "url": "https://oasis-pilates.vercel.app/contact"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
