"use client";

import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col font-sans bg-sage text-cream">
      
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative flex h-screen min-h-[700px] w-full items-center justify-center overflow-hidden bg-sage pt-20">
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <p className="font-serif text-lg md:text-xl italic font-light text-cream/80 mb-2">Transformez votre corps. Élevez votre esprit.</p>
            <h1 className="font-serif text-[8rem] md:text-[15rem] lg:text-[18rem] font-medium leading-none tracking-tighter text-cream" style={{ margin: '-1rem 0' }}>
              OASIS
            </h1>
            <h2 className="font-serif text-xl md:text-3xl font-semibold uppercase tracking-[0.3em] text-cream mt-4">Pilates Studio</h2>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative glow-circle h-[300px] w-[300px] md:h-[600px] md:w-[600px] rounded-full bg-cream/5 shadow-2xl shadow-cream/5"></div>
          </div>
        </section>

        {/* SECTION À PROPOS */}
        <section className="bg-cream py-24 sm:py-32" id="about">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div>
                <h2 className="font-serif text-4xl font-bold tracking-tight text-sage sm:text-5xl">Bienvenue dans votre sanctuaire</h2>
                <p className="mt-6 text-base leading-7 text-sage/80">
                  Chez Oasis, nous croyons au pouvoir transformateur du mouvement conscient. Notre studio est une échappatoire sereine du quotidien, où vous pouvez vous reconnecter à votre corps, renforcer votre centre et cultiver un esprit apaisé. Nous mélangeons les principes classiques du Pilates avec des techniques contemporaines pour offrir une expérience holistique qui nourrit le corps et l'âme.
                </p>
              </div>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                <img className="h-full w-full object-cover" alt="Femme faisant du yoga" src="/images/reformer with lady.jpg"/>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION COURS */}
        <section className="bg-sage py-24 sm:py-32" id="classes">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-4xl font-bold tracking-tight text-cream sm:text-5xl">Nos Cours</h2>
              <p className="mt-6 text-base leading-7 text-cream/80">
                Explorez notre gamme de cours, chacun conçu pour vous accompagner là où vous en êtes et vous guider vers vos objectifs de bien-être.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {/* Carte 1 */}
              <article className="flex flex-col items-start justify-between rounded-lg overflow-hidden border border-cream/20">
                <div className="relative w-full">
                  <img className="aspect-[16/9] w-full bg-cream/10 object-cover sm:aspect-[2/1] lg:aspect-[3/2]" alt="Reformer Pilates" src="/images/reformer.jpg"/>
                </div>
                <div className="max-w-xl p-6 bg-sage">
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-6 text-cream">Reformer Flow</h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-cream/80">Transformez votre corps avec cet appareil emblématique du Pilates, conçu pour renforcer, allonger et tonifier l'ensemble de votre musculature en douceur et efficacité.</p>
                </div>
              </article>
              {/* Carte 2 */}
              <article className="flex flex-col items-start justify-between rounded-lg overflow-hidden border border-cream/20">
                <div className="relative w-full">
                  <img className="aspect-[16/9] w-full bg-cream/10 object-cover sm:aspect-[2/1] lg:aspect-[3/2]" alt="Pilates au sol" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD72WBv_yruh3Ql3VW17S_Gl7kBNm-igvaEj9JNSQY2ZzLu1Lofz03DMYNLz_5IssdZFOn8wZDS8i-Aqg0M9h5l-pwTCDJ2CsoXg1cn6XL0wx9Bbohkxqhx_nEqyqZ6NB1h94uIA2oKIPve9ABXepjjcNnIB0aeRplfFOI3f8vYrBs9QQvgP9xfNm8O78At16xAMQmO2WT7ola_Mv82MCyibv-ZJhnof-nR6STJZFLeAGnhzuUw3D6HHCdeJSr_F2kJihRJhhNBbz4"/>
                </div>
                <div className="max-w-xl p-6 bg-sage">
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-6 text-cream">Mat Sculpt</h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-cream/80">Au sol, maîtrisez votre corps pour développer une sangle abdominale puissante et une stabilité à toute épreuve.</p>
                </div>
              </article>
              {/* Carte 3 */}
              <article className="flex flex-col items-start justify-between rounded-lg overflow-hidden border border-cream/20">
                <div className="relative w-full">
                  <img className="aspect-[16/9] w-full bg-cream/10 object-cover sm:aspect-[2/1] lg:aspect-[3/2]" alt="Pilates Prénatal" src="/images/wunda_chair.jpg"/>
                </div>
                <div className="max-w-xl p-6 bg-sage">
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-6 text-cream">Wunda Chair</h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-cream/80">Compacte mais intense, la chaise défie votre équilibre et sculpte les jambes, galbe les fessiers et renforce le centre avec précision.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION AVANTAGES */}
        <section className="bg-cream py-24 sm:py-32" id="benefits">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <p className="text-base font-semibold leading-7 text-sage">La Différence Oasis</p>
              <h2 className="mt-2 font-serif text-4xl font-bold tracking-tight text-sage sm:text-5xl">Une approche holistique du bien-être</h2>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-sage">
                    <span className="material-symbols-outlined text-sage h-5 w-5 flex-none">spa</span>
                    Environnement Conscient
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-sage/80">
                    <p className="flex-auto">Notre studio est méticuleusement conçu pour être un sanctuaire tranquille, vous permettant de vous concentrer sur vous-même et de trouver la paix dans votre pratique.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-sage">
                    <span className="material-symbols-outlined text-sage h-5 w-5 flex-none">school</span>
                    Instructeurs Experts
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-sage/80">
                    <p className="flex-auto">Apprenez avec les meilleurs. Nos instructeurs certifiés fournissent des conseils personnalisés pour assurer une forme correcte et un bénéfice maximal.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-sage">
                    <span className="material-symbols-outlined text-sage h-5 w-5 flex-none">fitness_center</span>
                    Équipement de Pointe
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-sage/80">
                    <p className="flex-auto">Nous utilisons des reformers et des équipements haut de gamme pour offrir une expérience Pilates sûre, efficace et luxueuse.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* SECTION TÉMOIGNAGES */}
        <section className="bg-sage py-24 sm:py-32" id="testimonials">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="font-serif text-lg font-semibold leading-8 tracking-tight text-cream">Témoignages</h2>
              <p className="mt-2 font-serif text-4xl font-bold tracking-tight text-cream sm:text-5xl">Ce que disent nos clients</p>
            </div>
            <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
              <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
                <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-lg bg-cream/5 p-8 text-sm leading-6">
                    <blockquote className="text-cream/80">
                      <p className="font-serif italic">“Très joli studio, une vraie bulle de détente. On s’y sent bien dès qu’on entre : ambiance apaisante, machines impeccables, accueil adorable, propreté, ambiance olfactive apaisante… Les séances passent à une vitesse folle ! On sent l’effort sans jamais être épuisée. La coach, qui est aussi la fondatrice et une sportive de haut niveau, est ultra professionnelle, bienveillante et motivante. Bref, un lieu où on a envie de revenir encore et encore.”</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <div className="font-semibold text-cream">Amina E.</div>
                    </figcaption>
                  </figure>
                </div>
                <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-lg bg-cream/5 p-8 text-sm leading-6">
                    <blockquote className="text-cream/80">
                      <p className="font-serif italic">“Peacful place et la coach Aziza est juste magnifique ❤️ je continuerais avec vous Inchaellah”</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <div className="font-semibold text-cream">Safae E.</div>
                    </figcaption>
                  </figure>
                </div>
                <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-lg bg-cream/5 p-8 text-sm leading-6">
                    <blockquote className="text-cream/80">
                      <p className="font-serif italic">“Endroit paisible et propre accueil chaleureux la coach gentille et professionnelle ,je reviendrai inchallah !! Bonne continuation 🌹”</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <div className="font-semibold text-cream">Amina C.</div>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION CTA (Call to Action) */}
        <section className="bg-cream" id="cta">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
            <h2 className="font-serif text-4xl font-bold tracking-tight text-sage sm:text-5xl">Commencez votre transformation.</h2>
            <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-sage text-cream text-base font-bold tracking-wider hover:bg-opacity-90 transition-all">
                <span className="truncate">Réserver un cours</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}