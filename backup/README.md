# Backup Supabase - Gestor Pro

**Data:** 16/04/2026
**Projeto ID:** tbzkuzfturedpltawxss

## Conteúdo do Backup
- `full_db_backup.sql`: Dump completo do banco de dados (schema e dados).
- `storage/`: Estrutura de arquivos dos buckets do Supabase Storage.
- `backup_storage.js`: Script utilizado para a extração do storage.

## Observações
- O dump do banco foi realizado via `pg_dump` v18.1.
- Os buckets identificados (`client-avatars`, `labels`) estavam vazios durante este backup.
