# API Contract: Finances

**Base path**: `/api/finances`  
**Auth**: Required (all routes)  
**Authorization**: ADMIN for write; ADMIN/PLAYER for read (FR-008)

## GET /api/finances
Listar transações financeiras do time.

**Auth**: ADMIN ou PLAYER  
**Query params**:
```typescript
{
  type?: "INCOME" | "EXPENSE"
  category?: "MEMBERSHIP" | "FRIENDLY_FEE" | "VENUE_RENTAL" | "REFEREE" | "EQUIPMENT" | "OTHER"
  from?: string       // ISO date, filtro período início
  to?: string         // ISO date, filtro período fim
  page?: number       // default 1
  limit?: number      // default 20, max 100
}
```

**Response 200**:
```typescript
{
  transactions: Array<{
    id: string
    type: "INCOME" | "EXPENSE"
    amount: number
    description: string
    category: string
    date: string          // ISO 8601
    createdAt: string
  }>
  balance: number          // saldo atual (total receitas - total despesas)
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

---

## POST /api/finances
Registrar nova transação.

**Auth**: ADMIN  
**Request Body**:
```typescript
{
  type: "INCOME" | "EXPENSE"
  amount: number                // > 0
  description: string           // min 2, max 200
  category: "MEMBERSHIP" | "FRIENDLY_FEE" | "VENUE_RENTAL" | "REFEREE" | "EQUIPMENT" | "OTHER"
  date: string                  // ISO date, não pode ser futuro
}
```

**Response 201**:
```typescript
{
  id: string
  type: string
  amount: number
  description: string
  category: string
  date: string
  createdAt: string
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 400 | DATE_IN_FUTURE | Data no futuro |

---

## PATCH /api/finances/:id
Atualizar uma transação.

**Auth**: ADMIN  
**Request Body** (todos opcionais):
```typescript
{
  type?: "INCOME" | "EXPENSE"
  amount?: number
  description?: string
  category?: string
  date?: string
}
```

**Response 200**: Mesmo formato do POST response.

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Campos inválidos |
| 404 | NOT_FOUND | Transação não encontrada |

---

## DELETE /api/finances/:id
Deletar uma transação.

**Auth**: ADMIN

**Response 200**:
```typescript
{
  message: "Transaction deleted"
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 404 | NOT_FOUND | Transação não encontrada |

---

## GET /api/finances/summary
Resumo financeiro mensal.

**Auth**: ADMIN ou PLAYER  
**Query params**:
```typescript
{
  month: number     // 1-12
  year: number      // e.g. 2026
}
```

**Response 200**:
```typescript
{
  month: number
  year: number
  totalIncome: number
  totalExpense: number
  balance: number                // totalIncome - totalExpense
  byCategory: Array<{
    category: string
    type: "INCOME" | "EXPENSE"
    total: number
    count: number
  }>
}
```

**Errors**:
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Mês ou ano inválido |
