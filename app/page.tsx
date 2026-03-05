
// ✅ PAS de "use client" — rendu serveur pour le SEO
import type { Metadata } from 'next';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HomeSchema from '../components/seo/HomeSchema';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Oasis Pilates Studio | Studio de Pilates à Casablanca',
  description:
    'Studio de Pilates premium à Casablanca — Reformer Flow, Mat Sculpt, Wunda Chair. Cours collectifs et privés pour tous niveaux. Boulevard El Qods, Casablanca.',
  alternates: {
    canonical: 'https://oasis-pilates.vercel.app',
  },
  openGraph: {
    title: 'Oasis Pilates Studio | Casablanca',
    description:
      'Studio de Pilates premium à Casablanca. Reformer, Mat, Wunda Chair — tous niveaux.',
    url: 'https://oasis-pilates.vercel.app',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function Home() {
  return (
    <>
      <HomeSchema />
      <Header />

      <main>
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            HERO SECTION
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section
          className="relative flex h-screen min-h-[700px] w-full items-center justify-center overflow-hidden bg-sage pt-20"
          aria-label="Bienvenue chez Oasis Pilates Studio Casablanca"
        >
          <div className="relative z-10 flex flex-col items-center text-center px-4">

            {/* ✅ H1 optimisé SEO — visible mais petit visuellement */}
            <h1 className="sr-only">
              Oasis Pilates Studio — Studio de Pilates à Casablanca
            </h1>

            {/* Le grand "OASIS" reste visuel mais devient aria-hidden */}
            <p
              className="font-serif text-[8rem] md:text-[15rem] lg:text-[18rem] font-medium leading-none tracking-tighter text-cream"
              style={{ margin: '-1rem 0' }}
              aria-hidden="true"
            >
              OASIS
            </p>

            <p className="font-serif text-lg md:text-xl italic font-light text-cream/80 mb-2">
              Transformez votre corps. Élevez votre esprit.
            </p>

            {/* ✅ H2 avec mot-clé géolocalisé */}
            <h2 className="font-serif text-xl md:text-3xl font-semibold uppercase tracking-[0.3em] text-cream mt-4">
              Studio Pilates · Casablanca
            </h2>

            {/* ✅ CTA avec lien vers planning */}
            <Link
              href="/planning"
              className="mt-10 inline-flex items-center justify-center rounded-full h-12 px-8 bg-cream text-sage text-base font-bold tracking-wider hover:bg-white transition-all"
            >
              Réserver un cours
            </Link>

          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="relative glow-circle h-[300px] w-[300px] md:h-[600px] md:w-[600px] rounded-full bg-cream/5 shadow-2xl shadow-cream/5" />
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION À PROPOS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="bg-cream py-24 sm:py-32" id="about">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div>
                <h2 className="font-serif text-4xl font-bold tracking-tight text-sage sm:text-5xl">
                  Bienvenue dans votre sanctuaire de Pilates à Casablanca
                </h2>
                <p className="mt-6 text-base leading-7 text-sage/80">
                  Chez Oasis Pilates Studio à Casablanca, nous croyons au pouvoir transformateur
                  du mouvement conscient. Notre studio est une échappatoire sereine du quotidien,
                  où vous pouvez vous reconnecter à votre corps, renforcer votre centre et cultiver
                  un esprit apaisé. Nous mélangeons les principes classiques du Pilates avec des
                  techniques contemporaines pour offrir une expérience holistique qui nourrit le
                  corps et l'âme.
                </p>
              </div>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                {/* ✅ Alt descriptif avec mot-clé */}
                <img
                  className="h-full w-full object-cover"
                  alt="Séance de Pilates Reformer au studio Oasis Pilates à Casablanca"
                  src="/images/reformer with lady.jpg"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION COURS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="bg-sage py-24 sm:py-32" id="classes">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              {/* ✅ H2 avec mots-clés */}
              <h2 className="font-serif text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                Nos Cours de Pilates à Casablanca
              </h2>
              <p className="mt-6 text-base leading-7 text-cream/80">
                Explorez notre gamme de cours de Pilates à Casablanca, chacun conçu pour vous
                accompagner là où vous en êtes et vous guider vers vos objectifs de bien-être.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">

              <article className="flex flex-col items-start justify-between rounded-lg overflow-hidden border border-cream/20">
                <div className="relative w-full">
                  {/* ✅ Alt avec mot-clé + ville */}
                  <img
                    className="aspect-[16/9] w-full bg-cream/10 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    alt="Cours Pilates Reformer Flow — Oasis Pilates Studio Casablanca"
                    src="/images/reformer.jpg"
                    loading="lazy"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="max-w-xl p-6 bg-sage">
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-6 text-cream">
                    Reformer Flow
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-cream/80">
                    Transformez votre corps avec cet appareil emblématique du Pilates à Casablanca,
                    conçu pour renforcer, allonger et tonifier l'ensemble de votre musculature en
                    douceur et efficacité.
                  </p>
                </div>
              </article>

              <article className="flex flex-col items-start justify-between rounded-lg overflow-hidden border border-cream/20">
                <div className="relative w-full">
                  <img
                    className="aspect-[16/9] w-full bg-cream/10 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    alt="Cours Mat Sculpt Pilates au sol — Oasis Pilates Casablanca"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD72WBv_yruh3Ql3VW17S_Gl7kBNm-igvaEj9JNSQY2ZzLu1Lofz03DMYNLz_5IssdZFOn8wZDS8i-Aqg0M9h5l-pwTCDJ2CsoXg1cn6XL0wx9Bbohkxqhx_nEqyqZ6NB1h94uIA2oKIPve9ABXepjjcNnIB0aeRplfFOI3f8vYrBs9QQvgP9xfNm8O78At16xAMQmO2WT7ola_Mv82MCyibv-ZJhnof-nR6STJZFLeAGnhzuUw3D6HHCdeJSr_F2kJihRJhhNBbz4"
                    loading="lazy"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="max-w-xl p-6 bg-sage">
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-6 text-cream">
                    Mat Sculpt
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-cream/80">
                    Au sol, maîtrisez votre corps pour développer une sangle abdominale puissante
                    et une stabilité à toute épreuve.
                  </p>
                </div>
              </article>

              <article className="flex flex-col items-start justify-between rounded-lg overflow-hidden border border-cream/20">
                <div className="relative w-full">
                  <img
                    className="aspect-[16/9] w-full bg-cream/10 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    alt="Cours Wunda Chair Pilates — Oasis Pilates Studio Casablanca"
                    src="/images/wunda_chair.jpg"
                    loading="lazy"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="max-w-xl p-6 bg-sage">
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-6 text-cream">
                    Wunda Chair
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-cream/80">
                    Compacte mais intense, la chaise défie votre équilibre et sculpte les jambes,
                    galbe les fessiers et renforce le centre avec précision.
                  </p>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION AVANTAGES
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="bg-cream py-24 sm:py-32" id="benefits">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <p className="text-base font-semibold leading-7 text-sage">La Différence Oasis</p>
              <h2 className="mt-2 font-serif text-4xl font-bold tracking-tight text-sage sm:text-5xl">
                Pourquoi choisir notre studio de Pilates à Casablanca ?
              </h2>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-sage">
                    <span className="material-symbols-outlined text-sage h-5 w-5 flex-none" aria-hidden="true">spa</span>
                    Environnement Conscient
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-sage/80">
                    <p className="flex-auto">
                      Notre studio de Pilates à Casablanca est méticuleusement conçu pour être un
                      sanctuaire tranquille, vous permettant de vous concentrer sur vous-même.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-sage">
                    <span className="material-symbols-outlined text-sage h-5 w-5 flex-none" aria-hidden="true">school</span>
                    Instructeurs Certifiés
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-sage/80">
                    <p className="flex-auto">
                      Nos coachs Pilates certifiés à Casablanca fournissent des conseils
                      personnalisés pour assurer une forme correcte et un bénéfice maximal.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-sage">
                    <span className="material-symbols-outlined text-sage h-5 w-5 flex-none" aria-hidden="true">fitness_center</span>
                    Équipement de Pointe
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-sage/80">
                    <p className="flex-auto">
                      Reformers et équipements Pilates haut de gamme pour une expérience sûre,
                      efficace et luxueuse à Casablanca.
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION TÉMOIGNAGES + Schema Review
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="bg-sage py-24 sm:py-32" id="testimonials">
          {/* ✅ Schema Review — étoiles dans Google */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Oasis Pilates Studio",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "5",
                  "reviewCount": "3",
                  "bestRating": "5"
                },
                "review": [
                  {
                    "@type": "Review",
                    "author": { "@type": "Person", "name": "Amina E." },
                    "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                    "reviewBody": "Très joli studio, une vraie bulle de détente. La coach est ultra professionnelle, bienveillante et motivante."
                  },
                  {
                    "@type": "Review",
                    "author": { "@type": "Person", "name": "Safae E." },
                    "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                    "reviewBody": "Peaceful place et la coach Aziza est juste magnifique."
                  },
                  {
                    "@type": "Review",
                    "author": { "@type": "Person", "name": "Amina C." },
                    "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                    "reviewBody": "Endroit paisible et propre, accueil chaleureux, coach gentille et professionnelle."
                  }
                ]
              })
            }}
          />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="font-serif text-lg font-semibold leading-8 tracking-tight text-cream">Témoignages</h2>
              <p className="mt-2 font-serif text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                Ce que disent nos clients Casablanca
              </p>
            </div>
            <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
              <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
                {[
                  { name: "Amina E.", text: "Très joli studio, une vraie bulle de détente. On s'y sent bien dès qu'on entre : ambiance apaisante, machines impeccables, accueil adorable, propreté, ambiance olfactive apaisante… Les séances passent à une vitesse folle ! La coach est ultra professionnelle, bienveillante et motivante." },
                  { name: "Safae E.", text: "Peaceful place et la coach Aziza est juste magnifique ❤️ je continuerais avec vous Inchaellah" },
                  { name: "Amina C.", text: "Endroit paisible et propre accueil chaleureux la coach gentille et professionnelle, je reviendrai inchallah !! Bonne continuation 🌹" },
                ].map(({ name, text }) => (
                  <div key={name} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                    <figure className="rounded-lg bg-cream/5 p-8 text-sm leading-6">
                      <blockquote className="text-cream/80">
                        <p className="font-serif italic">{`"${text}"`}</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <div className="font-semibold text-cream">{name}</div>
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CTA
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="bg-cream" id="cta">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
            <h2 className="font-serif text-4xl font-bold tracking-tight text-sage sm:text-5xl">
              Commencez votre transformation à Casablanca.
            </h2>
            <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
              {/* ✅ Vrai lien au lieu d'un bouton mort */}
              <Link
                href="/planning"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-sage text-cream text-base font-bold tracking-wider hover:bg-opacity-90 transition-all"
              >
                Réserver un cours
              </Link>
              <Link href="/contact" className="text-sage font-semibold hover:underline">
                Nous contacter →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}