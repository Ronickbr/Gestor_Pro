
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { emailService } from '../services/email';
import { toast } from 'react-hot-toast';

interface CheckoutInfo {
    planId?: string;
    planName?: string | null;
    amount?: string | null;
    frequency?: string | null;
}

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    const urlPlanName = searchParams.get('plan');
    const urlAmount = searchParams.get('amount');
    const urlFrequency = searchParams.get('frequency');

    useEffect(() => {
        const resolveCheckoutInfo = (): CheckoutInfo => {
            const fallback: CheckoutInfo = {};

            try {
                const stored = localStorage.getItem('gestor_pro_last_checkout');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    fallback.planId = parsed.planId;
                    fallback.planName = parsed.planName;
                    fallback.amount = parsed.amount;
                    fallback.frequency = parsed.frequency;
                }
            } catch {
                // Ignore parse errors
            }

            return {
                planId: fallback.planId,
                planName: urlPlanName || fallback.planName || 'Plano Mensal',
                amount: urlAmount || fallback.amount || '59,90',
                frequency: urlFrequency || fallback.frequency || 'mês'
            };
        };

        const activateSubscription = async (checkout: CheckoutInfo) => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    toast.error('Usuário não autenticado');
                    navigate('/login');
                    return;
                }

                const now = new Date();

                const normalizedPlan = (() => {
                    if (checkout.planId === 'mensal') return 'mensal';
                    if (checkout.planId === 'semestral') return 'semestral';
                    if (checkout.planId === 'anual') return 'anual';

                    const name = (checkout.planName || '').toLowerCase();
                    if (name.includes('anual')) return 'anual';
                    if (name.includes('semest')) return 'semestral';
                    return 'mensal';
                })();

                const durationDays = normalizedPlan === 'anual'
                    ? 365
                    : normalizedPlan === 'semestral'
                        ? 180
                        : 30;

                const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

                const { error } = await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'active',
                        subscription_plan: normalizedPlan,
                        subscription_activated_at: now.toISOString(),
                        subscription_ends_at: endDate.toISOString(),
                        trial_ends_at: null
                    })
                    .eq('id', user.id);

                if (error) throw error;

                try {
                    await supabase.from('subscription_audit_logs').insert({
                        user_id: user.id,
                        event: 'activated',
                        plan: normalizedPlan,
                        details: {
                            plan_name: checkout.planName,
                            amount: checkout.amount,
                            frequency: checkout.frequency,
                            activated_at: now.toISOString(),
                            ends_at: endDate.toISOString()
                        }
                    });
                } catch (logError) {
                    console.error('Erro ao registrar log de assinatura:', logError);
                }

                if (user.email) {
                    await emailService.sendPaymentConfirmation(
                        user.email,
                        checkout.planName || 'Plano Mensal',
                        checkout.amount || '59,90'
                    );
                }

                setSuccess(true);
                toast.success('Assinatura ativada com sucesso!');
            } catch (error) {
                console.error('Erro ao ativar assinatura:', error);

                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        await supabase.from('subscription_audit_logs').insert({
                            user_id: user.id,
                            event: 'activation_failed',
                            plan: null,
                            details: {
                                error: String(error)
                            }
                        });
                    }
                } catch (logError) {
                    console.error('Erro ao registrar falha na assinatura:', logError);
                }

                toast.error('Erro ao processar ativação. Entre em contato com o suporte.');
            } finally {
                setLoading(false);
            }
        };

        const checkoutInfo = resolveCheckoutInfo();

        if (checkoutInfo.planName) {
            activateSubscription(checkoutInfo);
        } else {
            setLoading(false);
        }
    }, [navigate, urlPlanName, urlAmount, urlFrequency]);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-slate-500">Processando sua assinatura...</p>
                    </div>
                ) : success ? (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-5xl">check_circle</span>
                        </div>
                        
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pagamento Confirmado!</h1>
                            <p className="text-slate-500">
                                Sua assinatura está ativa.
                                <br />
                                Aproveite todos os recursos ilimitados.
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl w-full text-left">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-500">Valor pago:</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    R$ {urlAmount || '—'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Próxima cobrança:</span>
                                <span className="font-bold text-slate-900 dark:text-white">Em até 30 minutos seu painel será atualizado.</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                        >
                            Ir para o Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-4xl">error</span>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Algo deu errado</h1>
                        <p className="text-slate-500">Não foi possível confirmar o pagamento.</p>
                        <button
                            onClick={() => navigate('/subscription')}
                            className="mt-4 text-primary font-bold hover:underline"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
