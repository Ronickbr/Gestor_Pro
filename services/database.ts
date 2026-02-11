
import { Quote, QuoteStatus, Client, UserProfile } from '../types';
import { supabase } from '../lib/supabase';

// Map QuoteStatus to DB status string if necessary, or use consistent enum
const mapStatusToDb = (status: QuoteStatus) => status;
const mapDbToStatus = (status: string): QuoteStatus => status as QuoteStatus;

const calculateTotal = (quote: Partial<Quote>) => {
    return (quote.services?.reduce((a, b) => a + (b.price || 0), 0) || 0) +
        (quote.materials?.reduce((a, b) => a + (b.totalPrice || 0), 0) || 0);
};

export const quotesService = {
    // --- QUOTES ---
    async fetchQuotes() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('quotes')
            .select(`
        *,
        client:clients(*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((q: any) => ({
            ...q,
            status: mapDbToStatus(q.status),
            client: q.client,
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
            .select(`
        *,
        client:clients(*)
      `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;

        // Fetch contract content from separate table
        let contractContent = data.contract_terms;
        try {
            const { data: contractData } = await supabase
                .from('contracts')
                .select('content')
                .eq('quote_id', id)
                .single();
            
            if (contractData?.content) {
                contractContent = contractData.content;
            }
        } catch (e) {
            // Ignore error if contract not found or table issues
            console.log('Contract fetch error or not found', e);
        }

        return {
            ...data,
            status: mapDbToStatus(data.status),
            client: data.client,
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

        // Fetch current profile to snapshot company info
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

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

        // Save contract draft if provided
        if (quote.contractTerms) {
            await this.saveContract(data.id, quote.contractTerms);
        }

        return data;
    },

    async updateQuote(quote: Quote) {
        // 1. Update quote fields (excluding contract_terms which is in a separate table)
        const { error } = await supabase
            .from('quotes')
            .update({
                client_id: quote.client.id, // Update client reference
                status: quote.status,
                services: quote.services,
                materials: quote.materials,
                valid_until: quote.validUntil,
                warranty_duration: quote.warrantyDuration,
                payment_terms: quote.paymentTerms,
                // contract_terms: quote.contractTerms, // Removed: Column does not exist in quotes table
                contract_number: quote.contractNumber, 
                completion_date: quote.completionDate, 
                warranty_until: quote.warrantyUntil, 
                signature_data: quote.signatureData,
                access_password: quote.accessPassword,
                total_value: (quote.services.reduce((a, b) => a + b.price, 0) + quote.materials.reduce((a, b) => a + b.totalPrice, 0)),
                viewed_at: quote.viewedAt ? new Date(quote.viewedAt).toISOString() : null
            })
            .eq('id', quote.id);

        if (error) throw error;

        // 2. Upsert contract content if provided
        if (quote.contractTerms) {
            await this.saveContract(quote.id, quote.contractTerms);
        }
    },

    async deleteQuote(id: string) {
        // First delete associated contract due to FK constraints
        const { error: contractError } = await supabase
            .from('contracts')
            .delete()
            .eq('quote_id', id);
        
        if (contractError) {
            console.error('Error deleting contract:', contractError);
            // We continue even if contract delete fails, hoping the FK is not restrictive or it was a false alarm, 
            // but realistically if this fails, the next one will likely fail too if FK exists.
            // However, ignoring it might be safer if the table doesn't exist or other weird states.
            // But strictness is usually better. Let's just log it for now as "soft" dependency handling 
            // often implies we just want to ensure it's gone.
        }

        const { error } = await supabase
            .from('quotes')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- CLIENTS ---
    async fetchClients() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('user_id', user.id)
            .order('name');

        if (error) throw error;
        return data as Client[];
    },

    async createClient(client: Omit<Client, 'id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('clients')
            .insert({
                user_id: user.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address,
                // avatar: client.avatar, // TODO: Handle image upload
                document: client.document
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getClient(id: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return data as Client;
    },

    async updateClient(client: Client) {
        const { error } = await supabase
            .from('clients')
            .update({
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address,
                document: client.document
            })
            .eq('id', client.id);

        if (error) throw error;
    },

    // --- CONTRACTS ---
    async saveContract(quoteId: string, content: string) {
        // Upsert contract
        const { error } = await supabase
            .from('contracts')
            .upsert({
                quote_id: quoteId,
                content,
                status: 'DRAFT'
            }, { onConflict: 'quote_id' });

        if (error) throw error;
    },

    async getContract(quoteId: string) {
        const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .eq('quote_id', quoteId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore not found
        return data;
    },

    // --- PUBLIC ACCESS (No Auth Required if RLS allows) ---
    async checkPublicQuoteAccess(token: string) {
        const { data, error } = await supabase.rpc('check_quote_access', { token_input: token });
        if (error) {
             // Invalid UUID format - definitely doesn't exist
             if (error.message?.includes('invalid input syntax') || error.code === '22P02') {
                 return { exists: false, requires_password: false };
             }

             // Fallback: assume exists and no password if RPC missing
             if (error.message?.includes('function not found') || error.code === 'PGRST202') {
                 return { exists: true, requires_password: false };
             }
             // Don't throw here, let getQuote handle it or return safe default
             console.warn('check_quote_access RPC check failed', error);
             throw error; // Throw error to let UI know something is wrong instead of silently failing
        }
        return data as { exists: boolean; requires_password: boolean };
    },

    async getQuoteByToken(token: string, password?: string) {
        let data: any = null;
        let fetchError: any = null;

        try {
            const { data: rpcData, error: rpcError } = await supabase
                .rpc('get_quote_secure', { 
                    token_input: token, 
                    password_input: password || null 
                });
            
            if (rpcError) throw rpcError;
            data = rpcData;
        } catch (e: any) {
             if (e.message?.includes('function not found') || e.code === 'PGRST202') {
                 // Fallback to standard Select
                 const { data: oldData, error: oldError } = await supabase
                    .from('quotes')
                    .select(`
                        *,
                        client:clients(*)
                    `)
                    .eq('public_token', token)
                    .single();
                 
                 if (oldError) fetchError = oldError;
                 else {
                     data = oldData;
                     // Try to fetch contract separately
                     try {
                        const { data: contractData } = await supabase
                            .from('contracts')
                            .select('content')
                            .eq('quote_id', data.id)
                            .single();
                        if (contractData?.content) {
                            data.contract_content_resolved = contractData.content;
                        }
                     } catch (err) { /* ignore */ }
                 }
             } else {
                 fetchError = e;
             }
        }

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Orçamento não encontrado ou senha incorreta.');

        // Resolve contract content
        const contractContent = data.contract_content_resolved || data.contract_terms;

        // Helper to safely parse items and ensure numbers
        const parseServices = (items: any) => {
            const arr = typeof items === 'string' ? JSON.parse(items) : (items || []);
            return Array.isArray(arr) ? arr.map((i: any) => ({
                ...i,
                price: Number(i.price) || 0
            })) : [];
        };

        const parseMaterials = (items: any) => {
            const arr = typeof items === 'string' ? JSON.parse(items) : (items || []);
            return Array.isArray(arr) ? arr.map((i: any) => ({
                ...i,
                totalPrice: Number(i.totalPrice) || 0,
                quantity: Number(i.quantity) || 0
            })) : [];
        };

        return {
            ...data,
            status: mapDbToStatus(data.status),
            client: data.client,
            services: parseServices(data.services),
            materials: parseMaterials(data.materials),
            companyInfo: data.company_info || data.companyInfo,
            validUntil: data.valid_until || data.validUntil,
            warrantyDuration: data.warranty_duration || data.warrantyDuration,
            paymentTerms: data.payment_terms || data.paymentTerms,
            contractTerms: contractContent || data.contractTerms,
            contractNumber: data.contract_number || data.contractNumber,
            completionDate: data.completion_date || data.completionDate,
            warrantyUntil: data.warranty_until || data.warrantyUntil,
            signatureData: data.signature_data || data.signatureData,
            viewedAt: data.viewed_at || data.viewedAt,
            publicToken: data.public_token || data.publicToken,
            accessPassword: data.access_password || data.accessPassword
        } as Quote;
    },

    async publicUpdateStatus(id: string, status: QuoteStatus) {
        // This might fail if RLS for UPDATE requires ownership.
        // Usually public actions are better handled via Edge Functions or RPC.
        // For MVP, we'll try direct update. If fails, we might need an alternative.
        const { error } = await supabase
            .from('quotes')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    async markAsViewed(id: string) {
        const { error } = await supabase.rpc('mark_quote_viewed', { quote_id_input: id });
            
        if (error) console.error('Error marking as viewed:', error);
    }
};

export const profileService = {
    async getProfile(): Promise<UserProfile> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return {
            ...data,
            companyName: data.company_name, // map snake_case to camelCase
            techSignature: data.tech_signature,
            materialCatalog: data.material_catalog || [],
            contractTemplates: data.contract_templates || [],
            subscriptionStatus: data.subscription_status,
            trialEndsAt: data.trial_ends_at,
            pixKey: data.pix_key,
            bankInfo: data.bank_info
        } as UserProfile;
    },

    async updateProfile(updates: Partial<UserProfile>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        // Map camelCase to snake_case for DB update if needed
        const dbUpdates: any = {};
        if (updates.companyName !== undefined) dbUpdates.company_name = updates.companyName;
        if (updates.document !== undefined) dbUpdates.document = updates.document;
        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.address !== undefined) dbUpdates.address = updates.address;
        if (updates.logo !== undefined) dbUpdates.logo = updates.logo;
        if (updates.techSignature !== undefined) dbUpdates.tech_signature = updates.techSignature;
        if (updates.materialCatalog !== undefined) dbUpdates.material_catalog = updates.materialCatalog;
        if (updates.contractTemplates !== undefined) dbUpdates.contract_templates = updates.contractTemplates;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.pixKey !== undefined) dbUpdates.pix_key = updates.pixKey;
        if (updates.bankInfo !== undefined) dbUpdates.bank_info = updates.bankInfo;

        const { error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', user.id);

        if (error) throw error;
    }
};
