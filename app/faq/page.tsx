"use client";

import { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-sage text-cream font-sans flex flex-col">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* EN-TÊTE */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Questions Fréquentes</h1>
            <p className="text-cream/80 max-w-2xl mx-auto text-lg">
              Tout ce que vous devez savoir pour votre expérience chez Oasis.
            </p>
          </div>

          {/* GROUPE 1 : DÉBUTANTS & COURS */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl mb-6 border-b border-cream/20 pb-2">Découvrir le Pilates</h2>
            <div className="space-y-4">
              <FAQItem 
                question="Je n'ai jamais fait de Pilates, par où commencer ?" 
                answer="Bienvenue ! Le Pilates est accessible à tous. Nous vous recommandons de commencer par nos cours 'Reformer Beginner' ou 'Mat Sculpt'. Nos coachs sont formés pour adapter les exercices et proposer des options selon votre niveau." 
              />
              <FAQItem 
                question="Quelle est la différence entre Mat et Reformer ?" 
                answer="Le Pilates Mat se pratique au sol sur un tapis : on utilise le poids du corps pour se renforcer et se gainer. Le Reformer est une machine avec des ressorts qui offrent une résistance : cela permet d'aller plus loin dans l'étirement et le renforcement musculaire, tout en guidant le mouvement." 
              />
              <FAQItem 
                question="Est-ce que je vais perdre du poids ?" 
                answer="Le Pilates affine la silhouette, tonifie les muscles profonds et améliore la posture. Combiné à une alimentation équilibrée, il transforme visiblement le corps en le rendant plus longiligne et ferme." 
              />
            </div>
          </div>

          {/* GROUPE 2 : PRATIQUE */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl mb-6 border-b border-cream/20 pb-2">Infos Pratiques</h2>
            <div className="space-y-4">
              <FAQItem 
                question="Quelle tenue dois-je porter ?" 
                answer="Une tenue de sport confortable et près du corps (legging, brassière/t-shirt) pour que le coach puisse corriger votre posture. Pour des raisons d'hygiène et de sécurité, les chaussettes antidérapantes sont obligatoires sur les machines." 
              />
              <FAQItem 
                question="Que dois-je apporter ?" 
                answer="Nous fournissons tout : tapis, bouteilles d'eau, coin café et vestiaire. Venez juste avec votre tenue et votre bonne énergie !" 
              />
              <FAQItem 
                question="Y a-t-il des vestiaires ?" 
                answer="Oui, notre studio dispose de vestiaires équipés." 
              />
            </div>
          </div>

          {/* GROUPE 3 : RÉSERVATIONS */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl mb-6 border-b border-cream/20 pb-2">Abonnements & Réservations</h2>
            <div className="space-y-4">
              <FAQItem 
                question="Comment annuler un cours ?" 
                answer="Vous pouvez annuler un cours directement depuis votre Espace Membre. Si l'annulation est faite plus de 4 heures avant le début du cours, votre séance est recréditée. Sinon, elle est décomptée." 
              />
              <FAQItem 
                question="Quelle est la durée de validité des packs ?" 
                answer="Le Pack Découverte (5 séances) est valable 1 mois. Le Pack Standard (10 séances) est valable 2 mois. Le Pack Premium (20 séances) est valable 3 mois." 
              />
              <FAQItem 
                question="Puis-je partager mon pack avec un(e) ami(e) ?" 
                answer="Nos packs sont nominatifs et individuels pour assurer un suivi personnalisé de votre progression." 
              />
            </div>
          </div>

          {/* CTA FINAL */}
          <div className="text-center bg-white/5 rounded-2xl p-10 border border-cream/10 mt-16">
            <h3 className="font-serif text-2xl font-bold mb-4">Vous avez une autre question ?</h3>
            <p className="text-cream/80 mb-8">Notre équipe est à votre disposition par téléphone ou WhatsApp.</p>
            <Link href="/contact">
              <button className="bg-cream text-sage font-bold py-3 px-8 rounded-full hover:bg-white transition-all transform hover:scale-105">
                Contactez-nous
              </button>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

// Composant Accordéon Réutilisable
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-cream/10 rounded-xl bg-sage/30 overflow-hidden transition-all hover:bg-sage/50">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-5 px-6 flex justify-between items-center text-left focus:outline-none"
      >
        <span className="font-bold text-lg text-cream/90 pr-4">
          {question}
        </span>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          keyboard_arrow_down
        </span>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out px-6 overflow-hidden ${
          isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
        }`}
      >
        <p className="text-cream/70 leading-relaxed text-sm md:text-base border-t border-cream/5 pt-4">
          {answer}
        </p>
      </div>
    </div>
  );
}