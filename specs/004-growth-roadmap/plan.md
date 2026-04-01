# Plano de Execução — Roadmap de Crescimento 2026

**Branch**: `004-growth-roadmap`  
**Date**: 2026-04-01  
**Input**: [spec.md](spec.md)

## Resumo

O roadmap será executado em quatro ondas. A lógica é simples:

1. primeiro, resolver dores semanais do admin;
2. depois, aumentar retorno e compartilhamento do jogador;
3. em seguida, criar efeito de rede entre times;
4. por fim, monetizar em cima de eficiência e visibilidade já percebidas.

## Objetivos por Trimestre

### Q2 2026 — Operação mais previsível

- reduzir improviso na montagem do elenco;
- centralizar rotina do dia do jogo;
- usar dados já existentes para sugerir decisões.

### Q3 2026 — Retenção e crescimento orgânico

- transformar jogadores em usuários recorrentes;
- aumentar compartilhamento de ativos públicos;
- melhorar descoberta de times e amistosos.

### Q4 2026 — Receita e expansão da rede

- ativar monetização em camadas;
- oferecer visibilidade para times e parceiros;
- consolidar a plataforma como canal de relacionamento entre equipes.

## Ondas de Entrega

### Onda 1 — Coordenação Inteligente

**Itens**:

- F-011 Central de disponibilidade recorrente
- F-012 Escalação inteligente e banco sugerido
- F-013 Borderô do jogo

**Resultado esperado**:

- admin marca partidas com mais confiança;
- menos faltas críticas por posição;
- menos controles paralelos fora da plataforma.

**Dependências**:

- reutilizar jogadores, posições, limites por posição, RSVP e financeiro já existentes;
- adicionar novos modelos apenas se necessário para disponibilidade e checklist.

**Critério de sucesso**:

- aumento de RSVP antecipado;
- queda em partidas com baixa confirmação;
- adoção semanal do fluxo de jogo pelo admin.

### Onda 2 — Loop do Jogador

**Itens**:

- F-014 Recap compartilhável do jogador e da rodada

**Resultado esperado**:

- mais visitas em perfis públicos;
- mais sessões de jogadores fora do dia da partida;
- crescimento orgânico via compartilhamento.

**Dependências**:

- reaproveitar perfis públicos, achievements e infraestrutura de cards OG.

**Critério de sucesso**:

- aumento de compartilhamentos por partida e por jogador;
- crescimento de retorno semanal dos atletas.

### Onda 3 — Rede Entre Times

**Itens**:

- F-015 Agenda aberta e diretório geográfico
- F-016 CRM de adversários e reputação

**Resultado esperado**:

- mais amistosos iniciados pela plataforma;
- menor dependência de networking manual no WhatsApp;
- melhor qualidade dos adversários recorrentes.

**Dependências**:

- evoluir a vitrine pública;
- adicionar campos de descoberta e reputação para times e adversários.

**Critério de sucesso**:

- número de solicitações originadas no diretório;
- taxa de resposta e conversão em amistoso;
- recorrência entre times com boa reputação.

### Onda 4 — Monetização

**Itens**:

- F-017 Financeiro preditivo e cobrança assistida
- F-018 Vitrine de parceiros e patrocinadores
- F-019 Plano Pro em camadas

**Resultado esperado**:

- percepção clara de valor premium;
- maior organização financeira do time;
- primeira linha de receita recorrente do produto.

**Dependências**:

- amadurecer o valor das ondas anteriores antes de cobrar;
- definir regras simples de feature gating.

**Critério de sucesso**:

- times interessados em upgrade;
- retenção maior no segmento mais organizado;
- uso recorrente dos módulos premium.

## Ordem Recomendada de Implementação

| Ordem | Feature | Motivo |
|---|---|---|
| 1 | F-011 Disponibilidade recorrente | Maior ganho operacional com dados já disponíveis |
| 2 | F-012 Escalação inteligente | Aproveita imediatamente a base da F-011 |
| 3 | F-013 Borderô do jogo | Fecha a rotina operacional semanal |
| 4 | F-014 Recap compartilhável | Ativa retenção e viralização sem grande dívida técnica |
| 5 | F-015 Agenda aberta e diretório | Começa o efeito de rede |
| 6 | F-016 CRM de adversários | Aumenta qualidade e confiança da rede |
| 7 | F-017 Financeiro preditivo | Forte alavanca de monetização e valor admin |
| 8 | F-018 Vitrine de parceiros | Valor econômico para o time |
| 9 | F-019 Plano Pro | Deve entrar quando a percepção de valor já estiver comprovada |

## Riscos

- tentar abrir rede entre times antes de consolidar critérios de qualidade pode gerar diretório vazio ou ruído;
- monetizar cedo demais pode enfraquecer a adoção orgânica;
- funcionalidades “inteligentes” precisam ser explicáveis para não perder confiança do admin;
- ampliar demais o escopo do financeiro pode atrasar entregas mais visíveis.

## Recomendações Práticas

1. Tratar a Onda 1 como prioridade absoluta.
2. Medir uso por jogador, não só por admin, a partir da Onda 2.
3. Só abrir diretório público amplo quando houver um onboarding mínimo para times listados.
4. Monetizar primeiro por eficiência operacional, não por vanity features.

## Artefatos de Execução Associados

- `README.md`: guia de navegacao do roadmap por objetivo, onda e tipo de artefato.
- `tasks.md`: ordem de implementação por dependência e onda.
- `wave-1-sprint-plan.md`: decomposição tática da Onda 1 em sprints, gates e critérios de go/no-go.
- `priority-scorecard.md`: critério único de desempate e priorização.
- `metrics-and-rollout.md`: baseline, métricas, gates e instrumentação mínima.
- `wave-1-rollout-checklist.md`: checklist operacional para piloto da Onda 1.
- `wave-1-acceptance-matrix.md`: criterio unico de aceite, smoke test e validacao manual da Onda 1.
- `mvp-cutlines.md`: linha de corte por feature para conter escopo e adiar automações prematuras.
- `codebase-impact-map.md`: mapa das superfícies do repositório mais prováveis por feature e onda.
- `technical-staging-plan.md`: sequência recomendada de schema, APIs, UI e contratos para evitar churn entre ondas.
- `risk-register.md`: principais riscos de produto/engenharia, sinais precoces e fallback por onda.
- `experiment-backlog.md`: experimentos baratos para validar hipóteses antes de ampliar modelagem e automação.
- `discovery-interview-guide.md`: roteiro curto para validar dores, valor percebido e corte de escopo com admins, jogadores e times.
- `decision-log.md`: decisões transversais já congeladas para evitar rediscussão recorrente durante execução e rollout.
- `execution-board.md`: quadro unico com ordem de PRs, gates de onda, paralelismo seguro e definição de pronto da execução.
- `operating-rhythm.md`: cadencia semanal, papeis minimos, regras de avanco e artefatos obrigatorios para operar o roadmap sem deriva.
- `wave-1-contract-freeze.md`: contrato unico de schema, API e UI da Onda 1 para evitar ambiguidade entre mini-specs e implementacao.
- `wave-1-engineering-handoff.md`: ordem prática de PRs, boundaries de App Router e sequência de implementação da Onda 1.
- `pr-01-f-011-implementation-checklist.md`: checklist técnico por arquivo da primeira PR da Onda 1, cobrindo Prisma, validação, rota e smoke test.
- `pr-02-f-011-quorum-checklist.md`: checklist técnico por arquivo da segunda PR da F-011, cobrindo forecast derivado, rota admin e integração no `MatchForm`.
- `pr-03-f-012-lineup-engine-checklist.md`: checklist técnico por arquivo da primeira PR da F-012, cobrindo heurística, endpoint de lineup e o corte sem persistência.
- `pr-04-f-012-lineup-ui-checklist.md`: checklist técnico por arquivo da PR de UI da F-012, cobrindo fetch dedicado, card local e ação de recalcular.
- `pr-05-f-013-bordereau-operations-checklist.md`: checklist técnico por arquivo da primeira PR da F-013, cobrindo checklist, presença real, rota dedicada e bloco operacional da partida.
- `pr-06-f-013-match-expenses-checklist.md`: checklist técnico por arquivo da segunda PR da F-013, cobrindo `Transaction.matchId`, despesa vinculada e resumo financeiro mínimo do jogo.
- `pr-07-wave-1-hardening-pilot-checklist.md`: checklist técnico da PR final da Onda 1, cobrindo permissões, QA manual, rollout e piloto controlado.
- `wave-2-engineering-handoff.md`: ordem prática de PRs da Onda 2, com boundaries entre agregadores em `lib/`, rotas OG e CTAs nas superfícies públicas e admin.
- `pr-08-f-014-recap-engine-checklist.md`: checklist técnico por arquivo da primeira PR da F-014, cobrindo agregadores e rotas OG individuais/coletivas.
- `pr-09-f-014-recap-ui-checklist.md`: checklist técnico por arquivo da segunda PR da F-014, cobrindo CTAs no perfil público, na partida pública e no dashboard admin.
- `wave-3-engineering-handoff.md`: ordem pratica de PRs da Onda 3, com boundaries entre modelagem de discovery, vitrine publica, hooks de CRM e UI admin.
- `pr-10-f-015-discovery-engine-checklist.md`: checklist tecnico por arquivo da primeira PR da F-015, cobrindo schema, validacao, payload de discovery e rotas de slots.
- `pr-11-f-015-directory-ui-checklist.md`: checklist tecnico por arquivo da segunda PR da F-015, cobrindo filtros, vitrine do time, estados vazios e configuracao admin.
- `pr-12-f-016-opponent-engine-checklist.md`: checklist tecnico por arquivo da primeira PR da F-016, cobrindo schema do CRM, hooks em `friendly-requests` e rotas admin.
- `pr-13-f-016-opponent-ui-checklist.md`: checklist tecnico por arquivo da segunda PR da F-016, cobrindo lista admin, detalhe do adversario e review pos-jogo.
- `wave-4-engineering-handoff.md`: ordem pratica de PRs da Onda 4, com boundaries entre forecast financeiro, cobranca assistida, sponsors e gating comercial.
- `pr-14-f-017-forecast-engine-checklist.md`: checklist tecnico por arquivo da primeira PR da F-017, cobrindo configuracao minima do time, forecast derivado e collections admin.
- `pr-15-f-017-forecast-ui-checklist.md`: checklist tecnico por arquivo da segunda PR da F-017, cobrindo projecao na tela financeira e configuracao em `team/settings`.
- `pr-16-f-018-sponsors-engine-checklist.md`: checklist tecnico por arquivo da primeira PR da F-018, cobrindo modelo `TeamSponsor`, CRUD admin e tracking minimo de click.
- `pr-17-f-018-sponsors-ui-checklist.md`: checklist tecnico por arquivo da segunda PR da F-018, cobrindo configuracao admin e bloco publico de parceiros na vitrine.
- `pr-18-f-019-plan-engine-checklist.md`: checklist tecnico por arquivo da primeira PR da F-019, cobrindo `planTier`, entitlements centralizados e gating backend.
- `pr-19-f-019-plan-ui-checklist.md`: checklist tecnico por arquivo da segunda PR da F-019, cobrindo comparativo `Free vs Pro` e estados bloqueados brandos.
- `implementation-readiness-review.md`: revisão final de consistência e prontidão antes de abrir a execução da Onda 1.