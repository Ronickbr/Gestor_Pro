
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Quote } from '../types';
import { profileService } from './database';

const API_KEY_STORAGE_KEY = 'gestor_pro_gemini_api_key';
const RATE_LIMIT_KEY = 'gestor_pro_ai_last_request';
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export const getGeminiApiKey = (): string | null => {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const saveGeminiApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

// Security: Input Sanitization
const sanitizeInput = (input: string): string => {
    return input.replace(/[<>]/g, '').trim().substring(0, 5000); // Remove potential HTML tags and limit length
};

// Security & Access Control: Check Subscription and Rate Limit
const checkAccess = async () => {
    // 1. Rate Limiting
    const lastRequest = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastRequest) {
        const timeDiff = Date.now() - parseInt(lastRequest);
        if (timeDiff < RATE_LIMIT_WINDOW) {
            throw new Error('Muitas requisições. Por favor, aguarde um minuto.');
        }
    }

    // 2. Subscription Check
    try {
        const profile = await profileService.getProfile();
        const isActive = profile.subscriptionStatus === 'active';

        // Trial users are also blocked from using AI
        if (!isActive) {
            throw new Error('FUNCIONALIDADE_BLOQUEADA: Assinatura ativa necessária para usar a IA (Versão Trial não permitida).');
        }
    } catch (error: any) {
        if (error.message?.includes('FUNCIONALIDADE_BLOQUEADA')) throw error;
        // If profile fetch fails (e.g. network), we might want to block or allow with warning. 
        // For security, we should probably block if we can't verify.
        console.error('Erro ao verificar assinatura:', error);
        throw new Error('Não foi possível verificar sua assinatura. Tente novamente.');
    }

    // Update rate limit timestamp
    localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
};

export const generateClauses = async (quote: Quote): Promise<string> => {
    await checkAccess();

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('MISSING_API_KEY');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Sanitize inputs
    const clientName = sanitizeInput(quote.client.name);
    const services = quote.services.map(s => `${sanitizeInput(s.name)}: ${sanitizeInput(s.description || '')} (R$ ${s.price})`).join(', ');
    const materials = quote.materials.map(m => `${m.quantity}x ${sanitizeInput(m.name)}`).join(', ');
    const paymentTerms = sanitizeInput(quote.paymentTerms);

    const prompt = `
    Você é um assistente jurídico especializado em contratos de prestação de serviços no Brasil.
    Gere as cláusulas contratuais essenciais para o seguinte serviço:
    
    Cliente: ${clientName}
    Serviços: ${services}
    Materiais: ${materials || 'Nenhum material listado'}
    Valor Total: R$ ${(quote.services.reduce((a, b) => a + b.price, 0) + quote.materials.reduce((a, b) => a + b.totalPrice, 0)).toFixed(2)}
    Prazo de Garantia: ${quote.warrantyDuration} meses
    Forma de Pagamento: ${paymentTerms}

    Gere APENAS o texto das cláusulas, numeradas, cobrindo:
    1. Objeto do contrato (detalhando os serviços)
    2. Obrigações do contratado
    3. Obrigações do contratante
    4. Valores e forma de pagamento
    5. Prazos e garantia
    6. Rescisão
    7. Foro

    Use linguagem formal mas clara. Não inclua cabeçalho ou rodapé, testemunhas, apenas as cláusulas.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
            return text;
        }
        throw new Error('Resposta vazia da IA');

    } catch (error: any) {
        console.error('Erro ao gerar cláusulas:', error);
        if (error.message?.includes('API key')) {
             throw new Error('INVALID_API_KEY');
        }
        throw error;
    }
};

export const generateTemplate = async (templateName: string): Promise<string> => {
    await checkAccess();

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('MISSING_API_KEY');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const safeTemplateName = sanitizeInput(templateName);

    const prompt = `
    Você é um especialista jurídico. Crie um modelo de contrato de prestação de serviços para: ${safeTemplateName}.
    
    Use OBRIGATORIAMENTE os seguintes placeholders para os dados variáveis:
    {{CLIENTE_NOME}} - Nome do cliente
    {{CLIENTE_DOC}} - CPF/CNPJ do cliente
    {{CLIENTE_ENDERECO}} - Endereço do cliente
    {{CONTRATADO_NOME}} - Nome do profissional
    {{CONTRATADO_EMPRESA}} - Nome da empresa do profissional
    {{CONTRATADO_DOC}} - CPF/CNPJ do profissional
    {{SERVICOS_LISTA}} - Lista detalhada dos serviços e valores
    {{MATERIAIS_LISTA}} - Lista de materiais
    {{VALOR_TOTAL}} - Valor total do orçamento
    {{FORMA_PAGAMENTO}} - Condições de pagamento
    {{PRAZO_GARANTIA}} - Tempo de garantia
    {{DATA_ATUAL}} - Data de hoje

    Estrutura:
    1. Identificação das partes (usando os placeholders)
    2. Objeto (usando {{SERVICOS_LISTA}})
    3. Materiais (usando {{MATERIAIS_LISTA}})
    4. Preço e Pagamento (usando {{VALOR_TOTAL}} e {{FORMA_PAGAMENTO}})
    5. Obrigações
    6. Garantia (usando {{PRAZO_GARANTIA}})
    7. Foro

    Gere APENAS o texto do contrato. Sem explicações extras.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) return text;
        throw new Error('Resposta vazia da IA');

    } catch (error: any) {
        console.error('Erro ao gerar modelo:', error);
        if (error.message?.includes('API key')) {
             throw new Error('INVALID_API_KEY');
        }
        throw error;
    }
};
