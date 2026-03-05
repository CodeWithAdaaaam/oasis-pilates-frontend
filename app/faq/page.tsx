// ✅ PAS de "use client"
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'FAQ | Questions Fréquentes — Oasis Pilates Studio Casablanca',
  description:
    'Toutes les réponses à vos questions sur nos cours de Pilates à Casablanca : débutants, Reformer, Mat, réservations, tarifs et annulations.',
  alternates: {
    canonical: 'https://oasis-pilates.vercel.app/faq',
  },
  openGraph: {
    title: 'FAQ Pilates Casablanca | Oasis Pilates Studio',
    description:
      'Questions fréquentes sur nos cours de Pilates à Casablanca : Reformer, Mat Sculpt, réservations et packs.',
    url: 'https://oasis-pilates.vercel.app/faq',
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Données FAQ — définies côté serveur
// pour le Schema JSON-LD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const faqGroups = [
  {
    group: "Découvrir le Pilates à Casablanca",
    items: [
      {
        question: "Je n'ai jamais fait de Pilates à Casablanca, par où commencer ?",
        answer: "Bienvenue ! Le Pilates est accessible à tous. Nous vous recommandons de commencer par nos cours Reformer Beginner ou Mat Sculpt à Casablanca. Nos coachs adaptent les exercices à votre niveau.",
      },
      {
        question: "Quelle est la différence entre Mat et Reformer ?",
        answer: "Le Pilates Mat se pratique au sol sur un tapis. Le Reformer est une machine avec des ressorts qui offrent une résistance pour aller plus loin dans l'étirement et le renforcement musculaire.",
      },
      {
        question: "Est-ce que le Pilates aide à perdre du poids ?",
        answer: "Le Pilates affine la silhouette, tonifie les muscles profonds et améliore la posture. Combiné à une alimentation équilibrée, il transforme visiblement le corps en le rendant plus longiligne et ferme.",
      },
    ],
  },
  {
    group: "Infos Pratiques",
    items: [
      {
        question: "Quelle tenue dois-je porter pour un cours de Pilates ?",
        answer: "Une tenue de sport confortable et près du corps (legging, brassière/t-shirt). Les chaussettes antidérapantes sont obligatoires sur les machines pour des raisons d'hygiène.",
      },
      {
        question: "Que dois-je apporter au studio ?",
        answer: "Nous fournissons tout : tapis, bouteilles d'eau, coin café et vestiaire. Venez juste avec votre tenue et votre bonne énergie !",
      },
      {
        question: "Y a-t-il des vestiaires chez Oasis Pilates Casablanca ?",
        answer: "Oui, notre studio de Casablanca dispose de vestiaires équipés.",
      },
    ],
  },
  {
    group: "Abonnements & Réservations",
    items: [
      {
        question: "Comment annuler un cours de Pilates ?",
        answer: "Annulez depuis votre Espace Membre. Si l'annulation est faite plus de 4 heures avant le début du cours, votre séance est recréditée. Sinon, elle est décomptée.",
      },
      {
        question: "Quelle est la durée de validité des packs Pilates ?",
        answer: "Le Pack Découverte (5 séances) est valable 1 mois. Le Pack Standard (10 séances) est valable 2 mois. Le Pack Premium (20 séances) est valable 3 mois.",
      },
      {
        question: "Puis-je partager mon pack avec un ami ?",
        answer: "Nos packs sont nominatifs et individuels pour assurer un suivi personnalisé de votre progression.",
      },
    ],
  },
];

// Schema FAQPage — toutes les questions aplaties
const allFAQItems = faqGroups.flatMap((g) => g.items);

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFAQItems.map(({ question, answer }) => ({
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer,
      },
    })),
  };

  return (
    <>
      {/* ✅ Schema JSON-LD — rich snippets Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* EN-TÊTE — H1 avec mots-clés */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Questions Fréquentes sur nos Cours de Pilates à Casablanca
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-lg">
              Tout ce que vous devez savoir pour votre expérience chez Oasis Pilates Studio à Casablanca.
            </p>
          </div>

          {/* ✅ Accordéon — composant client séparé */}
          <FAQAccordion groups={faqGroups} />

          {/* CTA FINAL */}
          <div className="text-center bg-white/5 rounded-2xl p-10 border border-cream/10 mt-16">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Vous avez une autre question sur nos cours ?
            </h2>
            <p className="text-cream/80 mb-8">
              Notre équipe est à votre disposition par téléphone ou WhatsApp à Casablanca.
            </p>
            {/* ✅ Link seul sans <button> imbriqué */}
            <Link
              href="/contact"
              className="inline-block bg-cream text-sage font-bold py-3 px-8 rounded-full hover:bg-white transition-all transform hover:scale-105"
            >
              Contactez-nous
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}