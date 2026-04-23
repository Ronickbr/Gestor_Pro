
import { quotesModule } from './modules/quotes.service';
import { clientsModule } from './modules/clients.service';
import { profileModule } from './modules/profile.service';
import { Quote, QuoteStatus } from '../types';
import { supabase } from '../lib/supabase';

// Exporta os serviços individuais
export const quotesService = {
    ...quotesModule,
    
    // Métodos que ainda podem ser específicos ou que combinam lógica
    async deleteQuote(id: string) {
        // Exclui contrato associado primeiro devido a FKs
        await supabase.from('contracts').delete().eq('quote_id', id);
        const { error } = await supabase.from('quotes').delete().eq('id', id);
        if (error) throw error;
    },

    async checkPublicQuoteAccess(token: string) {
        const { data, error } = await supabase.rpc('check_quote_access', { token_input: token });
        if (error) {
             if (error.message?.includes('invalid input syntax') || error.code === '22P02') {
                 return { exists: false, requires_password: false };
             }
             if (error.message?.includes('function not found') || error.code === 'PGRST202') {
                 return { exists: true, requires_password: false };
             }
             throw error;
        }
        return data as { exists: boolean; requires_password: boolean };
    },

    async getQuoteByToken(token: string, password?: string) {
        // Reutiliza a lógica complexa de acesso por token (pode ser movida para módulo público futuramente)
        const { data, error } = await supabase.rpc('get_quote_secure', { 
            token_input: token, 
            password_input: password || null 
        });
        
        if (error) throw error;
        
        // Mapeamento básico garantindo tipos
        return {
            ...data,
            services: typeof data.services === 'string' ? JSON.parse(data.services) : data.services,
            materials: typeof data.materials === 'string' ? JSON.parse(data.materials) : data.materials,
        } as any;
    },

    async markAsViewed(id: string) {
        const { error } = await supabase.rpc('mark_quote_viewed', { quote_id_input: id });
        if (error) console.error('Error marking as viewed:', error);
    }
};

export const clientsService = clientsModule;
export const profileService = profileModule;
