# Checklist Tecnico - PR-07 da Onda 1

**Escopo**: F-011, F-012 e F-013  
**PR alvo**: PR-07 - hardening, QA manual e preparo de piloto  
**Data**: 2026-04-01  
**Objetivo**: estabilizar a Onda 1 antes de ampliar uso, revisando permissoes, estados vazios, mensagens operacionais, smoke tests e readiness de rollout sem reabrir escopo funcional.

---

## Pre-requisitos

Esta PR assume que as PRs anteriores da Onda 1 ja entregaram o fluxo base:

- disponibilidade recorrente salva e consultavel;
- previsao de quorum integrada ao fluxo da partida;
- lineup sugerida disponivel por endpoint e UI dedicada;
- bordero operacional com despesas vinculadas ao jogo.

Tambem assume que `wave-1-acceptance-matrix.md` e `wave-1-rollout-checklist.md` sao as fontes oficiais de QA e rollout.

---

## Escopo Congelado da PR-07

Esta PR entrega apenas:

- revisao final de permissao e escopo por papel nas rotas novas da Onda 1;
- estados de loading, erro e vazio consistentes nas telas tocadas;
- smoke test manual e checklist de aceite executaveis;
- preparo de piloto pequeno com baseline e owners preenchidos.

Esta PR **nao** entrega:

- features novas na Onda 1;
- analytics complexa nova;
- refactor estrutural de App Router;
- persistencia de lineup, cobranca individual ou automacoes fora do corte atual.

---

## Ordem Recomendada de Trabalho

1. Revisar permissoes e team scoping das rotas novas.
2. Consolidar estados de loading, erro e vazio nas telas da Onda 1.
3. Executar a matriz de aceite como smoke test unico.
4. Preencher o checklist de rollout com owners, times piloto e baseline.
5. Registrar cortes e nao conformidades sem ampliar o escopo funcional.

---

## Checklist por Arquivo

### `app/api/players/me/availability/route.ts`

- [ ] Confirmar protecao por `requireAuth`.
- [ ] Confirmar que o jogador autenticado so acessa o proprio contexto.
- [ ] Confirmar erro coerente quando o usuario nao possui `playerId` ou `teamId` valido.

### `app/api/matches/availability/route.ts`

- [ ] Confirmar protecao por `requireAdmin`.
- [ ] Confirmar escopo estrito por `teamId`.
- [ ] Confirmar degradacao segura quando nao houver regras suficientes para previsao.

### `app/api/matches/[id]/lineup/route.ts`

- [ ] Confirmar protecao por `requireAdmin`.
- [ ] Confirmar resposta `200` com estado vazio explicavel em vez de erro fatal quando a base for insuficiente.
- [ ] Confirmar que nao ha persistencia de lineup ou override manual indireto.

### `app/api/matches/[id]/bordereau/route.ts`

- [ ] Confirmar protecao por `requireAdmin`.
- [ ] Confirmar separacao semantica entre RSVP, presenca real e despesa.
- [ ] Confirmar que `suggestedSharePerPresent` nunca vira cobranca automatica.

### `components/forms/PlayerSelfProfileForm.tsx`

- [ ] Confirmar loading e erro claros no bloco de disponibilidade recorrente.
- [ ] Confirmar que falha de disponibilidade nao quebra o restante do perfil.

### `components/forms/MatchForm.tsx`

- [ ] Confirmar que a previsao de quorum nao bloqueia submit.
- [ ] Confirmar estado vazio e erro local explicavel.
- [ ] Confirmar que troca de data e horario nao gera loop de fetch nem mensagem enganosa.

### `app/(dashboard)/matches/[id]/page.tsx`

- [ ] Confirmar estados independentes para detalhe da partida, lineup e bordero.
- [ ] Confirmar que erro local de lineup ou bordero nao derruba a pagina inteira.
- [ ] Confirmar que o bloco de admin nao aparece para usuario `PLAYER`.

### `app/(dashboard)/finances/page.tsx`

- [ ] Confirmar que a despesa vinculada a partida e identificavel sem poluir a listagem.
- [ ] Confirmar que transacoes antigas sem `matchId` continuam renderizando normalmente.

### `specs/004-growth-roadmap/wave-1-acceptance-matrix.md`

- [ ] Executar os cenarios A001 a A015 como criterio unico de QA manual.
- [ ] Registrar cenarios falhos com decisao explicita: corrigir agora ou cortar do MVP.

### `specs/004-growth-roadmap/wave-1-rollout-checklist.md`

- [ ] Preencher owners.
- [ ] Preencher times piloto.
- [ ] Preencher baseline manual das 4 semanas anteriores.
- [ ] Confirmar gate de abertura para piloto restrito.

---

## Smoke Test Manual da PR-07

### Cenario 1 - jornada operacional completa do admin

- [ ] Jogador salva disponibilidade recorrente.
- [ ] Admin cria ou edita partida e consulta previsao de quorum.
- [ ] Admin abre a partida, consulta lineup sugerida e recalcula.
- [ ] Admin registra checklist, presenca real e despesa do jogo.
- [ ] Admin confirma a transacao no financeiro.

### Cenario 2 - permissao por papel

- [ ] Usuario `PLAYER` nao acessa rotas admin da Onda 1.
- [ ] Usuario `ADMIN` acessa apenas recursos do proprio time.

### Cenario 3 - estados vazios

- [ ] Sem regras de disponibilidade.
- [ ] Sem confirmados para lineup.
- [ ] Sem despesas no bordero.
- [ ] Sem presentes para rateio sugerido.

### Cenario 4 - resiliencia local de UI

- [ ] Falha do endpoint de previsao nao quebra o `MatchForm`.
- [ ] Falha do endpoint de lineup nao quebra a pagina da partida.
- [ ] Falha do endpoint do bordero nao apaga o restante do detalhe da partida.

### Cenario 5 - piloto pronto para abrir

- [ ] Baseline preenchida.
- [ ] Times piloto definidos.
- [ ] Linguagem operacional revisada.
- [ ] Corte de MVP mantido sem reabertura de escopo.

---

## Criterio de Pronto da PR-07

- [ ] permissoes e team scoping revisados nas rotas novas.
- [ ] estados de loading, erro e vazio consistentes nas telas tocadas.
- [ ] matriz de aceite executada como QA unico.
- [ ] checklist de rollout preenchido para piloto pequeno.
- [ ] nenhum escopo novo introduzido durante o hardening.

---

## Saida Esperada

Ao final desta PR, a Onda 1 deixa de ser apenas um conjunto de PRs tecnicas e passa a ser um pacote operacionalmente pronto para piloto controlado com 1 a 3 times.