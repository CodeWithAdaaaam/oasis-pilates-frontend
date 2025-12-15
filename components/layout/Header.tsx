"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const headerClass = !isScrolled 
    ? "bg-transparent py-6" 
    : "bg-sage/90 backdrop-blur-md py-4 shadow-md";

  const navLinks = [
    { name: "Contact", href: "/contact" },      // Page Contact (à créer plus tard)
    { name: "Cours", href: "/#classes" },       // Section Cours sur l'accueil
    { name: "FAQ", href: "/faq" },       // Section FAQ
    { name: "Planning", href: "/planning" },    // Page Planning
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-2xl font-bold tracking-wider text-cream">
              OASIS
            </Link>
          </div>

          {/* NAVIGATION DESKTOP */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium tracking-wider transition-colors ${
                  pathname === link.href 
                    ? "text-cream underline underline-offset-4" 
                    : "text-cream/80 hover:text-cream"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* BOUTON S'INSCRIRE */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-cream mr-4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>

            <Link href="/login">
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-cream text-sage text-sm font-bold tracking-wider hover:bg-opacity-90 transition-all">
                <span className="truncate">S&apos;inscrire</span>
              </button>
            </Link>
          </div>

        </div>
      </div>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-sage border-t border-cream/10 p-6 flex flex-col gap-6 shadow-xl h-screen">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-xl font-serif text-cream text-center py-2">
              {link.name}
            </Link>
          ))}
          <Link href="/dashboard" className="w-full py-3 bg-cream text-sage text-center rounded-lg font-bold">
            S&apos;inscrire / Connexion
          </Link>
        </div>
      )}
    </header>
  );
}