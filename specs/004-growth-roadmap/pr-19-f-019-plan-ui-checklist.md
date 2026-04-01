# Checklist Tecnico - PR-19 da F-019

**Feature**: F-019 Plano Pro em camadas  
**PR alvo**: PR-19 - UI de plano e estados bloqueados  
**Data**: 2026-04-01  
**Objetivo**: expor o plano atual, o comparativo `Free vs Pro` e bloqueios brandos nas superficies certas, sem transformar o app em paywall agressivo.

---

## Arquivos-Alvo

- `app/(dashboard)/team/settings/page.tsx`
- `app/(dashboard)/finances/page.tsx`
- `app/(dashboard)/matches/[id]/page.tsx`
- `components/`

---

## Checklist por Arquivo

### `app/(dashboard)/team/settings/page.tsx`

- [ ] Exibir plano atual do time com status `FREE`, `PRO` ou `PILOT`.
- [ ] Incluir comparativo curto `Free vs Pro` com grupos `Operacao` e `Growth`.
- [ ] Mostrar CTA de interesse ou contato, sem checkout nesta PR.

### `app/(dashboard)/finances/page.tsx`

- [ ] Exibir bloqueio brando para forecast quando o time nao tiver entitlement premium.
- [ ] Preservar acesso ao historico financeiro gratuito.
- [ ] Mostrar mensagem objetiva de valor, sem modal agressivo.

### `app/(dashboard)/matches/[id]/page.tsx`

- [ ] Exibir bloqueio brando nas features premium da Onda 1 quando aplicavel.
- [ ] Nao esconder dados essenciais do fluxo base de partida.
- [ ] Manter copy consistente com `team/settings`.

### `components/`

- [ ] Extrair card reutilizavel de upgrade/gating se o padrao se repetir.
- [ ] Garantir responsividade e acessibilidade basicas do estado bloqueado.

---

## Smoke Test da PR

1. Time `FREE` ve bloqueio brando e explicavel em forecast e features premium.
2. Time `PRO` nao ve bloqueio indevido nas mesmas superficies.
3. Comparativo `Free vs Pro` aparece corretamente no settings.
4. O fluxo base de partidas e financas continua util para time gratuito.
5. Em mobile, os cards de plano e upgrade continuam legiveis e sem overflow horizontal.

---

## Fora de Escopo desta PR

- checkout self-service;
- trial com expiracao automatica;
- funil comercial complexo;
- gating em todas as telas do produto de uma vez.