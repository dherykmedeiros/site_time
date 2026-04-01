# Tasks: Roadmap de Crescimento 2026

**Input**: Artefatos de `/specs/004-growth-roadmap/`
**Prerequisites**: spec.md ✅, plan.md ✅

**Tests**: Não incluídos por padrão. Validar cada fase com smoke tests manuais e adicionar testes automatizados quando a execução começar.

**Organization**: Tasks agrupadas por onda de entrega, com detalhamento completo da Onda 1 e backlog estruturado para as ondas seguintes.

## Format: `[ID] [P?] [Wave?] Description`

- **[P]**: Pode rodar em paralelo com outra task sem bloquear a sequência principal.
- **[Wave]**: Onda associada (`W1`, `W2`, `W3`, `W4`).
- Caminhos de arquivo relativos à raiz do repositório.

---

## Phase 1: Descoberta e Preparação da Onda 1

**Purpose**: reduzir risco antes de tocar modelo, APIs e dashboard de jogos.

- [ ] T000 [W1] Usar `specs/004-growth-roadmap/discovery-interview-guide.md` para entrevistar admins e jogadores de times piloto antes de fechar rollout da Onda 1
- [ ] T000A [P] [W1] Executar E-001, E-002 e E-003 de `specs/004-growth-roadmap/experiment-backlog.md` em protótipo ou operação manual antes de ampliar persistência da Onda 1
- [ ] T001 [W1] Validar o escopo funcional de F-011, F-012 e F-013 contra os fluxos atuais de `app/(dashboard)/matches`, `app/api/matches` e `app/api/finances`
- [ ] T001A [W1] Usar `specs/004-growth-roadmap/mvp-cutlines.md` para congelar o que entra e o que fica explicitamente fora do MVP antes de abrir branches de implementação
- [ ] T001B [W1] Usar `specs/004-growth-roadmap/codebase-impact-map.md` para abrir a implementação já nas superfícies corretas e evitar descoberta repetida no começo de cada feature
- [ ] T001C [W1] Usar `specs/004-growth-roadmap/decision-log.md` como fonte única das decisões transversais antes de discutir persistência, automação ou monetização
- [ ] T001D [W1] Usar `specs/004-growth-roadmap/wave-1-contract-freeze.md` como contrato único de schema, API e UI antes de abrir migrations e rotas novas
- [ ] T001E [W1] Usar `specs/004-growth-roadmap/wave-1-engineering-handoff.md` como sequência oficial de PRs e boundaries antes de tocar `prisma/`, `app/api/` e `components/`
- [ ] T001F [W1] Usar `specs/004-growth-roadmap/pr-01-f-011-implementation-checklist.md` como checklist técnico por arquivo antes de abrir a primeira PR da F-011
- [ ] T001G [W1] Usar `specs/004-growth-roadmap/pr-02-f-011-quorum-checklist.md` como checklist técnico por arquivo antes de abrir a segunda PR da F-011
- [ ] T001H [W1] Usar `specs/004-growth-roadmap/pr-03-f-012-lineup-engine-checklist.md` como checklist técnico por arquivo antes de abrir a primeira PR da F-012
- [ ] T001I [W1] Usar `specs/004-growth-roadmap/pr-04-f-012-lineup-ui-checklist.md` como checklist técnico por arquivo antes de abrir a PR de UI da F-012
- [ ] T001J [W1] Usar `specs/004-growth-roadmap/pr-05-f-013-bordereau-operations-checklist.md` como checklist técnico por arquivo antes de abrir a primeira PR da F-013
- [ ] T001K [W1] Usar `specs/004-growth-roadmap/pr-06-f-013-match-expenses-checklist.md` como checklist técnico por arquivo antes de abrir a segunda PR da F-013
- [ ] T001L [W1] Usar `specs/004-growth-roadmap/pr-07-wave-1-hardening-pilot-checklist.md` como checklist técnico antes de abrir a PR final de hardening e piloto da Onda 1
- [ ] T002 [P] [W1] Definir as regras heurísticas mínimas da sugestão de escalação (posição principal, limites por posição, ordem por RSVP confirmado, fallback por excesso/falta de posição) em `specs/004-growth-roadmap/f-012-lineup-heuristics-mini-spec.md`
- [ ] T003 [P] [W1] Definir o modelo operacional do borderô: checklist padrão, presença real, despesas do jogo e regra de rateio opcional em `specs/004-growth-roadmap/f-013-bordereau-mini-spec.md`

**Checkpoint**: critérios de produto e decisões de dados da Onda 1 estão fechados o suficiente para implementação.

---

## Phase 2: Onda 1 — F-011 Central de Disponibilidade Recorrente

**Goal**: o admin consegue prever quorum e gargalos de posição antes de confirmar a partida.

**Independent Test**: cadastrar preferências recorrentes de jogadores, abrir criação/edição de partida e visualizar termômetro de quorum com alertas simples por posição.

### Data Model e Validação

- [ ] T004 [W1] Adicionar modelo Prisma para disponibilidade recorrente do jogador em `prisma/schema.prisma` com campos para dia da semana, janela de horário, frequência e observações opcionais
- [ ] T005 [W1] Criar migration Prisma para a nova estrutura de disponibilidade recorrente em `prisma/migrations/`
- [ ] T006 [P] [W1] Criar schemas Zod para CRUD da disponibilidade recorrente em `lib/validations/player.ts` ou `lib/validations/player-availability.ts`

### API e Regras de Negócio

- [ ] T007 [W1] Implementar endpoints de leitura e atualização da disponibilidade recorrente do jogador em `app/api/players/me/availability/route.ts`
- [ ] T008 [P] [W1] Implementar endpoint admin para consultar disponibilidade prevista por partida/data em `app/api/matches/availability/route.ts`
- [ ] T009 [W1] Criar agregador de quorum e risco por posição reutilizável em `lib/` usando elenco ativo, posição principal e preferências recorrentes

### UI e Integração

- [ ] T010 [W1] Adicionar seção de disponibilidade recorrente ao perfil do jogador em `components/forms/PlayerSelfProfileForm.tsx` e integrar com `app/(dashboard)/squad/page.tsx`
- [ ] T011 [W1] Expandir `components/forms/MatchForm.tsx` para consultar previsão de quorum ao alterar data/horário e exibir termômetro simples antes do submit
- [ ] T012 [P] [W1] Atualizar `app/(dashboard)/matches/page.tsx` e `app/(dashboard)/matches/[id]/page.tsx` para mostrar sinalização resumida de risco de elenco quando disponível

**Checkpoint**: criação de partida deixa de ser cega; o admin enxerga risco provável antes de agendar.

---

## Phase 3: Onda 1 — F-012 Escalação Inteligente e Banco Sugerido

**Goal**: o sistema sugere uma escalação explicável com base no elenco confirmado e nos limites por posição já existentes.

**Independent Test**: abrir uma partida com jogadores confirmados e receber uma escalação sugerida + banco, com indicação dos desequilíbrios do elenco.

### Motor de Sugestão

- [ ] T013 [W1] Criar módulo de sugestão de escalação em `lib/` que use `Player.position`, RSVPs confirmados e `MatchPositionLimit`
- [ ] T014 [P] [W1] Definir payload de resposta da sugestão em `lib/validations/match.ts` incluindo titulares, banco e alertas de desequilíbrio
- [ ] T015 [W1] Implementar endpoint de sugestão para uma partida em `app/api/matches/[id]/lineup/route.ts`

### UX Admin e Recalculo Efemero

- [ ] T016 [W1] Manter a escalação sugerida sem persistência no MVP, validando o contrato congelado em `specs/004-growth-roadmap/wave-1-contract-freeze.md`
- [ ] T017 [W1] Expor ação de recalcular sugestão por nova leitura do endpoint `app/api/matches/[id]/lineup/route.ts`, sem preservar travas manuais entre refreshs
- [ ] T018 [W1] Adicionar card de “Escalação sugerida” em `app/(dashboard)/matches/[id]/page.tsx` com titulares, banco, alertas e CTA de recalcular
- [ ] T019 [P] [W1] Criar componente visual reutilizável para lista posicional da escalação em `components/dashboard/` ou `components/ui/`

### Compartilhamento

- [ ] T020 [W1] Gerar versão simples de compartilhamento/export da escalação dentro de `app/(dashboard)/matches/[id]/page.tsx` usando texto formatado ou card estático inicial

**Checkpoint**: a montagem do time fica assistida e explicável, sem depender de decisão manual do zero.

---

## Phase 4: Onda 1 — F-013 Borderô do Jogo

**Goal**: concentrar no produto a rotina operacional do dia do jogo e seus custos reais.

**Independent Test**: abrir uma partida agendada, registrar checklist, presença real no local, despesas do jogo e rateio opcional com reflexo no módulo financeiro.

### Data Model e Contratos

- [ ] T021 [W1] Adicionar modelos Prisma para checklist do jogo, check-in de presença real e despesas/eventos do match em `prisma/schema.prisma`
- [ ] T022 [W1] Criar migration Prisma correspondente em `prisma/migrations/`
- [ ] T023 [P] [W1] Criar schemas Zod do borderô em `lib/validations/match.ts` ou `lib/validations/finance.ts` para checklist, check-in e despesas do jogo

### Backend e Integração Financeira

- [ ] T024 [W1] Implementar API de borderô da partida em `app/api/matches/[id]/bordereau/route.ts` para GET e PATCH do checklist/check-in
- [ ] T025 [W1] Implementar criação de despesas vinculadas à partida com integração em `app/api/finances/route.ts` ou rota dedicada `app/api/matches/[id]/expenses/route.ts`
- [ ] T026 [P] [W1] Adicionar relação explícita entre transação e partida no `prisma/schema.prisma` se a rastreabilidade financeira por jogo for necessária desde o MVP
- [ ] T027 [W1] Implementar estratégia de rateio inicial já congelada no mini-spec: apenas sugestão de valores por presentes, sem geração automática de pendências por jogador

### UI Operacional

- [ ] T028 [W1] Adicionar seção “Borderô” em `app/(dashboard)/matches/[id]/page.tsx` com checklist editável e check-in manual dos presentes
- [ ] T029 [P] [W1] Criar formulário de despesa do jogo reutilizando padrões de `components/forms/TransactionForm.tsx`
- [ ] T030 [W1] Atualizar `app/(dashboard)/finances/page.tsx` para destacar transações ligadas a partidas quando existirem

**Checkpoint**: o admin fecha a operação do jogo sem sair da plataforma.

---

## Phase 5: Hardening da Onda 1

**Purpose**: consolidar UX, estados vazios, mensagens e segurança básica antes de avançar para retenção e rede.

- [ ] T031 [W1] Revisar permissões de admin/jogador nas novas rotas de disponibilidade, escalação e borderô usando `requireAdmin` e `requireAuth`
- [ ] T032 [P] [W1] Adicionar loading/error states nas telas afetadas: `app/(dashboard)/matches/page.tsx`, `app/(dashboard)/matches/[id]/page.tsx`, `components/forms/MatchForm.tsx`, `components/forms/PlayerSelfProfileForm.tsx`
- [ ] T033 [P] [W1] Executar smoke test manual dos fluxos: atualizar disponibilidade, criar partida, recalcular escalação, registrar borderô, lançar despesa e validar reflexo em finanças
- [ ] T033A [P] [W1] Usar `specs/004-growth-roadmap/wave-1-acceptance-matrix.md` como criterio unico de aceite e smoke test antes do piloto
- [ ] T034 [W1] Atualizar documentação operacional curta em `specs/004-growth-roadmap/plan.md` ou `quickstart` futuro com os novos fluxos da Onda 1
- [ ] T034A [P] [W1] Usar `specs/004-growth-roadmap/f-011-availability-mini-spec.md` como fonte congelada para modelagem, API e UX da F-011

**Checkpoint**: Onda 1 pronta para implementação controlada ou entrega incremental.

---

## Phase 6: Backlog Preparado — Onda 2

**Purpose**: deixar a retenção pronta para detalhamento quando a Onda 1 estiver estabilizada.

- [ ] T034B [P] [W2] Rodar E-004 de `specs/004-growth-roadmap/experiment-backlog.md` com jogadores de times piloto antes de ampliar o escopo do recap
- [ ] T035 [W2] Usar `specs/004-growth-roadmap/f-014-recap-mini-spec.md` como contrato congelado para payload, OG routes e CTAs do recap individual e coletivo
- [ ] T035A [W2] Usar `specs/004-growth-roadmap/wave-2-engineering-handoff.md` como sequência oficial de PRs e boundaries entre `lib/`, `app/api/og` e superfícies públicas/admin
- [ ] T035B [W2] Usar `specs/004-growth-roadmap/pr-08-f-014-recap-engine-checklist.md` como checklist técnico da primeira PR da F-014 antes de abrir branch
- [ ] T035C [W2] Usar `specs/004-growth-roadmap/pr-09-f-014-recap-ui-checklist.md` como checklist técnico da segunda PR da F-014 antes de tocar páginas públicas e dashboard
- [ ] T036 [P] [W2] Implementar agregadores reutilizaveis de recap em `lib/player-recap.ts` e `lib/team-recap.ts` usando `MatchStats`, `Achievement` e `Team`
- [ ] T037 [W2] Criar rotas OG `app/api/og/player-recap/[playerId]/route.tsx` e `app/api/og/team-recap/[matchId]/route.tsx` com fallback tolerante para pouca estatistica
- [ ] T037A [P] [W2] Adicionar CTAs de compartilhamento em `app/vitrine/[slug]/jogadores/[id]/page.tsx` e `app/(dashboard)/matches/[id]/page.tsx`

---

## Phase 7: Backlog Preparado — Onda 3

**Purpose**: preparar a camada de rede entre times sem abrir diretório vazio.

- [ ] T037B [P] [W3] Rodar E-005 e E-006 de `specs/004-growth-roadmap/experiment-backlog.md` com onboarding manual antes de abrir descoberta ampla
- [ ] T037C [W3] Usar `specs/004-growth-roadmap/wave-3-engineering-handoff.md` como sequencia oficial de PRs e boundaries entre discovery publica, vitrine e CRM admin
- [ ] T038 [W3] Usar `specs/004-growth-roadmap/f-015-open-schedule-directory-mini-spec.md` como contrato de modelagem para opt-in publico, enriquecimento de descoberta e `OpenMatchSlot`
- [ ] T038A [W3] Usar `specs/004-growth-roadmap/pr-10-f-015-discovery-engine-checklist.md` como checklist tecnico da primeira PR da F-015 antes de abrir branch
- [ ] T039 [P] [W3] Evoluir `app/vitrine/page.tsx` e `app/vitrine/[slug]/page.tsx` para diretorio filtravel com selo de agenda aberta e CTA de amistoso contextualizado
- [ ] T039A [P] [W3] Usar `specs/004-growth-roadmap/pr-11-f-015-directory-ui-checklist.md` como checklist tecnico da segunda PR da F-015 antes de tocar as superficies publicas e admin
- [ ] T040 [W3] Usar `specs/004-growth-roadmap/f-016-opponent-crm-mini-spec.md` como contrato para `OpponentProfile`, timeline de interacoes e review pos-jogo
- [ ] T040B [W3] Usar `specs/004-growth-roadmap/pr-12-f-016-opponent-engine-checklist.md` como checklist tecnico da primeira PR da F-016 antes de abrir hooks no fluxo de amistosos
- [ ] T040A [P] [W3] Integrar hooks de CRM nos fluxos atuais de `app/api/friendly-requests/route.ts`, `app/api/friendly-requests/[id]/route.ts` e fechamento de amistosos
- [ ] T040C [P] [W3] Usar `specs/004-growth-roadmap/pr-13-f-016-opponent-ui-checklist.md` como checklist tecnico da segunda PR da F-016 antes de tocar dashboard e review pos-jogo

---

## Phase 8: Backlog Preparado — Onda 4

**Purpose**: preparar monetização somente após comprovar valor operacional e crescimento orgânico.

- [ ] T040B [P] [W4] Rodar E-007, E-008 e E-009 de `specs/004-growth-roadmap/experiment-backlog.md` antes de qualquer release comercial ou gating pago amplo
- [ ] T041 [W4] Usar `specs/004-growth-roadmap/f-017-predictive-finance-mini-spec.md` como contrato para forecast mensal, risco de inadimplencia e cobranca assistida
- [ ] T041A [W4] Usar `specs/004-growth-roadmap/wave-4-engineering-handoff.md` como sequencia oficial de PRs e boundaries entre forecast, sponsors e gating comercial
- [ ] T041B [W4] Usar `specs/004-growth-roadmap/pr-14-f-017-forecast-engine-checklist.md` como checklist tecnico da primeira PR da F-017 antes de abrir branch
- [ ] T042 [P] [W4] Evoluir `app/(dashboard)/finances/page.tsx` e `app/api/finances/summary/route.ts` para suportar camada de projeção e lista de pendencias do mes
- [ ] T042A [P] [W4] Usar `specs/004-growth-roadmap/pr-15-f-017-forecast-ui-checklist.md` como checklist tecnico da segunda PR da F-017 antes de tocar `finances` e `team/settings`
- [ ] T043 [W4] Usar `specs/004-growth-roadmap/f-018-sponsors-showcase-mini-spec.md` como contrato para `TeamSponsor`, tracking minimo de clique e bloco publico de parceiros na vitrine
- [ ] T043C [W4] Usar `specs/004-growth-roadmap/pr-16-f-018-sponsors-engine-checklist.md` como checklist tecnico da primeira PR da F-018 antes de abrir branch
- [ ] T043D [P] [W4] Usar `specs/004-growth-roadmap/pr-17-f-018-sponsors-ui-checklist.md` como checklist tecnico da segunda PR da F-018 antes de tocar `team/settings` e `app/vitrine/[slug]/page.tsx`
- [ ] T043A [P] [W4] Usar `specs/004-growth-roadmap/f-019-pro-plan-mini-spec.md` como contrato para `planTier`, entitlements centralizados e gating manual por time
- [ ] T043E [W4] Usar `specs/004-growth-roadmap/pr-18-f-019-plan-engine-checklist.md` como checklist tecnico da primeira PR da F-019 antes de abrir branch
- [ ] T043F [P] [W4] Usar `specs/004-growth-roadmap/pr-19-f-019-plan-ui-checklist.md` como checklist tecnico da segunda PR da F-019 antes de tocar estados bloqueados e comparativo comercial
- [ ] T043B [P] [W4] Validar `specs/004-growth-roadmap/priority-scorecard.md` e `specs/004-growth-roadmap/metrics-and-rollout.md` antes de abrir qualquer checkout, billing self-service ou trial automatizado

---

## Phase 9: Medição e Rollout

**Purpose**: impedir que a execução do roadmap avance sem baseline, critérios de sucesso e gates de abertura por onda.

- [ ] T044 [W1] Usar `specs/004-growth-roadmap/metrics-and-rollout.md` como contrato de métricas, gates e instrumentação mínima antes de iniciar piloto
- [ ] T045 [P] [W1] Preencher `specs/004-growth-roadmap/wave-1-rollout-checklist.md` com owners, times piloto e baseline das 4 semanas anteriores ao build
- [ ] T046 [P] [W2] Revisar os eventos leves realmente necessários antes de adicionar qualquer telemetria persistida no banco
- [ ] T047 [W3] Validar gates de abertura das ondas 3 e 4 usando `specs/004-growth-roadmap/priority-scorecard.md` e os sinais capturados no piloto
- [ ] T048 [W1] Revalidar a cada início de onda o corte definido em `specs/004-growth-roadmap/mvp-cutlines.md` antes de expandir persistência, automação ou monetização

---

## Phase 10: Governança Técnica do Roadmap

**Purpose**: impedir retrabalho estrutural, migrations grandes demais e avanço de onda fora de sequência.

- [ ] T049 [W1] Usar `specs/004-growth-roadmap/technical-staging-plan.md` para sequenciar migrations e contratos por feature antes de abrir implementação
- [ ] T049A [W1] Usar `specs/004-growth-roadmap/execution-board.md` como fila mestra de PRs e gates antes de planejar sprint ou paralelismo
- [ ] T049B [W1] Usar `specs/004-growth-roadmap/operating-rhythm.md` para rodar a execucao semanal com papeis, cerimonias e criterios de avanço explícitos
- [ ] T050 [P] [W1] Revisar `specs/004-growth-roadmap/risk-register.md` no início de cada sprint da onda corrente e marcar riscos em estado amarelo/vermelho
- [ ] T051 [P] [W2] Validar que F-014 continua derivada de dados existentes antes de introduzir qualquer persistência nova só para recap
- [ ] T052 [P] [W3] Confirmar opt-in e densidade mínima de times/slots antes de abrir diretório público mais amplo
- [ ] T053 [W4] Bloquear desenho de billing complexo até F-017 provar valor operacional e confiança suficiente no forecast

---

## Dependencies & Execution Order

### Fase a Fase

- `implementation-readiness-review.md` deve ser lido antes de abrir a primeira branch da Onda 1.
- `wave-1-engineering-handoff.md` deve guiar a sequência de PRs da Onda 1 para evitar misturar schema, API e UI no mesmo passo.
- `pr-01-f-011-implementation-checklist.md` deve guiar a primeira PR da F-011 no nível de arquivo, contrato e smoke test.
- `pr-02-f-011-quorum-checklist.md` deve guiar a segunda PR da F-011 no nível de agregador, rota admin, integração do formulário e smoke test.
- `pr-03-f-012-lineup-engine-checklist.md` deve guiar a primeira PR da F-012 no nível de heurística, rota derivada e corte contra persistência.
- `pr-04-f-012-lineup-ui-checklist.md` deve guiar a PR de UI da F-012 no nível de fetch dedicado, estados de interface e ação de recalcular.
- `pr-05-f-013-bordereau-operations-checklist.md` deve guiar a primeira PR da F-013 no nível de schema, rota dedicada, presença real e bloco operacional.
- `pr-06-f-013-match-expenses-checklist.md` deve guiar a segunda PR da F-013 no nível de vínculo financeiro, despesa por partida e resumo derivado de custo.
- `pr-07-wave-1-hardening-pilot-checklist.md` deve guiar a PR final da Onda 1 no nível de permissão, estados vazios, smoke test e readiness de rollout.
- `wave-2-engineering-handoff.md` deve guiar a sequência de PRs da Onda 2 para evitar misturar agregação derivada, renderização OG e CTAs nas páginas.
- `pr-08-f-014-recap-engine-checklist.md` deve guiar a primeira PR da F-014 no nível de agregadores e rotas OG.
- `pr-09-f-014-recap-ui-checklist.md` deve guiar a segunda PR da F-014 no nível de integração nas superfícies públicas e admin.
- `wave-3-engineering-handoff.md` deve guiar a sequência de PRs da Onda 3 para evitar misturar schema, discovery publica, hooks do CRM e UI admin no mesmo passo.
- `pr-10-f-015-discovery-engine-checklist.md` deve guiar a primeira PR da F-015 no nível de schema, payload de discovery e rotas dedicadas.
- `pr-11-f-015-directory-ui-checklist.md` deve guiar a segunda PR da F-015 no nível de filtros, vitrine do time e configuracao admin.
- `pr-12-f-016-opponent-engine-checklist.md` deve guiar a primeira PR da F-016 no nível de modelos do CRM, normalizacao, score e hooks nas rotas de amistoso.
- `pr-13-f-016-opponent-ui-checklist.md` deve guiar a segunda PR da F-016 no nível de lista admin, detalhe do adversario e review pos-jogo.
- `wave-4-engineering-handoff.md` deve guiar a sequência de PRs da Onda 4 para evitar misturar forecast, vitrine comercial e gating de plano no mesmo passo.
- `pr-14-f-017-forecast-engine-checklist.md` deve guiar a primeira PR da F-017 no nível de modelagem mínima, forecast e collections admin.
- `pr-15-f-017-forecast-ui-checklist.md` deve guiar a segunda PR da F-017 no nível de configuração do time, projeção e cobrança assistida na UI.
- `pr-16-f-018-sponsors-engine-checklist.md` deve guiar a primeira PR da F-018 no nível de modelo, CRUD admin e tracking mínimo de sponsors.
- `pr-17-f-018-sponsors-ui-checklist.md` deve guiar a segunda PR da F-018 no nível de surfaces admin e vitrine pública.
- `pr-18-f-019-plan-engine-checklist.md` deve guiar a primeira PR da F-019 no nível de entitlements, authz e gating backend.
- `pr-19-f-019-plan-ui-checklist.md` deve guiar a segunda PR da F-019 no nível de comparativo comercial e estados bloqueados brandos.
- `wave-1-acceptance-matrix.md` deve ser usado como criterio unico de QA manual antes do piloto da Onda 1.
- `operating-rhythm.md` deve guiar a cadencia semanal, os donos por papel e os pontos obrigatorios de decisao durante toda a execucao.
- Phase 1 desbloqueia as decisões de produto e dados da Onda 1.
- Phase 2 precisa estar funcional antes da integração do termômetro no formulário de partida.
- Phase 3 depende do resultado da disponibilidade recorrente para enriquecer a sugestão de escalação.
- Phase 4 depende do fluxo atual de partidas e se integra com finanças, mas pode começar em paralelo ao fim da Phase 3 se o modelo de dados já estiver decidido.
- Phase 5 depende das três features da Onda 1 estarem navegáveis.
- Phases 6, 7 e 8 são backlog preparado; não bloqueiam a execução da Onda 1.

### Cadeia principal

```text
Phase 1 → F-011 Disponibilidade → F-012 Escalação sugerida → F-013 Borderô → Hardening
```

### Paralelismo recomendado

- T002 e T003 podem rodar em paralelo.
- T006 e T008 podem rodar em paralelo depois da modelagem de disponibilidade.
- T014 e T016 podem ser executadas em paralelo, desde que a decisão de persistência esteja clara.
- T023 e T026 podem rodar em paralelo após a definição final do escopo financeiro do borderô.
- T032 e T033 podem rodar em paralelo como fechamento da Onda 1.

---

## Suggested Execution Strategy

### Entrega incremental mais segura

1. Fechar F-011 primeiro e colocar o termômetro de quorum visível no `MatchForm`.
2. Em seguida, liberar F-012 apenas na página de detalhe da partida, com heurística explicável e sem promessa de automação total.
3. Por último, integrar F-013 com despesas do jogo e rastreabilidade mínima no financeiro.
4. Usar `specs/004-growth-roadmap/wave-1-sprint-plan.md` como cadência oficial de Sprint 0 a Sprint 4 para evitar mistura prematura de escopos.
5. Usar `specs/004-growth-roadmap/wave-1-contract-freeze.md` como trava única contra novas migrations ou endpoints fora do corte da Onda 1.
6. Ao abrir a Onda 2, usar `specs/004-growth-roadmap/wave-2-engineering-handoff.md` para separar a feature em PR-08 base derivada/OG e PR-09 integração de superfície.
7. Ao abrir a Onda 3, usar `specs/004-growth-roadmap/wave-3-engineering-handoff.md` para separar a F-015 em PR-10 e PR-11, e a F-016 em PR-12 e PR-13.
8. Ao abrir a Onda 4, usar `specs/004-growth-roadmap/wave-4-engineering-handoff.md` para separar F-017 em PR-14 e PR-15, F-018 em PR-16 e PR-17, e F-019 em PR-18 e PR-19.

### Marco de validação de produto

1. O admin consulta o termômetro antes de agendar.
2. O admin recebe escalação sugerida útil em partidas com RSVP suficiente.
3. O admin fecha presença real e custos do jogo sem sair do dashboard.

### Próximo artefato após este arquivo

- Se a execução começar já: usar `f-011-availability-mini-spec.md` como contrato técnico inicial da feature.
- Na primeira PR da execução: usar `pr-01-f-011-implementation-checklist.md` como guia tático de schema, rota e validação.
- Na segunda PR da F-011: usar `pr-02-f-011-quorum-checklist.md` como guia tático de forecast derivado, rota admin e integração no formulário.
- Na primeira PR da F-012: usar `pr-03-f-012-lineup-engine-checklist.md` como guia tático de motor, endpoint e smoke test.
- Na PR de UI da F-012: usar `pr-04-f-012-lineup-ui-checklist.md` como guia tático de apresentação, recálculo e estados locais.
- Na primeira PR da F-013: usar `pr-05-f-013-bordereau-operations-checklist.md` como guia tático de checklist, presença real, rota dedicada e smoke test.
- Na segunda PR da F-013: usar `pr-06-f-013-match-expenses-checklist.md` como guia tático de `Transaction.matchId`, despesa vinculada, resumo financeiro e smoke test.
- Na PR final da Onda 1: usar `pr-07-wave-1-hardening-pilot-checklist.md` como guia tático de permissões, QA manual, rollout e piloto.
- Se a prioridade for refinar decisão antes de construir: revisar T002, T003, T016 e T027 como pontos de ambiguidade restantes.