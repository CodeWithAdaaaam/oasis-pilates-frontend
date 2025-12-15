// types/index.ts

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: 'CLIENT' | 'ADMIN' | 'RECEPTIONIST';
  status?: 'ACTIVE' | 'INACTIVE';
  dateInscription: string;
  subscriptions?: Subscription[];
  reservations?: Reservation[];
}

export interface Payment {
  id: number;
  amount: number;
  paymentDate: string;
  method: string;
  reference?: string;
}

export interface Subscription {
  id: number;
  type: string;
  price: number;
  sessionsTotal: number;
  sessionsLeft: number;
  startDate?: string | null;
  endDate?: string | null;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  createdAt: string;
  amountDue?: number | null;
  amountPaid?: number | null;
  payments?: Payment[];
}

export interface Schedule {
  id: number;
  title: string;
  dayOfWeek: number;
  startTime: string;
  duration: number;
  coachName: string;
  capacity: number;
  isActive: boolean;
}


export interface Reservation {
  id: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  reservationDate: string; 
  schedule: Schedule; 
  user?: { 
    nom: string;
    prenom: string;
  };
}

export interface Coach {
  id: number;
  nom: string;
  prenom: string;
  bio: string;
  specialites: string;
  photoUrl?: string;
  ordre?: number;
}