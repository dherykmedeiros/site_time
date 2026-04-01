# Checklist Tecnico - PR-08 da F-014

**Feature**: F-014 Recap Compartilhavel do Jogador e da Rodada  
**PR alvo**: PR-08 - agregadores e rotas OG  
**Data**: 2026-04-01  
**Objetivo**: entregar a base derivada do recap em `lib/` e as duas rotas OG, sem tocar ainda nas CTAs das paginas publicas e admin.

---

## Pre-requisitos

Esta PR assume que:

- `f-014-recap-mini-spec.md` ja esta congelado como contrato funcional;
- a infraestrutura OG existente em `app/api/og/match/[id]/route.tsx` esta estavel;
- a vitrine publica do jogador e a pagina publica da partida ja estao prontas para receber links na PR seguinte.

---

## Escopo Congelado da PR-08

Esta PR entrega apenas:

- agregador de recap individual em `lib/player-recap.ts`;
- agregador de recap coletivo em `lib/team-recap.ts`;
- rota `GET /api/og/player-recap/[playerId]`;
- rota `GET /api/og/team-recap/[matchId]`;
- heuristica centralizada de homem da rodada e highlight de achievement.

Esta PR **nao** entrega:

- botoes ou CTAs nas paginas publicas;
- feed historico de recaps;
- persistencia de recap no banco;
- tracking persistido de clique;
- troca do card OG atual da partida concluida.

---

## Ordem Recomendada de Trabalho

1. Criar `lib/player-recap.ts`.
2. Criar `lib/team-recap.ts`.
3. Implementar `app/api/og/player-recap/[playerId]/route.tsx`.
4. Implementar `app/api/og/team-recap/[matchId]/route.tsx`.
5. Executar smoke tests com jogador sem partida recente, jogador com stats, partida concluida e partida sem stats suficientes.

---

## Checklist por Arquivo

### `lib/player-recap.ts`

- [ ] Criar funcao pura `getLatestPlayerRecapPayload` ou nome equivalente.
- [ ] Buscar a ultima `MatchStats` do jogador com `match.status = COMPLETED`.
- [ ] Incluir `player`, `team`, `match`, `performance` e `highlightAchievement` no payload.
- [ ] Destacar apenas a conquista mais recente por `awardedAt`.
- [ ] Considerar participacao apenas quando existir `MatchStats`, sem inferir minutos.
- [ ] Retornar `null` quando nao houver partida concluida com stats do jogador.
- [ ] Nao renderizar JSX nem depender de `ImageResponse` dentro desse modulo.

### `lib/team-recap.ts`

- [ ] Criar funcao pura `getTeamRecapPayload` ou nome equivalente.
- [ ] Buscar stats agregadas da partida concluida.
- [ ] Calcular score de homem da rodada com a heuristica congelada: gols x 3, assistencias x 2, amarelo x -1, vermelho x -3.
- [ ] Aplicar desempate por gols, assistencias, `shirtNumber` e `createdAt` do jogador.
- [ ] Retornar `topPerformers`, `manOfTheMatch` e `seasonSummary` opcional.
- [ ] Retornar `null` quando a partida nao estiver concluida ou nao houver minimo de dados.
- [ ] Nao acessar componentes React nem metadata dentro desse modulo.

### `app/api/og/player-recap/[playerId]/route.tsx`

- [ ] Reaproveitar o padrao estrutural de `app/api/og/match/[id]/route.tsx`.
- [ ] Buscar apenas os dados necessarios para o recap individual.
- [ ] Chamar o agregador de `lib/player-recap.ts`.
- [ ] Retornar `404` simples quando o recap nao existir.
- [ ] Renderizar card OG com foco em nome do jogador, rodada, linha de performance e achievement em destaque quando houver.
- [ ] Sanitizar cores do time com helper equivalente a `safeHex`.
- [ ] Manter `runtime = "nodejs"`.

### `app/api/og/team-recap/[matchId]/route.tsx`

- [ ] Reaproveitar o padrao estrutural de `app/api/og/match/[id]/route.tsx`.
- [ ] Buscar apenas os dados necessarios da partida concluida, time e stats.
- [ ] Chamar o agregador de `lib/team-recap.ts`.
- [ ] Retornar `404` quando a partida nao estiver concluida ou nao houver recap minimo.
- [ ] Renderizar card OG com placar, adversario, top contributors e destaque do homem da rodada.
- [ ] Manter o resumo visual simples e resiliente a poucos dados.

### `app/vitrine/[slug]/jogadores/[id]/page.tsx`

- [ ] Nao alterar nesta PR.
- [ ] Manter a integracao de superficie para a PR-09.

### `app/(dashboard)/matches/[id]/page.tsx`

- [ ] Nao alterar nesta PR.
- [ ] Manter compartilhamento/admin para a PR-09.

---

## Contrato Minimo das Rotas OG

### `GET /api/og/player-recap/[playerId]`

- [ ] Deve responder `200 image/*` quando existir recap individual.
- [ ] Deve responder `404` quando o jogador nao tiver recap disponivel.

### `GET /api/og/team-recap/[matchId]`

- [ ] Deve responder `200 image/*` quando existir recap coletivo da partida.
- [ ] Deve responder `404` quando a partida nao puder gerar recap.

---

## Smoke Test Manual da PR-08

### Cenario 1 - jogador com recap disponivel

- [ ] Abrir `GET /api/og/player-recap/[playerId]` para jogador com stats em partida concluida.
- [ ] Confirmar imagem renderizada com nome, time, adversario e performance.

### Cenario 2 - jogador sem recap

- [ ] Abrir rota de jogador sem `MatchStats` concluidas.
- [ ] Confirmar `404`.

### Cenario 3 - partida concluida com recap coletivo

- [ ] Abrir `GET /api/og/team-recap/[matchId]` para partida concluida com stats.
- [ ] Confirmar placar, adversario e destaque principal renderizados.

### Cenario 4 - partida invalida ou sem dados suficientes

- [ ] Testar partida nao concluida ou inexistente.
- [ ] Confirmar `404` sem erro interno.

---

## Criterio de Pronto da PR-08

- [ ] agregadores criados fora das rotas.
- [ ] rotas OG individuais e coletivas funcionais.
- [ ] heuristicas do mini-spec centralizadas em `lib/`.
- [ ] smoke test manual executado nos 4 cenarios.
- [ ] nenhuma CTA ou integracao de pagina adicionada prematuramente.

---

## Handoff para a PR Seguinte

Se esta PR fechar corretamente, a PR-09 expoe o recap nas superficies certas:

- perfil publico do jogador;
- pagina publica da partida concluida;
- detalhe admin da partida.

Essa separacao mantem a composicao do App Router limpa e evita misturar motor de recap com UX de compartilhamento.