// ✅ Serveur — uniquement pour les metadata
import type { Metadata } from 'next';
import PlanningClient from '@/app/planning/PlanningClient';

export const metadata: Metadata = {
  title: 'Planning des Cours de Pilates | Oasis Pilates Studio Casablanca',
  description:
    'Consultez et réservez vos cours de Pilates à Casablanca — Reformer Flow, Mat Sculpt, Wunda Chair. Planning de la semaine mis à jour quotidiennement.',
  alternates: {
    canonical: 'https://oasis-pilates.vercel.app/planning',
  },
  openGraph: {
    title: 'Planning Pilates Casablanca | Oasis Pilates Studio',
    description:
      'Réservez votre cours de Pilates à Casablanca. Planning hebdomadaire — Reformer, Mat, Wunda Chair.',
    url: 'https://oasis-pilates.vercel.app/planning',
  },
  // ✅ Indique à Google de revenir souvent (cours changent)
  other: {
    'revisit-after': '1 day',
  },
};

export default function PlanningPage() {
  return <PlanningClient />;
}