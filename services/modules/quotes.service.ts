
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
            .eq('id', quote.id);

        if (error) throw error;

        if (quote.contractTerms) {
            await this.saveContract(quote.id, quote.contractTerms);
        }
    },

    async saveContract(quoteId: string, content: string) {
        const { error } = await supabase
            .from('contracts')
            .upsert({
                quote_id: quoteId,
                content,
                status: 'DRAFT'
            }, { onConflict: 'quote_id' });

        if (error) throw error;
    }
};
