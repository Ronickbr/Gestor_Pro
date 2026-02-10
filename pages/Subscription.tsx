
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PLANS = [
    {
        name: 'Starter',
        price: '0,00',
        frequency: 'mês',
        features: [
            '3 Orçamentos por mês',
            '1 Modelo de Contrato',
            'Backup Local',
            'Suporte via Email'
        ],
        isPopular: false,
        buttonText: 'Plano Atual',
        disabled: true
    },
    {
        name: 'Pro',
        price: '29,90',
        frequency: 'mês',
        features: [
            'Orçamentos Ilimitados',
            'Gerador de Contratos com IA',
            'Todos os Modelos Premium',
            'Backup na Nuvem (Em breve)',
            'Selo de Profissional Verificado',
            'Suporte Prioritário via WhatsApp'
        ],
        isPopular: true,
        buttonText: 'Assinar Agora',
        disabled: false
    }
];

const Subscription: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null); // Use any or CompanyInfo

    // Check if trial is expired to change messaging
    React.useEffect(() => {
        const checkStatus = async () => {
            try {
                const { profileService } = await import('../services/database');
                const p = await profileService.getProfile();
                setProfile(p);
            } catch (e) { console.error(e); }
        };
        checkStatus();
    }, []);

    const isExpired = profile?.subscriptionStatus === 'expired' ||
        (profile?.trialEndsAt && new Date(profile.trialEndsAt) < new Date() && profile?.subscriptionStatus !== 'active');

    const handleSubscribe = (planName: string) => {
        setSelectedPlan(planName);
        // Mock payment process
        setTimeout(() => {
            toast.success(`Obrigado por escolher o plano ${planName}! Redirecionando para pagamento...`);
            window.open('https://buy.stripe.com/test_123', '_blank');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center py-12 px-4">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />

            <header className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-700">
                {isExpired ? (
                    <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                        Período de Teste Finalizado
                    </span>
                ) : (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                        Planos e Preços
                    </span>
                )}

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                    {isExpired ? 'Assine para Continuar' : 'Invista no seu Negócio'}
                </h1>
                <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base">
                    {isExpired
                        ? 'Seu período de teste grátis terminou. Escolha um plano para destravar seu acesso.'
                        : 'Escolha o plano ideal para profissionalizar sua gestão e fechar mais contratos com rapidez e segurança.'}
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                {PLANS.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative bg-white dark:bg-surface-dark rounded-3xl p-8 border hover:scale-105 transition-transform duration-300 ${plan.isPopular ? 'border-primary shadow-2xl shadow-primary/20' : 'border-slate-100 dark:border-white/5 shadow-xl'}`}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-lg">
                                Mais Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">R$ {plan.price}</span>
                                <span className="text-sm text-slate-500">/{plan.frequency}</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <span className={`material-symbols-outlined text-lg ${plan.isPopular ? 'text-primary' : 'text-slate-400'}`}>check_circle</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => !plan.disabled && handleSubscribe(plan.name)}
                            disabled={plan.disabled}
                            className={`w-full py-4 rounded-xl font-bold text-sm transition-all focus:ring-4 focus:ring-primary/20 ${plan.disabled
                                ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30 active:scale-95'
                                }`}
                        >
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-4">Empresas que confiam no Gestor Pro</p>
                <div className="flex justify-center gap-8 opacity-50 grayscale">
                    {/* Logos placeholder using text for now */}
                    <span className="font-black text-slate-300 text-xl">ACME Corp</span>
                    <span className="font-black text-slate-300 text-xl">Global Tech</span>
                    <span className="font-black text-slate-300 text-xl">Fast Fix</span>
                </div>
            </div>

            {!isExpired && (
                <button
                    onClick={() => navigate(-1)}
                    className="mt-12 text-slate-400 hover:text-primary text-sm font-bold flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Voltar para o Sistema
                </button>
            )}
        </div>
    );
};

export default Subscription;
