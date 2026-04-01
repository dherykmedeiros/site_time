# Mini-Spec Técnico — F-011 Central de Disponibilidade Recorrente

**Feature**: F-011  
**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft pronto para implementação

---

## Objetivo

Permitir que cada jogador informe padrões recorrentes de disponibilidade e usar esses sinais para mostrar, ainda no formulário de criação/edição de partida, uma previsão simples de quorum e alertas de gargalo por posição.

Essa feature não substitui RSVP. Ela existe para melhorar a decisão antes do jogo ser criado.

---

## Encaixe no Produto Atual

Hoje o produto já tem a base necessária para a previsão:

- cadastro de jogadores com `position` e `status` em `Player`;
- criação de RSVPs automáticos ao criar partida;
- limites por posição em `MatchPositionLimit`;
- edição do próprio perfil do jogador via `app/api/players/me/route.ts`;
- criação e edição de partida via `components/forms/MatchForm.tsx` e `app/api/matches/route.ts`.

Logo, a menor implementação correta é adicionar uma camada de disponibilidade recorrente ligada ao jogador, sem mexer na semântica do RSVP atual.

---

## Problema de Produto que Será Resolvido

Antes de agendar uma partida, o admin ainda responde perguntas fora do sistema:

- “Quinta à noite costuma dar elenco?”
- “Tem goleiro que normalmente consegue nesse horário?”
- “Vale marcar esse jogo ou o risco de vazio é alto?”

A F-011 resolve isso com previsão explicável, não com automação opaca.

---

## Escopo Fechado do MVP

### Incluído

- cadastro de preferências recorrentes por jogador;
- suporte a mais de uma janela semanal por jogador;
- indicador de quorum estimado no formulário de partida;
- alertas por posição com base em jogadores ativos;
- endpoint admin de previsão para uma data e hora informadas;
- leitura e atualização da disponibilidade do jogador autenticado.

### Fora de Escopo

- bloqueios por data específica;
- sincronização com calendário externo;
- sugestão automática do melhor horário;
- machine learning;
- uso da disponibilidade para alterar RSVP automaticamente;
- edição administrativa da disponibilidade de outros jogadores.

---

## Modelo de Dados Proposto

Criar um novo modelo Prisma ligado a `Player`.

### Nome sugerido

`PlayerAvailabilityRule`

### Campos mínimos

- `id`
- `playerId`
- `dayOfWeek` (`0-6`, com convenção documentada)
- `startMinutes` (minutos desde 00:00)
- `endMinutes` (minutos desde 00:00)
- `frequency` (`WEEKLY`, `BIWEEKLY`, `MONTHLY_OPTIONAL`)
- `availability` (`AVAILABLE`, `UNAVAILABLE`, `PREFERABLE`)
- `notes` opcional curto
- `createdAt`
- `updatedAt`

### Justificativas

- `startMinutes` e `endMinutes` evitam problemas de parsing e timezone em janela recorrente.
- `availability` permite distinguir “consigo”, “prefiro esse horário” e “normalmente não consigo” sem precisar de modelo extra.
- `frequency` cobre o caso citado no roadmap de disponibilidade quinzenal sem inflar o MVP.

### Restrições recomendadas

- índice por `playerId`;
- índice composto por `playerId`, `dayOfWeek`;
- validação de `startMinutes < endMinutes`;
- limite inicial de até 10 regras por jogador.

---

## Regras de Negócio do MVP

### 1. Quem entra no cálculo

Entram apenas jogadores:

- do mesmo time do admin;
- com `status = ACTIVE`;
- com regra compatível com o dia e horário consultados.

### 2. Como uma regra casa com a partida

Uma regra casa com a partida quando:

- o `dayOfWeek` da partida é igual ao da regra;
- o horário da partida cai dentro da janela `[startMinutes, endMinutes)`.

### 3. Como interpretar `availability`

- `AVAILABLE`: conta como presença provável forte;
- `PREFERABLE`: conta como presença provável moderada;
- `UNAVAILABLE`: conta como indisponível provável.

### 4. Como interpretar `frequency`

Para o MVP, a previsão deve ser explicável e conservadora:

- `WEEKLY`: peso total;
- `BIWEEKLY`: peso parcial;
- `MONTHLY_OPTIONAL`: peso menor e tratado como baixa confiança.

Isso evita falsa precisão. O produto deve falar em “estimativa” e “tendência”, não em número exato garantido.

### 5. Score de quorum inicial

O endpoint retorna:

- `likelyAvailableCount`
- `uncertainCount`
- `likelyUnavailableCount`
- `coverageByPosition`
- `overallRisk`

### 6. Regra inicial de risco

- `LOW`: há base suficiente de jogadores prováveis e nenhuma posição crítica vazia;
- `MEDIUM`: quorum total razoável, mas com gargalo relevante em alguma posição;
- `HIGH`: poucos jogadores prováveis ou falta crítica de posição-chave.

### 7. Posições críticas no MVP

O cálculo deve destacar:

- goleiro;
- laterais se a partida tiver limite explícito;
- qualquer posição com limite definido e cobertura abaixo do necessário.

Sem limite configurado, o sistema só sinaliza cobertura baixa relativa, sem bloquear o fluxo.

---

## Contrato de API Proposto

### GET/PATCH `app/api/players/me/availability/route.ts`

#### GET response

```json
{
  "rules": [
    {
      "id": "clx123",
      "dayOfWeek": 4,
      "startMinutes": 1140,
      "endMinutes": 1380,
      "frequency": "WEEKLY",
      "availability": "AVAILABLE",
      "notes": "Saio do trabalho às 18h"
    }
  ]
}
```

#### PATCH request

```json
{
  "rules": [
    {
      "dayOfWeek": 2,
      "startMinutes": 1140,
      "endMinutes": 1380,
      "frequency": "WEEKLY",
      "availability": "AVAILABLE",
      "notes": ""
    }
  ]
}
```

#### Comportamento

- `PATCH` substitui o conjunto inteiro de regras do jogador autenticado;
- regras inválidas rejeitam a requisição inteira;
- jogador sem `playerId` vinculado recebe erro `403/404`, consistente com `players/me`.

### GET `app/api/matches/availability/route.ts`

#### Query params

- `date`: ISO string obrigatória
- `seasonId`: opcional, sem impacto no MVP
- `positionLimits[]`: não enviar por query; o frontend pode enviar consulta simples por `POST` no futuro, mas no MVP usar `GET` apenas para data e combinar com limites do form já preenchidos no cliente

Para reduzir complexidade inicial, o endpoint pode aceitar só `date` e retornar a cobertura-base do elenco. O `MatchForm` cruza esse retorno com os limites preenchidos localmente para mostrar os alertas finais.

#### Response sugerido

```json
{
  "snapshot": {
    "date": "2026-04-09T22:00:00.000Z",
    "activePlayers": 23,
    "likelyAvailableCount": 13,
    "uncertainCount": 5,
    "likelyUnavailableCount": 5,
    "overallRisk": "MEDIUM"
  },
  "positions": [
    {
      "position": "GOALKEEPER",
      "likelyAvailable": 1,
      "uncertain": 1,
      "likelyUnavailable": 0,
      "risk": "LOW"
    }
  ],
  "explanations": [
    "Ha apenas 1 goleiro com disponibilidade forte para este horario",
    "A base estimada de atletas disponiveis esta abaixo da media do elenco"
  ]
}
```

---

## Validação Zod Proposta

Criar um schema dedicado em `lib/validations/player-availability.ts`.

### Enum sugerido

- `availability`: `AVAILABLE | PREFERABLE | UNAVAILABLE`
- `frequency`: `WEEKLY | BIWEEKLY | MONTHLY_OPTIONAL`

### Regra por item

- `dayOfWeek`: inteiro entre `0` e `6`;
- `startMinutes`: inteiro entre `0` e `1439`;
- `endMinutes`: inteiro entre `1` e `1440`;
- `endMinutes > startMinutes`;
- `notes`: máximo 120 caracteres;
- array com no máximo 10 itens.

---

## Estratégia de Cálculo

Criar um agregador em `lib/` com responsabilidade única.

### Nome sugerido

`lib/player-availability.ts`

### Funções sugeridas

- `matchAvailabilityRulesForDate()`
- `buildAvailabilitySnapshot()`
- `buildPositionCoverageSummary()`

### Saída desejada

Uma estrutura agnóstica de UI que possa ser usada por:

- `MatchForm`;
- páginas futuras de detalhe da partida;
- escalação sugerida da F-012.

Essa reutilização é importante porque a F-012 deve depender da mesma interpretação de disponibilidade provável.

---

## UX do Jogador

### Local

Expandir `components/forms/PlayerSelfProfileForm.tsx`.

### Bloco novo

Seção: `Disponibilidade recorrente`

Cada linha deve permitir:

- dia da semana;
- horário inicial;
- horário final;
- frequência;
- tipo de disponibilidade;
- observação opcional;
- remover linha.

### Texto orientador

Explicar explicitamente:

- isso não confirma presença em jogos;
- isso ajuda o admin a prever melhores dias e horários;
- a confirmação real continua sendo feita no RSVP.

### Critério de UX

O jogador deve conseguir preencher tudo sem entender termos técnicos como “janela recorrente” ou “heurística”.

---

## UX do Admin no MatchForm

### Gatilho

Quando o campo `date` ficar preenchido com valor válido.

### Comportamento

- debounced fetch para `/api/matches/availability`;
- estado inicial neutro antes de informar data;
- estado de loading curto e discreto;
- exibição do termômetro abaixo da data e acima dos limites por posição.

### Conteúdo mínimo do card

- label de risco geral: `baixo`, `medio`, `alto`;
- contagem provável de jogadores disponíveis;
- 2 ou 3 alertas legíveis;
- resumo por posição apenas para posições críticas.

### Sem bloqueio

O formulário nunca deve impedir o agendamento por causa da previsão. A função é informar, não validar regra dura.

---

## Observabilidade do MVP

Mesmo sem stack analítica dedicada, vale registrar no mínimo:

- quantas vezes o endpoint de previsão foi consultado;
- quantas partidas foram criadas após consulta;
- quantos jogadores preencheram ao menos uma regra.

Se não houver analytics pronta, isso pode ficar apenas como log técnico ou anotação para a fase de implementação.

---

## Riscos e Decisões Deliberadas

### Risco 1: falsa sensação de precisão

Mitigação:

- usar linguagem de tendência;
- evitar porcentagem “científica” no MVP;
- mostrar explicações textuais curtas.

### Risco 2: complexidade demais no cadastro do jogador

Mitigação:

- limitar número de regras;
- formulário simples com defaults claros;
- permitir salvar zero regras.

### Risco 3: timezone e horário local

Mitigação:

- comparar disponibilidade sempre no horário local exibido no `datetime-local`;
- persistir janelas como minutos do dia e dia da semana;
- evitar converter regra recorrente para `DateTime` absoluto.

---

## Aceite Funcional

- jogador autenticado consegue cadastrar e editar regras recorrentes do próprio perfil;
- admin informa data/hora de uma nova partida e recebe uma previsão de quorum;
- previsão destaca pelo menos um risco geral e cobertura por posição quando houver;
- nenhum RSVP existente é alterado por essa feature;
- partidas continuam podendo ser criadas normalmente com ou sem previsão.

---

## Arquivos Alvo Mais Prováveis

- `prisma/schema.prisma`
- `lib/validations/player-availability.ts`
- `app/api/players/me/availability/route.ts`
- `app/api/matches/availability/route.ts`
- `components/forms/PlayerSelfProfileForm.tsx`
- `components/forms/MatchForm.tsx`
- `app/(dashboard)/matches/page.tsx`
- `app/(dashboard)/matches/[id]/page.tsx`

---

## Decisões Congeladas para Iniciar Implementação

- disponibilidade recorrente é complementar ao RSVP;
- edição é self-service pelo próprio jogador no MVP;
- previsão usa heurística explicável e sem bloqueio de fluxo;
- o cálculo usa jogadores ativos e posição principal já existentes;
- a primeira integração visual obrigatória é o `MatchForm`.