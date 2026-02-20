-- Add subscription metadata to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_plan text,
ADD COLUMN IF NOT EXISTS subscription_activated_at timestamptz,
ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;

-- Audit table for subscription lifecycle events
CREATE TABLE IF NOT EXISTS public.subscription_audit_logs (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  event text NOT NULL,
  plan text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Function to expire subscriptions and register logs
CREATE OR REPLACE FUNCTION public.expire_subscriptions_and_log()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT id, subscription_plan, subscription_ends_at
    FROM public.profiles
    WHERE subscription_status = 'active'
      AND subscription_ends_at IS NOT NULL
      AND subscription_ends_at < now()
  LOOP
    UPDATE public.profiles
    SET subscription_status = 'expired'
    WHERE id = r.id;

    INSERT INTO public.subscription_audit_logs (user_id, event, plan, details)
    VALUES (
      r.id,
      'expired',
      r.subscription_plan,
      jsonb_build_object(
        'subscription_ends_at', r.subscription_ends_at,
        'expired_at', now()
      )
    );
  END LOOP;
END;
$$;

-- Schedule daily job to run expiration check (03:00 UTC)
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

SELECT
  cron.schedule(
    'daily_subscription_expiration_check',
    '0 3 * * *',
    $$CALL public.expire_subscriptions_and_log();$$
  );

