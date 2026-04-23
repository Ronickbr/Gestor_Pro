
import { UserProfile } from '../../types';
import { supabase } from '../../lib/supabase';

export const profileModule = {
    async getProfile(): Promise<UserProfile> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (error) throw error;
        
        if (!data) {
            return {
                id: user.id,
                name: user.email?.split('@')[0] || 'Usuário',
                email: user.email || '',
                materialCatalog: [],
                contractTemplates: [],
                subscriptionStatus: 'trial',
                companyName: '',
                phone: '',
                address: '',
                document: ''
            } as UserProfile;
        }

        return {
            ...data,
            companyName: data.company_name,
            techSignature: data.tech_signature,
            materialCatalog: (data.material_catalog || []).map((item: any) => ({
                id: item.id || crypto.randomUUID(),
                name: item.name || '',
                brand: item.brand || item.category || 'Geral',
                unitPrice: Number(item.unitPrice || item.price || 0),
                quantity: item.quantity || 1,
                totalPrice: Number(item.totalPrice || item.unitPrice || item.price || 0)
            })),
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

        const dbUpdates: any = {
            id: user.id,
            updated_at: new Date().toISOString()
        };
        
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
            .upsert(dbUpdates, { onConflict: 'id' });

        if (error) throw error;
    }
};
