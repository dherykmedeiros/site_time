# Checklist Tecnico - PR-12 - F-016 Opponent Engine

**Feature**: F-016 CRM de adversarios e reputacao  
**Objetivo da PR**: entregar o dominio de adversarios, consolidacao por relacionamento e hooks automaticos no fluxo atual de amistosos.  
**Escopo**: schema, score privado, hooks e APIs admin. Sem UI rica ainda.

---

## Arquivos-Alvo

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/opponent-crm.ts`
- `lib/validations/friendly-request.ts`
- `app/api/friendly-requests/route.ts`
- `app/api/friendly-requests/[id]/route.ts`
- `app/api/opponents/route.ts`
- `app/api/opponents/[id]/route.ts`

---

## Checklist por Arquivo

### `prisma/schema.prisma`

- adicionar `OpponentProfile`, `OpponentInteraction` e `OpponentReview` com os campos minimos do mini-spec;
- ligar `OpponentProfile` ao `Team` dono do CRM;
- deixar `friendlyRequestId` e `matchId` opcionais em interacoes;
- nao publicar nenhum relacionamento do CRM em tabelas publicas da vitrine nesta PR.

### `prisma/migrations/`

- gerar migration pequena e isolada para os tres modelos do CRM;
- evitar misturar nessa migration qualquer item do diretorio ou monetizacao.

### `lib/opponent-crm.ts`

- criar normalizacao unica de `normalizedKey`;
- centralizar consolidacao de profile por nome/contacto minimo;
- centralizar recalculo de `reliabilityScore` a partir de interacoes e reviews;
- expor explicacao textual curta das faixas de score para a UI admin.

### `lib/validations/friendly-request.ts`

- adicionar schemas minimos para review pos-jogo e filtros de adversarios, se necessario;
- nao inflar os schemas atuais de create/process com regras de UI desnecessarias.

### `app/api/friendly-requests/route.ts`

- ao criar friendly request publica, criar ou reaproveitar `OpponentProfile` do time alvo;
- registrar `OpponentInteraction` como `REQUEST_RECEIVED`;
- manter rate limit e validacao existentes intactos.

### `app/api/friendly-requests/[id]/route.ts`

- ao aprovar, registrar interacao de aprovacao e vinculo com a `Match` criada;
- ao rejeitar, registrar interacao correspondente;
- preservar a transacao atual que cria `Match` e RSVPs.

### `app/api/opponents/route.ts` e `app/api/opponents/[id]/route.ts`

- restringir GET ao admin do proprio time;
- expor lista ordenada por `lastInteractionAt` e detalhe com timeline curta;
- retornar score privado com breakdown simples, nao apenas um numero cru.

---

## Smoke Test da PR

1. Uma nova `FriendlyRequest` cria ou atualiza `OpponentProfile`.
2. Aprovar a solicitacao registra interacoes e vincula a `Match` criada.
3. Rejeitar a solicitacao registra a interacao correta sem quebrar o fluxo atual.
4. `GET /api/opponents` retorna adversarios do time autenticado ordenados por interacao recente.
5. Outro time admin nao consegue ler o CRM alheio.

---

## Fora de Escopo desta PR

- tela nova de dashboard completa;
- score publicado na vitrine;
- merge manual de perfis duplicados;
- sincronizacao entre CRM de dois times.