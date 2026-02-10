-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  company_name text,
  email text,
  phone text,
  address text,
  document text,
  logo text,
  tech_signature text,
  pix_key text,
  bank_info text,
  subscription_status text DEFAULT 'trial',
  trial_ends_at timestamptz,
  material_catalog jsonb DEFAULT '[]',
  contract_templates jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
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

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
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
  completion_date date,
  warranty_until date,
  signature_data text,
  viewed_at timestamptz,
  contract_terms text,
  access_password text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES quotes(id) ON DELETE CASCADE,
  content text,
  created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Clients Policies
DROP POLICY IF EXISTS "Users can view own clients" ON clients;
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own clients" ON clients;
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own clients" ON clients;
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Quotes Policies
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
CREATE POLICY "Users can view own quotes" ON quotes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quotes" ON quotes;
CREATE POLICY "Users can insert own quotes" ON quotes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own quotes" ON quotes;
CREATE POLICY "Users can update own quotes" ON quotes FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own quotes" ON quotes;
CREATE POLICY "Users can delete own quotes" ON quotes FOR DELETE USING (auth.uid() = user_id);

-- Contracts Policies
DROP POLICY IF EXISTS "Users can view own contracts" ON contracts;
CREATE POLICY "Users can view own contracts" ON contracts FOR SELECT USING (
  EXISTS (SELECT 1 FROM quotes WHERE quotes.id = contracts.quote_id AND quotes.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert own contracts" ON contracts;
CREATE POLICY "Users can insert own contracts" ON contracts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM quotes WHERE quotes.id = contracts.quote_id AND quotes.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update own contracts" ON contracts;
CREATE POLICY "Users can update own contracts" ON contracts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM quotes WHERE quotes.id = contracts.quote_id AND quotes.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can delete own contracts" ON contracts;
CREATE POLICY "Users can delete own contracts" ON contracts FOR DELETE USING (
  EXISTS (SELECT 1 FROM quotes WHERE quotes.id = contracts.quote_id AND quotes.user_id = auth.uid())
);

-- Functions
CREATE OR REPLACE FUNCTION check_quote_access(token_input uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
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

GRANT EXECUTE ON FUNCTION check_quote_access(uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION get_quote_secure(token_input uuid, password_input text DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT row_to_json(t)
  INTO result
  FROM (
    SELECT 
      q.*, 
      row_to_json(c.*) as client,
      coalesce(ct.content, q.contract_terms) as contract_content_resolved
    FROM quotes q
    LEFT JOIN clients c ON q.client_id = c.id
    LEFT JOIN contracts ct ON ct.quote_id = q.id
    WHERE q.public_token = token_input
    AND (
      (q.access_password IS NULL OR q.access_password = '')
      OR
      (q.access_password = password_input)
    )
  ) t;
  
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_quote_secure(uuid, text) TO anon, authenticated, service_role;
