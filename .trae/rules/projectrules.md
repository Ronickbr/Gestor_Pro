# Regras do Projeto

Este arquivo contém regras estritas que devem ser seguidas durante o desenvolvimento e manutenção deste projeto.

## 🚨 Configuração de Banco de Dados e Ambiente

1.  **Sempre utilize os dados do arquivo `.env`**
    *   Todas as credenciais e configurações devem ser lidas exclusivamente do arquivo `.env` existente na raiz do projeto.
    *   Nunca substitua valores de variáveis de ambiente por valores fixos (hardcoded) no código.¨
    *   Limpar as ferramentas interna (MCP) para que não esteja "presa" em algum outro projeto, enquanto o seu arquivo .env e o código da aplicação apontam corretamente para o projeto.
    *   Execute um teste direto (bypassing minha ferramenta interna) e confirme:
    *   Conecta com sucesso ao projeto correto ( .env ).

2.  **Nunca troque o Banco de Dados**
    *   O projeto deve manter a conexão com o banco de dados atualmente configurado.
    *   **Proibido:** Alterar a URL de conexão do Supabase ou apontar para uma nova instância de banco de dados.
    *   **Proibido:** Recriar o banco de dados ou alterar configurações de conexão que desvinculem o projeto da instância atual.

3.  **⚠️ Verificação de Integridade do Banco de Dados (MANDATÓRIO)**
    *   **Antes de executar QUALQUER comando SQL ou migração:**
        1.  **Verifique a existência das tabelas principais:** O banco de dados DEVE conter as tabelas `profiles`, `quotes` e `clients`.
        2.  **Verifique se há tabelas estranhas:** Se o banco contiver tabelas como `products`, `categories` (típicas de e-commerce) mas NÃO tiver `quotes`, **PARE IMEDIATAMENTE**.
        3.  **Confirmação:** Se o esquema do banco de dados parecer incorreto ou pertencer a outro tipo de projeto, alerte o usuário e solicite confirmação antes de prosseguir.
        4.  **Não execute DDL (CREATE/ALTER/DROP)** sem antes confirmar que está operando no banco de dados correto do projeto "Gerador de Orçamento".