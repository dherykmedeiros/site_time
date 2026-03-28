# API Contract: Match Stats

**Base path**: `/api/matches/:matchId/stats`  
**Auth**: Required  
**Authorization**: ADMIN for write; ADMIN/PLAYER for read

## GET /api/matches/:matchId/stats
Listar estatísticas individuais de uma partida.

**Auth**: ADMIN ou PLAYER

**Response 200**:
```typescript
{
  matchId: string
  stats: Array<{
    id: string
    playerId: string
    playerName: string
    playerPosition: string
    goals: number
    assists: number
    yellowCards: number
    redCards: number
  }>
}
```

---

## POST /api/matches/:matchId/stats
Registrar estatísticas de pós-jogo (batch: múltiplos jogadores de uma vez).

**Auth**: ADMIN  
**Request Body**:
```typescript
{
  stats: Array<{
    playerId: string
    goals: number          // >= 0
    assists: number        // >= 0
    yellowCards: number    // 0-2
    redCards: number       // 0-1
  }>
}
```

**Response 201**:
```typescript
{
  matchId: string
  created: number        // quantidade de registros criados
  stats: Array<{
    id: string
    playerId: string
    goals: number
    assists: number
    yellowCards: number
    redCards: number
  }>
}
```

**Business rules**:
- `Match.date` deve estar no passado (FR-014)
- `Match` deve ter placar registrado (homeScore + awayScore preenchidos)
- Todos os playerIds devem pertencer ao time

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 400 | MATCH_NOT_COMPLETED | Partida ainda não foi marcada como completada |
| 400 | STATS_ALREADY_EXIST | Stats já registrados para este jogador nesta partida |
| 404 | MATCH_NOT_FOUND | Partida não encontrada |
| 404 | PLAYER_NOT_FOUND | Jogador não pertence ao time |

---

## GET /api/stats/rankings
Rankings agregados do time.

**Auth**: ADMIN ou PLAYER (também disponível publicamente via Vitrine)

**Query params**:
```typescript
{
  type?: "goals" | "assists" | "yellow_cards" | "red_cards" | "appearances"
  limit?: number     // default 10
}
```

**Response 200**:
```typescript
{
  teamId: string
  rankings: {
    topScorers: Array<{
      playerId: string
      playerName: string
      total: number
    }>
    topAssisters: Array<{
      playerId: string
      playerName: string
      total: number
    }>
    mostCards: Array<{
      playerId: string
      playerName: string
      yellowCards: number
      redCards: number
    }>
  }
  teamRecord: {
    totalMatches: number
    wins: number
    draws: number
    losses: number
    winRate: number        // porcentagem 0-100
    goalsScored: number
    goalsConceded: number
  }
}
```
