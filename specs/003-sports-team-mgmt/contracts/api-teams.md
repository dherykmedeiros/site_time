# API Contract: Teams

**Base path**: `/api/teams`  
**Auth**: Required (all routes)  
**Authorization**: ADMIN only for write operations

## POST /api/teams
Criar time (um por admin).

**Auth**: ADMIN  
**Request Body**:
```typescript
{
  name: string            // min 2, max 100
  description?: string    // max 500
  primaryColor?: string   // hex #RRGGBB
  secondaryColor?: string // hex #RRGGBB
  defaultVenue?: string   // max 200
}
```

**Response 201**:
```typescript
{
  id: string
  name: string
  slug: string          // auto-gerado do name
  description: string | null
  primaryColor: string | null
  secondaryColor: string | null
  defaultVenue: string | null
  badgeUrl: string | null
  createdAt: string     // ISO 8601
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 409 | TEAM_EXISTS | Admin já possui um time |
| 409 | SLUG_CONFLICT | Slug gerado já existe |

---

## GET /api/teams
Obter dados do time do usuário autenticado.

**Auth**: ADMIN ou PLAYER

**Response 200**:
```typescript
{
  id: string
  name: string
  slug: string
  badgeUrl: string | null
  description: string | null
  primaryColor: string | null
  secondaryColor: string | null
  defaultVenue: string | null
  createdAt: string
  updatedAt: string
  _count: {
    players: number
    matches: number
  }
}
```

---

## PATCH /api/teams
Atualizar configurações do time.

**Auth**: ADMIN  
**Request Body** (todos opcionais):
```typescript
{
  name?: string
  description?: string
  primaryColor?: string
  secondaryColor?: string
  defaultVenue?: string
}
```

**Response 200**: Mesmo formato do GET.

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 403 | FORBIDDEN | Usuário não é admin |
| 409 | SLUG_CONFLICT | Novo slug gerado conflita |
