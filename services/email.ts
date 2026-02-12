
import { toast } from 'react-hot-toast';

export const emailService = {
    async sendPaymentConfirmation(to: string, planName: string, amount: string) {
        // In a real application, you would call your backend API or an Edge Function here.
        // Example:
        // await supabase.functions.invoke('send-email', {
        //     body: { to, subject: 'Pagamento Confirmado', template: 'payment_success', data: { planName, amount } }
        // });

        console.log(`[MOCK EMAIL] Sending payment confirmation to ${to}`);
        console.log(`[MOCK EMAIL] Content: Pagamento confirmado para o plano ${planName} no valor de R$ ${amount}.`);

        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success(`Email de confirmação enviado para ${to}`);
        return true;
    }
};
