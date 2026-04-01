# Checklist Tecnico - PR-18 da F-019

**Feature**: F-019 Plano Pro em camadas  
**PR alvo**: PR-18 - entitlements e gating central  
**Data**: 2026-04-01  
**Objetivo**: criar a base comercial do plano e o gating centralizado em backend e helpers, sem abrir checkout nem espalhar condicionais pela UI.

---

## Arquivos-Alvo

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/auth.ts`
- `lib/plan-entitlements.ts`
- `lib/validations/team.ts`
- `app/api/teams/[teamId]/plan/route.ts`
- rotas premium selecionadas de admin

---

## Checklist por Arquivo

### `prisma/schema.prisma`

- [ ] Adicionar `planTier`, `planStatus`, `planStartedAt`, `planEndsAt` e `planNotes` ao `Team`.
- [ ] Usar enums minimos `FREE | PRO` e `ACTIVE | INACTIVE | PILOT`.
- [ ] Nao modelar checkout, invoice ou subscription externa nesta PR.

### `prisma/migrations/`

- [ ] Gerar migration pequena e isolada para plano comercial.
- [ ] Garantir default seguro para times existentes.

### `lib/plan-entitlements.ts`

- [ ] Criar tabela unica de entitlements por `planTier`.
- [ ] Exportar helper reutilizavel para rotas e UI.
- [ ] Cobrir pelo menos F-011, F-012, F-013, F-017 e F-018 como candidatos premium.

### `lib/auth.ts`

- [ ] Se necessario, expor helper leve para checar plano do time autenticado sem duplicar consulta.
- [ ] Manter sessao atual enxuta, sem injetar payload comercial excessivo no JWT do MVP.

### `lib/validations/team.ts`

- [ ] Adicionar schema para atualizacao admin do plano quando a rota permitir isso no MVP manual.
- [ ] Bloquear valores fora dos enums previstos.

### `app/api/teams/[teamId]/plan/route.ts`

- [ ] Exigir `requireAdmin` e ownership do time.
- [ ] Implementar GET do plano atual e dos entitlements resolvidos.
- [ ] Implementar PATCH apenas se o fluxo manual de piloto for intencionalmente habilitado para admins internos ou seeds controladas.

### Rotas premium selecionadas

- [ ] Aplicar gating primeiro em rotas premium mais claras e administrativas.
- [ ] Retornar erro de permissao/comercial coerente e sem vazar detalhes internos.
- [ ] Nao confiar apenas em bloqueio visual da UI.

---

## Smoke Test da PR

1. Time `FREE` recebe entitlements corretos via rota de plano.
2. Time `PRO` recebe entitlements premium corretos.
3. Rota premium protegida bloqueia acesso de time `FREE`.
4. Fluxo base gratuito continua funcionando sem regressao.
5. Sessao de usuario nao quebra quando o time muda de plano.

---

## Fora de Escopo desta PR

- comparativo visual `Free vs Pro`;
- cards de upgrade na UI;
- checkout, trial automatico ou billing recorrente;
- multiplos tiers pagos adicionais.