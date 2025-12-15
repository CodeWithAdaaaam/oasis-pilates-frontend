import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer aria-labelledby="footer-heading" className="bg-sage text-cream border-t border-cream/10">
      <h2 className="sr-only" id="footer-heading">Pied de page</h2>
      
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="font-serif text-3xl font-bold tracking-wider text-cream">
              OASIS
            </Link>
            <p className="text-sm leading-6 text-cream/70 max-w-xs">
              Transformez votre corps. Élevez votre esprit. 
              Le premier studio dédié au bien-être holistique à Casablanca.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-cream">Navigation</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link href="/#about" className="text-sm leading-6 text-cream/70 hover:text-cream transition-colors">Le Studio</Link></li>
                  <li><Link href="/#classes" className="text-sm leading-6 text-cream/70 hover:text-cream transition-colors">Nos Cours</Link></li>
                  <li><Link href="/planning" className="text-sm leading-6 text-cream/70 hover:text-cream transition-colors">Planning</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-cream">Ressources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link href="/faq" className="text-sm leading-6 text-cream/70 hover:text-cream transition-colors">FAQ</Link></li>
                  <li><Link href="/contact" className="text-sm leading-6 text-cream/70 hover:text-cream transition-colors">Contact</Link></li>
                  <li><Link href="/dashboard" className="text-sm leading-6 text-cream/70 hover:text-cream transition-colors">Espace Membre</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-cream">Réseaux</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><a href="https://www.instagram.com/oasispilatesstudio_" className="text-sm leading-6 text-cream/70 hover:text-cream transition-colors">Instagram</a></li>
                  <li><a href="https://www.tiktok.com/@oasis_pilates_s?_r=1&_t=ZS-92C39YdCW4C" className="text-sm leading-6 text-cream/70 hover:text-cream transition-colors">TikTok</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-cream/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-cream/60">
            &copy; {currentYear} Oasis Pilates Studio. Tous droits réservés.
          </p>
          
          <p className="text-xs leading-5 text-cream/60 flex items-center gap-1">
            Créé avec <span className="text-red-300 text-xs">♥</span> par 
            <a 
              href="https://ton-portfolio.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-cream hover:text-white hover:underline transition-all"
            >
              CodeByAdam
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}