# Checklist Técnico - PR-03 da F-012

**Feature**: F-012 Escalacao Inteligente e Banco Sugerido  
**PR alvo**: PR-03 - motor derivado e endpoint de lineup por partida  
**Data**: 2026-04-01  
**Objetivo**: entregar a primeira camada da F-012 como leitura derivada e explicavel, sem persistir lineup nem inflar a rota principal da partida.

---

## Pré-requisitos

Esta PR assume que a base da Onda 1 já está estável o suficiente para leitura derivada:

- detalhe da partida em `GET /api/matches/[id]` funcionando com `rsvps` e `positionLimits`;
- regra congelada de lineup efemera em `wave-1-contract-freeze.md`;
- heuristica funcional fechada em `f-012-lineup-heuristics-mini-spec.md`.

Esta PR não depende da UI final da F-012, mas depende de o contrato do motor estar claro antes de tocar a página da partida.

---

## Escopo Congelado da PR-03

Esta PR entrega apenas:

- motor puro de sugestao de lineup em `lib/`;
- contratos Zod e tipos de resposta da lineup;
- rota `GET /api/matches/[id]/lineup` protegida por admin e escopo de time;
- leitura derivada baseada apenas em confirmados ativos, posicao principal e limites da partida.

Esta PR **não** entrega:

- card visual definitivo na página da partida;
- persistencia de travas manuais;
- reordenacao manual de titulares e banco;
- integracao com recap, bordero ou financeiro;
- alteracao do payload de `GET /api/matches/[id]`.

---

## Ordem Recomendada de Trabalho

1. Criar o motor puro de lineup em `lib/`.
2. Expandir os contratos em `lib/validations/match.ts`.
3. Implementar `app/api/matches/[id]/lineup/route.ts`.
4. Executar smoke tests com partida sem confirmados, com confirmados suficientes e com gargalo por posicao.

---

## Checklist por Arquivo

### `lib/lineup-suggester.ts`

- [ ] Criar funcao pura `buildSuggestedLineup` ou nome equivalente.
- [ ] Receber como entrada:
- [ ] `matchId`.
- [ ] lista de confirmados com `playerId`, `playerName`, `position`, `shirtNumber`, `createdAt` e `status`.
- [ ] lista de `positionLimits` da partida.
- [ ] Filtrar apenas jogadores `ACTIVE` com RSVP `CONFIRMED`.
- [ ] Ordenar jogadores da mesma posicao por `shirtNumber` crescente e fallback por `createdAt` ascendente.
- [ ] Se houver `positionLimits`, preencher titulares por posicao ate o limite.
- [ ] Jogadores excedentes da mesma posicao devem ir para o banco com motivo explicavel.
- [ ] Se faltar jogador para uma posicao limitada, gerar alerta curto.
- [ ] Se nao houver `positionLimits`, aplicar distribuicao conservadora sem inventar formacao tatica fixa.
- [ ] Garantir que o motor retorne `starters`, `bench`, `alerts` e `meta`.
- [ ] Calcular `meta.confirmedPlayers`, `meta.startersCount`, `meta.benchCount`, `meta.usesPositionLimits` e `meta.confidence`.
- [ ] Nao ler Prisma nem depender de componentes React dentro desse modulo.

### `lib/validations/match.ts`

- [ ] Adicionar enums ou schemas para `lineupConfidence`, `lineupEntry` e `suggestedLineupResponse`.
- [ ] Tipar `reason` de cada item como string obrigatoria e curta.
- [ ] Garantir que `position` siga o enum atual de `playerPositions`.
- [ ] Exportar tipos inferidos para a rota e para a UI da PR seguinte.
- [ ] Nao misturar validacao de mutacao da lineup, porque o MVP desta PR e somente leitura.

### `app/api/matches/[id]/lineup/route.ts`

- [ ] Usar `requireAdmin`.
- [ ] Validar `teamId` da sessao antes de consultar o banco.
- [ ] Buscar a partida pelo `id` com escopo de time.
- [ ] Incluir apenas os dados necessarios:
- [ ] `positionLimits`.
- [ ] `rsvps` com `status` e `player` contendo `id`, `name`, `position`, `shirtNumber`, `status` e `createdAt`.
- [ ] Retornar `404` com `code: "NOT_FOUND"` se a partida nao existir no time.
- [ ] Montar a entrada do motor sem reaproveitar o payload inteiro de `GET /api/matches/[id]`.
- [ ] Chamar `buildSuggestedLineup` e serializar `generatedAt` em ISO.
- [ ] Retornar payload com:
- [ ] `matchId`.
- [ ] `generatedAt`.
- [ ] `lineup.starters`.
- [ ] `lineup.bench`.
- [ ] `lineup.alerts`.
- [ ] `lineup.meta`.
- [ ] Em partida sem confirmados suficientes, retornar `200` com lineup vazia e alertas explicaveis, nao erro fatal.

### `app/api/matches/[id]/route.ts`

- [ ] Nao alterar nesta PR.
- [ ] Manter a rota principal da partida como fonte de detalhe geral, sem acoplar a sugestao de lineup ao mesmo payload.

### `app/(dashboard)/matches/[id]/page.tsx`

- [ ] Nao alterar nesta PR.
- [ ] Registrar no comentario da PR que a UI entra na PR-04 para manter o corte entre motor e apresentacao.

---

## Contrato de Resposta do Endpoint

### `GET /api/matches/[id]/lineup`

```json
{
  "matchId": "clm123",
  "generatedAt": "2026-04-01T20:30:00.000Z",
  "lineup": {
    "starters": [
      {
        "playerId": "clx1",
        "playerName": "Carlos",
        "position": "GOALKEEPER",
        "reason": "Posicao preenchida conforme limite da partida"
      }
    ],
    "bench": [
      {
        "playerId": "clx2",
        "playerName": "Joao",
        "position": "FORWARD",
        "reason": "Excedente da posicao apos preencher titulares"
      }
    ],
    "alerts": [
      "Nao ha lateral direito confirmado para esta partida"
    ],
    "meta": {
      "confirmedPlayers": 14,
      "startersCount": 11,
      "benchCount": 3,
      "usesPositionLimits": true,
      "confidence": "MEDIUM"
    }
  }
}
```

---

## Smoke Test Manual da PR-03

### Cenario 1 - partida com confirmados suficientes e limites por posicao

- [ ] Criar ou usar partida com confirmados em varias posicoes e `positionLimits` preenchidos.
- [ ] Chamar `GET /api/matches/[id]/lineup`.
- [ ] Confirmar titulares, banco e alertas coerentes com os limites.

### Cenario 2 - partida sem limites por posicao

- [ ] Usar partida sem `positionLimits`.
- [ ] Confirmar resposta `200` com sugestao conservadora e `usesPositionLimits = false`.

### Cenario 3 - poucos confirmados

- [ ] Usar partida com poucos jogadores `CONFIRMED`.
- [ ] Confirmar lineup parcial ou vazia com alertas explicaveis.

### Cenario 4 - jogadores inativos ou nao confirmados

- [ ] Confirmar que jogadores `INACTIVE`, `PENDING` e `DECLINED` nao entram em titulares nem banco.

### Cenario 5 - escopo e permissao

- [ ] Autenticar usuario `PLAYER` e confirmar bloqueio por `requireAdmin`.
- [ ] Consultar partida de outro time e confirmar `404` com escopo correto.

---

## Criterio de Pronto da PR-03

- [ ] motor derivado criado fora da rota.
- [ ] contrato da lineup tipado em `lib/validations/match.ts`.
- [ ] endpoint admin `GET /api/matches/[id]/lineup` funcional.
- [ ] smoke test manual executado nos 5 cenarios.
- [ ] nenhuma persistencia de lineup adicionada ao banco.
- [ ] nenhuma alteracao indevida na rota principal da partida.

---

## Handoff para a PR Seguinte

Se esta PR fechar corretamente, a proxima entrega a exposicao visual da F-012:

- componente local de `SuggestedLineupCard` em `components/dashboard/`;
- fetch dedicado na tela `app/(dashboard)/matches/[id]/page.tsx`;
- CTA de recalcular como nova leitura do endpoint.

Essa separacao e importante para manter o motor testavel e impedir que a UI reabra discussoes de regra de negocio.
*** End Patch