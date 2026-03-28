# API Contract: Friendly Requests

**Base path**: `/api/friendly-requests`  
**Auth**: Mixed (POST is public; GET/PATCH require auth)

## POST /api/friendly-requests
Enviar solicitação de amistoso (formulário público da Vitrine).

**Auth**: Nenhuma (endpoint público)  
**Rate limit**: 5 requests/hora por IP (FR-029)

**Request Body**:
```typescript
{
  teamSlug: string             // slug do time na Vitrine
  requesterTeamName: string    // min 2, max 100
  contactEmail: string         // formato email válido
  contactPhone?: string        // max 20
  suggestedDates: string       // min 5, max 500
  suggestedVenue?: string      // max 200
  proposedFee?: number         // >= 0, em reais
}
```

**Response 201**:
```typescript
{
  id: string
  status: "PENDING"
  message: "Solicitação enviada com sucesso. Você receberá uma resposta por e-mail."
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 404 | TEAM_NOT_FOUND | Slug do time inválido |
| 429 | RATE_LIMITED | Muitas solicitações; tentar novamente em X minutos |

---

## GET /api/friendly-requests
Listar solicitações recebidas pelo time.

**Auth**: ADMIN  
**Query params**:
```typescript
{
  status?: "PENDING" | "APPROVED" | "REJECTED"
}
```

**Response 200**:
```typescript
{
  requests: Array<{
    id: string
    requesterTeamName: string
    contactEmail: string
    contactPhone: string | null
    suggestedDates: string
    suggestedVenue: string | null
    proposedFee: number | null
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: string
  }>
}
```

---

## GET /api/friendly-requests/:id
Detalhes de uma solicitação.

**Auth**: ADMIN

**Response 200**:
```typescript
{
  id: string
  requesterTeamName: string
  contactEmail: string
  contactPhone: string | null
  suggestedDates: string
  suggestedVenue: string | null
  proposedFee: number | null
  status: string
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
}
```

---

## PATCH /api/friendly-requests/:id
Aprovar ou rejeitar solicitação.

**Auth**: ADMIN  
**Request Body**:
```typescript
{
  action: "approve" | "reject"
  // Se approve:
  matchDate?: string          // ISO 8601, data confirmada para a partida
  matchVenue?: string         // local confirmado
  // Se reject:
  rejectionReason?: string    // motivo da rejeição
}
```

**Response 200 (approve)**:
```typescript
{
  request: {
    id: string
    status: "APPROVED"
  }
  match: {                    // partida criada automaticamente (FR-020)
    id: string
    date: string
    venue: string
    opponent: string
    type: "FRIENDLY"
    status: "SCHEDULED"
  }
}
```

**Response 200 (reject)**:
```typescript
{
  request: {
    id: string
    status: "REJECTED"
    rejectionReason: string
  }
}
```

**Side effects**:
- **Approve**: Cria Match tipo FRIENDLY no calendário, envia email de aprovação ao solicitante (FR-021)
- **Reject**: Envia email de rejeição com motivo ao solicitante (FR-021)

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 400 | NOT_PENDING | Solicitação já processada |
| 404 | NOT_FOUND | Solicitação não encontrada |
