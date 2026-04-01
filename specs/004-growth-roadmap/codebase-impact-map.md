# Mapa de Impacto na Codebase - Roadmap de Crescimento 2026

**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Objetivo**: mapear, por feature, as superficies do repositorio que provavelmente serao alteradas para reduzir descoberta repetida no inicio da implementacao.

---

## Como Usar

- usar este arquivo antes de abrir uma branch de implementacao;
- tratar os caminhos como ponto de partida, nao como lista exaustiva;
- priorizar mudancas perto da responsabilidade real ja existente;
- evitar criar modulo novo se a regra couber de forma coesa na superficie atual.

---

## Onda 1 - Operacao Proativa

### F-011 Disponibilidade recorrente

**Modelagem e persistencia**

- `prisma/schema.prisma`
- `prisma/migrations/`

**Validacao e dominio**

- `lib/validations/player.ts`
- `lib/validations/match.ts`
- `lib/` com modulo novo sugerido `player-availability.ts`

**API**

- `app/api/players/me/route.ts` como referencia de sessao/jogador vinculado
- `app/api/matches/route.ts` como referencia de criacao e listagem
- rota nova sugerida `app/api/players/me/availability/route.ts`
- rota nova sugerida `app/api/matches/availability/route.ts`

**UI**

- `components/forms/PlayerSelfProfileForm.tsx`
- `components/forms/MatchForm.tsx`
- `app/(dashboard)/matches/page.tsx`
- `app/(dashboard)/squad/page.tsx`

**Dependencias ja existentes**

- `Player.position`
- `RSVP`
- `MatchPositionLimit`

### F-012 Escalacao inteligente

**Dominio e heuristica**

- `lib/player-positions.ts`
- `lib/validations/match.ts`
- modulo novo sugerido `lib/match-lineup.ts`

**API**

- `app/api/matches/[id]/route.ts` como referencia do payload detalhado da partida
- `app/api/matches/[id]/rsvp/route.ts` como referencia das regras de confirmacao por posicao
- rota nova sugerida `app/api/matches/[id]/lineup/route.ts`

**UI**

- `app/(dashboard)/matches/[id]/page.tsx`
- `components/dashboard/` para card ou lista visual reutilizavel

**Dependencias ja existentes**

- `RSVP.status`
- `MatchPositionLimit`
- `Player.position`

### F-013 Bordero do jogo

**Modelagem e persistencia**

- `prisma/schema.prisma`
- `prisma/migrations/`

**Validacao e dominio**

- `lib/validations/match.ts`
- `lib/validations/finance.ts`

**API**

- `app/api/matches/[id]/route.ts`
- `app/api/finances/route.ts`
- rota nova sugerida `app/api/matches/[id]/bordereau/route.ts`
- rota nova sugerida `app/api/matches/[id]/expenses/route.ts`

**UI**

- `app/(dashboard)/matches/[id]/page.tsx`
- `components/forms/TransactionForm.tsx`
- `app/(dashboard)/finances/page.tsx`

**Dependencias ja existentes**

- `Transaction`
- `Match`
- `RSVP`

---

## Onda 2 - Loop do Jogador

### F-014 Recap compartilhavel

**Dominio e agregacao**

- `lib/achievements.ts`
- modulo novo sugerido `lib/player-recap.ts`
- modulo novo sugerido `lib/team-recap.ts`

**API e geracao de imagem**

- `app/api/og/`
- rota nova sugerida `app/api/og/player-recap/[playerId]/route.tsx`
- rota nova sugerida `app/api/og/team-recap/[matchId]/route.tsx`

**UI publica e dashboard**

- `app/vitrine/[slug]/jogadores/[id]/page.tsx`
- `app/vitrine/[slug]/matches/[id]/page.tsx`
- `app/(dashboard)/matches/[id]/page.tsx`

**Dependencias ja existentes**

- `MatchStats`
- `Achievement`
- paginas publicas da vitrine

---

## Onda 3 - Rede Entre Times

### F-015 Agenda aberta e diretorio

**Modelagem e persistencia**

- `prisma/schema.prisma`
- `prisma/migrations/`

**API**

- `app/api/friendly-requests/route.ts`
- `app/api/friendly-requests/[id]/route.ts`
- rotas novas sugeridas em `app/api/teams/` ou `app/api/vitrine/` para agenda aberta

**UI publica**

- `app/vitrine/page.tsx`
- `app/vitrine/[slug]/page.tsx`
- componente de formulario publico atual `app/vitrine/[slug]/FriendlyRequestForm.tsx`

**Dependencias ja existentes**

- `FriendlyRequest`
- `Team.slug`
- vitrine publica

### F-016 CRM de adversarios

**Modelagem e persistencia**

- `prisma/schema.prisma`
- `prisma/migrations/`

**API**

- `app/api/friendly-requests/route.ts`
- `app/api/friendly-requests/[id]/route.ts`
- possivel rota nova em `app/api/opponents/`

**UI**

- `app/(dashboard)/friendly-requests/`
- possivel pagina nova em `app/(dashboard)/team/` ou `app/(dashboard)/friendly-requests/`

**Dependencias ja existentes**

- fluxo de aprovacao/rejeicao de amistoso
- `Match.opponent`
- historico de partidas e solicitacoes

---

## Onda 4 - Monetizacao

### F-017 Financeiro preditivo

**Dominio e previsao**

- modulo novo sugerido `lib/finance-forecast.ts`
- `lib/validations/finance.ts`

**API**

- `app/api/finances/route.ts`
- `app/api/finances/summary/route.ts`
- rotas novas sugeridas `app/api/finances/forecast/route.ts` e `app/api/finances/collections/route.ts`

**UI**

- `app/(dashboard)/finances/page.tsx`
- `components/dashboard/StatsCard.tsx` se a pagina usar cards resumidos

**Dependencias ja existentes**

- `Transaction`
- `MembershipPayment`
- resumo mensal do financeiro

### F-018 Vitrine de parceiros

**Modelagem e persistencia**

- `prisma/schema.prisma`
- `prisma/migrations/`

**UI publica**

- `app/vitrine/[slug]/page.tsx`

**Dependencias ja existentes**

- identidade visual do time
- vitrine publica

### F-019 Plano Pro em camadas

**Modelagem e gating**

- `prisma/schema.prisma`
- `lib/auth.ts`
- possivel camada nova em `lib/plan-entitlements.ts`

**UI**

- `app/(dashboard)/team/`
- possivel pagina de billing ou configuracao comercial futura

**Dependencias ja existentes**

- nenhuma infraestrutura de billing aparente hoje
- depende de valor comprovado das ondas anteriores

---

## Riscos de Acoplamento por Superficie

### Partidas

`app/api/matches/[id]/route.ts` e `app/(dashboard)/matches/[id]/page.tsx` devem concentrar varias features da Onda 1. Existe risco de sobrecarregar o detalhe da partida com logicas demais. O ideal e manter motores de dominio em `lib/` e deixar a pagina como orquestradora.

### Financeiro

`app/api/finances/route.ts` e `app/(dashboard)/finances/page.tsx` ja servem a operacao atual. F-013 e F-017 devem reutilizar o modulo sem transformar o fluxo base em algo confuso para quem so precisa registrar transacoes simples.

### Vitrine

`app/vitrine/[slug]/page.tsx` ja concentra estatisticas, elenco, identidade visual e amistoso. F-014, F-015 e F-018 precisam preservar legibilidade e nao transformar a pagina em um mural pesado.

---

## Regra de Implementacao

Se uma feature exigir alteracao simultanea em `prisma`, `app/api`, `app/(dashboard)` e `app/vitrine`, quebrar o trabalho em subfases e validar primeiro a menor entrega que gere valor duravel.