# Mini-Spec Técnico — F-013 Borderô do Jogo

**Feature**: F-013  
**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft pronto para implementação

---

## Objetivo

Concentrar no detalhe da partida a operação do dia do jogo: checklist, presença real no local e despesas vinculadas ao evento, reduzindo controles paralelos em WhatsApp, bloco de notas e memória do admin.

---

## Encaixe no Produto Atual

Hoje o sistema já tem:

- detalhe completo da partida em `app/api/matches/[id]/route.ts`;
- RSVPs por jogador;
- fluxo de pós-jogo;
- módulo financeiro com criação manual de transações por time;
- formulário de transações reaproveitável em `components/forms/TransactionForm.tsx`.

Isso permite lançar um borderô enxuto sem reinventar o módulo financeiro.

---

## Problema de Produto

No dia do jogo, o admin ainda precisa controlar fora da plataforma:

- o que foi conferido antes da saída ou chegada;
- quem realmente apareceu;
- quanto custou arbitragem, campo, bola ou taxa do amistoso;
- como lembrar depois que aquela despesa nasceu daquela partida.

---

## Escopo Fechado do MVP

### Incluído

- checklist operacional por partida;
- check-in manual de presença real;
- registro de despesas da partida;
- vínculo explícito entre despesa e partida;
- visualização básica do borderô dentro do detalhe da partida.

### Fora de Escopo

- rateio automático gerando cobrança por jogador no primeiro corte;
- QR code ou geolocalização para check-in;
- assinatura digital do borderô;
- upload de comprovantes;
- edição colaborativa em tempo real;
- reconciliação financeira avançada.

---

## Decisão Principal do MVP

### Rateio fica como sugestão visual, não como pendência financeira automática

Essa decisão fecha a maior ambiguidade da feature.

### Motivos

- evita inflar o MVP com contas a receber por jogador;
- não exige nova semântica em mensalidades e cobranças;
- mantém a integração financeira simples e auditável;
- permite validar se o time realmente usa o borderô antes de automatizar cobrança.

### Comportamento esperado

- o admin informa despesas totais;
- o sistema mostra uma sugestão de valor por presente;
- nenhuma dívida individual é criada automaticamente.

---

## Modelo de Dados Proposto

### 1. `MatchChecklistItem`

Modelo ligado à partida.

Campos mínimos:

- `id`
- `matchId`
- `label`
- `isChecked`
- `sortOrder`
- `createdAt`
- `updatedAt`

### 2. `MatchAttendance`

Registro de presença real no local.

Campos mínimos:

- `id`
- `matchId`
- `playerId`
- `present`
- `checkedInAt` opcional
- `createdAt`
- `updatedAt`

### 3. Relação de transação com partida

Adicionar em `Transaction`:

- `matchId` opcional
- relação para `Match`

### Justificativa

- reaproveita a estrutura financeira existente;
- torna possível filtrar e explicar despesas por partida;
- evita duplicar um segundo modelo de despesa se a transação já resolve o núcleo financeiro.

---

## Checklist Padrão do MVP

Ao inicializar o borderô de uma partida, sugerir itens padrão:

- uniforme confirmado;
- bola disponível;
- coletes disponíveis;
- campo confirmado;
- arbitragem confirmada;
- adversário confirmado.

### Regra

- a lista nasce com defaults;
- o admin pode marcar e desmarcar;
- edição de texto customizado pode ficar para a segunda iteração.

Isso reduz escopo sem matar a utilidade.

---

## Check-in Real de Presença

### Regra do MVP

O universo inicial do check-in são os jogadores da lista de RSVP da partida.

### Interpretação

- quem confirmou RSVP pode ou não aparecer no local;
- quem estava pendente ou recusado pode acabar aparecendo e ainda assim pode ser marcado como presente, desde que já exista no elenco da partida;
- o borderô mede presença real, não apenas intenção.

### Regra de UI

Mostrar todos os jogadores da partida com status de RSVP e um toggle de presença real.

---

## Integração Financeira do MVP

### Estratégia

Criar despesas diretamente em `Transaction` com `type = EXPENSE` e `matchId` preenchido.

### Categorias iniciais mais prováveis

- `FRIENDLY_FEE`
- `VENUE_RENTAL`
- `REFEREE`
- `EQUIPMENT`
- `OTHER`

### Descrição recomendada

Prefixar automaticamente a descrição quando a origem for o borderô:

- `Partida vs X - Arbitragem`
- `Partida vs X - Aluguel do campo`

Isso melhora rastreabilidade sem exigir novo campo de label.

---

## Contrato de API Proposto

### GET/PATCH `app/api/matches/[id]/bordereau/route.ts`

#### GET response sugerido

```json
{
  "matchId": "clm123",
  "checklist": [
    {
      "id": "chk1",
      "label": "Campo confirmado",
      "isChecked": true,
      "sortOrder": 0
    }
  ],
  "attendance": [
    {
      "playerId": "pl1",
      "playerName": "Carlos",
      "rsvpStatus": "CONFIRMED",
      "present": true,
      "checkedInAt": "2026-04-01T21:00:00.000Z"
    }
  ],
  "expenses": [
    {
      "id": "tx1",
      "amount": 180,
      "category": "REFEREE",
      "description": "Partida vs Leoes - Arbitragem",
      "date": "2026-04-01T20:00:00.000Z"
    }
  ],
  "costSummary": {
    "totalExpense": 180,
    "presentCount": 12,
    "suggestedSharePerPresent": 15
  }
}
```

#### PATCH request sugerido

```json
{
  "checklist": [
    { "label": "Campo confirmado", "isChecked": true, "sortOrder": 0 }
  ],
  "attendance": [
    { "playerId": "pl1", "present": true }
  ]
}
```

### POST `app/api/matches/[id]/expenses/route.ts`

#### Request sugerido

```json
{
  "amount": 180,
  "description": "Arbitragem",
  "category": "REFEREE",
  "date": "2026-04-01T20:00:00.000Z"
}
```

#### Comportamento

- cria uma `Transaction` do time com `type = EXPENSE`;
- injeta `matchId`;
- devolve o total recalculado do borderô.

---

## Validação Zod Proposta

### Pode ficar em `lib/validations/match.ts` se o arquivo ainda estiver coeso

Schemas necessários:

- `bordereauChecklistItemSchema`
- `bordereauAttendanceItemSchema`
- `createMatchExpenseSchema`

### Regras mínimas

- checklist com no máximo 12 itens no MVP;
- `label` entre 2 e 80 caracteres;
- `playerId` deve existir no time da partida;
- despesa sempre com `amount > 0`;
- despesa não pode ter data futura;
- apenas categorias de despesa aceitas pelo financeiro atual.

---

## Estratégia de Persistência do Borderô

### Checklist

Persistido por partida, não derivado.

### Presença real

Persistida por partida e jogador.

### Despesas

Persistidas em `Transaction`, não em modelo paralelo de caixa.

Essa combinação mantém o domínio enxuto:

- operação específica fica nos modelos de partida;
- efeito contábil fica no financeiro existente.

---

## UX no Detalhe da Partida

### Local

`app/(dashboard)/matches/[id]/page.tsx`

### Seções do card `Bordero`

1. checklist pré-jogo;
2. presença real;
3. despesas do jogo;
4. resumo do custo total e rateio sugerido.

### Linguagem recomendada

- `Presenca real no local`
- `Custos desta partida`
- `Rateio sugerido entre presentes`

Evitar dizer que o sistema já “cobrou” alguém.

---

## Regras de Resumo Financeiro

### `presentCount`

Número de jogadores com `present = true`.

### `totalExpense`

Soma das `Transaction` de `EXPENSE` ligadas à partida.

### `suggestedSharePerPresent`

Se `presentCount > 0`:

`totalExpense / presentCount`

Se `presentCount = 0`:

retornar `null` e mostrar mensagem neutra.

---

## Casos de Borda

### Partida sem despesas

Borderô segue útil só com checklist e presença.

### Partida sem check-in feito

Rateio sugerido fica oculto ou nulo até existir ao menos um presente.

### Jogador desconfirmado, mas presente

Pode ser marcado como presente no local.

### Partida cancelada

Borderô fica somente leitura ou indisponível. No MVP, a opção mais segura é ocultar edição em partidas canceladas.

### Partida completada

Borderô continua editável por admin após o jogo para fechamento financeiro, desde que isso não conflite com a política do pós-jogo.

---

## Segurança e Permissões

- leitura do borderô: `requireAuth`, restrita ao mesmo time;
- edição do borderô e criação de despesa: `requireAdmin`;
- toda criação de despesa deve verificar `match.teamId === session.user.teamId`.

---

## Aceite Funcional

- admin consegue abrir uma partida e marcar checklist operacional;
- admin consegue registrar quem realmente compareceu;
- admin consegue lançar uma despesa vinculada à partida;
- o financeiro consegue rastrear que a despesa nasceu daquela partida;
- o sistema mostra apenas sugestão de rateio, sem criar cobrança individual automática.

---

## Arquivos Alvo Mais Prováveis

- `prisma/schema.prisma`
- `lib/validations/match.ts`
- `app/api/matches/[id]/bordereau/route.ts`
- `app/api/matches/[id]/expenses/route.ts`
- `app/api/finances/route.ts`
- `components/forms/TransactionForm.tsx`
- `app/(dashboard)/matches/[id]/page.tsx`
- `app/(dashboard)/finances/page.tsx`

---

## Decisões Congeladas para Iniciar Implementação

- checklist padrão e enxuto no MVP;
- presença real separada de RSVP;
- despesa do jogo persiste em `Transaction` com `matchId`;
- rateio é apenas sugestão visual no primeiro corte;
- edição do borderô fica restrita ao admin.