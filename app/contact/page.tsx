"use client";

import { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-sage text-cream font-sans flex flex-col">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        
        {/* TITRE */}
        <div className="text-center mb-16 px-6">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Contactez-nous</h1>
          <p className="text-cream/80 max-w-2xl mx-auto text-lg">
            Une question sur nos cours ? Envie de réserver une séance privée ? 
            Nous sommes là pour vous répondre.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* COLONNE GAUCHE : Coordonnées + Map */}
          <div className="space-y-12">
            
            {/* Infos */}
            <div className="bg-cream/5 p-8 rounded-2xl border border-cream/10">
              <h3 className="font-serif text-2xl mb-6">Nos Coordonnées</h3>
              <div className="space-y-4 text-cream/80">
                <p className="flex items-start gap-4">
                  <span className="material-symbols-outlined mt-1">location_on</span>
                  <span>
                    Oasis Pilates Studio<br />
                    Boulevard El Qods, the Gold Center <br />
                    Casablanca, Maroc
                  </span>
                </p>
                <p className="flex items-center gap-4">
                  <span className="material-symbols-outlined">call</span>
                  <a href="tel:+212663600408" className="hover:text-white transition-colors">+212 6 63 60 04 08</a>
                </p>
                <p className="flex items-center gap-4">
                  <span className="material-symbols-outlined">mail</span>
                  <a href="mailto:contact@oasispilates.ma" className="hover:text-white transition-colors">oasispilatespc@gmail.com</a>
                </p>
                <p className="flex items-start gap-4 pt-4 border-t border-cream/10">
                  <span className="material-symbols-outlined mt-1">schedule</span>
                  <span>
                    Lundi - Vendredi : 09h30 - 20h05<br />
                    Samedi : 09h30 - 16h00<br />
                    Dimanche : Fermé
                  </span>
                </p>
              </div>
            </div>

            {/* Google Maps (Iframe) */}
            <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-cream/10 grayscale hover:grayscale-0 transition-all duration-500">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4317.3783773918!2d-7.615137423565095!3d33.53456694488635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62deb65201cf7%3A0xe2b1bdf28f015319!2sOasis%20Pilates%20Studio!5e1!3m2!1sfr!2sma!4v1765650941725!5m2!1sfr!2sma"
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

          {/* COLONNE DROITE : Formulaire */}
          <div className="bg-white/5 p-8 md:p-10 rounded-3xl border border-cream/10">
            <h3 className="font-serif text-2xl mb-6">Envoyez-nous un message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstname" className="text-sm font-medium tracking-wide text-cream/70">Prénom</label>
                  <input type="text" id="firstname" className="w-full bg-sage/50 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-cream focus:ring-1 focus:ring-cream transition-all placeholder-cream/30" placeholder="Votre prénom" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastname" className="text-sm font-medium tracking-wide text-cream/70">Nom</label>
                  <input type="text" id="lastname" className="w-full bg-sage/50 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-cream focus:ring-1 focus:ring-cream transition-all placeholder-cream/30" placeholder="Votre nom" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium tracking-wide text-cream/70">Email</label>
                <input type="email" id="email" className="w-full bg-sage/50 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-cream focus:ring-1 focus:ring-cream transition-all placeholder-cream/30" placeholder="exemple@email.com" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium tracking-wide text-cream/70">Message</label>
                <textarea id="message" rows={4} className="w-full bg-sage/50 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-cream focus:ring-1 focus:ring-cream transition-all placeholder-cream/30" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>

              <button type="button" className="w-full bg-cream text-sage font-bold py-4 rounded-full hover:bg-white transition-all transform hover:scale-[1.02]">
                Envoyer le message
              </button>
            </form>
          </div>

        </div>

        {/* SECTION FAQ (Accordéon simple) */}
        <div className="max-w-3xl mx-auto px-6 mt-32" id="faq">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Questions Fréquentes (FAQ)</h2>
          <div className="space-y-4">
            <FAQItem question="Faut-il avoir déjà fait du Pilates ?" answer="Non, nos cours 'Mat Sculpt' et 'Reformer Matinal' sont ouverts aux débutants. Nos coachs adaptent les exercices à votre niveau." />
            <FAQItem question="Que dois-je apporter ?" answer="Nous fournissons les tapis et l'eau. Venez simplement avec une tenue confortable et des chaussettes antidérapantes (obligatoires pour l'hygiène)." />
            <FAQItem question="Comment annuler un cours ?" answer="Vous pouvez annuler sans frais jusqu'à 4 heures avant le début du cours via votre Espace Membre." />
            <FAQItem question="Proposez-vous des cours privés ?" answer="Absolument. Vous pouvez réserver des sessions 'Solo' ou 'Duo' directement sur demande ou via le planning." />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

// Petit composant pour l'accordéon FAQ
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-cream/10">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      >
        <span className={`font-serif text-lg transition-colors ${isOpen ? 'text-cream' : 'text-cream/80 group-hover:text-cream'}`}>
          {question}
        </span>
        <span className="material-symbols-outlined transition-transform duration-300 transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          keyboard_arrow_down
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-cream/70 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}