# Checklist Tecnico - PR-06 da F-013

**Feature**: F-013 Bordero do Jogo  
**PR alvo**: PR-06 - despesas vinculadas a partida e resumo financeiro minimo  
**Data**: 2026-04-01  
**Objetivo**: ligar o bordero ao financeiro existente com o menor incremento correto, adicionando rastreabilidade por partida, criacao de despesa e resumo visual sem abrir cobranca individual automatica.

---

## Pre-requisitos

Esta PR assume a PR-05 ja mergeada com estes pontos prontos:

- `GET/PATCH /api/matches/[id]/bordereau` funcional;
- checklist e presenca real persistidos por partida;
- detalhe da partida ja comportando o bloco operacional do bordero.

Tambem assume que o financeiro atual continua sendo a unica fonte de verdade para receita e despesa do time.

---

## Escopo Congelado da PR-06

Esta PR entrega apenas:

- vinculo opcional de `Transaction` com `Match`;
- criacao e listagem de despesas da partida usando o modulo financeiro atual;
- resumo de custo total e sugestao visual de rateio por presentes no payload do bordero;
- destaque simples de transacoes ligadas a partidas no financeiro.

Esta PR **nao** entrega:

- contas a receber por jogador;
- geracao automatica de pendencias de mensalidade ou amistoso;
- checkout, pix, boleto ou qualquer cobranca assistida;
- upload de comprovante;
- ledger separado do financeiro existente.

---

## Ordem Recomendada de Trabalho

1. Adicionar `matchId` em `Transaction` no schema Prisma.
2. Criar migration isolada do vinculo financeiro com partida.
3. Expandir validacoes financeiras para suportar despesa vinculada.
4. Implementar a criacao/listagem de despesas ligadas a partida.
5. Atualizar o resumo do bordero com custo total e rateio sugerido.
6. Destacar a rastreabilidade na listagem financeira.
7. Executar smoke tests com partida sem despesa, com uma ou mais despesas e com presenca zero.

---

## Checklist por Arquivo

### `prisma/schema.prisma`

- [ ] Adicionar `matchId String?` em `Transaction`.
- [ ] Criar relacao opcional de `Transaction` para `Match`.
- [ ] Garantir que o vinculo seja opcional para preservar transacoes legadas.
- [ ] Nao criar novos modelos financeiros nesta PR.

### `prisma/migrations/`

- [ ] Criar migration isolada para `Transaction.matchId`.
- [ ] Revisar constraint de foreign key para nao quebrar exclusoes ou leitura de historico.
- [ ] Validar que a migration nao altera semantica das categorias financeiras existentes.

### `lib/validations/finance.ts`

- [ ] Expandir `createTransactionSchema` ou criar schema complementar para aceitar `matchId` opcional.
- [ ] Garantir que `matchId` seja permitido apenas para `EXPENSE` no fluxo do bordero.
- [ ] Manter validacao de `date` sem permitir futuro.
- [ ] Nao abrir schema de cobranca individual nesta PR.

### `app/api/finances/route.ts`

- [ ] Permitir criar transacao com `matchId` opcional.
- [ ] Validar que `matchId`, quando informado, pertence ao mesmo `teamId` da sessao.
- [ ] Incluir `matchId` na serializacao da resposta.
- [ ] Incluir metadado simples da partida quando fizer sentido para a listagem, como `opponent` ou `matchDate`, sem inflar demais a rota.
- [ ] Manter `requireAdmin` no `POST` e `requireAuth` no `GET`.

### `app/api/matches/[id]/bordereau/route.ts`

- [ ] Expandir o `GET` para incluir `expenses` ligadas a `matchId`.
- [ ] Calcular `costSummary.totalExpense` a partir das transacoes `EXPENSE` da partida.
- [ ] Calcular `costSummary.presentCount` a partir das presencas reais marcadas.
- [ ] Calcular `costSummary.suggestedSharePerPresent` apenas quando `presentCount > 0`.
- [ ] Manter `suggestedSharePerPresent = null` quando nao houver presentes.
- [ ] Nao criar endpoint de cobranca individual nesta PR.

### `components/forms/TransactionForm.tsx`

- [ ] Tornar o formulario reutilizavel para criar despesa da partida sem duplicar componente inteiro.
- [ ] Aceitar props opcionais para `defaultType`, `defaultCategory`, `defaultDescriptionPrefix` e `matchId`.
- [ ] Quando `matchId` existir, enviar esse campo para `POST /api/finances`.
- [ ] Permitir esconder opcoes de receita no contexto do bordero, se isso simplificar a UX.
- [ ] Preservar o uso atual do formulario fora do bordero.

### `app/(dashboard)/matches/[id]/page.tsx`

- [ ] Adicionar CTA para lancar despesa dentro do bloco do bordero.
- [ ] Reaproveitar `TransactionForm` em modal local ou secao embutida.
- [ ] Atualizar o bordero apos salvar despesa com nova leitura do endpoint.
- [ ] Exibir lista simples de despesas do jogo com valor, categoria e descricao.
- [ ] Exibir resumo com `totalExpense` e `suggestedSharePerPresent` como informacao visual.
- [ ] Explicitar na UI que o rateio e apenas sugestao, sem cobranca automatica.

### `app/(dashboard)/finances/page.tsx`

- [ ] Destacar quando uma transacao estiver ligada a partida.
- [ ] Exibir link, label ou descricao que permita entender de qual jogo a despesa nasceu.
- [ ] Nao reestruturar a tela financeira inteira nesta PR.

---

## Contrato de Resposta do Endpoint

### `GET /api/matches/[id]/bordereau`

```json
{
  "matchId": "clm123",
  "checklist": [],
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
      "date": "2026-04-01T20:00:00.000Z",
      "matchId": "clm123"
    }
  ],
  "costSummary": {
    "totalExpense": 180,
    "presentCount": 12,
    "suggestedSharePerPresent": 15
  }
}
```

---

## Smoke Test Manual da PR-06

### Cenario 1 - criar despesa vinculada a partida

- [ ] Abrir o detalhe da partida e lancar uma despesa pelo bordero.
- [ ] Confirmar que a transacao foi salva como `EXPENSE` com `matchId` preenchido.

### Cenario 2 - refletir despesa no resumo do bordero

- [ ] Recarregar o bordero.
- [ ] Confirmar atualizacao de `totalExpense` e da lista de despesas.

### Cenario 3 - sugestao de rateio com presencas reais

- [ ] Marcar presentes e registrar despesa.
- [ ] Confirmar calculo de `suggestedSharePerPresent` sem gerar cobrancas individuais.

### Cenario 4 - partida sem presentes

- [ ] Registrar despesa em partida com `presentCount = 0`.
- [ ] Confirmar `suggestedSharePerPresent = null` ou estado equivalente seguro.

### Cenario 5 - rastreabilidade no financeiro

- [ ] Abrir a listagem em `/finances`.
- [ ] Confirmar que a despesa ligada a jogo pode ser identificada visualmente.

---

## Criterio de Pronto da PR-06

- [ ] `Transaction.matchId` adicionado de forma opcional.
- [ ] criacao de despesa vinculada funcionando sem quebrar o financeiro atual.
- [ ] resumo de custo do bordero refletindo as transacoes do jogo.
- [ ] rateio exibido apenas como sugestao visual.
- [ ] smoke test manual executado nos 5 cenarios.
- [ ] nenhuma cobranca individual automatica criada.

---

## Handoff para a PR Seguinte

Se esta PR fechar corretamente, a fronteira seguinte da Onda 1 passa a ser hardening e piloto:

- revisao de permissoes e estados vazios;
- uso da `wave-1-acceptance-matrix.md` como QA unico;
- preenchimento de `wave-1-rollout-checklist.md` para times piloto.

Essa separacao fecha o bordero com rastreabilidade minima e deixa o restante da onda pronto para estabilizacao, nao para ampliar escopo financeiro.
