'use client';

import { useState } from 'react';
import { X } from 'lucide-react'; // Utilisation de lucide pour la cohérence

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
    const [amountPaid, setAmountPaid] = useState<string>('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    if (!subscription) return null;

    // Calcul dynamique du restant dû pour affichage
    const currentPrice = subscription.price;
    const effectivePaid = isPaidInFull ? currentPrice : (parseFloat(amountPaid) || 0);
    const amountDue = Math.max(0, currentPrice - effectivePaid);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ SÉCURISATION DES DONNÉES (Pour éviter l'erreur 400)
        const payload = {
            paymentMethod, // CASH, CHEQUE ou VIREMENT
            paymentRef: paymentMethod === 'CASH' ? '' : paymentRef,
            amountPaid: effectivePaid, // Nombre réel
            startDate: startDate, // "YYYY-MM-DD"
        };

        onValidate(payload);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 relative animate-scale-in">
                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                    <X size={24} />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-black text-sage uppercase tracking-tighter">Validation du Paiement</h2>
                    <p className="text-gray-400 text-sm font-medium">Activez le forfait et enregistrez l'entrée en caisse.</p>
                </div>

                {/* RÉSUMÉ DU CLIENT */}
                <div className="bg-sage/5 p-6 rounded-[1.5rem] mb-8 border border-sage/10">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] font-black text-sage/60 uppercase tracking-widest mb-1">Adhérent</p>
                            <p className="font-bold text-gray-800">{subscription.user.prenom} {subscription.user.nom}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-sage/60 uppercase tracking-widest mb-1">Forfait demandé</p>
                            <p className="font-mono text-sm font-bold text-gray-700">{subscription.type}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-sage/60 uppercase tracking-widest mb-1">Prix du pack</p>
                            <p className="font-black text-sage text-xl">{subscription.price} DH</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-sage/60 uppercase tracking-widest mb-1">Contact</p>
                            <p className="text-xs font-bold text-gray-500">{subscription.user.telephone || subscription.user.email}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* MÉTHODE DE PAIEMENT */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Mode de règlement</label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            {(['CASH', 'CHEQUE', 'VIREMENT'] as const).map(method => (
                                <button 
                                    type="button" 
                                    key={method} 
                                    onClick={() => setPaymentMethod(method)}
                                    className={`py-3 rounded-xl text-xs font-black transition-all border-2 ${
                                        paymentMethod === method 
                                        ? 'bg-sage border-sage text-white shadow-lg shadow-sage/20' 
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-sage/30'
                                    }`}
                                >
                                    {method === 'CASH' ? 'ESPÈCES' : method}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* RÉFÉRENCE CONDITIONNELLE */}
                    {paymentMethod !== 'CASH' && (
                        <div className="animate-fade-in">
                            <label className="text-[10px] font-black text-orange-500 uppercase ml-2 tracking-widest">
                                {paymentMethod === 'CHEQUE' ? 'Numéro du chèque' : 'Référence du virement'}
                            </label>
                            <input 
                                type="text" 
                                value={paymentRef} 
                                onChange={e => setPaymentRef(e.target.value)}
                                className="w-full mt-1.5 p-4 border-2 border-orange-100 bg-orange-50/30 rounded-2xl outline-none focus:border-orange-400 font-bold" 
                                placeholder="Indispensable pour la traçabilité"
                                required 
                            />
                        </div>
                    )}

                    {/* CONFIGURATION DU MONTANT */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsPaidInFull(!isPaidInFull)}>
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 accent-sage cursor-pointer" 
                                checked={isPaidInFull} 
                                onChange={e => setIsPaidInFull(e.target.checked)} 
                            />
                            <label className="font-bold text-sm text-gray-700 cursor-pointer">Le client a payé la totalité ({subscription.price} DH)</label>
                        </div>

                        {!isPaidInFull && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Montant perçu</label>
                                    <input 
                                        type="number" 
                                        value={amountPaid} 
                                        onChange={e => setAmountPaid(e.target.value)}
                                        className="w-full mt-1 p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-sage font-black text-blue-600" 
                                        placeholder="0.00"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Reste dû</label>
                                    <div className="w-full mt-1 p-4 bg-red-50 border-2 border-red-50 rounded-2xl font-black text-red-500">
                                        {amountDue} DH
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* DATE DÉBUT */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Prendra effet le</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full mt-1.5 p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-sage font-bold" 
                            required 
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-gray-600"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            className="flex-[2] bg-sage text-white font-black py-4 rounded-2xl shadow-xl shadow-sage/20 hover:bg-sage/90 active:scale-95 transition-all uppercase text-[10px] tracking-[0.2em]"
                        >
                            Valider & Activer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}