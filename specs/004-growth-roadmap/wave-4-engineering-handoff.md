# Handoff Tecnico - Onda 4

**Escopo**: F-017, F-018 e F-019  
**Data**: 2026-04-01  
**Objetivo**: traduzir a monetizacao em uma sequencia pequena de implementacao, com boundaries claras entre forecast financeiro, cobranca assistida, vitrine de parceiros e feature gating por time.

---

## Leitura Operacional do Estado Atual

### Financeiro atual

- `app/(dashboard)/finances/page.tsx` ja opera com abas de lista e resumo mensal;
- `app/api/finances/route.ts` e `app/api/finances/summary/route.ts` ja entregam historico e consolidado do mes;
- `app/api/players/membership/route.ts` e `app/api/players/[id]/membership/route.ts` ja fornecem o dominio minimo para risco de inadimplencia e cobranca assistida.

### Configuracao do time

- `app/(dashboard)/team/settings/page.tsx` e `app/api/teams/route.ts` ja concentram a configuracao administravel do time;
- `lib/validations/team.ts` ja e a fronteira correta para evoluir configuracao financeira minima, sponsors e estado comercial do time;
- a Onda 4 deve reaproveitar essa superficie, sem criar um modulo administrativo paralelo.

### Vitrine publica

- `app/vitrine/[slug]/page.tsx` ja e a pagina publica principal do time;
- a F-018 deve nascer como bloco adicional da vitrine, sem competir com identidade, retrospecto e CTA de amistoso;
- o tracking minimo de clique pode entrar em rota publica dedicada, sem analytics pesada.

### Auth e gating

- `lib/auth.ts` ja define sessao, role e `teamId`;
- ainda nao existe camada central de entitlements no repositório;
- a F-019 deve criar essa camada em `lib/`, para evitar condicionais espalhadas por paginas e rotas.

---

## Boundaries Congeladas

### Camada de dominio

- `lib/finance-forecast.ts` deve concentrar projeção de caixa, risco financeiro e explicacao textual do forecast;
- `lib/collections.ts` deve concentrar lista de pendencias, nivel de risco e mensagem sugerida por jogador;
- `lib/plan-entitlements.ts` deve concentrar a tabela de permissao por `planTier`, sem gating duplicado em pages e APIs.

### Route handlers

- forecast e collections entram em rotas dedicadas sob `app/api/finances/`;
- sponsors entram em rotas dedicadas do time e em uma rota publica de click;
- consulta de plano entra em rota leve do time e o gating premium deve ser aplicado primeiro em rotas sensiveis/admin, nao como paywall de UI apenas.

### App Router e composicao

- `app/(dashboard)/finances/page.tsx` continua client e recebe novos blocos por aba ou secoes locais, sem reescrever a pagina inteira;
- `app/(dashboard)/team/settings/page.tsx` continua sendo a superficie de configuracao e plano do time;
- `app/vitrine/[slug]/page.tsx` continua server component, consumindo sponsors publicos ja prontos, sem mover a pagina inteira para client.

### Escopo congelado

- sem gateway de pagamento;
- sem disparo automatico de cobranca;
- sem dashboard comercial analitico para sponsors;
- sem checkout self-service;
- sem multiplos tiers pagos ativos no backend do MVP.

---

## Sequencia Recomendada de Implementacao

### PR-14 - F-017 Forecast e contratos financeiros

**Objetivo**: entregar a base derivada do forecast e o contrato da cobranca assistida sem tocar a UX principal ainda.

**Arquivos-alvo**:

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/validations/finance.ts`
- `lib/finance-forecast.ts`
- `lib/collections.ts`
- `app/api/finances/forecast/route.ts`
- `app/api/finances/collections/route.ts`

**Saida minima**:

- configuracao financeira minima do time;
- rotas admin para forecast e cobranca assistida;
- risco de inadimplencia e mensagem sugerida derivados de `MembershipPayment`;
- nenhuma alteracao visual na pagina financeira ainda.

**Checklist operacional**:

- usar `pr-14-f-017-forecast-engine-checklist.md` como checklist por arquivo, contrato de payload e smoke test da camada derivada.

### PR-15 - F-017 UI de projecao e cobranca assistida

**Objetivo**: expor o valor do forecast e da cobranca assistida nas superficies admin sem inflar o fluxo historico existente.

**Arquivos-alvo**:

- `app/(dashboard)/finances/page.tsx`
- `app/(dashboard)/team/settings/page.tsx`
- `components/forms/TeamForm.tsx`

**Saida minima**:

- bloco de forecast visivel na pagina financeira;
- lista de jogadores em risco com CTA `Copiar mensagem`;
- configuracao de valor padrao e dia de cobranca no settings do time.

**Checklist operacional**:

- usar `pr-15-f-017-forecast-ui-checklist.md` como checklist por arquivo, estados vazios e smoke test admin.

### PR-16 - F-018 Modelo e APIs de sponsors

**Objetivo**: entregar o dominio de parceiros com tracking minimo, sem tocar ainda a vitrine publica.

**Arquivos-alvo**:

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/validations/team.ts`
- `app/api/teams/[teamId]/sponsors/route.ts`
- `app/api/teams/[teamId]/sponsors/[sponsorId]/route.ts`
- `app/api/vitrine/sponsors/[sponsorId]/click/route.ts`

**Saida minima**:

- modelo `TeamSponsor` com ordem, ativacao e contagem agregada;
- CRUD admin do sponsor;
- rota publica de click com incremento simples e redirecionamento.

**Checklist operacional**:

- usar `pr-16-f-018-sponsors-engine-checklist.md` como checklist por arquivo, contrato de click e smoke test de tracking minimo.

### PR-17 - F-018 UI admin e vitrine publica

**Objetivo**: expor sponsors no dashboard e na vitrine do time sem poluir a pagina publica.

**Arquivos-alvo**:

- `app/(dashboard)/team/settings/page.tsx`
- `components/forms/TeamForm.tsx`
- `app/vitrine/[slug]/page.tsx`

**Saida minima**:

- CRUD simples e preview de sponsors no admin;
- bloco `Parceiros do time` na vitrine com CTA externo;
- densidade visual controlada e fallback quando nao houver sponsors ativos.

**Checklist operacional**:

- usar `pr-17-f-018-sponsors-ui-checklist.md` como checklist por arquivo, UX de configuracao e smoke test da vitrine publica.

### PR-18 - F-019 Entitlements e gating central

**Objetivo**: criar a base comercial e o gating centralizado sem abrir checkout nem espalhar condicionais.

**Arquivos-alvo**:

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/auth.ts`
- `lib/plan-entitlements.ts`
- `lib/validations/team.ts`
- `app/api/teams/[teamId]/plan/route.ts`
- rotas premium de admin da Onda 1 e Onda 4

**Saida minima**:

- `planTier` e `planStatus` no `Team`;
- helper unico de entitlements;
- rota de consulta do plano do time;
- gating aplicado primeiro nas rotas premium mais claras.

**Checklist operacional**:

- usar `pr-18-f-019-plan-engine-checklist.md` como checklist por arquivo, hardening de authz e smoke test de acesso premium.

### PR-19 - F-019 UI de plano e estados bloqueados

**Objetivo**: expor o plano atual, comparativo `Free vs Pro` e bloqueios brandos nas superficies certas.

**Arquivos-alvo**:

- `app/(dashboard)/team/settings/page.tsx`
- `app/(dashboard)/finances/page.tsx`
- `app/(dashboard)/matches/[id]/page.tsx`
- `components/`

**Saida minima**:

- bloco de plano atual com selo `Piloto` quando aplicavel;
- comparativo curto `Free vs Pro`;
- cards de bloqueio brandos em features premium sem quebrar o fluxo base.

**Checklist operacional**:

- usar `pr-19-f-019-plan-ui-checklist.md` como checklist por arquivo, copy de valor e smoke test dos estados bloqueados.

---

## Decisoes Tecnicas que Nao Devem Ser Reabertas

- nao espalhar entitlements pela UI sem helper central;
- nao bloquear fluxos basicos gratuitos por gating prematuro;
- nao acoplar forecast ao resumo financeiro existente como se fosse o mesmo payload;
- nao criar dashboard comercial novo fora de `team/settings` para sponsors e plano no MVP;
- nao abrir checkout, trial automatico ou billing recorrente nesta onda.

---

## Contratos por Camada

### `lib/`

- `finance-forecast` calcula realizado, esperado e risco de caixa a partir de `Transaction`, `MembershipPayment` e configuracao do time;
- `collections` monta a lista de pendencias e a mensagem sugerida por jogador;
- `plan-entitlements` traduz `FREE` e `PRO` em capacidades reutilizaveis por rota e UI.

### `app/api/finances`

- forecast e collections sao apenas admin;
- respostas devem ser explicaveis e resilientes quando faltar configuracao minima;
- ausencia de configuracao retorna estado vazio orientado, nao erro 500.

### `app/api/teams` e `app/api/vitrine`

- sponsors privados sao admin do proprio time;
- a rota publica de click registra tracking minimo sem vazar dados internos;
- consulta de plano pode ser admin-only no MVP para evitar exposicao desnecessaria.

### Paginas admin e publicas

- `finances` mostra valor premium de forma clara sem desmontar o historico existente;
- `team/settings` concentra configuracao de cobranca, sponsors e plano;
- `vitrine/[slug]` apenas consome sponsors ativos e renderiza CTA externo simples.

---

## Criterio de Pronto Para Codar

A Onda 4 pode abrir branch quando estes pontos forem tratados como baseline oficial:

- `f-017-predictive-finance-mini-spec.md` como contrato funcional do forecast e cobranca assistida;
- `f-018-sponsors-showcase-mini-spec.md` como contrato funcional do dominio de sponsors;
- `f-019-pro-plan-mini-spec.md` como contrato funcional do gating e do plano comercial;
- `wave-4-engineering-handoff.md` como sequencia oficial de PRs da Onda 4;
- `pr-14-f-017-forecast-engine-checklist.md` como guia tecnico da base financeira derivada;
- `pr-15-f-017-forecast-ui-checklist.md` como guia tecnico da exposicao admin do forecast;
- `pr-16-f-018-sponsors-engine-checklist.md` como guia tecnico do modelo e APIs de sponsors;
- `pr-17-f-018-sponsors-ui-checklist.md` como guia tecnico da vitrine publica e configuracao admin;
- `pr-18-f-019-plan-engine-checklist.md` como guia tecnico do gating centralizado;
- `pr-19-f-019-plan-ui-checklist.md` como guia tecnico da apresentacao comercial e dos estados bloqueados.