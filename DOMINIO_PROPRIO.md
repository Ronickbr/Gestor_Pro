# Guia de Configuração de Domínio Próprio

Este guia explica os passos necessários quando você decidir conectar seu domínio próprio (ex: `www.suaempresa.com.br`) ao projeto.

## 1. No Painel da Vercel
Primeiro, configure seu domínio na Vercel:
1. Vá até o seu projeto na Vercel.
2. Clique em **Settings** > **Domains**.
3. Adicione seu domínio (ex: `suaempresa.com.br`).
4. Siga as instruções de configuração de DNS fornecidas pela Vercel.

## 2. No Painel do Supabase (CRUCIAL)
Para que os links de confirmação de e-mail e recuperação de senha funcionem com seu novo domínio, você precisa autorizá-lo no Supabase.

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá em **Authentication** > **URL Configuration**.
3. **Site URL:** Atualize este campo para seu novo domínio (ex: `https://www.suaempresa.com.br`).
4. **Redirect URLs:** Adicione as novas variações do seu domínio à lista existente.
   
   Sua lista final deve parecer com isso:
   - `http://localhost:5173` (para desenvolvimento local)
   - `https://seu-projeto.vercel.app` (domínio padrão da Vercel)
   - `https://www.suaempresa.com.br` (seu novo domínio)
   - `https://suaempresa.com.br` (sem www, se aplicável)
   - `https://www.suaempresa.com.br/**` (recomendado para garantir subrotas)

## 3. No Código
**Nenhuma alteração é necessária no código.**

Já configuramos o sistema de login (`pages/Login.tsx`) para usar `window.location.origin` dinamicamente. Isso significa que o sistema detectará automaticamente se o usuário está acessando via `localhost`, `vercel.app` ou `suaempresa.com.br` e gerará os links corretamente, desde que as URLs estejam autorizadas no passo 2 acima.
