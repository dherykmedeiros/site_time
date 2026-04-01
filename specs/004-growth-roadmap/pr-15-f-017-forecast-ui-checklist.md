# Checklist Tecnico - PR-15 da F-017

**Feature**: F-017 Financeiro preditivo e cobranca assistida  
**PR alvo**: PR-15 - UI de projecao e cobranca assistida  
**Data**: 2026-04-01  
**Objetivo**: expor forecast, lista de risco e configuracao minima do time nas superficies admin certas, sem quebrar o fluxo historico atual.

---

## Arquivos-Alvo

- `app/(dashboard)/finances/page.tsx`
- `app/(dashboard)/team/settings/page.tsx`
- `components/forms/TeamForm.tsx`

---

## Checklist por Arquivo

### `app/(dashboard)/finances/page.tsx`

- [ ] Adicionar bloco de forecast sem remover as abas atuais de lista e resumo.
- [ ] Buscar `GET /api/finances/forecast` e `GET /api/finances/collections` de forma isolada do historico.
- [ ] Mostrar estado vazio orientado quando faltar configuracao minima do time.
- [ ] Exibir lista de jogadores em risco com CTA `Copiar mensagem`.
- [ ] Tratar loading, erro e lista vazia sem degradar a aba historica.
- [ ] Nao misturar collections dentro do payload do resumo mensal existente.

### `components/forms/TeamForm.tsx`

- [ ] Adicionar campos para `defaultMembershipAmount` e `billingDayOfMonth` no form do time.
- [ ] Validar UX de ajuda para explicar o uso da configuracao no modulo preditivo.
- [ ] Preservar o fluxo de criacao e edicao do time sem tornar esses campos obrigatorios no MVP.

### `app/(dashboard)/team/settings/page.tsx`

- [ ] Exibir a configuracao financeira como parte do settings existente.
- [ ] Mostrar explicacao curta de que esses dados alimentam previsao e cobranca assistida.
- [ ] Nao criar uma nova pagina separada de configuracao financeira nesta PR.

---

## Smoke Test da PR

1. Admin configura valor padrao da mensalidade e dia de cobranca em `team/settings`.
2. Pagina financeira mostra bloco de forecast com explicacao textual.
3. Lista de cobranca assistida aparece apenas para admin e copia mensagem corretamente.
4. Time sem configuracao ve estado vazio orientado, sem quebra do historico financeiro.
5. Em mobile, o bloco de risco e a lista de jogadores continuam legiveis e sem overflow horizontal.

---

## Fora de Escopo desta PR

- disparo automatico de mensagem;
- automacao de lembrete;
- filtro avançado de collections;
- qualquer gating comercial do forecast.