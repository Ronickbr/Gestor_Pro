-- ==========================================
-- GESTOR PRO - MASTER DATABASE SETUP
-- ==========================================
-- Este script consolida todas as tabelas, políticas de RLS e funções de segurança.
-- Executar no Editor SQL do Supabase.

-- 0. Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELAS

-- 1.1 Profiles (Perfil do Usuário/Técnico)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  email text,
  company_name text,
  document text,
  phone text,
  address text,
  logo text,
  tech_signature text,
  pix_key text,
  bank_info text,
  subscription_status text DEFAULT 'trial',
  trial_ends_at timestamptz DEFAULT (now() + interval '30 days'),
  subscription_ends_at timestamptz,
  subscription_plan text,
  subscription_activated_at timestamptz,
  material_catalog jsonb DEFAULT '[]'::jsonb,
  contract_templates jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 1.2 Clients (Clientes dos Usuários)
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text,
  document text,
  address text,
  phone text,
  email text,
  avatar text,
  created_at timestamptz DEFAULT now()
);

-- 1.3 Quotes (Orçamentos)
CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  number text,
  status text,
  date date,
  valid_until date,
  warranty_duration integer,
  payment_terms text,
  services jsonb,
  materials jsonb,
  total_value numeric,
  public_token uuid DEFAULT gen_random_uuid(),
  company_info jsonb,
  contract_number text,
  completion_date timestamptz,
  warranty_until timestamptz,
  signature_data text,
  viewed_at timestamptz,
  contract_terms text,
  access_password text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 1.4 Contracts (Documentos de Contrato)
CREATE TABLE IF NOT EXISTS public.contracts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES quotes(id) ON DELETE CASCADE,
  content text,
  status text DEFAULT 'DRAFT',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_quote_contract UNIQUE(quote_id)
);

-- 1.5 Feedbacks
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    nps INTEGER,
    general TEXT,
    improvements TEXT,
    ratings JSONB,
    comments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 1.6 Subscription Audit Logs (Para Pagamentos)
CREATE TABLE IF NOT EXISTS public.subscription_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event TEXT,
    plan TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. SEGURANÇA (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2.1 Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2.2 Clients Policies
DROP POLICY IF EXISTS "Users can view own clients" ON clients;
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own clients" ON clients;
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own clients" ON clients;
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- 2.3 Quotes Policies
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
CREATE POLICY "Users can view own quotes" ON quotes FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own quotes" ON quotes;
CREATE POLICY "Users can insert own quotes" ON quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own quotes" ON quotes;
CREATE POLICY "Users can update own quotes" ON quotes FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own quotes" ON quotes;
CREATE POLICY "Users can delete own quotes" ON quotes FOR DELETE USING (auth.uid() = user_id);
-- Acesso público via token (apenas leitura)
DROP POLICY IF EXISTS "Public access via token" ON quotes;
CREATE POLICY "Public access via token" ON quotes FOR SELECT USING (public_token IS NOT NULL);

-- 2.4 Contracts Policies
DROP POLICY IF EXISTS "Users can view own contracts" ON contracts;
CREATE POLICY "Users can view own contracts" ON contracts FOR SELECT USING (
  EXISTS (SELECT 1 FROM quotes WHERE quotes.id = contracts.quote_id AND quotes.user_id = auth.uid())
);
DROP POLICY IF EXISTS "Users can manage own contracts" ON contracts;
CREATE POLICY "Users can manage own contracts" ON contracts FOR ALL USING (
  EXISTS (SELECT 1 FROM quotes WHERE quotes.id = contracts.quote_id AND quotes.user_id = auth.uid())
);

-- 2.5 Feedbacks Policies
DROP POLICY IF EXISTS "Anonymous feedback insertion" ON feedbacks;
CREATE POLICY "Anonymous feedback insertion" ON feedbacks FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
DROP POLICY IF EXISTS "Users can view own feedback" ON feedbacks;
CREATE POLICY "Users can view own feedback" ON feedbacks FOR SELECT USING (auth.uid() = user_id);

-- 3. FUNÇÕES E TRIGGERS

-- 3.1 Criação automática de perfil ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, company_name, subscription_status, trial_ends_at)
  VALUES (
    new.id, 
    new.email, 
    'Gestor', 
    COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Empresa'),
    'trial',
    (now() + interval '30 days')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. FUNÇÕES DE ACESSO SEGURO (RPC) - SANITIZADAS

-- 4.1 Checar se orçamento existe e requer senha
CREATE OR REPLACE FUNCTION public.check_quote_access(token_input uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  record_exists boolean;
  has_pass boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM quotes WHERE public_token = token_input),
         (access_password IS NOT NULL AND access_password <> '')
  INTO record_exists, has_pass
  FROM quotes
  WHERE public_token = token_input;

  IF NOT record_exists THEN
    RETURN json_build_object('exists', false, 'requires_password', false);
  END IF;

  RETURN json_build_object('exists', true, 'requires_password', has_pass);
END;
$$;

-- 4.2 Obter orçamento detalhado (SEM VAZAMENTO DE PII DO CLIENTE)
CREATE OR REPLACE FUNCTION public.get_quote_secure(token_input uuid, password_input text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id', q.id,
    'number', q.number,
    'status', q.status,
    'date', q.date,
    'validUntil', q.valid_until,
    'warrantyDuration', q.warranty_duration,
    'paymentTerms', q.payment_terms,
    'services', q.services,
    'materials', q.materials,
    'totalValue', q.total_value,
    'companyInfo', q.company_info,
    'contractNumber', q.contract_number,
    'completionDate', q.completion_date,
    'warrantyUntil', q.warranty_until,
    'signatureData', q.signature_data,
    'viewedAt', q.viewed_at,
    'publicToken', q.public_token,
    'contractTerms', coalesce(ct.content, q.contract_terms),
    'client', CASE WHEN c.id IS NULL THEN NULL ELSE json_build_object(
      'id', c.id,
      'name', c.name
    ) END
  )
  INTO result
  FROM quotes q
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN contracts ct ON ct.quote_id = q.id
  WHERE q.public_token = token_input
  AND (
    (q.access_password IS NULL OR q.access_password = '')
    OR
    (q.access_password = password_input)
  );
  RETURN result;
END;
$$;

-- 4.3 Marcar como visualizado
CREATE OR REPLACE FUNCTION public.mark_quote_viewed(quote_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE quotes SET viewed_at = now() WHERE id = quote_id_input;
END;
$$;

-- 5. GRANTS
GRANT EXECUTE ON FUNCTION public.check_quote_access(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_quote_secure(uuid, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.mark_quote_viewed(uuid) TO anon, authenticated, service_role;

-- 6. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS quotes_public_token_idx ON quotes (public_token);
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON clients (user_id);
CREATE INDEX IF NOT EXISTS quotes_user_id_idx ON quotes (user_id);
