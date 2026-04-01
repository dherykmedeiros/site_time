# Mini-Spec Tecnico - F-016 CRM de Adversarios e Reputacao de Amistosos

**Feature**: F-016  
**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft pronto para implementacao incremental

---

## Objetivo

Dar ao admin memoria operacional sobre adversarios recorrentes, convertendo historico de solicitacoes e amistosos em um CRM leve e util para futuras negociacoes.

---

## Encaixe no Produto Atual

Hoje a aplicacao ja registra sinais importantes, mas dispersos:

- `FriendlyRequest` com nome do time solicitante, contato e status;
- `Match` com `opponent` em texto livre;
- pagina admin de solicitacoes de amistoso;
- aprovacao de solicitacao criando `Match` automaticamente.

O gap atual e que nao existe uma entidade consolidada de adversario nem historico confiavel por relacionamento.

---

## Problema de Produto

O admin lembra de cabeca:

- quem responde rapido;
- quem some depois do contato;
- quem costuma desmarcar;
- quem gera bom amistoso para repetir.

Sem memoria estruturada, a qualidade da rede depende de pessoas, nao do produto.

---

## Escopo Fechado do MVP

### Incluido

- consolidacao de relacionamento por adversario;
- timeline simples de contatos e partidas;
- score privado de confiabilidade;
- avaliacao curta apos amistoso concluido;
- destaque visual no painel admin para adversarios confiaveis e de risco.

### Fora de Escopo

- reputacao publica aberta para todos no primeiro corte;
- moderacao complexa de reviews;
- perfil publico editavel do adversario sem cadastro;
- sincronizacao bidirecional entre os dois times;
- grafo de rede entre varias equipes.

---

## Modelo de Dados Proposto

### Novo modelo `OpponentProfile`

Campos minimos:

- `id`
- `teamId`
- `displayName`
- `normalizedKey`
- `contactEmail` opcional
- `contactPhone` opcional
- `notes` opcional curto
- `reliabilityScore` inteiro `0-100`
- `lastInteractionAt` opcional
- `createdAt`
- `updatedAt`

### Novo modelo `OpponentInteraction`

Campos minimos:

- `id`
- `opponentProfileId`
- `type` (`REQUEST_RECEIVED`, `REQUEST_APPROVED`, `REQUEST_REJECTED`, `MATCH_SCHEDULED`, `MATCH_COMPLETED`, `NO_SHOW`, `MANUAL_NOTE`)
- `friendlyRequestId` opcional
- `matchId` opcional
- `summary` curto
- `occurredAt`
- `createdAt`

### Novo modelo `OpponentReview`

Campos minimos:

- `id`
- `opponentProfileId`
- `matchId`
- `punctuality` inteiro `1-5`
- `organization` inteiro `1-5`
- `sportsmanship` inteiro `1-5`
- `comment` opcional curto
- `createdAt`

### Justificativa

- separar perfil, interacao e review evita sobrecarregar `FriendlyRequest` e `Match`;
- `normalizedKey` permite consolidacao inicial por nome limpo do adversario;
- score privado fica recalculavel sem travar esquema futuro.

---

## Regra de Consolidacao Inicial

### Chave primaria do relacionamento

No MVP, consolidar por `teamId + normalizedKey`, onde `normalizedKey` deriva de `opponent` ou `requesterTeamName` em caixa baixa, sem espacos extras e sem pontuacao principal.

### Limitacao conhecida

Times com nomes parecidos podem colidir. Essa limitacao e aceitavel no primeiro corte porque a feature e privada e operacional.

---

## Heuristica do Score de Confiabilidade

Score inicial base: `50`.

Ajustes:

- `+10` por amistoso concluido;
- `+5` por solicitacao aprovada que virou partida;
- `-15` por no-show registrado;
- `-8` por rejeicao apos negociacao avancada, se houver marcacao manual futura;
- media das reviews pode ajustar em ate `+15` ou `-15`.

Faixas do MVP:

- `80-100`: confiavel;
- `60-79`: bom historico;
- `40-59`: neutro;
- `0-39`: atencao.

O score deve ser explicado no painel, nao apresentado como verdade absoluta.

---

## Fluxos do MVP

### 1. Ao receber `FriendlyRequest`

- criar ou reaproveitar `OpponentProfile`;
- registrar `OpponentInteraction` como `REQUEST_RECEIVED`.

### 2. Ao aprovar ou rejeitar solicitacao

- registrar interacao correspondente;
- se aprovada e virar `Match`, registrar vinculo com a partida.

### 3. Ao concluir amistoso

- permitir review curta pelo admin;
- registrar `MATCH_COMPLETED`;
- recalcular `reliabilityScore`.

---

## Superficie Tecnica Recomendada

### Dashboard

- evoluir `app/(dashboard)/friendly-requests/page.tsx` para mostrar historico por adversario;
- adicionar pagina `app/(dashboard)/friendly-requests/opponents/page.tsx` em iteracao dedicada ou embutir lista resumida no inicio do fluxo.

### API sugerida

- `app/api/opponents/route.ts` para listar perfis e filtros;
- `app/api/opponents/[id]/route.ts` para detalhe;
- `app/api/opponents/[id]/review/route.ts` para review pos-jogo.

### Integracoes

- hook no fluxo de `app/api/friendly-requests/route.ts`;
- hook no fluxo de `app/api/friendly-requests/[id]/route.ts`;
- hook no fechamento de amistosos quando `Match.type = FRIENDLY`.

---

## Contrato de Lista Sugerido

```json
{
  "opponents": [
    {
      "id": "opp1",
      "displayName": "Leoes FC",
      "reliabilityScore": 78,
      "lastInteractionAt": "2026-04-01T20:00:00.000Z",
      "stats": {
        "requestsReceived": 4,
        "approvedRequests": 3,
        "completedMatches": 2,
        "noShowCount": 0
      },
      "latestReview": {
        "punctuality": 4,
        "organization": 5,
        "sportsmanship": 4
      }
    }
  ]
}
```

---

## UX do MVP

### Lista de adversarios

- ordenar por `lastInteractionAt` desc por padrao;
- permitir filtro por faixa de score;
- destacar ultimas interacoes de cada adversario.

### Detalhe do adversario

- mostrar timeline curta: solicitacoes, aprovacoes, partidas, reviews;
- mostrar contatos conhecidos e notas internas;
- exibir explicacao textual do score.

### Review pos-jogo

- formulario curto com tres notas e comentario opcional;
- review so para amistosos concluidos.

---

## Riscos e Decisoes

### Risco principal

Se o score nascer opaco, o admin nao confia. Por isso o MVP deve exibir componentes simples do calculo e manter reputacao inicialmente privada.

### Decisao congelada

Nao publicar selo de reputacao no diretorio no primeiro corte. Primeiro a feature precisa provar valor interno e evitar injustica por dados incompletos.
