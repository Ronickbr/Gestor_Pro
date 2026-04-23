
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
                avatar: client.avatar,
                document: client.document
            })
            .select()
            .single();

        if (error) throw error;
        return data;
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

    async deleteClient(id: string) {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
