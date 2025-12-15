// app/(admin)/components/ValidationModal.tsx
'use client';

import { useState } from 'react';
import { User } from '@/types';

interface PendingSubscription {
    id: number;
    type: string;
    price: number;
    user: { nom: string; prenom: string; email?: string; telephone?: string };
}

interface ModalProps {
    subscription: PendingSubscription | null;
    onClose: () => void;
    onValidate: (data: any) => void;
}

export default function ValidationModal({ subscription, onClose, onValidate }: ModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CHEQUE' | 'VIREMENT'>('CASH');
    const [paymentRef, setPaymentRef] = useState('');
    const [isPaidInFull, setIsPaidInFull] = useState(true);
    const [amountPaid, setAmountPaid] = useState<number | string>('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Format YYYY-MM-DD

    if (!subscription) return null;

    const amountDue = isPaidInFull ? 0 : subscription.price - Number(amountPaid);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onValidate({
            subscriptionId: subscription.id,
            paymentMethod,
            paymentRef: paymentMethod === 'CASH' ? null : paymentRef,
            amountPaid: isPaidInFull ? subscription.price : Number(amountPaid),
            amountDue,
            startDate,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                    <span className="material-symbols-outlined">close</span>
                </button>

                <h2 className="text-2xl font-bold text-sage mb-2">Validation du Paiement</h2>
                <p className="text-sage/60 mb-6">Confirmez les détails de la transaction pour activer le pack.</p>

                {/* INFOS CLIENT */}
                <div className="bg-sage/5 p-4 rounded-lg mb-6 border border-sage/10">
                    <h3 className="font-bold text-sage mb-2">Informations du Client</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <p><strong className="text-sage/60">Nom:</strong> {subscription.user.prenom} {subscription.user.nom}</p>
                        <p><strong className="text-sage/60">Pack:</strong> <span className="font-mono">{subscription.type}</span></p>
                        <p><strong className="text-sage/60">Email:</strong> {subscription.user.email || 'N/A'}</p>
                        <p><strong className="text-sage/60">Téléphone:</strong> {subscription.user.telephone || 'N/A'}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* MOYEN DE PAIEMENT */}
                    <div>
                        <label className="font-bold text-sage">Moyen de paiement</label>
                        <div className="flex gap-4 mt-2">
                            {['CASH', 'CHEQUE', 'VIREMENT'].map(method => (
                                <button type="button" key={method} onClick={() => setPaymentMethod(method as any)}
                                    className={`px-4 py-2 rounded-lg text-sm border ${paymentMethod === method ? 'bg-sage text-white font-bold' : 'bg-gray-100 text-gray-700'}`}>
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* RÉFÉRENCE CHÈQUE/VIREMENT */}
                    {(paymentMethod === 'CHEQUE' || paymentMethod === 'VIREMENT') && (
                        <div>
                            <label htmlFor="paymentRef" className="font-bold text-sage">Référence</label>
                            <input id="paymentRef" type="text" value={paymentRef} onChange={e => setPaymentRef(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                    )}

                    {/* STATUT PAIEMENT */}
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="isPaidInFull" checked={isPaidInFull} onChange={e => setIsPaidInFull(e.target.checked)} />
                        <label htmlFor="isPaidInFull" className="font-bold text-sage">Le client a payé en intégralité ({subscription.price} DH)</label>
                    </div>

                    {/* MONTANTS */}
                    {!isPaidInFull && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label htmlFor="amountPaid" className="font-bold text-sage">Montant payé (DH)</label>
                                <input id="amountPaid" type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)}
                                    className="w-full mt-1 p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label className="font-bold text-sage/50">Montant restant (DH)</label>
                                <input type="number" value={amountDue} readOnly className="w-full mt-1 p-2 border rounded-md bg-gray-200" />
                            </div>
                        </div>
                    )}
                    
                    {/* DATE DE DÉBUT */}
                     <div>
                        <label htmlFor="startDate" className="font-bold text-sage">Date de début du pack</label>
                        <input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md" required />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="submit" className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                            Valider et Activer le Pack
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}