-- CORREÇÃO DE BANCO DE DADOS
-- Execute este script no SQL Editor do Supabase Dashboard para corrigir as tabelas.

-- 1. Tabela profiles (Perfil do Usuário)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pix_key text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_info text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tech_signature text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS material_catalog jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contract_templates jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trial';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz DEFAULT (now() + interval '30 days');
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 2. Tabela clients (Clientes)
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS document text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS avatar text;

-- 3. Tabela quotes (Orçamentos)
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS completion_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS warranty_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS signature_data TEXT;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS contract_number TEXT;

-- 4. Atualizar dados existentes (opcional)
UPDATE public.profiles SET subscription_ends_at = trial_ends_at WHERE subscription_ends_at IS NULL;
