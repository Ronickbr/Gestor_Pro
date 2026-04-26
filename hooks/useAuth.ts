
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'expired';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkSubscription(session.user.id);
      } else {
        setStatus('unauthenticated');
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkSubscription(session.user.id);
      } else {
        setStatus('unauthenticated');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, trial_ends_at')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const isExpired = data.subscription_status === 'expired' ||
          (data.trial_ends_at && new Date(data.trial_ends_at) < new Date());

        if (isExpired) {
          setStatus('expired');
          return;
        }
      }
      setStatus('authenticated');
    } catch (e) {
      console.error("Subscription check failed", e);
      setStatus('unauthenticated'); // Mais seguro: desloga em caso de erro crítico de verificação
    }
  };

  return {
    session,
    user: session?.user ?? null,
    status,
    loading: status === 'loading',
    authenticated: status === 'authenticated',
    expired: status === 'expired',
    unauthenticated: status === 'unauthenticated'
  };
}
