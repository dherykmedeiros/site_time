# Quickstart: Gestão de Times Esportivos Amadores

**Feature**: 003-sports-team-mgmt  
**Date**: 2026-03-28

## Prerequisites

- Node.js 20 LTS
- PostgreSQL 15+ (local ou Docker)
- npm ou pnpm

## Setup

```bash
# 1. Criar projeto Next.js
npx create-next-app@latest site-time --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# 2. Instalar dependências
cd site-time
npm install prisma @prisma/client next-auth @auth/prisma-adapter
npm install zod react-hook-form @hookform/resolvers
npm install bcryptjs resend
npm install -D @types/bcryptjs vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test

# 3. Inicializar Prisma
npx prisma init --datasource-provider postgresql

# 4. Configurar DATABASE_URL no .env
# DATABASE_URL="postgresql://user:password@localhost:5432/site_time?schema=public"

# 5. Copiar schema.prisma do data-model.md para prisma/schema.prisma

# 6. Rodar migrations
npx prisma migrate dev --name init

# 7. Gerar Prisma Client
npx prisma generate

# 8. Rodar em desenvolvimento
npm run dev
```

## Variáveis de Ambiente (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/site_time?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
RESEND_API_KEY="re_xxxxxxxxxxxx"
```

## Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npx prisma studio` | Abre UI do Prisma para explorar dados |
| `npx prisma migrate dev` | Cria e aplica nova migration |
| `npx prisma db seed` | Popula banco com dados de teste |
| `npx vitest` | Roda testes unitários |
| `npx playwright test` | Roda testes E2E |

## Primeira Execução

1. Subir PostgreSQL (Docker: `docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15`)
2. Configurar `.env` com credenciais do banco
3. `npx prisma migrate dev --name init`
4. `npm run dev`
5. Acessar `http://localhost:3000`
