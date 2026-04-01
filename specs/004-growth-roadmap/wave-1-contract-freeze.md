# Congelamento de Contratos Tecnicos - Onda 1

**Escopo**: F-011, F-012 e F-013  
**Data**: 2026-04-01  
**Objetivo**: congelar a menor superficie correta de schema, API e UI para a Onda 1, evitando reabertura de decisoes ja fechadas nos mini-specs.

---

## Decisoes Congeladas

### F-011 Disponibilidade recorrente

- adicionar um modelo dedicado de regra recorrente por jogador;
- manter RSVP como fluxo separado e posterior a criacao da partida;
- expor CRUD apenas para o proprio jogador autenticado;
- usar previsao explicavel por contagem e risco, sem sugestao automatica de melhor horario.

### F-012 Escalacao sugerida

- a sugestao e calculada em tempo real a partir de dados ja existentes;
- entram no motor apenas jogadores `ACTIVE` com RSVP `CONFIRMED`;
- a heuristica usa `Player.position` e `MatchPositionLimit` quando houver;
- nao persistir travas manuais nem lineup editado no MVP;
- a UX do admin pode recalcular a sugestao, mas qualquer ajuste manual inicial e efemero.

### F-013 Bordereo do jogo

- checklist e presenca real pertencem ao contexto da partida;
- despesas continuam usando `Transaction`, sem criar um segundo ledger;
- o rateio fica apenas como sugestao visual;
- nao gerar cobranca automatica por jogador no MVP.

---

## Contrato de Dados

### Modelos novos obrigatorios

#### `PlayerAvailabilityRule`

Campos minimos:

- `id`
- `playerId`
- `dayOfWeek`
- `startMinutes`
- `endMinutes`
- `frequency`
- `availability`
- `notes?`
- `createdAt`
- `updatedAt`

Indices minimos:

- indice por `playerId`
- indice composto por `playerId` e `dayOfWeek`

#### `MatchChecklistItem`

Campos minimos:

- `id`
- `matchId`
- `label`
- `isChecked`
- `sortOrder`
- `createdAt`
- `updatedAt`

#### `MatchAttendance`

Campos minimos:

- `id`
- `matchId`
- `playerId`
- `present`
- `checkedInAt?`
- `createdAt`
- `updatedAt`

Restricao minima:

- unicidade por `matchId` e `playerId`

### Campos novos em modelos existentes

#### `Transaction.matchId?`

- campo opcional para rastrear despesas nascidas do bordero;
- relacao opcional para `Match`;
- sem alterar semantica das transacoes de mensalidade existentes.

### Modelos explicitamente fora do MVP

- `MatchLineupLock`
- `MatchLineupSelection`
- `PlayerAvailabilityException`
- `PlayerCharge` derivado de bordero
- qualquer entidade de billing, checkout ou trial.

---

## Contrato de API

### F-011

#### `GET /api/players/me/availability`

- retorna as regras recorrentes do jogador autenticado;
- erro `404` se o usuario nao tiver `playerId` vinculado.

#### `PATCH /api/players/me/availability`

- substitui integralmente o conjunto de regras do jogador autenticado;
- validacao rejeita a requisicao inteira se qualquer regra for invalida.

#### `GET /api/matches/availability?date=...`

- retorna snapshot de quorum, contagem por risco e cobertura por posicao;
- nao persiste nada;
- o frontend cruza os limites por posicao localmente no `MatchForm`.

### F-012

#### `GET /api/matches/[id]/lineup`

- calcula em tempo real a sugestao de titulares, banco e alertas;
- nao cria, nao atualiza e nao persiste lineup;
- resposta deve incluir `generatedAt` e `meta` para explicar confianca e base usada.

#### `POST /api/matches/[id]/lineup`

- fora do MVP inicial;
- se surgir necessidade de refresh explicito, o cliente pode apenas refazer o `GET`.

### F-013

#### `GET /api/matches/[id]/bordereau`

- retorna checklist, presenca real, despesas vinculadas e resumo de custo;
- inicializa itens default de checklist se o bordero ainda nao tiver sido tocado.

#### `PATCH /api/matches/[id]/bordereau`

- atualiza checklist e presenca real;
- nao cria transacoes financeiras.

#### `POST /api/matches/[id]/expenses`

- cria despesa vinculada a partida usando `Transaction` com `type = EXPENSE`;
- aceita apenas categorias ja existentes no financeiro atual.

---

## Contrato de UI

### `components/forms/PlayerSelfProfileForm.tsx`

- recebera uma secao de disponibilidade recorrente;
- o formulario principal do perfil continua dono apenas dos campos de autoedicao do jogador;
- as regras recorrentes podem usar fetch separado para nao misturar o contrato atual de `/api/players/me`.

### `components/forms/MatchForm.tsx`

- consulta previsao de quorum quando data e horario estiverem preenchidos;
- exibe termometro simples e alertas curtos por posicao;
- continua salvando a partida pelo fluxo atual de `/api/matches`.

### `app/(dashboard)/matches/[id]/page.tsx`

- ganha dois blocos novos: `Escalacao sugerida` e `Bordero`;
- a sugestao de lineup nao vira editor persistente no MVP;
- o bordero concentra checklist, presenca e despesas da partida.

### `app/(dashboard)/finances/page.tsx`

- apenas destaca transacoes ligadas a partidas quando `matchId` existir;
- nao ganha cobranca por jogador nem rateio automatizado.

---

## Ordem Tecnica Recomendada

1. modelar `PlayerAvailabilityRule` e fechar F-011;
2. integrar o termometro no `MatchForm` sem mudar o fluxo de RSVP;
3. implementar o endpoint de lineup como leitura derivada dos dados atuais;
4. adicionar bordero e so depois ligar despesas com `Transaction.matchId`;
5. endurecer estados vazios, permissoes e smoke tests antes de piloto.

---

## Regras de Corte Durante Implementacao

- se a implementacao da F-012 exigir persistencia para ser usavel, a decisao deve voltar ao `decision-log.md` antes de qualquer migration nova;
- se o bordero puxar cobranca individual, o escopo deve ser cortado e mantido apenas como sugestao visual;
- se a previsao da F-011 passar a exigir historico ou calendario externo, isso sai do MVP da Onda 1.

---

## Arquivos Fonte Deste Congelamento

- `specs/004-growth-roadmap/f-011-availability-mini-spec.md`
- `specs/004-growth-roadmap/f-012-lineup-heuristics-mini-spec.md`
- `specs/004-growth-roadmap/f-013-bordereau-mini-spec.md`
- `app/api/players/me/route.ts`
- `app/api/matches/[id]/route.ts`
- `app/api/matches/[id]/rsvp/route.ts`
- `app/api/finances/route.ts`
- `prisma/schema.prisma`