# Checklist Tecnico - PR-05 da F-013

**Feature**: F-013 Bordero do Jogo  
**PR alvo**: PR-05 - checklist operacional e presenca real por partida  
**Data**: 2026-04-01  
**Objetivo**: entregar a primeira camada do bordero como operacao do dia do jogo, com checklist padrao, presenca real e rota dedicada por partida, sem misturar ainda a criacao de despesas no fluxo financeiro.

---

## Pre-requisitos

Esta PR assume que o detalhe da partida e a Onda 1 ja fornecem o contexto minimo para acoplar o bordero com baixo risco:

- `app/api/matches/[id]/route.ts` ja entrega a partida com `rsvps` e contexto suficiente para a tela;
- `f-013-bordereau-mini-spec.md` ja congelou checklist padrao, presenca real e o corte sem cobranca automatica;
- `wave-1-contract-freeze.md` ja travou o modelo minimo de persistencia da F-013.

Esta PR nao depende do vinculo financeiro por partida estar pronto, mas deve preparar o detalhe da partida para receber essa segunda etapa sem refactor estrutural.

---

## Escopo Congelado da PR-05

Esta PR entrega apenas:

- modelagem Prisma para checklist e presenca real por partida;
- validacao do payload do bordero;
- rota `GET/PATCH /api/matches/[id]/bordereau` protegida por admin e escopo de time;
- bloco inicial de bordero no detalhe da partida com checklist e check-in manual.

Esta PR **nao** entrega:

- criacao de despesas financeiras;
- `matchId` em `Transaction`;
- rateio visual por presente;
- upload de comprovantes ou observacoes livres;
- sincronizacao automatica entre RSVP e presenca real.

---

## Ordem Recomendada de Trabalho

1. Adicionar os modelos de checklist e presenca real em `prisma/schema.prisma`.
2. Criar a migration da F-013 base.
3. Expandir os schemas Zod do bordero.
4. Implementar `app/api/matches/[id]/bordereau/route.ts`.
5. Expor o bloco inicial no detalhe da partida.
6. Executar smoke tests com partida agendada, lista vazia, presencas divergentes do RSVP e escopo invalido.

---

## Checklist por Arquivo

### `prisma/schema.prisma`

- [ ] Adicionar modelo `MatchChecklistItem` com `id`, `matchId`, `label`, `isChecked`, `sortOrder`, `createdAt` e `updatedAt`.
- [ ] Adicionar modelo `MatchAttendance` com `id`, `matchId`, `playerId`, `present`, `checkedInAt`, `createdAt` e `updatedAt`.
- [ ] Relacionar ambos os modelos com `Match`.
- [ ] Relacionar `MatchAttendance` com `Player`.
- [ ] Garantir unicidade de presenca por `matchId + playerId`.
- [ ] Garantir ordenacao estavel dos itens por `sortOrder`.
- [ ] Nao adicionar `Transaction.matchId` nesta PR.

### `prisma/migrations/`

- [ ] Criar migration isolada para os modelos `MatchChecklistItem` e `MatchAttendance`.
- [ ] Revisar nomes de constraints e indices para legibilidade.
- [ ] Validar que a migration nao mexe em tabelas financeiras nem em RSVP.

### `lib/validations/match.ts`

- [ ] Adicionar schema para item de checklist do bordero.
- [ ] Adicionar schema para entrada de presenca real por jogador.
- [ ] Adicionar schema de `patchMatchBordereauSchema` com arrays opcionais de `checklist` e `attendance`.
- [ ] Tipar resposta de `GET /api/matches/[id]/bordereau` com `matchId`, `checklist`, `attendance` e `costSummary` basico.
- [ ] Permitir labels curtas e seguras para o checklist padrao.
- [ ] Nao adicionar validacao de despesas nesta PR.

### `app/api/matches/[id]/bordereau/route.ts`

- [ ] Criar rota com `GET` e `PATCH` protegidos por `requireAdmin`.
- [ ] Validar `teamId` da sessao antes de consultar a partida.
- [ ] Buscar a partida com escopo de time e incluir apenas os dados necessarios:
- [ ] `rsvps` com `playerId`, `status` e `player.name`.
- [ ] `checklistItems` ordenados por `sortOrder`.
- [ ] `attendances` com `playerId`, `present` e `checkedInAt`.
- [ ] No primeiro `GET`, inicializar checklist default se a partida ainda nao tiver itens.
- [ ] Retornar `404` com `code: "NOT_FOUND"` se a partida nao existir no time.
- [ ] No `PATCH`, substituir checklist e presencas de forma idempotente dentro de transacao.
- [ ] Preservar presencas de jogadores do time e rejeitar `playerId` fora do elenco do time.
- [ ] Serializar `checkedInAt` em ISO quando existir.
- [ ] Retornar `200` com payload completo do bordero apos salvar.

### `app/(dashboard)/matches/[id]/page.tsx`

- [ ] Adicionar estado local para `bordereauData`, `bordereauLoading`, `bordereauSaving` e `bordereauError`.
- [ ] Buscar bordero apenas para admin e apenas quando `match.status === "SCHEDULED"`.
- [ ] Inserir bloco do bordero abaixo da sugestao de lineup ou da area operacional do admin.
- [ ] Exibir checklist padrao com toggles simples e ordem estavel.
- [ ] Exibir lista de jogadores com `rsvpStatus` e toggle de `present`.
- [ ] Mostrar claramente que presenca real e diferente de RSVP.
- [ ] Salvar alteracoes pela rota dedicada do bordero, sem reaproveitar `PATCH /api/matches/[id]`.
- [ ] Tratar erro local sem quebrar o resto da pagina.

### `app/api/matches/[id]/route.ts`

- [ ] Nao alterar nesta PR.
- [ ] Manter o detalhe principal da partida separado do payload do bordero.

---

## Contrato de Resposta do Endpoint

### `GET /api/matches/[id]/bordereau`

```json
{
  "matchId": "clm123",
  "checklist": [
    {
      "id": "chk1",
      "label": "Campo confirmado",
      "isChecked": true,
      "sortOrder": 0
    }
  ],
  "attendance": [
    {
      "playerId": "pl1",
      "playerName": "Carlos",
      "rsvpStatus": "CONFIRMED",
      "present": true,
      "checkedInAt": "2026-04-01T21:00:00.000Z"
    }
  ],
  "costSummary": {
    "totalExpense": 0,
    "presentCount": 1,
    "suggestedSharePerPresent": null
  }
}
```

---

## Smoke Test Manual da PR-05

### Cenario 1 - primeira abertura do bordero

- [ ] Abrir uma partida agendada sem checklist salvo.
- [ ] Confirmar que o `GET /api/matches/[id]/bordereau` devolve checklist default.

### Cenario 2 - salvar checklist e presenca real

- [ ] Marcar itens do checklist e presencas reais.
- [ ] Confirmar persistencia apos refresh da pagina.

### Cenario 3 - divergencia entre RSVP e presenca

- [ ] Marcar como presente um jogador nao confirmado, mas pertencente ao elenco da partida.
- [ ] Confirmar que a UI deixa explicita a diferenca entre RSVP e presenca real.

### Cenario 4 - erro de permissao

- [ ] Abrir o endpoint como `PLAYER`.
- [ ] Confirmar bloqueio por `requireAdmin`.

### Cenario 5 - escopo entre times

- [ ] Consultar ou salvar bordero de partida de outro time.
- [ ] Confirmar `404` com escopo correto.

---

## Criterio de Pronto da PR-05

- [ ] modelos `MatchChecklistItem` e `MatchAttendance` adicionados.
- [ ] migration criada sem tocar no financeiro.
- [ ] rota `GET/PATCH /api/matches/[id]/bordereau` funcional.
- [ ] bloco inicial do bordero navegavel no detalhe da partida.
- [ ] smoke test manual executado nos 5 cenarios.
- [ ] nenhuma despesa financeira criada por este fluxo ainda.

---

## Handoff para a PR Seguinte

Se esta PR fechar corretamente, a proxima entrega adiciona o vinculo minimo com o financeiro:

- `Transaction.matchId` em `prisma/schema.prisma`;
- criacao de despesa vinculada pela rota financeira existente ou rota dedicada;
- rateio apenas como resumo visual derivado.

Essa separacao mantem a primeira PR do bordero focada em operacao do jogo e reduz o risco de misturar checklist, presenca e dinheiro no mesmo passo.