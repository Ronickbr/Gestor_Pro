# Sistema de Itens de Orçamento (Catálogo)

## Objetivo

Permitir que, durante a criação de orçamentos, o usuário:
- Pesquise e selecione itens já existentes no catálogo (produtos/materiais e serviços).
- Crie novos itens diretamente na tela do orçamento, com campos essenciais.
- Garanta que itens criados durante o orçamento sejam adicionados automaticamente ao catálogo e fiquem disponíveis para uso futuro, sem recadastro.

## Entidades e Armazenamento

### Catálogo (da empresa)
- Origem: `profiles.material_catalog` (JSON) no Supabase.
- No app: `profile.materialCatalog` (array).
- Itens podem representar:
  - Produto/Material (`kind: 'product'`)
  - Serviço (`kind: 'service'`)

Campos relevantes (por item):
- `id` (string)
- `kind` (`product` | `service`)
- `status` (`active` | `inactive`)
- `code` (string) — código único por item
- `name` (string) — nome do item
- `description` (string, opcional)
- `category` (string)
- `unit` (string) — unidade de medida (ex.: `un`, `m`, `h`, `serv`)
- `unitPrice` (number) — preço sugerido
- `cost` (number, opcional) — custo
- `margin` (number, opcional) — margem (%)

### Itens no Orçamento
- Serviços: `Quote.services[]`
- Produtos/Materiais: `Quote.materials[]`

Para manter consistência entre orçamento e catálogo, itens do orçamento podem carregar:
- `catalogItemId` (id do item no catálogo)
- `code`, `category`, `unit`, `cost`, `margin` (quando disponível)

## Fluxo do Usuário

### 1) Selecionar item do catálogo
Na tela de orçamento, o usuário pode abrir o seletor de catálogo e:
- Filtrar por categoria, nome, código e faixa de preço.
- Navegar com paginação (para catálogos extensos).
- Selecionar um item para preencher a linha do orçamento.

### 2) Criar item novo no orçamento (formulário dinâmico)
Se o item não existir:
- O usuário abre o modo “Criar novo” dentro do seletor.
- Preenche os campos obrigatórios:
  - Nome
  - Categoria
  - Unidade
  - Preço unitário
- Opcionalmente:
  - Código (se vazio, será gerado automaticamente)
  - Descrição
  - Custo e Margem

Ao criar:
- O item aparece imediatamente no catálogo (em memória) e pode ser selecionado na hora.

### 3) Persistência automática ao salvar o orçamento
Ao salvar o orçamento, itens novos criados no fluxo são persistidos em:
- `profiles.material_catalog` com `status = 'active'`.

## Regras de Negócio

### Duplicidade
Não permitir duplicatas no catálogo por:
- `code` (case-insensitive)
- `name` (case-insensitive)

Comportamento:
- Se houver duplicata, o sistema associa o item do orçamento ao item já existente no catálogo.

### Geração automática de código
Se o usuário não informar `code`, o sistema gera automaticamente:
- Produtos: `PRD-000001`, `PRD-000002`, ...
- Serviços: `SRV-000001`, `SRV-000002`, ...

### Permissões
A criação de novos itens no catálogo é permitida apenas para usuários autorizados.
Regra atual (app):
- `subscriptionStatus` em `trial` ou `active`.

Usuários não autorizados:
- Não veem o botão de “Criar novo” no seletor.
- Se tentarem persistir itens novos, o sistema bloqueia a escrita no catálogo e informa ao usuário.

## Validações (formulário de criação)

Obrigatórias:
- Nome (não vazio)
- Categoria (não vazio)
- Unidade (não vazio)
- Preço unitário (`> 0`)

Opcionais:
- Custo (`>= 0`)
- Margem (número)
- Código: se informado, deve ser único; se vazio, será gerado.

## Tratamento de Erros e Feedback

Mensagens principais:
- Falha ao carregar catálogo: informar e permitir continuar o orçamento.
- Duplicata (nome/código): alertar no formulário e impedir criação.
- Sem permissão: informar que não é possível criar itens no catálogo.
- Falha ao salvar catálogo: logar erro e seguir com o salvamento do orçamento (sem perder dados do orçamento).

## Critérios de Aceitação

- O seletor de catálogo possui filtros por categoria, nome, código e preço, com paginação.
- Itens criados no fluxo de orçamento aparecem no catálogo imediatamente (mesma sessão).
- Ao salvar o orçamento, itens novos são persistidos no catálogo com `status = active`.
- 100% dos itens criados durante orçamentos ficam disponíveis para seleção futura, sem recadastro.
- O sistema impede duplicatas por nome ou código.
- Apenas usuários autorizados conseguem criar itens novos no catálogo.

