'use client';
import { useState, useEffect } from 'react';
import { X, DollarSign, Wallet, Check, CreditCard, AlertCircle } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Pack {
    id: number;
    name: string;
    price: number;
    isPromoActive: boolean;
    promoPrice?: number;
}

interface BuyPackModalProps {
    clientId: number;
    clientName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BuyPackModal({ clientId, clientName, onClose, onSuccess }: BuyPackModalProps) {
    const [packs, setPacks] = useState<Pack[]>([]);
    const [selectedPackId, setSelectedPackId] = useState<string>('');
    
    // Formulaire
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [paymentRef, setPaymentRef] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Prix
    const [totalPrice, setTotalPrice] = useState<string>(''); // Le "Montant convenu" (Editable)
    const [amountPaid, setAmountPaid] = useState<string>(''); // Le "Montant payé" (Acompte)
    const [basePrice, setBasePrice] = useState<number>(0);    // Prix catalogue pour comparaison

    useEffect(() => {
        api.get('/packs/active')
           .then(res => setPacks(res.data))
           .catch(() => toast.error("Impossible de charger les packs."));
    }, []);

    // Mise à jour automatique des prix lors de la sélection du pack
    useEffect(() => {
        if (selectedPackId) {
            const pack = packs.find(p => p.id === parseInt(selectedPackId));
            if (pack) {
                const officialPrice = (pack.isPromoActive && pack.promoPrice) ? pack.promoPrice : pack.price;
                setBasePrice(officialPrice);
                
                // On pré-remplit avec le prix officiel, mais l'admin peut le changer
                setTotalPrice(officialPrice.toString()); 
                setAmountPaid(officialPrice.toString()); 
            }
        } else {
            setTotalPrice('');
            setAmountPaid('');
            setBasePrice(0);
        }
    }, [selectedPackId, packs]);
    
    // Calcul dynamique du reste à payer
    const negotiatedPrice = parseFloat(totalPrice) || 0;
    const paidNow = parseFloat(amountPaid) || 0;
    const remainingDue = negotiatedPrice - paidNow;
    
    // Détecte si une négociation est en cours (Prix affiché != Prix catalogue)
    const isNegotiated = negotiatedPrice !== basePrice;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedPackId) return toast.error("Sélectionnez un pack.");
        if (remainingDue < 0) return toast.error("Le montant payé dépasse le prix total !");

        const tid = toast.loading("Validation de la vente...");
        try {
            await api.post(`/admin/clients/${clientId}/buy`, {
                packId: parseInt(selectedPackId),
                paymentMethod,
                paymentRef,
                startDate,
                customPrice: isNegotiated ? negotiatedPrice : null, // On envoie le prix négocié seulement si modifié
                amountPaid: paidNow
            });
            
            toast.success("Vente validée !", { id: tid });
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Erreur vente", { id: tid });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-scale-in">
                
                <div className="bg-sage/10 p-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-sage">Nouvelle Vente</h2>
                        <p className="text-sm text-gray-500 font-medium">Pour : <span className="text-gray-800">{clientName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    <select required className="w-full p-3 border-2 border-gray-100 rounded-xl bg-white font-bold text-gray-700 outline-none focus:border-sage" value={selectedPackId} onChange={e => setSelectedPackId(e.target.value)}>
                        <option value="">-- Sélectionner un Pack --</option>
                        {packs.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name} — {(p.isPromoActive && p.promoPrice) ? p.promoPrice : p.price} DH
                            </option>
                        ))}
                    </select>

                    {selectedPackId && (
                        <div className="space-y-4 animate-fade-in">
                            {/* PRIX TOTAL (NÉGOCIABLE) */}
                            <div className={`p-4 rounded-xl border-2 transition-all ${isNegotiated ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-1.5">
                                        <Wallet size={12}/> Montant convenu (DH)
                                    </label>
                                    {isNegotiated && (
                                        <span className="text-[9px] font-bold bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <AlertCircle size={10}/> Prix modifié
                                        </span>
                                    )}
                                </div>
                                <input 
                                    type="number" min="0" step="0.01" required 
                                    value={totalPrice} 
                                    onChange={e => setTotalPrice(e.target.value)} 
                                    className={`w-full p-2 text-xl font-black bg-white rounded-lg outline-none border ${isNegotiated ? 'text-orange-600 border-orange-300' : 'text-gray-800 border-gray-200'}`} 
                                />
                                {isNegotiated && negotiatedPrice < basePrice && (
                                    <p className="text-[10px] text-orange-600 mt-1 text-right font-medium">
                                        Réduction de {basePrice - negotiatedPrice} DH
                                    </p>
                                )}
                            </div>

                            {/* ACOMPTE */}
                            <div className="p-4 rounded-xl border-2 bg-blue-50 border-blue-200">
                                <label className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1.5">
                                    <DollarSign size={12}/> Payé aujourd'hui (DH)
                                </label>
                                <input 
                                    type="number" min="0" step="0.01" required 
                                    value={amountPaid} 
                                    onChange={e => setAmountPaid(e.target.value)} 
                                    className="w-full mt-1 p-2 text-xl font-black bg-white rounded-lg outline-none border border-blue-300 text-blue-700" 
                                />
                            </div>
                            
                            {/* RESTE À PAYER */}
                            <div className={`text-center font-bold p-3 rounded-xl transition-all border-2 ${remainingDue > 0 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                {remainingDue > 0 ? `Reste à payer : ${remainingDue.toFixed(2)} DH` : "✅ Compte soldé"}
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Début</label>
                             <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full mt-1 p-3 border-2 border-gray-100 rounded-xl outline-none text-sm font-bold text-gray-600"/>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Moyen</label>
                            <select className="w-full mt-1 p-3 border-2 border-gray-100 rounded-xl bg-white outline-none text-sm font-bold text-gray-600" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                <option value="CASH">Espèces</option>
                                <option value="CHEQUE">Chèque</option>
                                <option value="VIREMENT">Virement</option>
                            </select>
                        </div>
                    </div>
                    
                    {paymentMethod !== 'CASH' && (
                        <div className="animate-fade-in">
                           <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Référence</label>
                           <input type="text" placeholder="N° Chèque / Virement" className="w-full mt-1 p-3 border-2 border-gray-100 rounded-xl outline-none text-sm font-bold focus:border-sage" value={paymentRef} onChange={e => setPaymentRef(e.target.value)}/>
                        </div>
                    )}

                    <button type="submit" disabled={!selectedPackId} className="w-full py-4 bg-sage text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4">
                        <Check size={18} />
                        Valider la vente
                    </button>
                </form>
            </div>
        </div>
    );
}