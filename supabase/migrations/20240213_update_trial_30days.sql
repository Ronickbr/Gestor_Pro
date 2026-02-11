-- Atualizar a função handle_new_user para garantir 30 dias de trial
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
    (now() + interval '30 days')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
