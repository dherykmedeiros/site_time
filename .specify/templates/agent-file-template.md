# [PROJECT NAME] Development Guidelines

Auto-generated from all feature plans. Last updated: [DATE]

## Active Technologies

[EXTRACTED FROM ALL PLAN.MD FILES]

## Project Structure

```text
[ACTUAL STRUCTURE FROM PLANS]
```

## Commands

[ONLY COMMANDS FOR ACTIVE TECHNOLOGIES]

## Code Style

[LANGUAGE-SPECIFIC, ONLY FOR LANGUAGES IN USE]

## Recent Changes

[LAST 3 FEATURES AND WHAT THEY ADDED]

## CRITICAL SAFETY RULES (REGRAS CRÍTICAS DE SEGURANÇA)

- **PROIBIDO RESETAR OU LIMPAR O BANCO DE DADOS (DATABASE RESET IS STRICTLY FORBIDDEN):** 
  Nenhum agente de IA tem permissão para executar comandos que apaguem dados do banco de dados (como `npx prisma migrate reset`, `prisma db push --force-reset` ou truncagem de tabelas).
  Se houver conflito de migrações ou divergência de schema com o banco de dados remoto, o agente DEVE reportar o conflito ao usuário e aguardar instruções, ou sugerir alterações de DDL não destrutivas via SQL manual.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
