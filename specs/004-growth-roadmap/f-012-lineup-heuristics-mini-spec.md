# Mini-Spec Técnico — F-012 Escalação Inteligente e Banco Sugerido

**Feature**: F-012  
**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft pronto para implementação

---

## Objetivo

Gerar uma sugestão de escalação titular e banco para partidas já criadas, usando dados que o produto já possui, com regras simples, explicáveis e ajustáveis pelo admin.

O sistema não escolhe “o melhor time possível”. Ele monta uma sugestão operacional útil para reduzir trabalho manual.

---

## Encaixe no Produto Atual

Hoje a aplicação já tem os insumos mínimos:

- `Player.position` como posição principal;
- RSVPs por partida com `CONFIRMED`, `DECLINED` e `PENDING`;
- `MatchPositionLimit` para restrição por posição;
- detalhe da partida em `app/api/matches/[id]/route.ts`;
- lista de presença confirmada exibida em `app/(dashboard)/matches/[id]/page.tsx`.

Isso permite implementar a F-012 sem depender de dados avançados de performance.

---

## Problema de Produto

Mesmo depois do RSVP, o admin ainda precisa resolver manualmente:

- quem deve começar jogando;
- quem vai para o banco;
- onde existe excesso ou carência por posição;
- como reorganizar rapidamente quando há desequilíbrio.

---

## Escopo Fechado do MVP

### Incluído

- sugestão de titulares e banco por partida;
- uso de posição principal como critério base;
- respeito a limites por posição quando existirem;
- priorização de jogadores com RSVP `CONFIRMED`;
- alertas de desequilíbrio do elenco;
- ação manual de recalcular sugestão.

### Fora de Escopo

- IA generativa;
- formação tática completa em campo visual;
- múltiplas posições por jogador;
- uso de nota técnica, gols ou ranking de desempenho para escolher titulares;
- substituições planejadas por tempo;
- travas persistidas por jogador no MVP inicial.

---

## Princípios da Heurística

### 1. Explicabilidade vence sofisticação

O admin deve entender por que alguém entrou como titular ou banco.

### 2. Confirmado vale mais que pendente

No MVP, apenas jogadores com RSVP `CONFIRMED` entram na sugestão principal. `PENDING` e `DECLINED` não entram em titulares nem banco.

### 3. Posição principal é a referência oficial

Sem cadastro de posição secundária, o sistema não deve inventar adaptação complexa. Quando faltar posição, ele sinaliza o problema em vez de mascará-lo silenciosamente.

### 4. Limite por posição orienta a distribuição

Se a partida tem `MatchPositionLimit`, a escalação usa esse limite como meta de preenchimento. Sem limite, o sistema usa distribuição por grupos simples e alerta baixa cobertura.

---

## Entrada da Heurística

### Dados mínimos

- partida;
- RSVPs da partida;
- jogadores vinculados aos RSVPs;
- posição principal de cada jogador;
- status do jogador;
- limites por posição, se existirem.

### Filtros obrigatórios

Entram no motor apenas jogadores:

- com `status = ACTIVE`;
- com RSVP `CONFIRMED`;
- pertencentes ao time da partida.

---

## Estratégia de Seleção no MVP

## Cenário A: partida com limites por posição

1. Agrupar confirmados por posição.
2. Para cada posição limitada, preencher titulares até o máximo configurado.
3. Jogadores excedentes da mesma posição vão para o banco.
4. Se faltar jogador para uma posição limitada, registrar alerta.
5. Qualquer confirmado de posição sem limite explícito vai para o banco por padrão, salvo se o total de titulares ainda estiver muito baixo.

## Cenário B: partida sem limites por posição

Usar distribuição conservadora baseada em cobertura por grupo:

- priorizar ao menos 1 goleiro, se existir confirmado;
- depois distribuir jogadores de linha respeitando a posição principal;
- não tentar montar formação tática fixa como 4-4-2 no MVP;
- quando houver excesso em alguma posição e falta em outra, mostrar alerta em vez de realocar automaticamente.

Nesse cenário, a saída deve ser entendida como “sugestão inicial de organização”, não como escalação ideal.

---

## Critério de Ordenação Dentro da Mesma Posição

Para evitar aleatoriedade total, a ordenação inicial recomendada é:

1. jogadores `ACTIVE` e `CONFIRMED`;
2. ordem estável pelo menor `shirtNumber`;
3. empate final por `createdAt` ascendente.

Justificativa:

- é determinístico;
- evita parecer arbitrário a cada refresh;
- não introduz viés de desempenho que o sistema ainda não sustenta bem.

No futuro, essa ordem pode evoluir para presença recente ou aderência histórica.

---

## Saída do Motor

O motor deve retornar uma estrutura agnóstica de UI.

### Shape sugerido

```json
{
  "starters": [
    {
      "playerId": "clx1",
      "playerName": "Carlos",
      "position": "GOALKEEPER",
      "reason": "Posicao preenchida conforme limite da partida"
    }
  ],
  "bench": [
    {
      "playerId": "clx2",
      "playerName": "Joao",
      "position": "FORWARD",
      "reason": "Excedente da posicao apos preencher titulares"
    }
  ],
  "alerts": [
    "Nao ha lateral direito confirmado para esta partida",
    "Existem 4 atacantes confirmados acima do limite sugerido"
  ],
  "meta": {
    "confirmedPlayers": 14,
    "startersCount": 11,
    "benchCount": 3,
    "usesPositionLimits": true,
    "confidence": "MEDIUM"
  }
}
```

---

## Regras de Alertas

Gerar alertas quando houver:

- ausência de goleiro confirmado;
- posição limitada sem cobertura suficiente;
- excesso relevante numa posição com limite explícito;
- poucos confirmados para montar base mínima;
- grande concentração de banco em uma única posição.

Os alertas devem ser texto curto e operacional.

---

## Persistência no MVP

### Decisão congelada

Não persistir travas manuais no primeiro corte.

### Motivo

- reduz modelagem extra e acelera entrega;
- permite validar utilidade da sugestão antes de investir em editor persistente;
- evita acoplamento prematuro entre F-012 e um sistema completo de lineup.

### Comportamento

- botão `Recalcular sugestão` apenas reexecuta o motor;
- qualquer ajuste manual no UI, se existir no primeiro corte, é efêmero na sessão;
- persistência de travas fica explicitamente para uma segunda iteração.

---

## Contrato de API Proposto

### GET `app/api/matches/[id]/lineup/route.ts`

Retorna a sugestão atual calculada em tempo real.

#### Response sugerido

```json
{
  "matchId": "clm123",
  "generatedAt": "2026-04-01T20:30:00.000Z",
  "lineup": {
    "starters": [],
    "bench": [],
    "alerts": [],
    "meta": {
      "confirmedPlayers": 0,
      "startersCount": 0,
      "benchCount": 0,
      "usesPositionLimits": false,
      "confidence": "LOW"
    }
  }
}
```

### POST `app/api/matches/[id]/lineup/route.ts`

Opcional no MVP. Se existir, serve apenas para forçar recalculação com mesmo contrato de resposta.

Como a sugestão é derivada e não persistida, `GET` isolado já resolve o MVP.

---

## Módulo de Domínio Sugerido

Criar um módulo em `lib/`.

### Nome sugerido

`lib/match-lineup.ts`

### Funções sugeridas

- `buildSuggestedLineup()`
- `groupConfirmedPlayersByPosition()`
- `buildLineupAlerts()`

O módulo deve receber dados já carregados e não depender diretamente de `fetch` ou de componentes.

---

## UX no Detalhe da Partida

### Local

`app/(dashboard)/matches/[id]/page.tsx`

### Bloco novo

Card `Escalacao sugerida`

### Conteúdo mínimo

- titulares agrupados por posição;
- banco agrupado por posição;
- alertas de desequilíbrio;
- botão de recalcular;
- nota curta explicando que a sugestão usa confirmações e posição principal.

### Linguagem

Evitar promessas exageradas como “melhor escalação”. Preferir:

- `Sugestao inicial`;
- `Baseada nos confirmados`;
- `Revise conforme seu criterio`.

---

## Casos de Borda

### Poucos confirmados

Se houver menos de 7 confirmados, ainda retornar lista parcial com alerta forte de baixa confiança.

### Sem goleiro

Retornar titulares sem goleiro apenas se não houver nenhum confirmado nessa posição, sempre com alerta explícito.

### Excesso extremo de uma posição

Não redistribuir automaticamente para outras posições. Mandar para banco e alertar.

### Jogadores inativos com RSVP legado

Ignorar do cálculo.

---

## Aceite Funcional

- partida com confirmados retorna titulares, banco e alertas coerentes;
- limites por posição, quando existirem, influenciam a sugestão;
- resultado é determinístico para o mesmo conjunto de dados;
- UI explica de forma simples a lógica usada;
- nenhuma alteração é feita em RSVP, stats ou cadastro do jogador.

---

## Arquivos Alvo Mais Prováveis

- `lib/match-lineup.ts`
- `lib/validations/match.ts`
- `app/api/matches/[id]/lineup/route.ts`
- `app/(dashboard)/matches/[id]/page.tsx`
- `components/dashboard/` para bloco visual reutilizável, se necessário

---

## Decisões Congeladas para Iniciar Implementação

- usar apenas confirmados no MVP;
- respeitar posição principal como fonte de verdade;
- não persistir travas manuais no primeiro corte;
- usar ordem determinística simples dentro da mesma posição;
- alertar desequilíbrio em vez de “inventar” adaptação silenciosa.