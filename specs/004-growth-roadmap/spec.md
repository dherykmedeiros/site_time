# Roadmap de Crescimento — Novas Funcionalidades Diferenciais

**Spec Branch**: `004-growth-roadmap`
**Data**: 2026-03-31
**Status**: Draft — Análise + Planejamento

---

## Contexto: O Que Já Foi Construído

A aplicação atual (spec 003 — 100% completa) cobre o ciclo operacional básico de um time amador:

| Módulo | Entregue |
|---|---|
| Auth com dois papéis (Admin/Jogador) | ✅ |
| Configuração do time + página pública (Vitrine) | ✅ |
| Gestão de elenco com convites por email | ✅ |
| Agendamento de partidas + RSVP | ✅ |
| Estatísticas pós-jogo (gols, assist., cartões) | ✅ |
| Rankings automáticos (artilheiro, assistências) | ✅ |
| Solicitação de amistosos via Vitrine pública | ✅ |
| Gestão financeira (caixinha) | ✅ |
| OpenGraph + WhatsApp deep links | ✅ |

---

## Diagnóstico: Onde a Aplicação Perde para o Status Quo

O time médio amador hoje usa:
- **WhatsApp** → comunicação e convocação
- **Planilha Google** → controle financeiro
- **Nada formal** → estatísticas e histórico

A aplicação já resolve esses pontos, mas ainda **não cria o loop viral** que faz o jogador querer mostrar para outros. O diferencial de crescimento está em **engajamento individual do jogador** e **descoberta de novos times**.

---

## Eixos de Crescimento

### Eixo 1 — Viral / Social
> Fazer cada jogador se tornar canal de aquisição do produto

### Eixo 2 — Stickiness Operacional
> O time não consegue mais funcionar sem a ferramenta

### Eixo 3 — Ecossistema / Rede
> Conectar times entre si, criando um mercado vivo de amistosos

### Eixo 4 — Monetização Sustentável
> Funcionalidades Pro que justificam um plano pago

---

## Funcionalidades Propostas por Prioridade

---

### [P1] F-001 — Perfil Público do Jogador com Estatísticas de Carreira

**Eixo**: Viral / Social
**Por que diferencia**: Cada jogador tem uma "figurinha" digital pública que pode compartilhar. Artilheiro da rodada → foto no status do WhatsApp. Criar ego loop.

**URL**: `/vitrine/[slug]/jogadores/[playerId]`

**Conteúdo da página**:
- Foto, nome, posição, número da camisa
- Total de partidas disputadas, gols, assistências, cartões
- Últimas 5 partidas jogadas (com placar e suas stats)
- "Jogando pelo [nome do time]" com link para a Vitrine

**Mudanças necessárias**:
- Nova rota pública (server component)
- API endpoint `GET /api/players/[id]/public` (sem auth, só dados públicos)
- Link na Vitrine para cada jogador da lista do elenco

**Entidades afetadas**: Player, MatchStats, Match (read-only, sem schema change)

---

### [P1] F-002 — Cards de Resultado Compartilháveis (OG Image API)

**Eixo**: Viral / Social
**Por que diferencia**: Após registrar o pós-jogo, o admin gera um card visual (como o Wordle share) com resultado, artilheiros e placar. Pronto para colar no WhatsApp/Instagram. **Este é o principal motor viral.**

**Implementação**:
- `GET /api/og/match/[id]` → Next.js `ImageResponse` (`@vercel/og`) gerando imagem PNG dinâmica
- Card mostra: "Flamengo Society 3 × 1 Corinthians FC", data, artilheiros do jogo, cores do time
- Botão "Compartilhar Resultado" na página do jogo (copia URL ou abre WhatsApp share)
- OpenGraph da página do jogo aponta para esta imagem dinâmica

**Mudanças necessárias**:
- Nova route `app/api/og/match/[id]/route.tsx` com `ImageResponse`
- Botão "Gerar Card" no post-game form após salvar stats
- Sem mudança de schema

---

### [P1] F-003 — Controle de Mensalidade por Jogador (Payment Tracker)

**Eixo**: Stickiness Operacional
**Por que diferencia**: A "caixinha" já existe, mas não tem o controle de **quem pagou a mensalidade este mês**. Esse é o maior ponto de atrito em qualquer time amador.

**Funcionalidade**:
- Painel de mensalidade no dashboard: lista todos os jogadores ativos com status do mês atual (Pago / Pendente / Isento)
- Admin marca o pagamento de cada jogador → cria automaticamente uma transação `INCOME + MEMBERSHIP` na caixinha
- Jogador vê no seu painel se está em dia
- Vitrine pode opcionalmente mostrar % do time "em dia" (gamificação coletiva)

**Mudanças de schema necessárias**:
- Novo modelo `MembershipPayment { id, playerId, teamId, month (Int), year (Int), amount, paidAt, transactionId? }`
- Enum novo ou campo no `Transaction` para vincular ao jogador (opcional, usando `playerRef`)

**Novas rotas**:
- `GET /api/players/membership?month=&year=` → status de todos os jogadores
- `POST /api/players/[id]/membership` → registrar pagamento (cria Transaction automaticamente)
- `DELETE /api/players/[id]/membership/[paymentId]` → estornar

---

### [P2] F-004 — Sistema de Conquistas e Badges (Gamificação)

**Eixo**: Viral / Social + Stickiness
**Por que diferencia**: Jogadores voltam para ver se conquistaram novas medalhas. Conquistas são compartilháveis.

**Badges iniciais**:

| Badge | Gatilho |
|---|---|
| 🥇 Artilheiro da Rodada | Mais gols em uma única partida |
| ⚽ Hat-Trick | 3+ gols em uma partida |
| 🎯 Assistências em Série | 3+ assistências em 3 jogos consecutivos |
| 🛡️ Presença 100% | Confirmou presença em todas as partidas de um mês |
| 👑 Capitão | 50+ partidas pelo time |
| 💰 Mensalidade em Dia | 6 meses consecutivos de pagamento |

**Implementação**:
- Processamento assíncrono após registro de pós-jogo (pode ser um Server Action ou job simples)
- Modelo `Achievement { id, playerId, type (enum), matchId?, awardedAt }`
- Exibição no perfil público do jogador (F-001) e no painel do jogador
- Notificação in-app (badge no sino) quando conquista é desbloqueada

---

### [P2] F-005 — Modo Temporada / Campeonato

**Eixo**: Stickiness Operacional
**Por que diferencia**: Times participam de campeonatos de bairro, ligas locais. Hoje não há como agrupar partidas em uma competição com classificação.

**Funcionalidade**:
- Admin cria uma `Season` (ex: "Copa Verão 2026") com data de início/fim
- Partidas do tipo `CHAMPIONSHIP` podem ser associadas a uma Season
- Classificação automática dentro da Season (pontos, saldo de gols, posição)
- Página pública da Season na Vitrine: tabela de classificação, artilheiros da temporada
- Exportar classificação como imagem (mesma tech do F-002)

**Schema**:
```
Season { id, teamId, name, type (LEAGUE|CUP|TOURNAMENT), startDate, endDate, status }
Match.seasonId → Season (opcional)
```

---

### [P2] F-006 — PWA + Push Notifications

**Eixo**: Stickiness Operacional
**Por que diferencia**: O maior problema declarado é que jogadores esquecem de confirmar presença. Push notification resolve isso sem depender do admin colar link no WhatsApp.

**Notificações disparadas**:
- Nova partida agendada → todos os jogadores ativos
- Lembrete 24h antes da partida (se RSVP pendente)
- Resultado registrado → todos que jogaram (com suas stats)
- Nova conquista desbloqueada
- Solicitação de amistoso aprovada (para o solicitante)

**Implementação**:
- `manifest.json` + `service-worker.js` para PWA
- Web Push API com VAPID keys (`web-push` package)
- Modelo `PushSubscription { id, userId, endpoint, keys }`
- Rota `POST /api/push/subscribe` e `POST /api/push/send` (internal)
- Botão "Ativar Notificações" no painel do jogador

---

### [P2] F-007 — Gerador de Convocação para WhatsApp

**Eixo**: Stickiness Operacional
**Por que diferencia**: Hoje o admin ainda precisa escrever a mensagem de convocação manualmente no WhatsApp. Automatizar isso cria um uso diário da ferramenta.

**Funcionalidade**:
- Na página de detalhes do jogo, botão "Gerar Convocação"
- Sistema monta o texto: data, horário, local, lista de confirmados/pendentes, link deep link da partida
- Exemplo de output:
  ```
  ⚽ JOGO DOMINGO!
  📅 06/04 às 10h
  📍 Society do Zé
  
  ✅ Confirmados (7): João, Pedro, Lucas...
  ⏳ Aguardando (4): Carlos, Rafael...
  
  👉 Confirme aqui: [link]
  ```
- Botão copia texto + abre `https://wa.me/?text=...` com texto pré-preenchido

**Implementação**: Puramente frontend, sem mudança de schema ou API.

---

### [P3] F-008 — Diretório Público de Times (Descoberta)

**Eixo**: Ecossistema / Rede
**Por que diferencia**: Criar um "marketplace" de amistosos. Time novo cadastrado → aparece no mapa/lista → outros times encontram e solicitam amistoso diretamente.

**Funcionalidade**:
- Página pública `/vitrine` (sem slug) → lista todos os times que optaram por aparecer
- Filtros: cidade, estado, tipo de campo (society, campo, futsal), dia preferido
- Cada card mostra: escudo, nome, cidade, aproveitamento, "Solicitar Amistoso"
- Time pode optar por aparecer ou não (campo `isPubliclyListed` no Team)

**Schema**:
```
Team.isPubliclyListed Boolean @default(false)
Team.city String?
Team.state String?
Team.preferredMatchDay String? (enum: WEEKDAY|WEEKEND|BOTH)
```

**Novas rotas**:
- `GET /api/teams/directory?city=&state=&matchDay=` → paginado, público

---

### [P3] F-009 — Avaliação Pós-Amistoso (Reputação de Times)

**Eixo**: Ecossistema / Rede
**Por que diferencia**: Quando um amistoso é aprovado e jogado, ambos os times podem avaliar a experiência. Cria um sistema de reputação que incentiva fair play.

**Funcionalidade**:
- Após marcar uma partida como concluída, admin pode avaliar o time adversário (1–5 estrelas + comentário)
- Avaliações aparecem no diretório público do time adversário
- Time com alto rating tem destaque no diretório

**Schema**:
```
TeamReview { id, reviewerTeamId, reviewedTeamId, matchId, rating (1-5), comment?, createdAt }
```

---

### [P3] F-010 — Plano Pro e Monetização

**Eixo**: Monetização
**Por que escalar**: Sem receita recorrente, o projeto não se sustenta. O plano Pro desbloqueia funcionalidades avançadas.

**Free (atual)**:
- 1 time por conta
- Até 20 jogadores
- Histórico de 1 temporada
- Sem push notifications

**Pro (R$ 29,90/mês ou R$ 269/ano)**:
- Times ilimitados por conta (multi-time owner)
- Jogadores ilimitados
- Histórico completo + exportação PDF
- Push notifications
- Conquistas e badges
- Destaque no diretório público
- Remove branding do Vitrine ("Powered by [App Name]")
- Suporte prioritário

**Implementação**:
- Campo `plan` no `Team` (FREE | PRO)
- Integração Stripe Checkout
- Webhook Stripe para atualizar plano
- Guards em server actions/API routes para features Pro

---

## Roadmap Sugerido (Sequência de Implementação)

```
Agora (Semana 1–2):
  F-001 Perfil público do jogador          [alto impacto, baixo esforço]
  F-007 Gerador de convocação WhatsApp     [alto impacto, esforço mínimo]

Curto prazo (Semana 3–6):
  F-002 Cards de resultado compartilháveis [principal motor viral]
  F-003 Controle de mensalidade            [principal dor operacional]

Médio prazo (Mês 2–3):
  F-006 PWA + Push notifications           [retenção = crescimento]
  F-004 Badges e conquistas                [engajamento do jogador]
  F-005 Modo temporada/campeonato          [diferencial competitivo]

Longo prazo (Mês 4+):
  F-008 Diretório de times                 [efeito de rede]
  F-009 Avaliações pós-amistoso            [qualidade da rede]
  F-010 Plano Pro                          [monetização]
```

---

## Mudanças de Schema Consolidadas

```prisma
// F-003
model MembershipPayment {
  id            String      @id @default(cuid())
  playerId      String
  teamId        String
  month         Int
  year          Int
  amount        Decimal     @db.Decimal(10, 2)
  paidAt        DateTime    @default(now())
  transactionId String?
  player        Player      @relation(fields: [playerId], references: [id])
  team          Team        @relation(fields: [teamId], references: [id])
  transaction   Transaction? @relation(fields: [transactionId], references: [id])

  @@unique([playerId, month, year])
  @@map("membership_payments")
}

// F-004
enum AchievementType {
  HAT_TRICK
  TOP_SCORER_ROUND
  ASSIST_STREAK
  FULL_ATTENDANCE
  CAPTAIN
  PAYMENT_STREAK
}

model Achievement {
  id        String          @id @default(cuid())
  playerId  String
  type      AchievementType
  matchId   String?
  awardedAt DateTime        @default(now())
  player    Player          @relation(fields: [playerId], references: [id])
  match     Match?          @relation(fields: [matchId], references: [id])

  @@map("achievements")
}

// F-005
enum SeasonType { LEAGUE CUP TOURNAMENT }
enum SeasonStatus { ACTIVE FINISHED }

model Season {
  id        String       @id @default(cuid())
  teamId    String
  name      String
  type      SeasonType
  startDate DateTime
  endDate   DateTime?
  status    SeasonStatus @default(ACTIVE)
  matches   Match[]
  team      Team         @relation(fields: [teamId], references: [id])
  createdAt DateTime     @default(now())

  @@map("seasons")
}

// F-006
model PushSubscription {
  id        String   @id @default(cuid())
  userId    String
  endpoint  String   @unique
  p256dh    String
  auth      String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("push_subscriptions")
}

// F-008 / F-009 — campos adicionados em Team
// Team.isPubliclyListed Boolean @default(false)
// Team.city             String?
// Team.state            String?
// Team.preferredMatchDay String?

model TeamReview {
  id               String   @id @default(cuid())
  reviewerTeamId   String
  reviewedTeamId   String
  matchId          String
  rating           Int
  comment          String?
  createdAt        DateTime @default(now())
  reviewerTeam     Team     @relation("ReviewsGiven", fields: [reviewerTeamId], references: [id])
  reviewedTeam     Team     @relation("ReviewsReceived", fields: [reviewedTeamId], references: [id])
  match            Match    @relation(fields: [matchId], references: [id])

  @@unique([reviewerTeamId, matchId])
  @@map("team_reviews")
}

// F-010
enum Plan { FREE PRO }
// Team.plan Plan @default(FREE)
// Team.stripeCustomerId String?
// Team.stripeSubscriptionId String?
```

---

## Resumo Executivo

| Feature | Eixo | Esforço | Impacto | Prioridade |
|---|---|---|---|---|
| F-001 Perfil público do jogador | Viral | Baixo | Alto | **P1** |
| F-007 Gerador convocação WhatsApp | Operacional | Mínimo | Alto | **P1** |
| F-002 Cards de resultado | Viral | Médio | Muito Alto | **P1** |
| F-003 Controle de mensalidade | Operacional | Médio | Alto | **P1** |
| F-006 PWA + Push notifications | Retenção | Alto | Alto | **P2** |
| F-004 Badges e conquistas | Engajamento | Médio | Médio | **P2** |
| F-005 Modo temporada | Diferencial | Alto | Médio | **P2** |
| F-008 Diretório de times | Rede | Alto | Muito Alto | **P3** |
| F-009 Avaliações pós-amistoso | Rede | Médio | Médio | **P3** |
| F-010 Plano Pro | Monetização | Alto | Alto | **P3** |

**A aposta maior a médio prazo é o trio F-001 + F-002 + F-007**: custo de implementação baixo, impacto viral alto porque fazem o jogador compartilhar a ferramenta por conta própria. Cada resultado compartilhado = nova exposição da plataforma.
