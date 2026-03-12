
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export const emailService = {
    async sendFeedback(data: any) {
        try {
            const { data: result, error } = await supabase.functions.invoke('send-feedback', {
                body: data
            });

            if (error) throw error;
            return result;
        } catch (e) {
            console.error('Erro ao enviar feedback:', e);
            throw e;
        }
    },

    async sendPaymentConfirmation(to: string, planName: string, amount: string) {
        try {
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: {
                    to: [to],
                    subject: 'Pagamento Confirmado - Gestor Pro',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #4f46e5;">Pagamento Confirmado!</h1>
                            <p>Olá,</p>
                            <p>Seu pagamento para o plano <strong>${planName}</strong> no valor de <strong>R$ ${amount}</strong> foi confirmado com sucesso.</p>
                            <p>Agora você já pode aproveitar todos os recursos premium do Gestor Pro.</p>
                            <br />
                            <p>Atenciosamente,<br />Equipe Gestor Pro</p>
                        </div>
                    `
                }
            });

            if (error) throw error;

            toast.success(`E-mail de confirmação enviado para ${to}`);
            return data;
        } catch (e) {
            console.error('Erro ao enviar e-mail de confirmação:', e);
            toast.error('Erro ao enviar e-mail de confirmação');
            throw e;
        }
    }
};
