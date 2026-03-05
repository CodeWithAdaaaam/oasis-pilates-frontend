// ✅ PAS de "use client" ici — rendu serveur pour le SEO
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactClient from './ContactClient';
import FAQList from './FaqList';
import ContactSchema from '@/components/seo/ContactSchema';

// ✅ Metadata spécifique à la page Contact
export const metadata: Metadata = {
  title: 'Contact & Localisation | Oasis Pilates Studio Casablanca',
  description:
    'Contactez Oasis Pilates Studio à Casablanca — Boulevard El Qods, The Gold Center. Téléphone : +212 6 63 60 04 08. Cours de Pilates du lundi au samedi.',
  alternates: {
    canonical: 'https://oasis-pilates.vercel.app/contact',
  },
  openGraph: {
    title: 'Contact | Oasis Pilates Studio Casablanca',
    description:
      'Trouvez notre studio de Pilates à Casablanca. Adresse, horaires et formulaire de contact.',
    url: 'https://oasis-pilates.vercel.app/contact',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return (
    <>
      {/* ✅ Schema JSON-LD — lu par Google côté serveur */}
      <ContactSchema />
      <Header />
      <main className="flex-grow pt-32 pb-20">

        {/* TITRE — H1 avec mot-clé géolocalisé */}
        <div className="text-center mb-16 px-6">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Contactez Oasis Pilates à Casablanca
          </h1>
          <p className="text-cream/80 max-w-2xl mx-auto text-lg">
            Une question sur nos cours de Pilates ? Envie de réserver une séance privée à Casablanca ?
            Nous sommes là pour vous répondre.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* COLONNE GAUCHE — Coordonnées + Map */}
          <div className="space-y-12">

            {/* ✅ Balise <address> — signal NAP fort pour Google */}
            <address className="not-italic bg-cream/5 p-8 rounded-2xl border border-cream/10">
              <h2 className="font-serif text-2xl mb-6 not-italic">Nos Coordonnées</h2>
              <div className="space-y-4 text-cream/80">

                <p className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1" aria-hidden="true">location_on</span>
                  <span>
                    {/* ✅ NAP identique au Schema + Google Business */}
                    <strong>Oasis Pilates Studio</strong><br />
                    Boulevard El Qods, The Gold Center<br />
                    Casablanca 20000, Maroc
                  </span>
                </p>

                <p className="flex items-center gap-4">
                  <span className="material-symbols-outlined" aria-hidden="true">call</span>
                  <a
                    href="tel:+212663600408"
                    className="hover:text-white transition-colors"
                    aria-label="Appeler Oasis Pilates Studio Casablanca"
                  >
                    +212 6 63 60 04 08
                  </a>
                </p>

                <p className="flex items-center gap-4">
                  <span className="material-symbols-outlined" aria-hidden="true">mail</span>
                  {/* ✅ Utilisez un seul email cohérent partout */}
                  <a
                    href="mailto:oasispilatespc@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    oasispilatespc@gmail.com
                  </a>
                </p>

                <p className="flex items-start gap-4 pt-4 border-t border-cream/10">
                  <span className="material-symbols-outlined mt-1" aria-hidden="true">schedule</span>
                  {/* ✅ Horaires en <time> pour la sémantique */}
                  <span>
                    <time>Lundi – Vendredi : 09h30 – 20h05</time><br />
                    <time>Samedi : 09h30 – 16h00</time><br />
                    Dimanche : Fermé
                  </span>
                </p>

              </div>
            </address>

            {/* ✅ Google Maps — width ajouté, title descriptif */}
            <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-cream/10 grayscale hover:grayscale-0 transition-all duration-500">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4317.3783773918!2d-7.615137423565095!3d33.53456694488635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62deb65201cf7%3A0xe2b1bdf28f015319!2sOasis%20Pilates%20Studio!5e1!3m2!1sfr!2sma!4v1765650941725!5m2!1sfr!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Oasis Pilates Studio — Boulevard El Qods, Casablanca"
                aria-label="Carte Google Maps — Oasis Pilates Studio Casablanca"
              />
            </div>

          </div>

          {/* COLONNE DROITE — Formulaire (composant client) */}
          <ContactClient />

        </div>

        {/* FAQ avec Schema JSON-LD — composant serveur */}
        <FAQSection />

      </main>
      <Footer />
    </  >
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAQ SECTION — rendu serveur + Schema
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const faqData = [
  {
    question: "Faut-il avoir déjà fait du Pilates pour rejoindre vos cours à Casablanca ?",
    answer: "Non, nos cours Mat Sculpt et Reformer Matinal sont ouverts aux débutants. Nos coachs certifiés à Casablanca adaptent les exercices à votre niveau.",
  },
  {
    question: "Que dois-je apporter à une séance de Pilates ?",
    answer: "Nous fournissons les tapis et l'eau. Venez simplement avec une tenue confortable et des chaussettes antidérapantes (obligatoires pour l'hygiène).",
  },
  {
    question: "Comment annuler un cours de Pilates à Oasis ?",
    answer: "Vous pouvez annuler sans frais jusqu'à 4 heures avant le début du cours via votre Espace Membre sur notre site.",
  },
  {
    question: "Proposez-vous des cours de Pilates privés à Casablanca ?",
    answer: "Absolument. Vous pouvez réserver des sessions Solo ou Duo directement sur demande ou via notre planning en ligne.",
  },
  {
    question: "Où se trouve Oasis Pilates Studio à Casablanca ?",
    answer: "Notre studio est situé Boulevard El Qods, The Gold Center, Casablanca. Ouvert du lundi au vendredi de 09h30 à 20h05 et le samedi de 09h30 à 16h00.",
  },
];

function FAQSection() {
  // ✅ Schema FAQPage — génère les rich snippets dans Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(({ question, answer }) => ({
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer,
      },
    })),
  };

  return (
    <section className="max-w-3xl mx-auto px-6 mt-32" id="faq" aria-label="Questions fréquentes">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
        Questions Fréquentes sur nos Cours de Pilates
      </h2>
      {/* ✅ Le composant accordéon reste client — voir ContactClient */}
      <FAQList items={faqData} />
    </section>
  );
}

