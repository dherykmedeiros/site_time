# Mini-Spec Tecnico - F-014 Recap Compartilhavel do Jogador e da Rodada

**Feature**: F-014  
**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft pronto para implementacao

---

## Objetivo

Criar ativos compartilhaveis que deem ao jogador e ao admin um motivo recorrente para voltar ao produto e divulgar o time. O recap deve aproveitar estatisticas e conquistas ja existentes, sem depender de um sistema novo de analytics pesado.

---

## Encaixe no Produto Atual

Hoje a base ja existe em partes importantes:

- pagina publica do jogador com carreira, ultimas partidas e conquistas;
- card OG de resultado de partida em `app/api/og/match/[id]/route.tsx`;
- pagina publica de partida com metadata OpenGraph;
- achievements em `Achievement`;
- rankings agregados em `app/api/stats/rankings/route.ts`;
- push e links compartilhaveis no detalhe da partida.

Logo, o MVP deve nascer como extensao da infraestrutura publica e de compartilhamento que ja existe.

---

## Problema de Produto

Hoje o produto compartilha bem o resultado do time, mas ainda nao gera um loop pessoal forte para o jogador:

- falta um ativo individual para compartilhar depois da rodada;
- falta um resumo semanal do time que nao dependa de montagem manual;
- o retorno do jogador ainda e mais utilitario do que aspiracional.

---

## Escopo Fechado do MVP

### Incluido

- recap individual do jogador da rodada;
- recap coletivo da rodada do time;
- versao OG compartilhavel por URL publica;
- CTA de compartilhar no perfil publico do jogador e no detalhe da partida concluida;
- uso de estatisticas da ultima partida e badge conquistada recentemente quando existir.

### Fora de Escopo

- feed cronologico de recaps;
- geracao automatica para toda semana via job agendado;
- video, animacao ou carrossel;
- analitica granular de clique por canal;
- recap multi-partida por periodo customizavel no MVP;
- edicao manual de layout pelo admin.

---

## Estrategia do MVP

### Recap individual

O foco inicial deve ser a ultima partida concluida do jogador com participacao registrada em `MatchStats`.

Elementos minimos:

- nome do jogador;
- nome do time;
- adversario e data;
- gols, assistencias e cartoes da rodada;
- marcador simples de participacao na partida;
- ultima conquista relevante se houver `Achievement` vinculada ao jogador perto da data da partida.

### Recap coletivo

O foco inicial deve ser a ultima partida concluida do time.

Elementos minimos:

- placar;
- adversario;
- top 3 contribuidores da rodada com base em gols e assistencias;
- homem da rodada com heuristica simples;
- resumo curto da temporada se houver `seasonId`.

---

## Fonte de Dados do MVP

### Recap individual

Consultar:

- `Player`;
- ultimas `MatchStats` do jogador com `match.status = COMPLETED`;
- `Achievement` recente do jogador;
- dados visuais do `Team`.

### Recap coletivo

Consultar:

- `Match` concluida;
- `MatchStats` agregadas da partida;
- dados do `Team`;
- opcionalmente standings/rankings quando houver `seasonId`.

---

## Heuristicas Congeladas do MVP

### Homem da rodada

Score inicial:

- gols x 3;
- assistencias x 2;
- amarelo x -1;
- vermelho x -3.

Desempate:

1. mais gols;
2. mais assistencias;
3. menor `shirtNumber`;
4. menor `createdAt` do jogador.

### Badge em destaque

Se houver mais de uma conquista recente, destacar a mais recente por `awardedAt`.

### Participacao do jogador

Se existir `MatchStats` na partida, considerar que o jogador participou da rodada. Nao inferir minutos jogados no MVP.

---

## Superficie Tecnica Recomendada

### Novas rotas OG

- `app/api/og/player-recap/[playerId]/route.tsx`
- `app/api/og/team-recap/[matchId]/route.tsx`

### Paginas/CTAs

- adicionar CTA no perfil publico em `app/vitrine/[slug]/jogadores/[id]/page.tsx`;
- adicionar CTA no detalhe admin da partida em `app/(dashboard)/matches/[id]/page.tsx`;
- opcionalmente adicionar CTA no detalhe publico da partida em `app/vitrine/[slug]/matches/[id]/page.tsx`.

### Camada de dominio sugerida

- `lib/player-recap.ts`
- `lib/team-recap.ts`

Esses modulos devem preparar payload neutro de UI para OG e para possiveis futuras telas internas.

---

## Contrato de Dados Sugerido

### Player recap payload

```json
{
  "player": {
    "id": "pl1",
    "name": "Carlos",
    "shirtNumber": 9,
    "position": "FORWARD"
  },
  "team": {
    "name": "VARzea FC",
    "primaryColor": "#0c6f5d",
    "badgeUrl": "/uploads/badge.png"
  },
  "match": {
    "id": "mt1",
    "date": "2026-04-01T20:00:00.000Z",
    "opponent": "Leoes",
    "homeScore": 3,
    "awayScore": 1
  },
  "performance": {
    "goals": 2,
    "assists": 1,
    "yellowCards": 0,
    "redCards": 0
  },
  "highlightAchievement": {
    "type": "TOP_SCORER_ROUND",
    "awardedAt": "2026-04-01T21:00:00.000Z"
  }
}
```

### Team recap payload

```json
{
  "match": {
    "id": "mt1",
    "opponent": "Leoes",
    "date": "2026-04-01T20:00:00.000Z",
    "homeScore": 3,
    "awayScore": 1
  },
  "topPerformers": [
    {
      "playerId": "pl1",
      "playerName": "Carlos",
      "goals": 2,
      "assists": 1,
      "score": 8
    }
  ],
  "manOfTheMatch": {
    "playerId": "pl1",
    "playerName": "Carlos"
  },
  "seasonSummary": {
    "seasonName": "Liga 2026",
    "positionLabel": "3o lugar",
    "points": 12
  }
}
```

---

## UX do MVP

### No perfil publico do jogador

- mostrar botao `Compartilhar recap da rodada` quando houver recap disponivel;
- se nao houver partida concluida recente, mostrar CTA inativo ou nao renderizar;
- o link deve abrir a rota publica/OG correspondente.

### No detalhe da partida

- mostrar CTA `Compartilhar rodada` apenas quando a partida estiver concluida;
- manter o card atual de resultado como ativo principal do time e adicionar o recap como ativo complementar.

---

## Medicao Minima

Sem introduzir stack nova de analytics no MVP, medir de forma leve:

- contagem de acessos nas rotas OG por recap;
- numero de jogadores com recap disponivel na ultima rodada;
- taxa de partidas concluidas com recap coletivo acessado ao menos uma vez.

Se nao houver persistencia de eventos no primeiro corte, registrar isso como limitacao conhecida do MVP.

---

## Riscos e Decisoes

### Risco principal

Se o recap depender de dados muito perfeitos, a feature perde cobertura. Por isso o MVP deve tolerar partidas com pouca estatistica e ainda produzir um card simples.

### Decisao congelada

O recap nasce orientado a ultima partida concluida, nao a uma semana calendario. Isso simplifica regra, evita jobs e encaixa com o modelo atual.
