# Regras do Projeto

Este arquivo contém regras estritas que devem ser seguidas durante o desenvolvimento e manutenção deste projeto.

## 🚨 Configuração de Banco de Dados e Ambiente

1.  **Sempre utilize os dados do arquivo `.env`**
    *   Todas as credenciais e configurações devem ser lidas exclusivamente do arquivo `.env` existente na raiz do projeto.
    *   Nunca substitua valores de variáveis de ambiente por valores fixos (hardcoded) no código.

2.  **Nunca troque o Banco de Dados**
    *   O projeto deve manter a conexão com o banco de dados atualmente configurado.
    *   **Proibido:** Alterar a URL de conexão do Supabase ou apontar para uma nova instância de banco de dados.
    *   **Proibido:** Recriar o banco de dados ou alterar configurações de conexão que desvinculem o projeto da instância atual.

Estas regras garantem a consistência e a integridade dos dados e do ambiente de desenvolvimento.
