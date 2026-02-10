
import { Quote, UserProfile } from '../types';

export const generateContractText = (template: string, quote: Quote, profile: UserProfile): string => {
    let text = template;

    // Helper to safe string
    const safeStr = (val: any) => (!val || val === 'null' || val === 'undefined') ? '' : String(val);

    // Dados do Contratado (Usuário/Empresa)
    const companyName = safeStr(profile.companyName) || safeStr(profile.name);
    
    text = text.replace(/{{CONTRATADO_NOME}}/g, safeStr(profile.name));
    text = text.replace(/{{CONTRATADO_EMPRESA}}/g, companyName);
    text = text.replace(/{{CONTRATADO_DOC}}/g, safeStr(profile.document));
    text = text.replace(/{{CONTRATADO_EMAIL}}/g, safeStr(profile.email));
    text = text.replace(/{{CONTRATADO_ENDERECO}}/g, safeStr(profile.address) || 'Endereço não informado');
    text = text.replace(/{{CONTRATADO_TELEFONE}}/g, safeStr(profile.phone) || 'Telefone não informado');

    // Bank Info Injection logic
    let paymentInfo = quote.paymentTerms || 'A combinar';
    const termsLower = paymentInfo.toLowerCase();

    // Check if Payment Terms mention Pix or Transfer and user has bank info
    if ((termsLower.includes('pix') || termsLower.includes('transfer') || termsLower.includes('depósito')) && (profile.pixKey || profile.bankInfo)) {
        paymentInfo += '\n\nDADOS PARA PAGAMENTO:';
        if (profile.pixKey) paymentInfo += `\nPIX: ${profile.pixKey}`;
        if (profile.bankInfo) paymentInfo += `\n${profile.bankInfo}`;
    }

    // Dados do Cliente
    text = text.replace(/{{CLIENTE_NOME}}/g, quote.client.name);
    text = text.replace(/{{CLIENTE_ENDERECO}}/g, quote.client.address);
    text = text.replace(/{{CLIENTE_DOC}}/g, quote.client.document || 'CPF/CNPJ não informado');
    text = text.replace(/{{CLIENTE_TELEFONE}}/g, quote.client.phone || 'Telefone não informado');

    // Dados do Orçamento
    text = text.replace(/{{NUMERO_ORCAMENTO}}/g, quote.number);
    text = text.replace(/{{DATA_HOJE}}/g, new Date().toLocaleDateString('pt-BR'));
    text = text.replace(/{{GARANTIA_MESES}}/g, quote.warrantyDuration.toString());

    // Tabela de Itens (Serviços e Materiais)
    const servicesList = quote.services.map(s => `- ${s.name}: R$ ${s.price.toFixed(2)}`).join('\n');
    const materialsList = quote.materials.map(m => `- ${m.quantity}x ${m.name} (${m.brand}): R$ ${m.totalPrice.toFixed(2)}`).join('\n');

    text = text.replace(/{{LISTA_SERVICOS}}/g, servicesList.length ? servicesList : 'Nenhum serviço listado.');
    text = text.replace(/{{LISTA_MATERIAIS}}/g, materialsList.length ? materialsList : 'Nenhum material listado.');
    text = text.replace(/{{FORMA_PAGAMENTO}}/g, paymentInfo);

    const totalValue = (
        quote.services.reduce((acc, s) => acc + s.price, 0) +
        quote.materials.reduce((acc, m) => acc + m.totalPrice, 0)
    ).toFixed(2);

    text = text.replace(/{{VALOR_TOTAL}}/g, `R$ ${totalValue}`);

    return text;
};

export const CONTRACT_VARIABLES_HELP = `
Variáveis disponíveis:
- {{CONTRATADO_NOME}}, {{CONTRATADO_EMPRESA}}, {{CONTRATADO_DOC}}, {{CONTRATADO_ENDERECO}}, {{CONTRATADO_TELEFONE}}
- {{CLIENTE_NOME}}, {{CLIENTE_ENDERECO}}, {{CLIENTE_DOC}}, {{CLIENTE_TELEFONE}}
- {{NUMERO_ORCAMENTO}}, {{DATA_HOJE}}, {{GARANTIA_MESES}}, {{VALOR_TOTAL}}, {{FORMA_PAGAMENTO}}
- {{LISTA_SERVICOS}}, {{LISTA_MATERIAIS}}
`;
