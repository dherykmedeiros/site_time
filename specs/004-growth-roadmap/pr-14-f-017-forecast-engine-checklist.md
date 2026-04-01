# Checklist Tecnico - PR-14 da F-017

**Feature**: F-017 Financeiro preditivo e cobranca assistida  
**PR alvo**: PR-14 - forecast e contratos financeiros  
**Data**: 2026-04-01  
**Objetivo**: entregar a base de forecast, risco de inadimplencia e collections em `lib/` e `app/api/finances`, sem tocar ainda na UX principal.

---

## Pre-requisitos

Esta PR assume que:

- `f-017-predictive-finance-mini-spec.md` ja esta congelado como contrato funcional;
- `app/api/finances/summary/route.ts` e o fluxo de mensalidades atual estao estaveis;
- a configuracao minima do time sera exposta na PR seguinte, mas os campos necessarios ja podem existir no backend.

---

## Escopo Congelado da PR-14

Esta PR entrega apenas:

- campos financeiros minimos no `Team` ou estrutura equivalente decidida no mini-spec;
- evolucao de validacao para configuracao financeira do time;
- `lib/finance-forecast.ts` e `lib/collections.ts`;
- `GET /api/finances/forecast` e `GET /api/finances/collections`;
- classificacao de risco e mensagem sugerida por jogador.

Esta PR **nao** entrega:

- nova aba visual na tela financeira;
- CTA `Copiar mensagem` na UI;
- automacao de envio;
- gating comercial do recurso.

---

## Ordem Recomendada de Trabalho

1. Evoluir `prisma/schema.prisma` e gerar migration pequena.
2. Atualizar `lib/validations/finance.ts` e `lib/validations/team.ts` se necessario.
3. Criar `lib/finance-forecast.ts`.
4. Criar `lib/collections.ts`.
5. Implementar `app/api/finances/forecast/route.ts`.
6. Implementar `app/api/finances/collections/route.ts`.
7. Executar smoke tests com time configurado e nao configurado.

---

## Checklist por Arquivo

### `prisma/schema.prisma`

- [ ] Adicionar no `Team` os campos minimos de configuracao: `defaultMembershipAmount` e `billingDayOfMonth`, ou equivalente decidido no mini-spec.
- [ ] Manter esses campos opcionais para nao quebrar times ja existentes.
- [ ] Nao misturar nesta migration sponsors, plano comercial ou checkout.

### `prisma/migrations/`

- [ ] Gerar migration pequena e isolada para os campos financeiros do time.
- [ ] Garantir compatibilidade com dados existentes sem backfill obrigatorio.

### `lib/validations/finance.ts`

- [ ] Adicionar schemas para query do forecast e, se necessario, de collections.
- [ ] Garantir parse seguro de `month` e `year` via query params.
- [ ] Nao aceitar inputs que abram payload de escrita nesta PR.

### `lib/finance-forecast.ts`

- [ ] Criar funcao pura `getFinanceForecast` ou nome equivalente.
- [ ] Calcular realizado do mes com base em `Transaction`.
- [ ] Calcular `membershipIncome` esperado a partir de jogadores ativos e `defaultMembershipAmount`.
- [ ] Produzir `cashRisk` e `explanation` explicaveis.
- [ ] Retornar estado orientado quando faltar configuracao minima do time.
- [ ] Nao acessar `NextResponse` nem renderizar UI.

### `lib/collections.ts`

- [ ] Criar funcao pura `getCollectionsOverview` ou nome equivalente.
- [ ] Cruzar jogadores ativos com `MembershipPayment` da competencia.
- [ ] Classificar risco em `LOW | MEDIUM | HIGH` conforme mini-spec.
- [ ] Gerar `suggestedMessage` apenas como texto, sem integracao externa.
- [ ] Tratar jogador sem historico de pagamento como caso valido e explicavel.

### `app/api/finances/forecast/route.ts`

- [ ] Exigir `requireAdmin`.
- [ ] Validar `teamId` da sessao.
- [ ] Validar query com schema.
- [ ] Chamar `lib/finance-forecast.ts`.
- [ ] Responder com `200` e payload explicavel quando houver configuracao minima.
- [ ] Responder com estado vazio orientado, nao erro interno, quando faltar configuracao do time.

### `app/api/finances/collections/route.ts`

- [ ] Exigir `requireAdmin`.
- [ ] Validar query com schema.
- [ ] Chamar `lib/collections.ts`.
- [ ] Retornar jogadores, competencias abertas e mensagem sugerida.
- [ ] Nao retornar dados alem do necessario para a cobranca assistida.

---

## Contrato Minimo das Rotas

### `GET /api/finances/forecast`

- [ ] Deve responder `200` com `realized`, `expected` e `health`.
- [ ] Deve responder estado vazio orientado quando o time ainda nao tiver configuracao financeira minima.

### `GET /api/finances/collections`

- [ ] Deve responder `200` com lista de jogadores em risco e `suggestedMessage`.
- [ ] Deve omitir jogadores inativos.

---

## Smoke Test Manual da PR-14

### Cenario 1 - time configurado

- [ ] Configurar valor padrao e dia de cobranca no banco ou fixture local.
- [ ] Abrir `GET /api/finances/forecast` para o mes atual.
- [ ] Confirmar realizado, esperado e risco calculados.

### Cenario 2 - time sem configuracao

- [ ] Remover configuracao minima do time de teste.
- [ ] Confirmar estado vazio orientado, sem `500`.

### Cenario 3 - cobranca assistida

- [ ] Abrir `GET /api/finances/collections` para competencia com pagamentos parciais.
- [ ] Confirmar jogadores pendentes com `risk` e `suggestedMessage`.

### Cenario 4 - acesso indevido

- [ ] Confirmar que usuario nao admin nao acessa forecast nem collections.

---

## Criterio de Pronto da PR-14

- [ ] base derivada de forecast criada fora das rotas.
- [ ] collections e risco de inadimplencia centralizados em `lib/`.
- [ ] rotas admin funcionais e seguras.
- [ ] smoke tests executados nos 4 cenarios.
- [ ] nenhuma mudanca de UX adicionada prematuramente.