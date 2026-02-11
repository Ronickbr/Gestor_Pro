# Design de Refatoração e Melhoria - Gerador de Orçamentos

## 1. Visão Geral
Refatoração focada em performance, manutenibilidade e experiência do usuário, introduzindo gestão de estado robusta e um visual profissional unificado para documentos, com integração simples de WhatsApp.

## 2. Arquitetura Técnica
- **State Management:** TanStack Query v5 (React Query)
  - `useQuote(id)`: Cache e background updates para evitar loading desnecessário.
  - `useUpdateStatus()`: Optimistic updates para feedback instantâneo.
- **Services:** Refatorar `database.ts` para métodos granulares (`getQuoteById` vs `getAll`).
- **Formulários:** Extrair lógica de `NewQuoteForm` para um hook customizado `useQuoteForm` para limpar o componente visual.

## 3. UI/UX (DocumentLayout)
Um container responsivo que simula um documento A4/Carta na tela:
- **Header:** Logo, Razão Social, Contato (Fixo no topo do papel).
- **Body:**
  - Grid de Metadados (Cliente, Datas, Status).
  - Tabela de Itens (Zebrada, alinhamento decimal para valores).
  - Seção de Totais e Condições (Destaque visual).
  - Assinaturas (Espaço dedicado lado a lado em desktop).
- **Footer:** Ações flutuantes (WhatsApp, Imprimir, Aprovar) que não saem na impressão.

## 4. Integração WhatsApp
Botões de ação rápida com deep links (`wa.me`):
- **Formato:** `https://wa.me/{phone}?text={message}`
- **Mensagens Dinâmicas:**
  - *Dono -> Cliente:* "Segue o link do orçamento..."
  - *Cliente -> Dono (Dúvida):* "Tenho dúvida sobre o item X..."
  - *Cliente -> Dono (Aprovação):* "Aprovei o orçamento Y..."

## 5. Estratégia de Implementação
1.  **Configuração:** Instalar TanStack Query e configurar Provider.
2.  **Refatoração de Serviços:** Criar métodos isolados de fetch.
3.  **Hooks:** Criar `useQuote`, `useQuotes`.
4.  **UI Components:** Criar `DocumentLayout`, `WhatsAppFab`.
5.  **Páginas:** Atualizar `PublicQuoteView`, `ContractReview` para usar o novo layout.
