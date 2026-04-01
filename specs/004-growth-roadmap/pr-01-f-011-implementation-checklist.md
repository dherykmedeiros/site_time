# Checklist Técnico - PR-01 da F-011

**Feature**: F-011 Central de Disponibilidade Recorrente  
**PR alvo**: PR-01 - base de dados e CRUD do jogador  
**Data**: 2026-04-01  
**Objetivo**: abrir a menor superfície correta para disponibilidade recorrente sem tocar previsão de quorum no `MatchForm` ainda.

---

## Escopo Congelado da PR-01

Esta PR entrega apenas:

- modelagem Prisma para regras recorrentes do jogador;
- migration inicial;
- schema Zod dedicado para CRUD das regras;
- rota autenticada `GET/PATCH /api/players/me/availability`;
- contrato mínimo de resposta para o front do próprio jogador.

Esta PR **não** entrega:

- previsão de quorum no formulário de partida;
- integração com `MatchForm`;
- endpoint admin de disponibilidade por partida;
- alteração no payload de `GET /api/players/me`.

---

## Ordem Recomendada de Trabalho

1. Atualizar `prisma/schema.prisma`.
2. Gerar migration em `prisma/migrations/`.
3. Criar schema Zod dedicado em `lib/validations/player-availability.ts`.
4. Implementar `app/api/players/me/availability/route.ts`.
5. Validar manualmente o contrato com `GET` vazio, `PATCH` válido e `PATCH` inválido.

---

## Checklist por Arquivo

### `prisma/schema.prisma`

- [ ] Adicionar enum `AvailabilityFrequency` com `WEEKLY`, `BIWEEKLY`, `MONTHLY_OPTIONAL`.
- [ ] Adicionar enum `AvailabilityLevel` com `AVAILABLE`, `PREFERABLE`, `UNAVAILABLE`.
- [ ] Criar model `PlayerAvailabilityRule` com:
- [ ] `id String @id @default(cuid())`
- [ ] `playerId String`
- [ ] `player Player @relation(fields: [playerId], references: [id], onDelete: Cascade)`
- [ ] `dayOfWeek Int`
- [ ] `startMinutes Int`
- [ ] `endMinutes Int`
- [ ] `frequency AvailabilityFrequency`
- [ ] `availability AvailabilityLevel`
- [ ] `notes String?`
- [ ] `createdAt DateTime @default(now())`
- [ ] `updatedAt DateTime @updatedAt`
- [ ] Adicionar relação `availabilityRules PlayerAvailabilityRule[]` em `Player`.
- [ ] Criar `@@index([playerId])`.
- [ ] Criar `@@index([playerId, dayOfWeek])`.
- [ ] Criar `@@map("player_availability_rules")`.
- [ ] Manter o resto do schema intacto, sem expandir `Match`, `RSVP` ou `Transaction` nesta PR.

### `prisma/migrations/`

- [ ] Gerar uma migration nova só para `PlayerAvailabilityRule` e enums associadas.
- [ ] Verificar se o SQL cria a tabela com `ON DELETE CASCADE` para `playerId`.
- [ ] Verificar se índices de `playerId` e `playerId + dayOfWeek` foram materializados.
- [ ] Confirmar que a migration não altera tabelas fora do escopo da F-011.

### `lib/validations/player-availability.ts`

- [ ] Criar enums Zod para `frequency` e `availability` espelhando Prisma.
- [ ] Criar schema de item com:
- [ ] `dayOfWeek` inteiro entre `0` e `6`.
- [ ] `startMinutes` inteiro entre `0` e `1439`.
- [ ] `endMinutes` inteiro entre `1` e `1440`.
- [ ] refinamento `startMinutes < endMinutes`.
- [ ] `notes` opcional, `trim`, máximo de 120 caracteres.
- [ ] Criar schema de payload `updateOwnAvailabilitySchema` com `rules: z.array(...).max(10)`.
- [ ] Exportar tipos inferidos para uso na rota.
- [ ] Não misturar este contrato com `updateOwnPlayerProfileSchema` em `lib/validations/player.ts`.

### `app/api/players/me/availability/route.ts`

- [ ] Reaproveitar `requireAuth`.
- [ ] Reaproveitar a mesma lógica de team scoping já usada em `app/api/players/me/route.ts`.
- [ ] Buscar o `player` do usuário autenticado com `playerId` e `teamId` válidos.
- [ ] Retornar `404` com `code: "PLAYER_PROFILE_NOT_FOUND"` se não houver perfil de jogador vinculado.
- [ ] Implementar `GET` retornando `{ rules: [...] }` ordenado por `dayOfWeek`, `startMinutes`.
- [ ] Implementar `PATCH` com parse seguro do JSON.
- [ ] Em payload inválido, retornar `400` com `code: "VALIDATION_ERROR"` e `details` achatado.
- [ ] Em `PATCH` válido, substituir o conjunto inteiro de regras do jogador dentro de transação Prisma.
- [ ] Garantir que o `PATCH` não escreva regras para outro `playerId`.
- [ ] Retornar o payload final persistido no mesmo formato do `GET`.

### `components/forms/PlayerSelfProfileForm.tsx`

- [ ] Não alterar nesta PR.
- [ ] Registrar no comentário da PR que a integração visual entra na PR-02 ou PR específica de UI da F-011.

---

## Contrato de Resposta da Rota

### `GET /api/players/me/availability`

```json
{
  "rules": [
    {
      "id": "clx123",
      "dayOfWeek": 4,
      "startMinutes": 1140,
      "endMinutes": 1380,
      "frequency": "WEEKLY",
      "availability": "AVAILABLE",
      "notes": "Saio do trabalho às 18h"
    }
  ]
}
```

### `PATCH /api/players/me/availability`

```json
{
  "rules": [
    {
      "dayOfWeek": 2,
      "startMinutes": 1140,
      "endMinutes": 1380,
      "frequency": "WEEKLY",
      "availability": "AVAILABLE",
      "notes": ""
    }
  ]
}
```

---

## Smoke Test Manual da PR-01

### Cenário 1 - jogador sem regras

- [ ] Fazer `GET /api/players/me/availability` com jogador autenticado sem dados.
- [ ] Confirmar resposta `200` com `rules: []`.

### Cenário 2 - gravação válida

- [ ] Fazer `PATCH` com 2 ou 3 regras válidas.
- [ ] Confirmar resposta `200` com as regras persistidas.
- [ ] Repetir `GET` e confirmar que o payload bate com o salvo.

### Cenário 3 - substituição integral

- [ ] Fazer novo `PATCH` com conjunto menor de regras.
- [ ] Confirmar que regras antigas foram removidas.

### Cenário 4 - payload inválido

- [ ] Enviar `dayOfWeek = 7`.
- [ ] Enviar `startMinutes >= endMinutes`.
- [ ] Enviar mais de 10 regras.
- [ ] Confirmar `400` com `VALIDATION_ERROR`.

### Cenário 5 - usuário sem vínculo de jogador

- [ ] Autenticar usuário sem `playerId`.
- [ ] Confirmar `404` com `PLAYER_PROFILE_NOT_FOUND`.

---

## Critério de Pronto da PR-01

- [ ] schema Prisma atualizado com relação ligada a `Player`.
- [ ] migration isolada e limpa.
- [ ] schema Zod dedicado criado.
- [ ] rota `GET/PATCH /api/players/me/availability` funcional.
- [ ] team scoping validado.
- [ ] smoke test manual executado nos 5 cenários.
- [ ] nenhuma mudança indevida em `MatchForm`, quorum ou lineup.

---

## Handoff para a PR Seguinte

Se esta PR fechar corretamente, a próxima abre a camada derivada:

- agregador de quorum em `lib/`;
- `GET /api/matches/availability`;
- integração visual no `components/forms/MatchForm.tsx`.

Essa separação é importante para manter a F-011 explicável e revisar a modelagem antes de conectar previsão ao fluxo de agendamento.