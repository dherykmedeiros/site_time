# Implementation Plan: Gestão de Times Esportivos Amadores

**Branch**: `003-sports-team-mgmt` | **Date**: 2026-03-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-sports-team-mgmt/spec.md`

## Summary

Aplicação web full-stack para gestão de times de futebol amador. Permite que administradores de times organizem elenco, agendem jogos com confirmação de presença, registrem estatísticas pós-jogo, gerenciem finanças (caixinha) e recebam solicitações de amistosos via página pública (Vitrine). Construída com Next.js 14+ App Router, Prisma ORM + PostgreSQL, NextAuth.js para autenticação, e Zod + React Hook Form para validação.

## Technical Context

**Language/Version**: TypeScript 5.x (strict: true) em Node.js 20 LTS  
**Primary Dependencies**: Next.js 14+ (App Router), Prisma ORM, Tailwind CSS, NextAuth.js, Zod, React Hook Form  
**Storage**: PostgreSQL (via Prisma ORM)  
**Testing**: Vitest + React Testing Library (unit/component), Playwright (E2E)  
**Target Platform**: Web (browser, mobile-responsive)  
**Project Type**: Web application (full-stack, single repo)  
**Performance Goals**: < 3 segundos de carregamento em 4G móvel (SC-008)  
**Constraints**: Single-tenant por time, upload de imagens max 5 MB, rate limiting em formulários públicos  
**Scale/Scope**: ~1 time por admin, ~30 jogadores/time, ~50 partidas/ano, ~15 telas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Evidência |
|-----------|--------|-----------|
| I. Componentes Reutilizáveis | ✅ PASS | React + Tailwind CSS; componentes UI genéricos em `components/ui/`; lógica de negócio em hooks/services separados |
| II. API-First | ✅ PASS | Todas as operações via Next.js API Routes (`app/api/`); frontend consome exclusivamente via fetch/SWR; contratos tipados |
| III. Type-Safety | ✅ PASS | TypeScript strict, Prisma como único ORM, tipos gerados pelo Prisma Client como fonte de verdade, `any` proibido |
| IV. Segurança | ✅ PASS | NextAuth.js para auth, middleware de autorização por role (Admin/Player), Zod para validação server-side, rate limiting |
| V. Simplicidade | ✅ PASS | Stack mínima confirmada, sem abstrações prematuras, sem features fora do escopo v1 |

**Gate Result**: PASS — Nenhuma violação detectada.

### Post-Design Re-Check (após Phase 1)

| Princípio | Status | Verificação |
|-----------|--------|-------------|
| I. Componentes Reutilizáveis | ✅ PASS | `components/ui/` definido para componentes genéricos; forms e dashboard separados; hooks/services isolados em `lib/` |
| II. API-First | ✅ PASS | 7 contracts de API definidos em `contracts/`; todas as operações via `app/api/`; frontend consome exclusivamente via API Routes |
| III. Type-Safety | ✅ PASS | Prisma schema completo com tipos gerados; Zod schemas em `lib/validations/`; request/response types documentados nos contracts; `any` ausente |
| IV. Segurança | ✅ PASS | Auth obrigatória em todas as rotas protegidas; roles ADMIN/PLAYER verificados nos contracts; Zod validation server-side; rate limiting em endpoint público; bcrypt para senhas |
| V. Simplicidade | ✅ PASS | Upload local (sem cloud), JWT sem session table, stats on-read (sem cache), rate limit in-memory; nenhuma abstração sem 2+ casos de uso |

**Post-Design Gate Result**: PASS — Design conforme todos os princípios da constitution.

## Project Structure

### Documentation (this feature)

```text
specs/003-sports-team-mgmt/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
│   ├── api-auth.md
│   ├── api-teams.md
│   ├── api-players.md
│   ├── api-matches.md
│   ├── api-stats.md
│   ├── api-friendly-requests.md
│   └── api-finances.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── invite/
│       └── [token]/
│           └── page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx                    # Dashboard home (overview)
│   ├── team/
│   │   └── settings/
│   │       └── page.tsx
│   ├── squad/
│   │   └── page.tsx
│   ├── matches/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx            # Match detail + RSVP + post-game
│   ├── finances/
│   │   └── page.tsx
│   └── friendly-requests/
│       └── page.tsx
├── vitrine/
│   └── [slug]/
│       ├── page.tsx                # Public team page
│       └── matches/
│           └── [id]/
│               └── page.tsx        # Public match detail (deep link)
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts
│   ├── teams/
│   │   └── route.ts
│   ├── players/
│   │   ├── route.ts
│   │   ├── [id]/
│   │   │   └── route.ts
│   │   └── invite/
│   │       └── route.ts
│   ├── matches/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       ├── rsvp/
│   │       │   └── route.ts
│   │       └── stats/
│   │           └── route.ts
│   ├── friendly-requests/
│   │   ├── route.ts               # POST (public), GET (admin)
│   │   └── [id]/
│   │       └── route.ts           # PATCH approve/reject
│   ├── finances/
│   │   ├── route.ts
│   │   ├── [id]/
│   │   │   └── route.ts
│   │   └── summary/
│   │       └── route.ts
│   ├── stats/
│   │   └── rankings/
│   │       └── route.ts
│   └── upload/
│       └── route.ts
├── layout.tsx
└── globals.css

components/
├── ui/                             # Generic reusable (Button, Card, Modal, Table, Badge, Input, Select)
├── forms/                          # Domain form components (PlayerForm, MatchForm, TransactionForm)
└── dashboard/                      # Composed dashboard components (StatsCard, RankingTable, Calendar)

lib/
├── auth.ts                         # NextAuth configuration
├── prisma.ts                       # Prisma client singleton
├── validations/                    # Zod schemas per domain
│   ├── team.ts
│   ├── player.ts
│   ├── match.ts
│   ├── friendly-request.ts
│   └── finance.ts
└── utils.ts                        # Shared utilities

prisma/
├── schema.prisma
└── seed.ts

public/
└── uploads/                        # Image storage (v1)

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Next.js App Router single-project structure with `app/` directory conventions. Frontend and backend colocated within the same Next.js project, with API routes under `app/api/` and pages under route groups `(auth)` and `(dashboard)`. Public Vitrine pages under `app/vitrine/[slug]/`. Reusable components in `components/ui/`, domain logic in `lib/`.

## Complexity Tracking

> Nenhuma violação de constitution detectada. Tabela vazia.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
