import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { AuthProvider } from '@/context/AuthContext';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_URL = "https://oasis-pilates-frontend.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Oasis Pilates Studio | Studio de Pilates à Casablanca",
    template: "%s | Oasis Pilates Casablanca",
  },

  description: "Studio de Pilates premium à Casablanca — cours Reformer, tapis et coaching personnalisé. Transformez votre corps et votre bien-être. Réservez votre séance à Casablanca.",

  keywords: [
    "pilates casablanca",
    "studio pilates casablanca",
    "reformer pilates casablanca",
    "cours pilates casablanca",
    "pilates maroc",
    "oasis pilates",
    "bien-être casablanca",
    "coach pilates casablanca",
  ],

  authors: [{ name: "Oasis Pilates Studio", url: SITE_URL }],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "fr_MA",         // ✅ Maroc, pas France
    url: SITE_URL,
    siteName: "Oasis Pilates Studio",
    title: "Oasis Pilates Studio | Studio de Pilates à Casablanca",
    description: "Studio de Pilates premium à Casablanca. Reformer, tapis, coaching personnalisé.",
    images: [{
      url: "/images/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Oasis Pilates Studio — Casablanca",
    }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Oasis Pilates Studio | Casablanca",
    description: "Studio de Pilates premium à Casablanca. Reformer, tapis, coaching.",
    images: ["/images/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ✅ Google Search Console
  verification: {
    google: 'IvnXzve-WURG7wfef5gE2r_rTj_NvdwscMG93ExA6o4',
  },
};

export const viewport: Viewport = {
  themeColor: "#7C8777",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-MA" className={`${montserrat.variable} ${playfair.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-sage text-cream font-sans antialiased min-h-screen flex flex-col"
        suppressHydrationWarning={true}
      >
        {/* ✅ Schema SEO local Casablanca */}
        <LocalBusinessSchema />

        <AuthProvider>
          {children}
        </AuthProvider>
      </body>

      {/* ✅ Google Analytics 4 — hors body pour les perfs */}
      <GoogleAnalytics gaId="G-G7DLK17GT9" />
    </html>
  );
}