# API Contract: Matches

**Base path**: `/api/matches`  
**Auth**: Required (all routes)  
**Authorization**: ADMIN for write; ADMIN/PLAYER for read

## GET /api/matches
Listar partidas do time.

**Auth**: ADMIN ou PLAYER  
**Query params**:
```typescript
{
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED"
  type?: "FRIENDLY" | "CHAMPIONSHIP"
  from?: string     // ISO date, filtro de data início
  to?: string       // ISO date, filtro de data fim
}
```

**Response 200**:
```typescript
{
  matches: Array<{
    id: string
    date: string            // ISO 8601
    venue: string
    opponent: string
    type: "FRIENDLY" | "CHAMPIONSHIP"
    homeScore: number | null
    awayScore: number | null
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED"
    shareToken: string
    rsvpSummary: {
      confirmed: number
      declined: number
      pending: number
    }
    createdAt: string
  }>
}
```

---

## POST /api/matches
Agendar nova partida.

**Auth**: ADMIN  
**Request Body**:
```typescript
{
  date: string              // ISO 8601, deve ser futuro
  venue: string             // min 2, max 200
  opponent: string          // min 2, max 100
  type: "FRIENDLY" | "CHAMPIONSHIP"
}
```

**Response 201**:
```typescript
{
  id: string
  date: string
  venue: string
  opponent: string
  type: string
  status: "SCHEDULED"
  shareToken: string
  shareUrl: string          // URL completa para compartilhar
  createdAt: string
}
```

**Side effects**: Cria RSVP com status `PENDING` para todos os jogadores ACTIVE do time.

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 400 | DATE_IN_PAST | Data no passado |

---

## GET /api/matches/:id
Detalhes de uma partida com RSVPs e stats.

**Auth**: ADMIN ou PLAYER

**Response 200**:
```typescript
{
  id: string
  date: string
  venue: string
  opponent: string
  type: string
  homeScore: number | null
  awayScore: number | null
  status: string
  shareToken: string
  shareUrl: string
  rsvps: Array<{
    playerId: string
    playerName: string
    status: "PENDING" | "CONFIRMED" | "DECLINED"
    respondedAt: string | null
  }>
  stats: Array<{           // vazio se SCHEDULED
    playerId: string
    playerName: string
    goals: number
    assists: number
    yellowCards: number
    redCards: number
  }>
  canSubmitPostGame: boolean  // true se date < now && status == SCHEDULED
  createdAt: string
  updatedAt: string
}
```

---

## PATCH /api/matches/:id
Atualizar partida (dados básicos ou pós-jogo).

**Auth**: ADMIN  
**Request Body** (todos opcionais):
```typescript
{
  date?: string
  venue?: string
  opponent?: string
  type?: "FRIENDLY" | "CHAMPIONSHIP"
  status?: "CANCELLED"      // only CANCELLED accepted; COMPLETED via score submission
  homeScore?: number        // >= 0, para pós-jogo
  awayScore?: number        // >= 0, para pós-jogo
}
```

**Response 200**: Mesmo formato do GET single.

**Business rules**:
- Se `homeScore` e `awayScore` fornecidos, `Match.date` deve estar no passado (FR-014)
- Ao registrar placar, status muda para `COMPLETED`
- Se `status: "CANCELLED"` enviado, transição `SCHEDULED → CANCELLED` (match só pode ser cancelado se status atual é `SCHEDULED`)

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 400 | MATCH_NOT_PAST | Tentativa de registrar pós-jogo antes da data |
| 404 | NOT_FOUND | Partida não encontrada |

---

## DELETE /api/matches/:id
Deletar partida. Requer confirmação se possui stats (edge case do spec).

**Auth**: ADMIN  
**Query params**:
```typescript
{
  confirm?: "true"   // obrigatório se partida tem stats
}
```

**Response 200**:
```typescript
{
  message: "Match deleted"
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | HAS_STATS_NEEDS_CONFIRM | Partida tem stats; enviar `?confirm=true` |
| 404 | NOT_FOUND | Partida não encontrada |

---

## POST /api/matches/:id/rsvp
Confirmar ou recusar presença em uma partida.

**Auth**: PLAYER (ou ADMIN que também é jogador)  
**Request Body**:
```typescript
{
  status: "CONFIRMED" | "DECLINED"
}
```

**Response 200**:
```typescript
{
  playerId: string
  matchId: string
  status: string
  respondedAt: string
}
```

**Business rules**:
- `Match.date` deve estar no futuro (FR-013)
- Jogador deve ter Player vinculado e status ACTIVE

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | MATCH_ALREADY_PAST | Partida já ocorreu |
| 400 | PLAYER_INACTIVE | Jogador está inativo |
| 403 | NO_PLAYER_LINKED | Usuário não tem jogador vinculado |
| 404 | NOT_FOUND | Partida não encontrada |
