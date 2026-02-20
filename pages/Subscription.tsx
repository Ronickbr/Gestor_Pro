import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { profileService } from '../services/database';
import { ExpiredAccountBanner } from '../components/ExpiredAccountBanner';

const PLANS = [
    {
        id: 'mensal',
        name: 'Mensal',
        price: '59,90',
        frequency: 'mês',
        description: 'Flexibilidade total para seu negócio.',
        features: [
            'Orçamentos Ilimitados',
            'Gerador de Contratos com IA',
            'Todos os Modelos Premium',
            'Backup na Nuvem',
            'Suporte via WhatsApp'
        ],
        isPopular: false,
        buttonText: 'Assinar Mensal',
        disabled: false
    },
    {
        id: 'semestral',
        name: 'Semestral',
        price: '55,00',
        frequency: 'mês',
        description: 'Economize 10% com pagamento semestral.',
        features: [
            'Tudo do Plano Mensal',
            'Economia de R$ 30,00/semestre',
            'Cobrança Semestral',
            'Prioridade no Suporte'
        ],
        isPopular: false,
        buttonText: 'Assinar Semestral',
        disabled: false
    },
    {
        id: 'anual',
        name: 'Anual',
        price: '49,90',
        frequency: 'mês',
        description: 'Melhor valor. Economize 20% ao ano.',
        features: [
            'Tudo do Plano Semestral',
            'Economia de R$ 120,00/ano',
            'Cobrança Anual',
            'Consultoria Exclusiva',
            'Badge de Membro Fundador'
        ],
        isPopular: true,
        buttonText: 'Assinar Anual',
        disabled: false
    }
];

const PAYMENT_LINKS: Record<string, string> = {
    mensal: 'https://invoice.infinitepay.io/plans/rnbudel_pay/CaBJ9RnvR',
    semestral: 'https://invoice.infinitepay.io/plans/rnbudel_pay/1pFe5l8YwV',
    anual: 'https://invoice.infinitepay.io/plans/rnbudel_pay/2R0ENMqZdx'
};

const FAQS = [
    {
        question: 'Posso cancelar a qualquer momento?',
        answer: 'Sim! Não há fidelidade no plano mensal. Nos planos semestral e anual, o cancelamento é programado para o fim do período contratado.'
    },
    {
        question: 'Como funciona o teste grátis?',
        answer: 'Você tem acesso total a todas as funcionalidades por 7 dias. Não pedimos cartão de crédito para começar.'
    },
    {
        question: 'Quais formas de pagamento aceitas?',
        answer: 'Aceitamos cartão de crédito, Pix e boleto bancário através da nossa plataforma segura.'
    },
    {
        question: 'O suporte é humanizado?',
        answer: 'Com certeza! Nosso time de suporte atende via WhatsApp e Email em horário comercial para tirar todas as suas dúvidas.'
    }
];

const Subscription: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const p = await profileService.getProfile();
                setProfile(p);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, []);

    const isExpired = (() => {
        if (!profile) return false;
        const now = new Date();

        if (profile.subscriptionStatus === 'expired') return true;

        if (profile.subscriptionEndsAt && profile.subscriptionStatus === 'active') {
            return new Date(profile.subscriptionEndsAt) < now;
        }

        if (profile.trialEndsAt && profile.subscriptionStatus === 'trial') {
            return new Date(profile.trialEndsAt) < now;
        }

        return false;
    })();

    const handleSubscribe = (plan: typeof PLANS[0]) => {
        if (plan.disabled) return;

        setSelectedPlan(plan.name);

        const paymentLink = PAYMENT_LINKS[plan.id];

        if (!paymentLink) {
            toast.error('Link de pagamento não disponível para este plano.');
            setSelectedPlan(null);
            return;
        }

        const frequency = plan.id === 'anual' ? 'ano' : plan.id === 'semestral' ? 'semestre' : 'mês';

        try {
            localStorage.setItem(
                'gestor_pro_last_checkout',
                JSON.stringify({
                    planId: plan.id,
                    planName: plan.name,
                    amount: plan.price,
                    frequency,
                    startedAt: new Date().toISOString()
                })
            );
        } catch {
            // Ignore storage errors and continue with redirect
        }

        const loadingToast = toast.loading('Redirecionando para pagamento seguro...');

        setTimeout(() => {
            toast.dismiss(loadingToast);
            window.location.href = paymentLink;
        }, 800);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background-dark">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-200 dark:bg-white/10 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex flex-col">
            {/* Header / Hero Section */}
            <div className="relative bg-white dark:bg-surface-dark pb-20 pt-10 px-4 border-b border-slate-100 dark:border-white/5 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                
                {/* Back Button */}
                <div className="max-w-6xl mx-auto mb-8 relative z-10">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium text-sm"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Voltar
                    </button>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10 animate-in slide-in-from-bottom-4 duration-700">
                    {isExpired ? (
                        <ExpiredAccountBanner />
                    ) : (
                        <>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                Planos e Preços
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                                Invista no Crescimento do seu Negócio
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                                Junte-se a centenas de profissionais que fecham mais contratos e organizam suas empresas com o Gestor Pro.
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Plans Grid */}
            <div className="flex-1 px-4 -mt-16 pb-20 relative z-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative group bg-white dark:bg-surface-dark rounded-3xl p-8 border transition-all duration-300 ${
                                    plan.isPopular 
                                        ? 'border-primary shadow-xl shadow-primary/20 scale-105 z-10 ring-4 ring-primary/10' 
                                        : 'border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl hover:-translate-y-1'
                                }`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">star</span>
                                        Mais Escolhido
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{plan.name}</h3>
                                    <div className="flex items-end justify-center gap-1 text-slate-900 dark:text-white">
                                        <span className="text-4xl font-black tracking-tight">R$ {plan.price}</span>
                                        <span className="text-sm font-medium text-slate-400 mb-1">/{plan.frequency}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">{plan.description}</p>
                                </div>

                                <div className="w-full h-px bg-slate-100 dark:bg-white/5 my-6" />

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                            <div className={`mt-0.5 p-0.5 rounded-full ${plan.isPopular ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                                                <span className="material-symbols-outlined text-sm font-bold block">check</span>
                                            </div>
                                            <span className="flex-1">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => !plan.disabled && handleSubscribe(plan)}
                                    disabled={plan.disabled || selectedPlan === plan.name}
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                        plan.disabled
                                            ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                                            : plan.isPopular
                                                ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30 active:scale-95'
                                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-95'
                                    }`}
                                >
                                    {selectedPlan === plan.name ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                                            Processando...
                                        </>
                                    ) : (
                                        plan.buttonText
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Trust Section */}
                    <div className="mt-20 text-center space-y-8">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Confiança de centenas de empresas</p>
                            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-2 text-xl font-black text-slate-400">
                                    <span className="material-symbols-outlined text-3xl">domain</span>
                                    Constructo
                                </div>
                                <div className="flex items-center gap-2 text-xl font-black text-slate-400">
                                    <span className="material-symbols-outlined text-3xl">apartment</span>
                                    BuildTech
                                </div>
                                <div className="flex items-center gap-2 text-xl font-black text-slate-400">
                                    <span className="material-symbols-outlined text-3xl">foundation</span>
                                    ReformasJá
                                </div>
                                <div className="flex items-center gap-2 text-xl font-black text-slate-400">
                                    <span className="material-symbols-outlined text-3xl">architecture</span>
                                    ArqDesign
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="max-w-2xl mx-auto text-left pt-10 border-t border-slate-200 dark:border-white/5">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Perguntas Frequentes</h3>
                            <div className="grid gap-4">
                                {FAQS.map((faq, i) => (
                                    <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">help</span>
                                            {faq.question}
                                        </h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 pl-8">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
