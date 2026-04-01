# Handoff Técnico - Onda 1

**Escopo**: F-011, F-012 e F-013  
**Data**: 2026-04-01  
**Objetivo**: traduzir os artefatos de produto da Onda 1 em uma sequência pequena de implementação, com boundaries claras entre schema, route handlers, lógica derivada e UI.

---

## Leitura Operacional do Estado Atual

### Perfil do jogador

- `app/api/players/me/route.ts` já concentra leitura e autoedição do perfil do jogador autenticado;
- `components/forms/PlayerSelfProfileForm.tsx` já faz fetch separado para carregar e salvar o perfil;
- a F-011 deve entrar como fetch complementar de disponibilidade, sem inflar o payload atual de `/api/players/me` no primeiro corte.

### Criação e edição de partida

- `components/forms/MatchForm.tsx` já é um client component responsável por data, local, adversário, temporada e limites por posição;
- o formulário já consulta temporadas e salva pela rota atual de `/api/matches`;
- a previsão de quorum da F-011 deve ser plugada como leitura auxiliar depois que data e horário estiverem preenchidos, sem virar dependência de submit.

### Detalhe da partida

- `app/api/matches/[id]/route.ts` já entrega detalhe da partida, RSVPs, estatísticas e limites por posição;
- `app/(dashboard)/matches/[id]/page.tsx` hoje é client e já coordena RSVP, convocação, pós-jogo e ações administrativas;
- para reduzir churn no MVP, F-012 e F-013 devem entrar por endpoints separados consumidos por blocos locais, em vez de expandir demais o GET principal da partida.

### Financeiro

- `app/api/finances/route.ts` já lista e cria transações com `requireAdmin`;
- `Transaction` ainda não possui vínculo explícito com `Match`;
- a F-013 deve reaproveitar esse fluxo adicionando rastreabilidade mínima, sem criar ledger paralelo ou cobrança individual.

---

## Boundaries Congeladas

### Prisma e persistência

- novos modelos entram apenas para `PlayerAvailabilityRule`, `MatchChecklistItem` e `MatchAttendance`;
- vínculo financeiro da F-013 entra como `Transaction.matchId?`;
- nenhum modelo novo para persistir lineup sugerida no MVP.

### Route handlers

- toda autorização continua centralizada em `requireAuth` e `requireAdmin`;
- team scoping continua obrigatório em todas as leituras e escritas;
- validação de payload fica em schemas Zod dedicados ou nos arquivos existentes de validação.

### Lógica derivada

- cálculo de quorum, sugestão de escalação e resumo do borderô devem viver em módulos puros dentro de `lib/`;
- route handlers só orquestram auth, leitura do banco, chamada da lógica derivada e serialização da resposta;
- heurística da F-012 continua determinística e explicável.

### UI no App Router

- manter `MatchForm.tsx` e `PlayerSelfProfileForm.tsx` como ilhas client pequenas;
- manter `app/(dashboard)/matches/[id]/page.tsx` como ponto de composição atual no MVP, evitando refactor estrutural prematuro;
- se o detalhe da partida ficar pesado, extrair blocos client focados como `SuggestedLineupCard` e `MatchBordereauCard`, sem mover a página inteira de responsabilidade.

---

## Sequência Recomendada de Implementação

### PR-01 - F-011 Base de dados e CRUD do jogador

**Objetivo**: abrir a modelagem mínima sem tocar partidas ainda.

**Arquivos-alvo**:

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/validations/player.ts` ou `lib/validations/player-availability.ts`
- `app/api/players/me/availability/route.ts`

**Saída mínima**:

- jogador autenticado consegue listar e substituir suas regras recorrentes;
- regras inválidas são rejeitadas integralmente;
- nenhum impacto ainda no `MatchForm`.

**Checklist operacional**:

- usar `pr-01-f-011-implementation-checklist.md` como checklist por arquivo e critério de pronto da PR.

### PR-02 - F-011 Previsão de quorum no MatchForm

**Objetivo**: conectar disponibilidade recorrente ao agendamento da partida.

**Arquivos-alvo**:

- `lib/` para agregador de quorum;
- `app/api/matches/availability/route.ts`
- `components/forms/MatchForm.tsx`

**Saída mínima**:

- preenchendo data e horário, o admin recebe snapshot simples de quorum e alertas por posição;
- falha ou ausência de base não bloqueia salvar partida;
- resposta continua somente derivada, sem persistência.

**Checklist operacional**:

- usar `pr-02-f-011-quorum-checklist.md` como checklist por arquivo, contrato de rota e smoke test da segunda PR da F-011.

### PR-03 - F-012 Motor de escalação sugerida

**Objetivo**: entregar leitura derivada e explicável da escalação.

**Arquivos-alvo**:

- `lib/` para motor de lineup;
- `lib/validations/match.ts`
- `app/api/matches/[id]/lineup/route.ts`

**Saída mínima**:

- endpoint devolve `starters`, `bench`, `alerts`, `generatedAt` e `meta`;
- entram apenas jogadores `ACTIVE` com RSVP `CONFIRMED`;
- nenhum dado de lineup é salvo no banco.

**Checklist operacional**:

- usar `pr-03-f-012-lineup-engine-checklist.md` como checklist por arquivo, contrato do endpoint e smoke test do motor derivado.

### PR-04 - F-012 UI do detalhe da partida

**Objetivo**: expor a sugestão no dashboard sem reescrever a tela inteira.

**Arquivos-alvo**:

- `app/(dashboard)/matches/[id]/page.tsx`
- `components/dashboard/` para card ou lista posicional reutilizável

**Saída mínima**:

- admin enxerga titulares, banco e alertas;
- ação de recalcular refaz o GET do endpoint;
- o bloco deixa explícito que é sugestão efêmera.

**Checklist operacional**:

- usar `pr-04-f-012-lineup-ui-checklist.md` como checklist por arquivo da camada de UI da F-012.

### PR-05 - F-013 Borderô operacional

**Objetivo**: centralizar checklist e presença real por partida.

**Arquivos-alvo**:

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/validations/match.ts` ou `lib/validations/finance.ts`
- `app/api/matches/[id]/bordereau/route.ts`
- `app/(dashboard)/matches/[id]/page.tsx`

**Saída mínima**:

- checklist default inicializa com segurança;
- presença real é salva separada do RSVP;
- o admin fecha a operação da partida sem sair da tela.

**Checklist operacional**:

- usar `pr-05-f-013-bordereau-operations-checklist.md` como checklist por arquivo, contrato da rota e smoke test da primeira PR da F-013.

### PR-06 - F-013 Despesas vinculadas ao jogo

**Objetivo**: ligar o borderô ao financeiro existente com o menor incremento possível.

**Arquivos-alvo**:

- `prisma/schema.prisma`
- `app/api/finances/route.ts` ou `app/api/matches/[id]/expenses/route.ts`
- `app/(dashboard)/finances/page.tsx`
- `components/forms/TransactionForm.tsx`

**Saída mínima**:

- despesa criada como `EXPENSE` fica rastreável por `matchId`;
- rateio continua apenas visual;
- nenhuma pendência individual é aberta automaticamente.

**Checklist operacional**:

- usar `pr-06-f-013-match-expenses-checklist.md` como checklist por arquivo, contrato financeiro e smoke test da segunda PR da F-013.

### PR-07 - Hardening e piloto

**Objetivo**: estabilizar a Onda 1 antes de ampliar uso.

**Arquivos-alvo**:

- rotas novas da Onda 1;
- `components/forms/MatchForm.tsx`
- `components/forms/PlayerSelfProfileForm.tsx`
- `app/(dashboard)/matches/[id]/page.tsx`
- `specs/004-growth-roadmap/wave-1-acceptance-matrix.md`
- `specs/004-growth-roadmap/wave-1-rollout-checklist.md`

**Saída mínima**:

- permissões e estados vazios revisados;
- smoke manual executado;
- piloto pronto para 1 a 3 times.

**Checklist operacional**:

- usar `pr-07-wave-1-hardening-pilot-checklist.md` como checklist de permissões, QA manual e readiness do piloto da Onda 1.

---

## Decisões Técnicas que Não Devem Ser Reabertas

- não expandir `GET /api/matches/[id]` para carregar lineup sugerida e borderô no mesmo payload do MVP;
- não criar server action para a Onda 1 quando route handlers já resolvem o fluxo atual com menor atrito;
- não persistir ajuste manual de escalação;
- não transformar presença real em mutação automática de RSVP;
- não criar módulo financeiro paralelo para despesas do jogo.

---

## Contratos por Camada

### Camada `lib/`

- `availability-forecast`: recebe jogadores ativos, regras recorrentes, data e limites opcionais;
- `lineup-suggester`: recebe confirmados ativos, posição principal e limites do jogo;
- `bordereau-summary`: recebe checklist, presentes e despesas para montar resumo visual.

### Camada `app/api`

- rotas novas devem serializar datas em ISO e metadados explicáveis;
- erros de permissão e validação seguem o padrão atual com `error`, `code` e `details` quando aplicável;
- toda escrita deve respeitar `teamId` da sessão.

### Camada `components/`

- formularios continuam donos apenas da interação e feedback de loading/erro;
- a UI da Onda 1 não recalcula heurística localmente;
- toda decisão operacional vem do backend derivado.

---

## Dependências Reais Entre Features

- F-011 desbloqueia sinal operacional antes da partida e melhora contexto da F-012, mas a lineup sugerida continua dependente de RSVP confirmado, não da disponibilidade em si;
- F-012 depende de `RSVP`, `Player.position` e `MatchPositionLimit`, já existentes;
- F-013 depende do detalhe da partida e do financeiro, mas não depende da F-012 para funcionar.

---

## Critério de Pronto Para Codar

A Onda 1 pode abrir branch quando estes pontos forem tratados como baseline oficial:

- `wave-1-contract-freeze.md` como contrato único de schema, API e UI;
- `wave-1-acceptance-matrix.md` como critério único de QA manual;
- `wave-1-sprint-plan.md` como cadência de entrega;
- este handoff como sequência oficial de PRs e boundaries.

## Próximo Artefato Operacional

- `pr-01-f-011-implementation-checklist.md`: checklist técnico por arquivo da primeira PR da Onda 1.
- `pr-02-f-011-quorum-checklist.md`: checklist técnico por arquivo da segunda PR da F-011, cobrindo agregador, rota admin e integração no `MatchForm`.
- `pr-03-f-012-lineup-engine-checklist.md`: checklist técnico por arquivo da PR do motor da F-012, cobrindo heurística, endpoint e corte contra persistência.
- `pr-04-f-012-lineup-ui-checklist.md`: checklist técnico por arquivo da PR de UI da F-012, cobrindo fetch dedicado, card local e ação de recalcular.
- `pr-05-f-013-bordereau-operations-checklist.md`: checklist técnico por arquivo da primeira PR da F-013, cobrindo checklist, presença real, rota dedicada e bloco operacional.
- `pr-06-f-013-match-expenses-checklist.md`: checklist técnico por arquivo da segunda PR da F-013, cobrindo `Transaction.matchId`, despesa vinculada e resumo financeiro do borderô.
- `pr-07-wave-1-hardening-pilot-checklist.md`: checklist técnico da PR final da Onda 1, cobrindo permissões, estados vazios, QA manual e preparo do piloto.