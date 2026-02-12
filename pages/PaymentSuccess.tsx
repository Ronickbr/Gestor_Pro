
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { emailService } from '../services/email';
import { toast } from 'react-hot-toast';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    const planName = searchParams.get('plan');
    const amount = searchParams.get('amount');
    const frequency = searchParams.get('frequency') || 'mês';

    useEffect(() => {
        const activateSubscription = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    toast.error('Usuário não autenticado');
                    navigate('/login');
                    return;
                }

                // Calculate new trial_ends_at based on frequency
                const now = new Date();
                let endDate = new Date(now);

                if (frequency === 'ano') {
                    endDate.setFullYear(now.getFullYear() + 1);
                } else if (frequency === 'semestre') {
                    endDate.setMonth(now.getMonth() + 6);
                } else {
                    // Default to monthly
                    endDate.setMonth(now.getMonth() + 1);
                }

                // Update profile
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'active',
                        trial_ends_at: endDate.toISOString() // Using trial_ends_at as subscription_ends_at
                    })
                    .eq('id', user.id);

                if (error) throw error;

                // Send confirmation email
                if (user.email) {
                    await emailService.sendPaymentConfirmation(user.email, planName || 'Plano Mensal', amount || '59,90');
                }

                setSuccess(true);
                toast.success('Assinatura ativada com sucesso!');

            } catch (error) {
                console.error('Erro ao ativar assinatura:', error);
                toast.error('Erro ao processar ativação. Entre em contato com o suporte.');
            } finally {
                setLoading(false);
            }
        };

        if (planName) {
            activateSubscription();
        } else {
            setLoading(false);
            // If no plan info, maybe just navigated here directly?
        }
    }, [planName, amount, frequency, navigate]);

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
                                Sua assinatura do <strong>{planName}</strong> está ativa.
                                <br />
                                Aproveite todos os recursos ilimitados.
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl w-full text-left">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-500">Valor pago:</span>
                                <span className="font-bold text-slate-900 dark:text-white">R$ {amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Próxima cobrança:</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {new Date(Date.now() + (frequency === 'ano' ? 365 : frequency === 'semestre' ? 180 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </span>
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
