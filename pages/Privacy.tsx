import React from 'react';
import { SimplePublicLayout } from '../components/SimplePublicLayout';

const Privacy: React.FC = () => {
    return (
        <SimplePublicLayout title="Política de Privacidade">
            <div className="space-y-8 text-slate-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">1. Coleta de Informações</h2>
                    <p>Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados de pagamento ao se registrar no GestorPro.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">2. Uso das Informações</h2>
                    <p>Usamos suas informações para fornecer, manter e melhorar nossos serviços, processar transações e enviar comunicações importantes sobre sua conta.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">3. Proteção de Dados</h2>
                    <p>Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado ou alteração.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">4. Compartilhamento</h2>
                    <p>Não vendemos suas informações pessoais. Compartilhamos dados apenas com prestadores de serviços essenciais para a operação do sistema (ex: processadores de pagamento).</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">5. Seus Direitos</h2>
                    <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento através das configurações da sua conta ou entrando em contato conosco.</p>
                </section>
            </div>
        </SimplePublicLayout>
    );
};

export default Privacy;
