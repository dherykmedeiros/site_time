# Checklist Tecnico - PR-17 da F-018

**Feature**: F-018 Vitrine de parceiros e patrocinadores  
**PR alvo**: PR-17 - UI admin e vitrine publica  
**Data**: 2026-04-01  
**Objetivo**: expor sponsors no admin e na vitrine do time com densidade visual controlada, sem poluir a pagina publica.

---

## Arquivos-Alvo

- `app/(dashboard)/team/settings/page.tsx`
- `components/forms/TeamForm.tsx`
- `app/vitrine/[slug]/page.tsx`

---

## Checklist por Arquivo

### `app/(dashboard)/team/settings/page.tsx`

- [ ] Adicionar secao de parceiros dentro do settings atual.
- [ ] Exibir lista curta com status, ordem e cliques acumulados.
- [ ] Incluir CTA `Adicionar parceiro` e acoes `Editar` e `Desativar`.

### `components/forms/TeamForm.tsx`

- [ ] Se o projeto já usar o form do time como container adequado, incluir ou compor bloco de sponsor sem conflitar com identidade do time.
- [ ] Manter UX clara para logo opcional, link externo e cupom opcional.
- [ ] Tratar erros de upload ou URL sem quebrar a edicao principal do time.

### `app/vitrine/[slug]/page.tsx`

- [ ] Renderizar secao `Parceiros do time` apenas quando houver sponsors ativos.
- [ ] Limitar volume visivel do bloco no MVP para evitar mural poluido.
- [ ] Usar CTA externo simples por card.
- [ ] Tratar sponsor sem link como card institucional sem acao clicavel.
- [ ] Preservar a composicao atual da vitrine como server component.

---

## Smoke Test da PR

1. Time com sponsors ativos ve bloco publico na vitrine.
2. Time sem sponsors nao ve secao vazia ou quebrada.
3. Clique no CTA passa pela rota de tracking e chega ao destino.
4. Admin consegue reordenar ou desativar sponsor e a vitrine reflete o estado.
5. Em mobile, os cards continuam legiveis e sem overflow horizontal.

---

## Fora de Escopo desta PR

- analytics comercial detalhada;
- self-service de patrocinador;
- layouts promocionais agressivos;
- feed de campanhas ou carrossel automatico.