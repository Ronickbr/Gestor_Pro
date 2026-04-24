# Gestor de Serviços Pro

O **Gestor de Serviços Pro** é uma aplicação web completa desenvolvida para prestadores de serviços gerenciarem orçamentos, contratos e clientes de forma eficiente e profissional. A plataforma simplifica todo o fluxo de trabalho, desde a criação de orçamentos detalhados até a geração automática de contratos e coleta de assinaturas digitais.

## 🚀 Funcionalidades Principais

- **Gestão de Orçamentos:** Criação rápida de orçamentos profissionais com cálculo automático de serviços e materiais.
- **Visualização Pública:** Links compartilháveis para clientes visualizarem orçamentos online (sem necessidade de login).
- **Gestão de Clientes:** Cadastro e histórico completo de clientes.
- **Gerador de Contratos:** Criação automática de contratos baseados nos dados do orçamento aprovado.
- **Assinatura Digital:** Coleta de assinaturas de clientes e técnicos diretamente na plataforma.
- **Integração com WhatsApp:** Botões de ação rápida para envio de orçamentos e comunicações via WhatsApp.
- **Dashboard:** Visão geral métricas do negócio.
- **PWA (Progressive Web App):** Pode ser instalado como aplicativo no celular ou desktop.
- **IA Integrada:** Utiliza Google Gemini para auxiliar na geração de termos e textos contratuais.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (Arquitetura moderna com discovery automático e design Premium)
- **Backend & Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Gerenciamento de Estado:** [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Roteamento:** [React Router v7](https://reactrouter.com/)
- **Ícones:** Material Symbols (Customizados)

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [NPM](https://www.npmjs.com/)

## 🛡️ Segurança e Auditoria

Recentemente, o projeto passou por uma auditoria completa de segurança (Round 3), com as seguintes implementações:

- **Verificação de Webhook:** Proteção HMAC-SHA256 no endpoint da InfinitePay para prevenir fraudes.
- **Sanitização de PII:** Funções de banco de dados (RPC) ajustadas para não expor dados sensíveis dos clientes em links públicos.
- **Harden RLS:** Políticas de Row Level Security que verificam o status da assinatura diretamente no servidor.
- **Storage Isolado:** Uploads de avatares protegidos por pastas individuais e políticas de propriedade.
- **Otimização Tailwind CSS v4:** Configuração refinada para suporte nativo e eliminação de avisos de build.
- **Refatoração Modular:** Migração de lógica monolítica de banco de dados para serviços especializados (`quotes`, `clients`, `profile`).

### ⚙️ Configuração Adicional
Para o funcionamento total das defesas:
1. Configure `INFINITEPAY_WEBHOOK_SECRET` no Supabase Edge Functions.
2. Certifique-se de usar a `VITE_SUPABASE_ANON_KEY` (Chave Anon) no frontend e **NUNCA** a chave de serviço.

## 📦 Instalação e Configuração

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/gestor-de-servicos-pro.git
cd gestor-de-servicos-pro
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves (baseado no `.env.example` se houver, ou utilize suas credenciais do Supabase):

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
GEMINI_API_KEY=sua_chave_api_do_google_gemini
```

4. **Banco de Dados (Supabase):**

O projeto utiliza o Supabase. Certifique-se de criar um projeto no Supabase e executar as migrações SQL localizadas na pasta `supabase/migrations` para configurar as tabelas e permissões necessárias.

> **Nota:** Para o funcionamento correto da visualização pública de orçamentos, é crucial que as funções RPC (`check_quote_access` e `get_quote_secure`) estejam configuradas com `SECURITY DEFINER`.

5. **Execute o servidor de desenvolvimento:**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm run preview`: Visualiza a versão de produção localmente.
- `npm run check`: Executa a verificação de tipos do TypeScript.

## 📱 PWA

Este projeto está configurado como um PWA. Para testar a funcionalidade de instalação e service workers, é necessário executar a versão de build (`npm run build` seguido de `npm run preview`), pois service workers geralmente não funcionam em modo de desenvolvimento padrão.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ⚠️ Regras do Projeto

Por favor, consulte [PROJECT_RULES.md](PROJECT_RULES.md) para regras importantes sobre a configuração do banco de dados e ambiente.
