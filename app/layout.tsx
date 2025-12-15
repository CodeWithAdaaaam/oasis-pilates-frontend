import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "OASIS PILATES STUDIO",
  description: "Transform Your Body. Elevate Your Mind.",
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
      
      {/* AJOUTE LA LIGNE JUSTE ICI 👇 */}
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