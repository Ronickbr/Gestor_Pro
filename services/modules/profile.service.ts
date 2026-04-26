
import { UserProfile } from '../../types';
import { supabase } from '../../lib/supabase';
import { generateNextCatalogCode } from '../../lib/catalog';

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
            materialCatalog: (() => {
                const raw = (data.material_catalog || []).map((item: any) => {
                    const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
                    const kind = item.kind === 'service' ? 'service' : 'product';
                    const category = item.category || item.brand || 'Geral';
                    const code = item.code || '';
                    const cost = item.cost !== undefined ? Number(item.cost) : undefined;
                    const margin =
                        item.margin !== undefined
                            ? Number(item.margin)
                            : cost !== undefined && unitPrice > 0
                                ? ((unitPrice - cost) / unitPrice) * 100
                                : undefined;

                    return {
                        id: item.id || crypto.randomUUID(),
                        catalogItemId: item.catalogItemId,
                        kind,
                        status: item.status || 'active',
                        code,
                        category,
                        unit: item.unit || 'un',
                        description: item.description,
                        cost,
                        margin,
                        name: item.name || '',
                        brand: item.brand || category,
                        unitPrice,
                        quantity: 1,
                        totalPrice: unitPrice
                    };
                });

                const withCodes: any[] = [];
                for (const item of raw) {
                    if (item.code) {
                        withCodes.push(item);
                        continue;
                    }
                    const nextCode = generateNextCatalogCode(withCodes, item.kind || 'product');
                    withCodes.push({ ...item, code: nextCode });
                }

                return withCodes;
            })(),
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
