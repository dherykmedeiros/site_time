# API Contract: Players

**Base path**: `/api/players`  
**Auth**: Required (all routes)  
**Authorization**: ADMIN for write operations; PLAYER for read

## GET /api/players
Listar jogadores do time.

**Auth**: ADMIN ou PLAYER  
**Query params**:
```typescript
{
  status?: "ACTIVE" | "INACTIVE"  // filtro opcional
}
```

**Response 200**:
```typescript
{
  players: Array<{
    id: string
    name: string
    position: "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD"
    shirtNumber: number
    photoUrl: string | null
    status: "ACTIVE" | "INACTIVE"
    hasAccount: boolean    // se tem User vinculado
    createdAt: string
  }>
}
```

---

## POST /api/players
Cadastrar novo jogador no elenco.

**Auth**: ADMIN  
**Request Body**:
```typescript
{
  name: string            // min 2, max 100
  position: "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD"
  shirtNumber: number     // 1-99
  status?: "ACTIVE" | "INACTIVE"  // default ACTIVE
}
```

**Response 201**:
```typescript
{
  id: string
  name: string
  position: string
  shirtNumber: number
  photoUrl: string | null
  status: string
  teamId: string
  createdAt: string
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 409 | SHIRT_NUMBER_TAKEN | Número de camisa já em uso no time |

---

## GET /api/players/:id
Obter detalhes de um jogador.

**Auth**: ADMIN ou PLAYER

**Response 200**:
```typescript
{
  id: string
  name: string
  position: string
  shirtNumber: number
  photoUrl: string | null
  status: string
  hasAccount: boolean
  stats: {
    totalMatches: number
    totalGoals: number
    totalAssists: number
    totalYellowCards: number
    totalRedCards: number
  }
  createdAt: string
  updatedAt: string
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 404 | NOT_FOUND | Jogador não encontrado no time |

---

## PATCH /api/players/:id
Atualizar dados de um jogador.

**Auth**: ADMIN  
**Request Body** (todos opcionais):
```typescript
{
  name?: string
  position?: "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD"
  shirtNumber?: number
  status?: "ACTIVE" | "INACTIVE"
}
```

**Response 200**: Mesmo formato do GET single.

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 404 | NOT_FOUND | Jogador não encontrado |
| 409 | SHIRT_NUMBER_TAKEN | Número de camisa já em uso |

---

## DELETE /api/players/:id
Remover jogador do elenco. Estatísticas são preservadas (FR-009).

**Auth**: ADMIN

**Response 200**:
```typescript
{
  message: "Player removed"
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 404 | NOT_FOUND | Jogador não encontrado |

---

## PATCH /api/players/:id/promote
Promover jogador para o papel de Admin (Diretoria) — FR-007.

**Auth**: ADMIN  
**Pre-conditions**: Jogador deve ter conta vinculada (User).

**Request Body**:
```typescript
{
  role: "ADMIN"   // único valor aceito
}
```

**Response 200**:
```typescript
{
  id: string
  name: string
  role: "ADMIN"
  teamId: string
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | NO_ACCOUNT | Jogador não possui conta vinculada |
| 404 | NOT_FOUND | Jogador não encontrado |

---

## POST /api/players/invite
Gerar e enviar convite para um jogador criar conta.

**Auth**: ADMIN  
**Request Body**:
```typescript
{
  playerId: string        // ID do jogador já cadastrado
  email: string           // email para enviar o convite
}
```

**Response 201**:
```typescript
{
  inviteId: string
  playerId: string
  email: string
  expiresAt: string       // ISO 8601
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | ALREADY_HAS_ACCOUNT | Jogador já tem conta vinculada |
| 404 | PLAYER_NOT_FOUND | Jogador não encontrado |
