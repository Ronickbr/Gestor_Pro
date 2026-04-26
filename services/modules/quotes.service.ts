
import { Quote, QuoteStatus, Client } from '../../types';
import { supabase } from '../../lib/supabase';

const mapDbToStatus = (status: string): QuoteStatus => status as QuoteStatus;

const calculateTotal = (quote: Partial<Quote>) => {
    const servicesTotal = quote.services?.reduce((a, b) => a + (Number(b.price) || 0), 0) || 0;
    const materialsTotal = quote.materials?.reduce((a, b) => a + (Number(b.totalPrice) || 0), 0) || 0;
    return servicesTotal + materialsTotal;
};

export const quotesModule = {
    async fetchQuotes() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('quotes')
            .select('*, client:clients(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((q: any) => ({
            ...q,
            status: mapDbToStatus(q.status),
            services: typeof q.services === 'string' ? JSON.parse(q.services) : q.services,
            materials: typeof q.materials === 'string' ? JSON.parse(q.materials) : q.materials,
            validUntil: q.valid_until,
            warrantyDuration: q.warranty_duration,
            paymentTerms: q.payment_terms,
            contractTerms: q.contract_terms,
            contractNumber: q.contract_number,
            completionDate: q.completion_date,
            warrantyUntil: q.warranty_until,
            signatureData: q.signature_data,
            viewedAt: q.viewed_at,
            publicToken: q.public_token,
            accessPassword: q.access_password,
        })) as Quote[];
    },

    async getQuote(id: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('quotes')
            .select('*, client:clients(*)')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;

        // Tenta buscar conteúdo do contrato da tabela separada
        let contractContent = data.contract_terms;
        try {
            const { data: contractData } = await supabase
                .from('contracts')
                .select('content')
                .eq('quote_id', id)
                .single();
            if (contractData?.content) contractContent = contractData.content;
        } catch (e) {
            console.log('Contract fetch notice', e);
        }

        return {
            ...data,
            status: mapDbToStatus(data.status),
            services: typeof data.services === 'string' ? JSON.parse(data.services) : data.services,
            materials: typeof data.materials === 'string' ? JSON.parse(data.materials) : data.materials,
            companyInfo: data.company_info,
            validUntil: data.valid_until,
            warrantyDuration: data.warranty_duration,
            paymentTerms: data.payment_terms,
            contractTerms: contractContent,
            contractNumber: data.contract_number,
            completionDate: data.completion_date,
            warrantyUntil: data.warranty_until,
            signatureData: data.signature_data,
            viewedAt: data.viewed_at,
            publicToken: data.public_token,
            accessPassword: data.access_password,
        } as Quote;
    },

    async createQuote(quote: Omit<Quote, 'id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        // Proteção: Verifica assinatura antes de permitir criação
        const isExpired = profile?.subscription_status === 'expired' || 
                         (profile?.trial_ends_at && new Date(profile.trial_ends_at) < new Date());
        
        if (isExpired) throw new Error('Assinatura expirada. Por favor, renove para continuar criando orçamentos.');

        const companyInfo = profile ? {
            name: profile.name,
            companyName: profile.company_name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            document: profile.document,
            logo: profile.logo,
            techSignature: profile.tech_signature,
            pixKey: profile.pix_key,
            bankInfo: profile.bank_info
        } : null;

        const { data, error } = await supabase
            .from('quotes')
            .insert({
                user_id: user.id,
                client_id: quote.client.id,
                number: quote.number,
                status: quote.status,
                date: quote.date,
                valid_until: quote.validUntil,
                warranty_duration: quote.warrantyDuration,
                payment_terms: quote.paymentTerms,
                services: JSON.stringify(quote.services),
                materials: JSON.stringify(quote.materials),
                total_value: calculateTotal(quote),
                public_token: crypto.randomUUID(),
                company_info: companyInfo,
                access_password: quote.accessPassword || null
            })
            .select()
            .single();

        if (error) throw error;

        if (quote.contractTerms) {
            await this.saveContract(data.id, quote.contractTerms);
        }

        return data;
    },

    async updateQuote(quote: Quote) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { error } = await supabase
            .from('quotes')
            .update({
                client_id: quote.client.id,
                status: quote.status,
                services: quote.services,
                materials: quote.materials,
                valid_until: quote.validUntil,
                warranty_duration: quote.warrantyDuration,
                payment_terms: quote.paymentTerms,
                contract_number: quote.contractNumber,
                completion_date: quote.completionDate,
                warranty_until: quote.warrantyUntil,
                signature_data: quote.signatureData,
                access_password: quote.accessPassword,
                total_value: calculateTotal(quote),
                viewed_at: quote.viewedAt ? new Date(quote.viewedAt).toISOString() : null
            })
            .eq('id', quote.id)
            .eq('user_id', user.id); // Prevenção de IDOR

        if (error) throw error;

        if (quote.contractTerms) {
            await this.saveContract(quote.id, quote.contractTerms);
        }
    },

    async saveContract(quoteId: string, content: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        // Verificamos se o orçamento pertence ao usuário antes de salvar o contrato (reforço manual de RLS)
        const { data: quote } = await supabase.from('quotes').select('id').eq('id', quoteId).eq('user_id', user.id).single();
        if (!quote) throw new Error('Acesso negado');

        const { error } = await supabase
            .from('contracts')
            .upsert({
                quote_id: quoteId,
                content,
                status: 'DRAFT'
            }, { onConflict: 'quote_id' });

        if (error) throw error;
    },

    async deleteQuote(id: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        // Verifica ownership antes de deletar contrato (devido a FKs)
        const { data: quote } = await supabase.from('quotes').select('id').eq('id', id).eq('user_id', user.id).single();
        if (!quote) throw new Error('Acesso negado');

        await supabase.from('contracts').delete().eq('quote_id', id);
        const { error } = await supabase.from('quotes').delete().eq('id', id).eq('user_id', user.id);
        if (error) throw error;
    },

    async checkPublicQuoteAccess(token: string) {
        const { data, error } = await supabase.rpc('check_quote_access', { token_input: token });
        if (error) {
             if (error.message?.includes('invalid input syntax') || error.code === '22P02') {
                 return { exists: false, requires_password: false, reason: 'INVALID_TOKEN' as const };
             }
             if (error.message?.includes('function not found') || error.code === 'PGRST202') {
                 return { exists: false, requires_password: false, reason: 'PUBLIC_VIEW_NOT_CONFIGURED' as const };
             }
             throw error;
         }
         return data as { exists: boolean; requires_password: boolean; reason?: string };
    },

    async getQuoteByToken(token: string, password?: string) {
        const { data, error } = await supabase.rpc('get_quote_secure', { 
            token_input: token, 
            password_input: password || null 
        });
        
        if (error) throw error;
        if (!data) return null;
        
        return {
            ...data,
            services: typeof data.services === 'string' ? JSON.parse(data.services) : data.services,
            materials: typeof data.materials === 'string' ? JSON.parse(data.materials) : data.materials,
        } as any;
    },

    async markAsViewed(id: string) {
        const { error } = await supabase.rpc('mark_quote_viewed', { quote_id_input: id });
        if (error) console.error('Error marking as viewed:', error);
    },

    async publicUpdateStatus(id: string, status: QuoteStatus) {
        // Idealmente esta operação deveria validar o token público, mas como o ID UUID é difícil de prever,
        // mantemos aqui o reforço. Futuramente, passar o token também seria ideal.
        const { error } = await supabase
            .from('quotes')
            .update({ status })
            .eq('id', id);
        if (error) throw error;
    }
};
