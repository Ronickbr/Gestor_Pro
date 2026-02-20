import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAccountExpired, ensureAccountNotExpired } from './database';

let currentProfile: any = null;
let auditLogs: any[] = [];
let authUser: any = { data: { user: { id: 'user-1' } } };

vi.mock('../lib/supabase', () => {
    const auth = {
        getUser: () => Promise.resolve(authUser)
    };

    const from = (table: string) => {
        if (table === 'profiles') {
            return {
                select: () => ({
                    eq: () => ({
                        single: () => Promise.resolve({ data: currentProfile, error: null })
                    })
                })
            };
        }

        if (table === 'subscription_audit_logs') {
            return {
                insert: (row: any) => {
                    auditLogs.push(row);
                    return Promise.resolve({ data: null, error: null });
                }
            };
        }

        return {
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: null })
                })
            }),
            insert: () => Promise.resolve({ data: null, error: null })
        };
    };

    return { supabase: { auth, from } };
});

beforeEach(() => {
    currentProfile = null;
    auditLogs = [];
    authUser = { data: { user: { id: 'user-1' } } };
});

describe('isAccountExpired', () => {
    it('returns false for active subscription in the future', () => {
        const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const result = isAccountExpired({
            subscription_status: 'active',
            subscription_ends_at: future,
            trial_ends_at: null
        });
        expect(result).toBe(false);
    });

    it('returns true for active subscription in the past', () => {
        const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const result = isAccountExpired({
            subscription_status: 'active',
            subscription_ends_at: past,
            trial_ends_at: null
        });
        expect(result).toBe(true);
    });

    it('returns true when status is expired regardless of dates', () => {
        const result = isAccountExpired({
            subscription_status: 'expired',
            subscription_ends_at: null,
            trial_ends_at: null
        });
        expect(result).toBe(true);
    });

    it('returns false for active trial in the future', () => {
        const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const result = isAccountExpired({
            subscription_status: 'trial',
            trial_ends_at: future,
            subscription_ends_at: null
        });
        expect(result).toBe(false);
    });

    it('returns true for expired trial', () => {
        const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const result = isAccountExpired({
            subscription_status: 'trial',
            trial_ends_at: past,
            subscription_ends_at: null
        });
        expect(result).toBe(true);
    });
});

describe('ensureAccountNotExpired', () => {
    it('allows operations when account is active', async () => {
        const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        currentProfile = {
            subscription_status: 'active',
            subscription_ends_at: future,
            trial_ends_at: null,
            subscription_plan: 'mensal'
        };

        await expect(ensureAccountNotExpired('create_quote')).resolves.toBeUndefined();
        expect(auditLogs.length).toBe(0);
    });

    it('blocks operations and logs when account is expired', async () => {
        const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        currentProfile = {
            subscription_status: 'active',
            subscription_ends_at: past,
            trial_ends_at: null,
            subscription_plan: 'mensal'
        };

        await expect(ensureAccountNotExpired('create_quote')).rejects.toThrow('Sua assinatura expirou');
        expect(auditLogs.length).toBe(1);
        expect(auditLogs[0].event).toBe('blocked_action');
        expect(auditLogs[0].details.action).toBe('create_quote');
    });
});
