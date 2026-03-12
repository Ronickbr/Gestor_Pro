
-- Tabela para armazenar os feedbacks
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    nps INTEGER,
    general TEXT,
    improvements TEXT,
    ratings JSONB,
    comments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança
-- Qualquer usuário autenticado pode inserir seu próprio feedback
CREATE POLICY "Users can insert their own feedback" 
ON public.feedbacks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Apenas administradores (ou ninguém via app) podem ler feedbacks por enquanto
CREATE POLICY "Users can view their own feedback" 
ON public.feedbacks 
FOR SELECT 
USING (auth.uid() = user_id);
