import React from 'react';
import { SimplePublicLayout } from '../components/SimplePublicLayout';

const Terms: React.FC = () => {
    return (
        <SimplePublicLayout title="Termos de Uso">
            <div className="space-y-8 text-slate-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
                    <p>Ao acessar e usar o GestorPro, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">2. Uso do Serviço</h2>
                    <p>O GestorPro é uma ferramenta para gestão de orçamentos e contratos. Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">3. Contas e Segurança</h2>
                    <p>Você é responsável por manter a confidencialidade de sua conta e senha. O GestorPro não se responsabiliza por qualquer perda decorrente do uso não autorizado de sua conta.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">4. Planos e Pagamentos</h2>
                    <p>O serviço oferece planos gratuitos e pagos. Os pagamentos são processados de forma segura e as renovações podem ocorrer automaticamente dependendo do plano escolhido.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">5. Propriedade Intelectual</h2>
                    <p>Todo o conteúdo, design e código do GestorPro são propriedade exclusiva da nossa empresa e estão protegidos por leis de direitos autorais.</p>
                </section>
            </div>
        </SimplePublicLayout>
    );
};

export default Terms;
