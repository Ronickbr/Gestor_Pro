
import { Client } from '../../types';
import { supabase } from '../../lib/supabase';

export const clientsModule = {
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

    async createClient(client: Omit<Client, 'id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        // Proteção extra: Verifica assinatura antes de criar
        const { data: profile } = await supabase.from('profiles').select('subscription_status, trial_ends_at').eq('id', user.id).single();
        const isExpired = profile?.subscription_status === 'expired' || 
                         (profile?.trial_ends_at && new Date(profile.trial_ends_at) < new Date());
        
        if (isExpired) throw new Error('Assinatura expirada. Por favor, renove para continuar criando clientes.');

        const { data, error } = await supabase
            .from('clients')
            .insert({
                user_id: user.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address,
                avatar: client.avatar,
                document: client.document
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateClient(client: Client) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { error } = await supabase
            .from('clients')
            .update({
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address,
                document: client.document
            })
            .eq('id', client.id)
            .eq('user_id', user.id); // Prevenção de IDOR

        if (error) throw error;
    },

    async deleteClient(id: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id); // Prevenção de IDOR

        if (error) throw error;
    }
};
