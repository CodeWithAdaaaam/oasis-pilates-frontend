import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { AuthProvider } from '@/context/AuthContext';
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

// ✅ CONFIGURATION SEO AVANCÉE
export const metadata: Metadata = {
  title: {
    default: "Oasis Pilates Studio | Pilates Reformer & Bien-être Premium",
    template: "%s | Oasis Pilates Studio",
  },
  description: "Découvrez Oasis Pilates, votre studio premium. Cours de Pilates Reformer, tapis et coaching personnalisé pour transformer votre corps et élever votre esprit.",
  keywords: ["Pilates", "Reformer Pilates", "Studio Pilates", "Bien-être", "Remise en forme", "Yoga", "Oasis Pilates"],
  authors: [{ name: "Oasis Pilates Studio" }],
  metadataBase: new URL("https://oasis-pilates-frontend.vercel.app"), // Remplace par ton vrai domaine plus tard
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://oasis-pilates-frontend.vercel.app",
    siteName: "Oasis Pilates Studio",
    images: [
      {
        url: "/images/og-image.jpg", // Image 1200x630 à mettre dans ton dossier public/images
        width: 1200,
        height: 630,
        alt: "Oasis Pilates Studio Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis Pilates Studio",
    description: "Transform Your Body. Elevate Your Mind.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
  google: 'IvnXzve-WURG7wfef5gE2r_rTj_NvdwscMG93ExA6o4',
},
};

export const viewport: Viewport = {
  themeColor: "#7C8777", // Couleur 'sage' pour la barre de navigation mobile
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${playfair.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
      </head>
      
      <body 
        className="bg-sage text-cream font-sans antialiased min-h-screen flex flex-col"
        suppressHydrationWarning={true} 
      >
        <AuthProvider> 
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}