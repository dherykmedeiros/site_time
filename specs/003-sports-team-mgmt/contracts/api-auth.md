# API Contract: Authentication

**Base path**: `/api/auth`

## NextAuth.js Routes

Handled automatically by NextAuth.js catch-all route `app/api/auth/[...nextauth]/route.ts`.

### POST /api/auth/callback/credentials
Login com email e senha.

**Request Body**:
```typescript
{
  email: string    // formato email válido
  password: string // min 8 chars
}
```

**Responses**:
| Status | Description |
|--------|-------------|
| 200 | Login bem-sucedido, sessão JWT criada |
| 401 | Credenciais inválidas |

---

## Custom Auth Routes

### POST /api/auth/register
Criar nova conta de admin (time será criado depois via POST /api/teams).

**Request Body**:
```typescript
{
  email: string        // formato email, unique
  password: string     // min 8 chars
  name: string         // min 2, max 100 chars
}
```

**Response 201**:
```typescript
{
  id: string
  email: string
  name: string
  role: "ADMIN"
  teamId: null         // null até criar time via POST /api/teams
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 409 | EMAIL_EXISTS | Email já cadastrado |

---

### POST /api/auth/register-from-invite
Criar conta de jogador a partir de convite.

**Request Body**:
```typescript
{
  token: string        // Token do convite (UUID)
  email: string        // formato email
  password: string     // min 8 chars
  name: string         // min 2, max 100 chars
}
```

**Response 201**:
```typescript
{
  id: string
  email: string
  name: string
  role: "PLAYER"
  teamId: string
  playerId: string
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 400 | TOKEN_EXPIRED | Token expirado |
| 400 | TOKEN_USED | Token já utilizado |
| 404 | TOKEN_NOT_FOUND | Token inválido |
| 409 | EMAIL_EXISTS | Email já cadastrado |
