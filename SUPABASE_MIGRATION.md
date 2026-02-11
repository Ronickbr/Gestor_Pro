# Guia de Migração Final do Banco de Dados

Para que todas as funcionalidades do Gestor Pro (SaaS) funcionem perfeitamente na nuvem, incluindo configurações da empresa, assinatura técnica e catálogo de materiais, execute o seguinte script SQL no **Editor SQL do Supabase**:

```sql
-- 1. Atualizar Tabela de Perfis (Profiles)
-- Adiciona campos para configurações da empresa, assinatura e catálogos
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS logo text,
ADD COLUMN IF NOT EXISTS document text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS tech_signature text,
ADD COLUMN IF NOT EXISTS material_catalog jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS contract_templates jsonb DEFAULT '[]'::jsonb;

-- 2. Atualizar Tabela de Orçamentos (Quotes)
-- Garante que o token público existe para links compartilháveis
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS public_token uuid DEFAULT gen_random_uuid();

-- Criar índice para busca rápida por token
CREATE INDEX IF NOT EXISTS quotes_public_token_idx ON quotes (public_token);

-- Adicionar campo para snapshot da empresa (dados da empresa no momento da criação)
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS company_info jsonb;

-- 3. Configurar Acesso Público aos Orçamentos (Links Compartilháveis)
-- Permite que qualquer pessoa com o link (token) possa ler (SELECT) o orçamento
-- ATENÇÃO: Isso permite que quem tem o link veja os dados do orçamento.

-- Primeiro, habilitar RLS caso não esteja
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Criar policy para leitura anônima via token
CREATE POLICY "Leitura pública via token" ON quotes
FOR SELECT
USING (public_token IS NOT NULL);

-- (Opcional) Permitir atualização pública do status (ex: cliente aprovar)
-- Isso requer cuidado. Por segurança, sugerimos manter apenas leitura por enquanto 
-- e a aprovação ser feita via API segura ou Edge Function no futuro.
-- Para este MVP, a aprovação pelo cliente apenas notifica via WhatsApp.
```




-- 4. Reparo Tabela de Perfis (Versão Final e Robusta)
-- Se a tabela já existia sem campos (email, etc), isso vai corrigir.

-- Adicionar TODAS as colunas possíveis se não existirem
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tech_signature text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pix_key text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_info text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS material_catalog jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contract_templates jsonb DEFAULT '[]'::jsonb;

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Resetar Permissões (Evita erros de policy already exists)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can select own profile" ON profiles;

CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can select own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Atualizar Função Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, company_name, name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Empresa'),
    'Gestor'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- CORREÇÃO FINAL PARA SEU USUÁRIO ATUAL
-- Insere seu perfil se ele ainda não existir
INSERT INTO public.profiles (id, email, name, company_name)
SELECT 
  id, 
  email, 
  'Gestor', 
  COALESCE(raw_user_meta_data->>'company_name', 'Minha Empresa')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);




-- 5. Adicionar Controle de Assinatura (Trial)
-- Adiciona campos para controlar o período de teste e status da assinatura

-- Adicionar colunas na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trial';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone DEFAULT (now() + interval '2 months');

-- Atualizar Trigger para novos usuários (2 meses de trial)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, company_name, name, subscription_status, trial_ends_at)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Empresa'), 
    'Gestor',
    'trial',
    (now() + interval '60 days')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Atualizar usuários existentes (dar 2 meses de trial a partir de hoje)
UPDATE public.profiles 
SET 
  subscription_status = 'trial', 
  trial_ends_at = (now() + interval '60 days') 
WHERE subscription_status IS NULL;

-- 6. Atualizar Tabela de Clientes (Clients) - Correção de Erro de Schema
-- Adiciona colunas que podem estar faltando se a tabela foi criada em versão antiga
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS document text,
ADD COLUMN IF NOT EXISTS avatar text;
