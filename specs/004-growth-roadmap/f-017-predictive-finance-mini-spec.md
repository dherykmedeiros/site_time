# Mini-Spec Tecnico - F-017 Financeiro Preditivo e Cobranca Assistida

**Feature**: F-017  
**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft pronto para implementacao incremental

---

## Objetivo

Evoluir o modulo financeiro de registro historico para um painel que antecipa risco de caixa e ajuda o admin a agir antes do problema aparecer.

---

## Encaixe no Produto Atual

Hoje o produto ja possui:

- `Transaction` com receitas e despesas por categoria;
- resumo mensal em `app/api/finances/summary/route.ts`;
- mensalidades registradas em `MembershipPayment`;
- pagina de financas com saldo, filtros e resumo mensal.

O que falta e previsao operacional e assistencia de cobranca.

---

## Problema de Produto

O admin consegue olhar para tras, mas ainda nao consegue responder com seguranca:

- quanto deve entrar ate o fim do mes;
- quem esta atrasando recorrencia;
- qual o risco de caixa ao considerar amistosos e despesas previstas;
- qual mensagem mandar para cobrar sem montar tudo do zero.

---

## Escopo Fechado do MVP

### Incluido

- projeção mensal simples de entradas e saidas;
- lista de risco de inadimplencia por jogador;
- mensagens prontas de cobranca com valores e competencia;
- confirmacao simples de quitação apos pagamento registrado.

### Fora de Escopo

- gateway de pagamento;
- automacao de WhatsApp;
- cobranca recorrente automatica;
- centro de conciliacao bancaria;
- machine learning de risco.

---

## Estrategia do MVP

### 1. Previsao de caixa do mes

Calcular:

- receitas realizadas no mes;
- despesas realizadas no mes;
- mensalidades esperadas do elenco ativo;
- despesas previstas de partidas futuras com valor manual opcional em iteracao futura;
- saldo projetado no fechamento do mes.

### 2. Risco de inadimplencia

Classificar jogadores ativos usando historico simples de `MembershipPayment`.

Sinais minimos:

- nao pagou a competencia atual;
- quantidade de competencias em atraso;
- ultimo pagamento muito antigo.

### 3. Cobranca assistida

Gerar mensagem pronta por jogador com:

- nome;
- competencia em aberto;
- valor esperado;
- instrucoes livres do admin.

O sistema nao envia automaticamente no MVP.

---

## Modelo de Dados Proposto

### Evolucao minima em `Team`

- `defaultMembershipAmount` opcional `Decimal`;
- `billingDayOfMonth` opcional `Int` entre `1` e `28`.

### Modelo opcional de apoio `BillingPreference`

Se a equipe quiser separar configuracao financeira do `Team`, usar:

- `teamId`
- `defaultMembershipAmount`
- `billingDayOfMonth`
- `defaultReminderMessage` opcional

No MVP, manter direto em `Team` e melhor para reduzir complexidade.

---

## Regras de Negocio do MVP

### Receita esperada do mes

Receita esperada = numero de jogadores ativos x `defaultMembershipAmount`.

Se nao houver valor padrao configurado, o modulo preditivo fica desabilitado com explicacao clara.

### Competencia aberta

Considerar mes e ano correntes como competencia principal de analise.

### Jogador em risco

- `LOW`: pagamento da competencia atual ja registrado;
- `MEDIUM`: competencia atual em aberto, mas houve pagamento recente nos ultimos 60 dias;
- `HIGH`: duas ou mais competencias em aberto ou ultimo pagamento muito antigo.

### Mensagem pronta

Gerar texto, nao disparo automatico.

Exemplo base:

`Oi, [nome]. A mensalidade de [mes/ano] do [time] esta em aberto no valor de R$ [valor]. Quando puder, me confirma o pagamento por aqui.`

---

## Superficie Tecnica Recomendada

### API

- `app/api/finances/forecast/route.ts` para projeção mensal;
- `app/api/finances/collections/route.ts` para lista de pendencias e mensagens prontas.

### Dashboard

- expandir `app/(dashboard)/finances/page.tsx` com aba `Projecao` ou `Cobranca assistida`;
- reutilizar tabela/lista para destacar jogadores em risco.

### Dominio sugerido

- `lib/finance-forecast.ts`
- `lib/collections.ts`

---

## Contrato de Forecast Sugerido

```json
{
  "month": 4,
  "year": 2026,
  "realized": {
    "income": 1200,
    "expense": 850,
    "balance": 350
  },
  "expected": {
    "membershipIncome": 1800,
    "projectedExpense": 300,
    "projectedClosingBalance": 1850
  },
  "health": {
    "cashRisk": "MEDIUM",
    "explanation": "Ainda faltam 6 mensalidades previstas para fechar o caixa do mes"
  }
}
```

## Contrato de Collections Sugerido

```json
{
  "players": [
    {
      "playerId": "pl1",
      "playerName": "Carlos",
      "risk": "HIGH",
      "openCompetencies": [
        { "month": 3, "year": 2026, "amount": 120 },
        { "month": 4, "year": 2026, "amount": 120 }
      ],
      "lastPaymentAt": "2026-02-05T00:00:00.000Z",
      "suggestedMessage": "Oi, Carlos..."
    }
  ]
}
```

---

## UX do MVP

### Tela financeira

- manter resumo historico como primeira camada;
- adicionar bloco de previsao acima da lista quando configuracao minima existir;
- destacar jogadores em risco com CTA `Copiar mensagem`.

### Configuracao do time

- incluir valor padrao da mensalidade e dia de cobranca em `team/settings`;
- sem essa configuracao o modulo mostra estado vazio orientado.

---

## Riscos e Decisoes

### Risco principal

Previsao financeira sem parametros minimos vira ruído. Por isso o MVP depende de configuracao simples do time e assume uma mensalidade padrao unica.

### Decisao congelada

A cobranca assistida nasce como copiloto textual, nao automacao. Primeiro o produto precisa provar valor administrativo antes de integrar canais de envio.
