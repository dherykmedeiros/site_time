# Tasks: Gestão de Times Esportivos Amadores

**Input**: Design documents from `/specs/003-sports-team-mgmt/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, research.md ✅, quickstart.md ✅, contracts/ ✅

**Tests**: Não incluídos (não solicitado explicitamente). Adicionar em cada fase se necessário.

**Organization**: Tasks agrupadas por user story conforme prioridades do spec.md (P1 → P2 → P3).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: User story associada (US1–US7)
- File paths relativos à raiz do repositório

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Criação do projeto Next.js e instalação de dependências

- [x] T001 Create Next.js project with TypeScript, Tailwind CSS, ESLint, App Router (sem src dir, alias `@/*`) conforme quickstart.md
- [x] T002 Install all project dependencies: `prisma @prisma/client next-auth @auth/prisma-adapter zod react-hook-form @hookform/resolvers bcryptjs resend` e devDeps: `@types/bcryptjs`
- [x] T003 [P] Configure environment variables in `.env` and `.env.example` (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, RESEND_API_KEY)
- [x] T004 [P] Enable TypeScript strict mode in `tsconfig.json` (strict: true)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura core que DEVE estar completa antes de qualquer user story

**⚠️ CRITICAL**: Nenhuma user story pode começar até esta fase estar completa

### Database & ORM

- [x] T005 Create Prisma schema with all entities (User, Team, Player, Match, RSVP, MatchStats, FriendlyRequest, Transaction, InviteToken) and enums (Role, PlayerPosition, PlayerStatus, MatchType, MatchStatus, RSVPStatus, FriendlyRequestStatus, TransactionType, TransactionCategory) in `prisma/schema.prisma` conforme data-model.md
- [ ] T006 Run initial Prisma migration (`npx prisma migrate dev --name init`) and generate Prisma Client
- [x] T007 [P] Create Prisma client singleton in `lib/prisma.ts`

### Authentication

- [x] T008 [P] Configure NextAuth.js with JWT strategy, Credentials provider, and role/teamId in JWT payload in `lib/auth.ts` (conforme research.md R4)
- [x] T009 Create NextAuth catch-all route handler in `app/api/auth/[...nextauth]/route.ts`
- [x] T009B [P] Create Auth Zod validation schemas (registerSchema, loginSchema, registerFromInviteSchema) in `lib/validations/auth.ts`
- [x] T010 Create admin registration endpoint (POST) in `app/api/auth/register/route.ts` — validate with Zod (T009B), hash password with bcrypt, create User with role ADMIN and teamId=null (conforme api-auth.md)
- [x] T011 Create auth helper utility for extracting session, checking role (ADMIN/PLAYER), and verifying teamId in `lib/auth.ts` (exported functions `getSession`, `requireAdmin`, `requireAuth`) — extends T008, MUST run after T008

### Shared Utilities

- [x] T012 [P] Create shared utilities (slug generation, UUID generation, date helpers) in `lib/utils.ts`
- [x] T013 [P] Create image upload API route (POST) with magic bytes validation (JPEG, PNG, WebP), 5 MB limit, UUID rename in `app/api/upload/route.ts` and create `public/uploads/` directory (conforme research.md R1, R9)
- [x] T013B [P] Create email notification utility (send email via Resend, template helpers for invite, approval, rejection) in `lib/email.ts` — conforme research.md R5. Used by T028, T052, T053

### Base UI Components

- [x] T014 [P] Create generic reusable UI components in `components/ui/`: Button, Card, Modal, Input, Select, Table, Badge, Textarea — styled with Tailwind CSS

### Layouts & Base Pages

- [x] T015 Configure root layout with global font, metadata (pt-BR), and Tailwind globals in `app/layout.tsx` and `app/globals.css`
- [x] T016 [P] Create auth layout in `app/(auth)/layout.tsx` (centered card layout, no sidebar)
- [x] T017 [P] Create dashboard layout with sidebar navigation (Elenco, Jogos, Finanças, Amistosos, Configurações) in `app/(dashboard)/layout.tsx`
- [x] T018 Create login page with email/password form using React Hook Form + Zod, NextAuth signIn in `app/(auth)/login/page.tsx`
- [x] T019 Create register page with name/email/password form, calls POST /api/auth/register, redirects to dashboard in `app/(auth)/register/page.tsx`

**Checkpoint**: Infraestrutura pronta — implementação de user stories pode iniciar

---

## Phase 3: User Story 1 — Configuração do Time e Perfil Público (Priority: P1) 🎯 MVP

**Goal**: Admin cria conta, configura perfil do time (nome, escudo, cores, local), e a Vitrine pública é gerada automaticamente

**Independent Test**: Criar conta, configurar time completo, verificar que `vitrine/{slug}` exibe todas as informações públicas

### Implementation for User Story 1

- [x] T020 [P] [US1] Create Team Zod validation schemas (createTeam, updateTeam) in `lib/validations/team.ts`
- [x] T021 [US1] Implement Teams API route (POST create team, GET team data, PATCH update team) in `app/api/teams/route.ts` — conforme api-teams.md, auto-generate slug from name
- [x] T022 [US1] Create team settings page with form (name, description, colors, defaultVenue, badge upload) using React Hook Form in `app/(dashboard)/team/settings/page.tsx` and `components/forms/TeamForm.tsx`
- [x] T023 [P] [US1] Create public Vitrine page displaying team info (badge, name, description, colors, elenco, stats) at `app/vitrine/[slug]/page.tsx` — server component, fetch team by slug, OpenGraph meta tags
- [x] T024 [US1] Implement dashboard home page with team overview (name, badge, player count, next match, balance summary) in `app/(dashboard)/page.tsx`

**Checkpoint**: Admin pode criar time, configurar perfil e Vitrine pública está acessível. Dashboard mostra visão geral.

---

## Phase 4: User Story 2 — Gestão de Elenco (Priority: P1)

**Goal**: Admin cadastra, edita e remove jogadores; jogadores podem ter conta com acesso limitado via convite

**Independent Test**: Cadastrar jogadores com nome/posição/camisa/foto, editar status, enviar convite, criar conta de jogador e verificar permissões read-only

### Implementation for User Story 2

- [x] T025 [P] [US2] Create Player Zod validation schemas (createPlayer, updatePlayer, invitePlayer) in `lib/validations/player.ts`
- [x] T026 [US2] Implement Players API list/create (GET with status filter, POST create player) in `app/api/players/route.ts` — conforme api-players.md, validate shirtNumber unique per team
- [x] T027 [P] [US2] Implement Player detail API (GET with aggregated stats, PATCH update, DELETE preserve stats) in `app/api/players/[id]/route.ts`
- [x] T028 [US2] Implement player invite endpoint (POST generate InviteToken, send email via Resend) in `app/api/players/invite/route.ts` — conforme research.md R5
- [x] T029 [US2] Create register-from-invite endpoint (POST validate token, create User with PLAYER role, link to Player) in `app/api/auth/register-from-invite/route.ts` — conforme api-auth.md
- [x] T030 [US2] Create squad management page with player list (filter by status), add player button, edit/delete actions in `app/(dashboard)/squad/page.tsx` and `components/forms/PlayerForm.tsx`
- [x] T031 [P] [US2] Create invite acceptance page (token validation, registration form) in `app/(auth)/invite/[token]/page.tsx`
- [x] T032 [US2] Update Vitrine page `app/vitrine/[slug]/page.tsx` to display active squad list (name, position, shirtNumber, photo)
- [x] T032B [US2] Implement player promote endpoint (PATCH /api/players/:id/promote — require player has linked User, update User.role to ADMIN) in `app/api/players/[id]/promote/route.ts` — conforme api-players.md, FR-007

**Checkpoint**: Admin gerencia elenco completo, jogadores podem criar conta via convite e têm acesso read-only. Vitrine mostra elenco.

---

## Phase 5: User Story 3 — Agendamento de Jogos e Confirmação de Presença (Priority: P2)

**Goal**: Admin agenda partidas, jogadores confirmam/recusam presença, admin visualiza status de confirmação em tempo real

**Independent Test**: Agendar partida com data futura, verificar RSVPs pendentes criados, confirmar presença como jogador, validar contador de confirmações

### Implementation for User Story 3

- [x] T033 [P] [US3] Create Match Zod validation schemas (createMatch, updateMatch, rsvpResponse) in `lib/validations/match.ts`
- [x] T034 [US3] Implement Matches API list/create (GET with filters status/type/date, POST create match + auto-create PENDING RSVPs for active players) in `app/api/matches/route.ts` — conforme api-matches.md, generate shareToken UUID
- [x] T035 [US3] Implement Match detail API (GET with RSVPs + stats + canSubmitPostGame flag, PATCH update/post-game score, DELETE with confirmation dialog if has stats — edge case) in `app/api/matches/[id]/route.ts`
- [x] T036 [US3] Implement RSVP endpoint (POST confirm/decline) in `app/api/matches/[id]/rsvp/route.ts` — block RSVP if match date has passed (FR-013), require PLAYER or ADMIN with linked Player
- [x] T037 [US3] Create matches list page with calendar/list view, filter by status/type in `app/(dashboard)/matches/page.tsx` and `components/forms/MatchForm.tsx`
- [x] T038 [US3] Create match detail page with RSVP actions (confirm/decline for players), RSVP summary (confirmed/declined/pending counts), copy share link button in `app/(dashboard)/matches/[id]/page.tsx`
- [x] T039 [P] [US3] Create public match detail page (deep link) for WhatsApp sharing at `app/vitrine/[slug]/matches/[id]/page.tsx` — display date, venue, opponent, RSVP status (conforme research.md R7)

**Checkpoint**: Partidas agendadas, jogadores confirmam presença, admin acompanha RSVPs. Deep links funcionam para WhatsApp.

---

## Phase 6: User Story 4 — Registro de Estatísticas Pós-Jogo (Priority: P2)

**Goal**: Após data da partida passar, admin registra placar e estatísticas individuais (gols, assistências, cartões)

**Independent Test**: Criar partida com data passada, registrar placar + stats individuais, verificar vinculação stats↔jogador↔partida

### Implementation for User Story 4

- [x] T040 [US4] Implement Match Stats API (GET stats for match, POST batch create stats with validation) in `app/api/matches/[id]/stats/route.ts` — require match COMPLETED, validate all playerIds belong to team, conforme api-stats.md
- [x] T041 [US4] Create post-game form component (score input + per-player stats: goals, assists, yellowCards 0-2, redCards 0-1) in `components/forms/PostGameForm.tsx`
- [x] T042 [US4] Integrate post-game form into match detail page `app/(dashboard)/matches/[id]/page.tsx` — show form only when `canSubmitPostGame === true` (FR-014), display saved stats when available
- [x] T043 [P] [US4] Update public match detail page `app/vitrine/[slug]/matches/[id]/page.tsx` to display score and individual stats when match is COMPLETED

**Checkpoint**: Estatísticas de pós-jogo registradas e vinculadas corretamente. Visíveis no painel e Vitrine.

---

## Phase 7: User Story 5 — Motor de Estatísticas e Rankings (Priority: P3)

**Goal**: Sistema agrega estatísticas automaticamente para gerar rankings (artilheiros, assistências, cartões, aproveitamento)

**Independent Test**: Registrar stats em 2+ partidas, verificar rankings calculados corretamente com ordenação, validar Vitrine mostra stats agregadas

### Implementation for User Story 5

- [x] T044 [US5] Implement Rankings API (GET with type filter and limit) using Prisma aggregation (groupBy) in `app/api/stats/rankings/route.ts` — return topScorers, topAssisters, mostCards, teamRecord (wins/draws/losses/winRate), conforme api-stats.md e research.md R8
- [x] T045 [P] [US5] Create RankingTable component (sortable by stat type) in `components/dashboard/RankingTable.tsx`
- [x] T046 [P] [US5] Create StatsCard component for summary stats display in `components/dashboard/StatsCard.tsx`
- [x] T047 [US5] Add rankings section to dashboard home page `app/(dashboard)/page.tsx` — show top 5 scorers, assisters, team record
- [x] T048 [US5] Update Vitrine `app/vitrine/[slug]/page.tsx` to display team aggregated stats (total matches, wins, draws, losses, winRate, goalsScored, goalsConceded) and top players

**Checkpoint**: Rankings calculados automaticamente, visíveis no dashboard e na Vitrine pública.

---

## Phase 8: User Story 6 — Solicitação de Amistosos via Vitrine (Priority: P3)

**Goal**: Visitantes solicitam amistosos via formulário público; admin aprova/rejeita no painel; notificação por email

**Independent Test**: Acessar Vitrine como visitante, preencher formulário de amistoso, verificar solicitação no painel admin, aprovar (partida criada automaticamente), rejeitar com motivo

### Implementation for User Story 6

- [x] T049 [P] [US6] Create FriendlyRequest Zod validation schemas (createRequest, processRequest) in `lib/validations/friendly-request.ts`
- [x] T050 [P] [US6] Create rate limiting utility (5 requests/IP/hour, in-memory Map, 429 response) in `lib/rate-limit.ts` — conforme research.md R6
- [x] T051 [US6] Implement Friendly Requests API — POST (public, rate-limited) create request by teamSlug, GET (admin) list with status filter in `app/api/friendly-requests/route.ts` — conforme api-friendly-requests.md
- [x] T052 [US6] Implement Friendly Request action API — PATCH approve (auto-create Match FRIENDLY + send approval email via Resend) or reject (send rejection email with reason) in `app/api/friendly-requests/[id]/route.ts`
- [x] T053 [US6] Add friendly request approval and rejection email templates to `lib/email.ts` (extends T013B) using Resend
- [x] T054 [US6] Add friendly request form (requesterTeamName, contactEmail, contactPhone, suggestedDates, suggestedVenue, proposedFee) to Vitrine page `app/vitrine/[slug]/page.tsx`
- [x] T055 [US6] Create friendly requests management page (list pending/approved/rejected, approve with date+venue, reject with reason) in `app/(dashboard)/friendly-requests/page.tsx`

**Checkpoint**: Visitantes enviam solicitações via Vitrine, admin gerencia no painel, emails de notificação enviados.

---

## Phase 9: User Story 7 — Gestão Financeira / Caixinha (Priority: P3)

**Goal**: Admin registra receitas/despesas, sistema exibe saldo, histórico com filtros, e resumo mensal

**Independent Test**: Registrar receitas e despesas, verificar saldo, filtrar por período/categoria, gerar resumo mensal

### Implementation for User Story 7

- [x] T056 [P] [US7] Create Finance Zod validation schemas (createTransaction, updateTransaction, summaryQuery) in `lib/validations/finance.ts`
- [x] T057 [US7] Implement Finances API list/create (GET with type/category/date filters + pagination + balance, POST create transaction) in `app/api/finances/route.ts` — conforme api-finances.md, validate date not in future
- [x] T058 [P] [US7] Implement Finance detail API (PATCH update, DELETE remove) in `app/api/finances/[id]/route.ts`
- [x] T059 [US7] Implement monthly financial summary API (GET by month/year, totals by category) in `app/api/finances/summary/route.ts`
- [x] T060 [US7] Create finances page with transaction list, balance display, filters (type, category, period), and add transaction form in `app/(dashboard)/finances/page.tsx` and `components/forms/TransactionForm.tsx`
- [x] T061 [US7] Create monthly summary view with income/expense/balance breakdown by category in `app/(dashboard)/finances/page.tsx` (tab ou section dentro da mesma página)

**Checkpoint**: Gestão financeira completa com CRUD, saldo, filtros e resumo mensal.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories e validação final

- [x] T062 [P] Create seed data script (admin user, team, 5 players, 3 matches, sample stats, sample transactions) in `prisma/seed.ts` and configure `package.json` prisma seed command
- [x] T063 [P] Validate and enhance OpenGraph meta tags for WhatsApp link preview on all Vitrine pages (verify T023 tags on `app/vitrine/[slug]/page.tsx`, add/fix tags on `app/vitrine/[slug]/matches/[id]/page.tsx`)
- [x] T064 [P] Add mobile-responsive styling across all dashboard and Vitrine pages (breakpoints Tailwind sm/md/lg)
- [x] T065 Implement proper error handling with user-friendly error messages and loading states (Suspense/skeletons) across all pages
- [x] T066 Update dashboard sidebar navigation to show active state and badge counts (pending friendly requests, upcoming matches)
- [x] T067 Run quickstart.md validation: execute full setup flow, verify all pages load, test main CRUD operations
- [x] T067B Validate performance target SC-008 (pages load <3s on 4G): audit largest pages (Vitrine, Dashboard, Matches) with Lighthouse, add dynamic imports and Suspense boundaries if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode iniciar imediatamente
- **Foundational (Phase 2)**: Depende do Setup — **BLOQUEIA** todas as user stories
- **US1 (Phase 3)**: Depende do Foundational — sem dependência de outras stories
- **US2 (Phase 4)**: Depende do Foundational — sem dependência de outras stories (mas integra com Vitrine da US1)
- **US3 (Phase 5)**: Depende do Foundational — depende de US2 (precisa de Players para RSVPs)
- **US4 (Phase 6)**: Depende de US3 (precisa de Matches criadas)
- **US5 (Phase 7)**: Depende de US4 (precisa de MatchStats registradas)
- **US6 (Phase 8)**: Depende de US1 (Vitrine) — pode rodar em paralelo com US3/US4/US5
- **US7 (Phase 9)**: Depende apenas do Foundational — pode rodar em paralelo com qualquer story
- **Polish (Phase 10)**: Depende de todas as user stories desejadas estarem completas

### User Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → ┬─ US1 (P1) ──→ US6 (P3)
                                            ├─ US2 (P1) ──→ US3 (P2) → US4 (P2) → US5 (P3)
                                            └─ US7 (P3)
```

- **US1** (Configuração Time): Independente após Foundational
- **US2** (Elenco): Independente após Foundational
- **US3** (Jogos/RSVP): Depende de US2 (Players existirem para RSVPs)
- **US4** (Estatísticas): Depende de US3 (Matches existirem)
- **US5** (Rankings): Depende de US4 (MatchStats existirem)
- **US6** (Amistosos Vitrine): Depende de US1 (Vitrine pública existir)
- **US7** (Financeiro): Independente após Foundational

### Within Each User Story

- Zod schemas antes de API routes
- API routes antes de pages/components
- Backend antes de frontend
- Core implementation antes de integração com Vitrine

### Parallel Opportunities

- Fase 1: T003 e T004 em paralelo
- Fase 2: T007, T008, T011, T012, T013, T014, T016, T017 em paralelo (arquivos independentes)
- Após Foundational: US1, US2 e US7 podem iniciar em paralelo
- US6 pode iniciar assim que US1 completar (em paralelo com US3/US4)
- Dentro de cada story: tasks marcadas [P] podem rodar em paralelo

---

## Parallel Example: Foundation + First Stories

```text
# Foundation (Phase 2) — parallelizable tasks:
Task T007: "Prisma client singleton in lib/prisma.ts"
Task T008: "NextAuth config in lib/auth.ts"
Task T011: "Auth helpers in lib/auth.ts"          ← same file as T008, run AFTER T008
Task T012: "Shared utilities in lib/utils.ts"
Task T013: "Upload route in app/api/upload/route.ts"
Task T014: "UI components in components/ui/"
Task T016: "Auth layout in app/(auth)/layout.tsx"
Task T017: "Dashboard layout in app/(dashboard)/layout.tsx"

# After Foundation — 3 stories in parallel:
Developer A: US1 (T020 → T024)  — Team config + Vitrine
Developer B: US2 (T025 → T032)  — Squad management
Developer C: US7 (T056 → T061)  — Finances
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 — Configuração do Time + Vitrine
4. Complete Phase 4: US2 — Gestão de Elenco
5. **STOP and VALIDATE**: Admin cria time, cadastra jogadores, Vitrine pública funciona
6. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → Base pronta
2. US1 (Time + Vitrine) → Teste independente → Deploy/Demo **(MVP!)**
3. US2 (Elenco) → Teste independente → Deploy/Demo
4. US3 (Jogos + RSVP) → Teste independente → Deploy/Demo
5. US4 (Estatísticas) → Teste independente → Deploy/Demo
6. US5 (Rankings) + US6 (Amistosos) + US7 (Finanças) → em paralelo → Deploy/Demo
7. Polish → Validação final

### Scope Summary

| Phase | Story | Priority | Tasks | Status |
|-------|-------|----------|-------|--------|
| 1 | Setup | — | T001–T004 | ⬜ |
| 2 | Foundational | — | T005–T019 | ⬜ |
| 3 | US1: Configuração Time + Vitrine | P1 | T020–T024 | ⬜ |
| 4 | US2: Gestão de Elenco | P1 | T025–T032 | ⬜ |
| 5 | US3: Jogos + RSVP | P2 | T033–T039 | ⬜ |
| 6 | US4: Estatísticas Pós-Jogo | P2 | T040–T043 | ⬜ |
| 7 | US5: Rankings | P3 | T044–T048 | ⬜ |
| 8 | US6: Amistosos Vitrine | P3 | T049–T055 | ⬜ |
| 9 | US7: Financeiro | P3 | T056–T061 | ⬜ |
| 10 | Polish | — | T062–T067 | ⬜ |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências pendentes
- [US*] label vincula task à user story para rastreabilidade
- Cada user story é independentemente completável e testável (respeitando dependências de dados)
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar story independentemente
- Evitar: tasks vagas, conflitos de mesmo arquivo, dependências cross-story que quebrem independência
