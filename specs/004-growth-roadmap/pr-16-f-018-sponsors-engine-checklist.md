# Checklist Tecnico - PR-16 da F-018

**Feature**: F-018 Vitrine de parceiros e patrocinadores  
**PR alvo**: PR-16 - modelo e APIs de sponsors  
**Data**: 2026-04-01  
**Objetivo**: entregar o dominio de sponsors, o CRUD admin e o tracking minimo de clique, sem tocar ainda a vitrine publica.

---

## Arquivos-Alvo

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/validations/team.ts`
- `app/api/teams/[teamId]/sponsors/route.ts`
- `app/api/teams/[teamId]/sponsors/[sponsorId]/route.ts`
- `app/api/vitrine/sponsors/[sponsorId]/click/route.ts`

---

## Checklist por Arquivo

### `prisma/schema.prisma`

- [ ] Adicionar modelo `TeamSponsor` com os campos do mini-spec.
- [ ] Relacionar `TeamSponsor` a `Team`.
- [ ] Manter `clickCount` e `lastClickedAt` no proprio registro do sponsor.
- [ ] Nao criar tabela de eventos brutos nesta PR.

### `prisma/migrations/`

- [ ] Gerar migration pequena e isolada para sponsors.
- [ ] Nao misturar gating de plano nem forecast nessa migration.

### `lib/validations/team.ts`

- [ ] Adicionar schemas para criar e editar sponsor.
- [ ] Validar comprimentos de `name`, `category`, `description` e `couponCode`.
- [ ] Validar `externalUrl` e permitir sponsor institucional sem CTA clicavel.

### `app/api/teams/[teamId]/sponsors/route.ts`

- [ ] Exigir `requireAdmin` e ownership do time.
- [ ] Implementar GET e POST do CRUD minimo.
- [ ] Ordenar por `displayOrder` e fallback coerente.

### `app/api/teams/[teamId]/sponsors/[sponsorId]/route.ts`

- [ ] Exigir `requireAdmin` e ownership do sponsor.
- [ ] Implementar PATCH para editar, reordenar e ativar/desativar.
- [ ] Implementar DELETE apenas se o time optar por remocao em vez de desativacao.

### `app/api/vitrine/sponsors/[sponsorId]/click/route.ts`

- [ ] Validar existencia do sponsor e se ele esta ativo.
- [ ] Incrementar `clickCount` e atualizar `lastClickedAt`.
- [ ] Responder com redirecionamento seguro para `externalUrl` quando existir.
- [ ] Nao vazar dados privados do sponsor.

---

## Smoke Test da PR

1. Admin cria sponsor ativo com link externo.
2. Admin edita ordem e desativa sponsor sem erro de autorizacao.
3. Rota publica de click incrementa contador e redireciona.
4. Sponsor sem `externalUrl` nao quebra o tracking nem a persistencia.
5. Usuario de outro time ou nao admin nao consegue editar sponsors.

---

## Fora de Escopo desta PR

- bloco de sponsors na vitrine publica;
- preview visual sofisticado no dashboard;
- relatorio de impressao ou conversao;
- cobranca do patrocinador.