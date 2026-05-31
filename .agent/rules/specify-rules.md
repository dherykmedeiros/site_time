# site_time Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-05-31

## Active Technologies

- TypeScript 5.x (strict: true) em Node.js 20 LTS + Next.js 14+ (App Router), Prisma ORM, Tailwind CSS, NextAuth.js, Zod, React Hook Form (003-sports-team-mgmt)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5.x (strict: true) em Node.js 20 LTS: Follow standard conventions

## Recent Changes

- 003-sports-team-mgmt: Added TypeScript 5.x (strict: true) em Node.js 20 LTS + Next.js 14+ (App Router), Prisma ORM, Tailwind CSS, NextAuth.js, Zod, React Hook Form

## CRITICAL SAFETY RULES (REGRAS CRÍTICAS DE SEGURANÇA)

- **PROIBIDO RESETAR OU LIMPAR O BANCO DE DADOS (DATABASE RESET IS STRICTLY FORBIDDEN):** 
  Nenhum agente de IA tem permissão para executar comandos que apaguem dados do banco de dados (como `npx prisma migrate reset`, `prisma db push --force-reset` ou truncagem de tabelas).
  Se houver conflito de migrações ou divergência de schema com o banco de dados remoto, o agente DEVE reportar o conflito ao usuário e aguardar instruções, ou sugerir alterações de DDL não destrutivas via SQL manual.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
