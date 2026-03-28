# Data Model: Gestão de Times Esportivos Amadores

**Feature**: 003-sports-team-mgmt  
**Date**: 2026-03-28  
**ORM**: Prisma (PostgreSQL)

## Entity Relationship Diagram

```
User 1──0..1 Player
User N──1 Team
Player N──1 Team
Player 1──N RSVP
Player 1──N MatchStats
Match N──1 Team
Match 1──N RSVP
Match 1──N MatchStats
FriendlyRequest N──1 Team
Transaction N──1 Team
InviteToken N──1 Team
InviteToken N──1 Player
```

## Enums

### Role
| Value | Description |
|-------|-------------|
| `ADMIN` | Dono ou membro da diretoria do time. Acesso total de leitura e escrita. |
| `PLAYER` | Jogador com conta. Acesso read-only + RSVP em partidas. |

### PlayerPosition
| Value | Description |
|-------|-------------|
| `GOALKEEPER` | Goleiro |
| `DEFENDER` | Zagueiro / Lateral |
| `MIDFIELDER` | Meio-campista |
| `FORWARD` | Atacante |

### PlayerStatus
| Value | Description |
|-------|-------------|
| `ACTIVE` | Jogador ativo no elenco |
| `INACTIVE` | Jogador inativo (preserva histórico) |

### MatchType
| Value | Description |
|-------|-------------|
| `FRIENDLY` | Amistoso |
| `CHAMPIONSHIP` | Campeonato |

### MatchStatus
| Value | Description |
|-------|-------------|
| `SCHEDULED` | Partida agendada (data futura) |
| `COMPLETED` | Partida realizada (pós-jogo disponível) |
| `CANCELLED` | Partida cancelada (preserva registro) |

### RSVPStatus
| Value | Description |
|-------|-------------|
| `PENDING` | Jogador ainda não respondeu |
| `CONFIRMED` | Jogador confirmou presença |
| `DECLINED` | Jogador recusou presença |

### FriendlyRequestStatus
| Value | Description |
|-------|-------------|
| `PENDING` | Solicitação aguardando análise |
| `APPROVED` | Solicitação aprovada (partida criada) |
| `REJECTED` | Solicitação rejeitada |

### TransactionType
| Value | Description |
|-------|-------------|
| `INCOME` | Receita |
| `EXPENSE` | Despesa |

### TransactionCategory
| Value | Description |
|-------|-------------|
| `MEMBERSHIP` | Mensalidade de jogador |
| `FRIENDLY_FEE` | Cota de amistoso |
| `VENUE_RENTAL` | Aluguel de quadra/campo |
| `REFEREE` | Arbitragem |
| `EQUIPMENT` | Material esportivo |
| `OTHER` | Outros |

## Entities

### User

Pessoa com acesso autenticado ao sistema.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, cuid | Identificador único |
| `email` | String | unique, not null | E-mail de login |
| `passwordHash` | String | not null | Hash da senha (bcrypt) |
| `name` | String | not null | Nome exibido |
| `role` | Role | not null, default `PLAYER` | Nível de acesso |
| `teamId` | String? | FK → Team, nullable | Time ao qual pertence (null até criar/associar time) |
| `playerId` | String? | FK → Player, unique | Jogador vinculado (opcional 1:1) |
| `createdAt` | DateTime | not null, default now | Data de criação |
| `updatedAt` | DateTime | not null, auto-update | Última atualização |

**Relationships**: Belongs to Team (0..1:N — nullable até admin criar time), optionally linked to Player (1:0..1)  
**Note**: `teamId` é nullable para permitir registro de admin antes da criação do time. Após criar/associar o time, `teamId` é preenchido.  
**Validation**:
- `email`: formato válido, max 255 chars
- `name`: min 2, max 100 chars
- `passwordHash`: gerado via bcrypt, nunca exposto em responses

---

### Team

Entidade central. Representa o time de futebol amador.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, cuid | Identificador único |
| `name` | String | not null | Nome do time |
| `slug` | String | unique, not null | Slug para URL da Vitrine |
| `badgeUrl` | String? | — | URL do escudo (upload) |
| `description` | String? | — | Descrição do time |
| `primaryColor` | String? | — | Cor primária (hex) |
| `secondaryColor` | String? | — | Cor secundária (hex) |
| `defaultVenue` | String? | — | Local padrão de jogos |
| `createdAt` | DateTime | not null, default now | Data de criação |
| `updatedAt` | DateTime | not null, auto-update | Última atualização |

**Relationships**: Has many Users, Players, Matches, FriendlyRequests, Transactions  
**Validation**:
- `name`: min 2, max 100 chars
- `slug`: auto-gerado do nome, lowercase, alphanumeric + hyphens, unique
- `primaryColor`, `secondaryColor`: formato hex (#RRGGBB)
- `badgeUrl`: path relativo ao upload

---

### Player

Jogador do elenco. Pode existir sem conta de User associada (FR-008.1).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, cuid | Identificador único |
| `name` | String | not null | Nome do jogador |
| `position` | PlayerPosition | not null | Posição em campo |
| `shirtNumber` | Int | not null | Número da camisa |
| `photoUrl` | String? | — | URL da foto (upload) |
| `status` | PlayerStatus | not null, default `ACTIVE` | Status no elenco |
| `teamId` | String | FK → Team, not null | Time ao qual pertence |
| `createdAt` | DateTime | not null, default now | Data de criação |
| `updatedAt` | DateTime | not null, auto-update | Última atualização |

**Relationships**: Belongs to Team (N:1), optionally linked to User (0..1:1), has many RSVPs, has many MatchStats  
**Validation**:
- `name`: min 2, max 100 chars
- `shirtNumber`: 1–99, unique dentro do mesmo Team (constraint composta)
- `position`: um dos valores do enum PlayerPosition

**Unique constraints**: `@@unique([teamId, shirtNumber])`

---

### Match

Partida agendada ou realizada.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, cuid | Identificador único |
| `date` | DateTime | not null | Data e horário da partida |
| `venue` | String | not null | Local da partida |
| `opponent` | String | not null | Nome do adversário |
| `type` | MatchType | not null | Tipo: Amistoso ou Campeonato |
| `homeScore` | Int? | — | Placar do time (preenchido pós-jogo) |
| `awayScore` | Int? | — | Placar do adversário (pós-jogo) |
| `status` | MatchStatus | not null, default `SCHEDULED` | Status da partida |
| `shareToken` | String | unique, not null | Token para deep link público |
| `teamId` | String | FK → Team, not null | Time que mandou/organizou |
| `createdAt` | DateTime | not null, default now | Data de criação |
| `updatedAt` | DateTime | not null, auto-update | Última atualização |

**Relationships**: Belongs to Team (N:1), has many RSVPs, has many MatchStats  
**Validation**:
- `date`: não pode ser no passado ao criar (mas pode ser no passado ao registrar pós-jogo)
- `venue`: min 2, max 200 chars
- `opponent`: min 2, max 100 chars
- `homeScore`, `awayScore`: >= 0 (quando preenchido)
- `shareToken`: UUID v4, auto-gerado na criação

**State transitions**:
- `SCHEDULED` → `COMPLETED`: Quando admin registra pós-jogo (após date ter passado)
- `SCHEDULED` → `CANCELLED`: Quando admin cancela a partida (somente se status atual é SCHEDULED)

---

### RSVP

Confirmação de presença de um jogador em uma partida.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, cuid | Identificador único |
| `status` | RSVPStatus | not null, default `PENDING` | Status da resposta |
| `playerId` | String | FK → Player, not null | Jogador |
| `matchId` | String | FK → Match, not null | Partida |
| `respondedAt` | DateTime? | — | Data/hora da resposta |
| `createdAt` | DateTime | not null, default now | Data de criação |

**Relationships**: Belongs to Player (N:1), belongs to Match (N:1)  
**Validation**:
- Status só pode ser alterado enquanto `Match.date` > now (FR-013)
- Um jogador só pode ter um RSVP por partida

**Unique constraints**: `@@unique([playerId, matchId])`

---

### MatchStats

Estatísticas individuais de um jogador em uma partida (pós-jogo).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, cuid | Identificador único |
| `goals` | Int | not null, default 0 | Gols marcados |
| `assists` | Int | not null, default 0 | Assistências |
| `yellowCards` | Int | not null, default 0 | Cartões amarelos |
| `redCards` | Int | not null, default 0 | Cartões vermelhos |
| `playerId` | String | FK → Player, not null | Jogador |
| `matchId` | String | FK → Match, not null | Partida |
| `createdAt` | DateTime | not null, default now | Data de criação |

**Relationships**: Belongs to Player (N:1), belongs to Match (N:1)  
**Validation**:
- Todos os campos numéricos: >= 0
- Somente criável quando `Match.status == COMPLETED` ou `Match.date` já passou (FR-014)
- `yellowCards`: max 2 por jogador por partida
- `redCards`: max 1 por jogador por partida

**Unique constraints**: `@@unique([playerId, matchId])`

---

### FriendlyRequest

Solicitação de amistoso recebida via Vitrine pública.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, cuid | Identificador único |
| `requesterTeamName` | String | not null | Nome do time solicitante |
| `contactEmail` | String | not null | E-mail de contato |
| `contactPhone` | String? | — | Telefone de contato |
| `suggestedDates` | String | not null | Datas/horários sugeridos (texto livre) |
| `suggestedVenue` | String? | — | Local sugerido |
| `proposedFee` | Decimal? | — | Valor de cota/taxa proposto |
| `status` | FriendlyRequestStatus | not null, default `PENDING` | Status da solicitação |
| `rejectionReason` | String? | — | Motivo da rejeição (se rejeitada) |
| `teamId` | String | FK → Team, not null | Time que recebeu a solicitação |
| `createdAt` | DateTime | not null, default now | Data de criação |
| `updatedAt` | DateTime | not null, auto-update | Última atualização |

**Relationships**: Belongs to Team (N:1)  
**Validation**:
- `requesterTeamName`: min 2, max 100 chars
- `contactEmail`: formato de e-mail válido
- `suggestedDates`: min 5, max 500 chars
- `proposedFee`: >= 0 (se informado)
- `rejectionReason`: obrigatório quando `status == REJECTED`

**State transitions**:
- `PENDING` → `APPROVED`: Admin aprova; sistema cria Match automaticamente (FR-020)
- `PENDING` → `REJECTED`: Admin rejeita com motivo

---

### Transaction

Registro de receita ou despesa do time (Caixinha).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, cuid | Identificador único |
| `type` | TransactionType | not null | Receita ou Despesa |
| `amount` | Decimal | not null | Valor em reais |
| `description` | String | not null | Descrição da transação |
| `category` | TransactionCategory | not null | Categoria |
| `date` | DateTime | not null | Data da transação |
| `teamId` | String | FK → Team, not null | Time proprietário |
| `createdAt` | DateTime | not null, default now | Data de criação |
| `updatedAt` | DateTime | not null, auto-update | Última atualização |

**Relationships**: Belongs to Team (N:1)  
**Validation**:
- `amount`: > 0 (valor positivo; `type` determina se é soma ou subtração)
- `description`: min 2, max 200 chars
- `date`: não pode ser no futuro

---

### InviteToken

Token para convite de jogador criar conta no sistema.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, cuid | Identificador único |
| `token` | String | unique, not null | Token UUID para URL do convite |
| `teamId` | String | FK → Team, not null | Time do convite |
| `playerId` | String | FK → Player, not null | Jogador a ser vinculado |
| `expiresAt` | DateTime | not null | Data de expiração (7 dias) |
| `usedAt` | DateTime? | — | Data em que foi utilizado |
| `createdAt` | DateTime | not null, default now | Data de criação |

**Relationships**: Belongs to Team (N:1), belongs to Player (N:1)  
**Validation**:
- Token não pode ser reutilizado (`usedAt` deve ser null para uso)
- Token não pode estar expirado (`expiresAt` > now)

## Prisma Schema Reference

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  PLAYER
}

enum PlayerPosition {
  GOALKEEPER
  DEFENDER
  MIDFIELDER
  FORWARD
}

enum PlayerStatus {
  ACTIVE
  INACTIVE
}

enum MatchType {
  FRIENDLY
  CHAMPIONSHIP
}

enum MatchStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
}

enum RSVPStatus {
  PENDING
  CONFIRMED
  DECLINED
}

enum FriendlyRequestStatus {
  PENDING
  APPROVED
  REJECTED
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum TransactionCategory {
  MEMBERSHIP
  FRIENDLY_FEE
  VENUE_RENTAL
  REFEREE
  EQUIPMENT
  OTHER
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(PLAYER)
  teamId       String?
  team         Team?    @relation(fields: [teamId], references: [id])
  playerId     String?  @unique
  player       Player?  @relation(fields: [playerId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("users")
}

model Team {
  id               String             @id @default(cuid())
  name             String
  slug             String             @unique
  badgeUrl         String?
  description      String?
  primaryColor     String?
  secondaryColor   String?
  defaultVenue     String?
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
  users            User[]
  players          Player[]
  matches          Match[]
  friendlyRequests FriendlyRequest[]
  transactions     Transaction[]
  inviteTokens     InviteToken[]

  @@map("teams")
}

model Player {
  id          String         @id @default(cuid())
  name        String
  position    PlayerPosition
  shirtNumber Int
  photoUrl    String?
  status      PlayerStatus   @default(ACTIVE)
  teamId      String
  team        Team           @relation(fields: [teamId], references: [id])
  user        User?
  rsvps       RSVP[]
  matchStats  MatchStats[]
  inviteTokens InviteToken[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@unique([teamId, shirtNumber])
  @@map("players")
}

model Match {
  id         String      @id @default(cuid())
  date       DateTime
  venue      String
  opponent   String
  type       MatchType
  homeScore  Int?
  awayScore  Int?
  status     MatchStatus @default(SCHEDULED)
  shareToken String      @unique @default(uuid())
  teamId     String
  team       Team        @relation(fields: [teamId], references: [id])
  rsvps      RSVP[]
  matchStats MatchStats[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  @@map("matches")
}

model RSVP {
  id          String     @id @default(cuid())
  status      RSVPStatus @default(PENDING)
  playerId    String
  player      Player     @relation(fields: [playerId], references: [id])
  matchId     String
  match       Match      @relation(fields: [matchId], references: [id])
  respondedAt DateTime?
  createdAt   DateTime   @default(now())

  @@unique([playerId, matchId])
  @@map("rsvps")
}

model MatchStats {
  id          String   @id @default(cuid())
  goals       Int      @default(0)
  assists     Int      @default(0)
  yellowCards Int      @default(0)
  redCards    Int      @default(0)
  playerId    String
  player      Player   @relation(fields: [playerId], references: [id])
  matchId     String
  match       Match    @relation(fields: [matchId], references: [id])
  createdAt   DateTime @default(now())

  @@unique([playerId, matchId])
  @@map("match_stats")
}

model FriendlyRequest {
  id                String                 @id @default(cuid())
  requesterTeamName String
  contactEmail      String
  contactPhone      String?
  suggestedDates    String
  suggestedVenue    String?
  proposedFee       Decimal?
  status            FriendlyRequestStatus  @default(PENDING)
  rejectionReason   String?
  teamId            String
  team              Team                   @relation(fields: [teamId], references: [id])
  createdAt         DateTime               @default(now())
  updatedAt         DateTime               @updatedAt

  @@map("friendly_requests")
}

model Transaction {
  id          String              @id @default(cuid())
  type        TransactionType
  amount      Decimal
  description String
  category    TransactionCategory
  date        DateTime
  teamId      String
  team        Team                @relation(fields: [teamId], references: [id])
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  @@map("transactions")
}

model InviteToken {
  id        String   @id @default(cuid())
  token     String   @unique @default(uuid())
  teamId    String
  team      Team     @relation(fields: [teamId], references: [id])
  playerId  String
  player    Player   @relation(fields: [playerId], references: [id])
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  @@map("invite_tokens")
}
```
