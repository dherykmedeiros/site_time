# Checklist Tecnico - PR-11 - F-015 Diretorio e UI

**Feature**: F-015 Agenda aberta e diretorio geografico  
**Objetivo da PR**: expor a discovery publica e a agenda aberta nas superficies certas, sem quebrar a composicao atual da vitrine.  
**Escopo**: UI publica e admin simples. Sem CRM ainda.

---

## Arquivos-Alvo

- `app/vitrine/page.tsx`
- `app/vitrine/[slug]/page.tsx`
- `app/(dashboard)/friendly-requests/page.tsx`
- `app/(dashboard)/team/` ou superficie equivalente de configuracao do time
- `components/ui/` e `components/forms/` apenas se faltar bloco reutilizavel pequeno

---

## Checklist por Superficie

### `app/vitrine/page.tsx`

- manter a pagina como server component;
- trocar a busca unica por filtros em query string simples;
- adicionar campos de filtro para cidade, regiao, tipo de campo e agenda aberta;
- destacar times com slot aberto por selo visual e metadata curta do proximo slot;
- manter empty state claro quando os filtros nao encontrarem resultados.

### `app/vitrine/[slug]/page.tsx`

- mostrar bloco `Datas abertas para amistoso` apenas quando houver slots `OPEN`;
- permitir CTA de amistoso contextualizado a partir do slot, sem alterar o fluxo base do formulario;
- nao mover a pagina inteira para client so para preencher contexto do slot;
- manter a hero e os dados atuais da vitrine como primarios.

### `app/(dashboard)/friendly-requests/page.tsx`

- adicionar atalho simples para gerenciar agenda aberta ou discovery do time;
- nao transformar essa tela na pagina principal de configuracao do diretorio;
- manter solicitacoes pendentes como foco principal da tela.

### `app/(dashboard)/team/`

- expor opt-in publico e CRUD basico de slots em uma superficie admin curta;
- tratar claramente estados vazios: time fora do diretorio, sem slots e sem cidade/regiao preenchidas;
- deixar a relacao entre `opt-in` e vitrine publica explicitada no texto da UI.

---

## Smoke Test da PR

1. Admin ativa o opt-in, preenche cidade e cria um slot aberto.
2. A vitrine publica lista o time ao filtrar pela cidade correta.
3. O card do time mostra selo de agenda aberta.
4. A vitrine do time mostra o bloco do slot e o CTA de amistoso.
5. Ao desativar o opt-in, o time some do diretorio sem quebrar a pagina publica direta do slug.

---

## Fora de Escopo desta PR

- criar autocomplete geografico;
- mapa de localizacao;
- filtros client-side complexos com estado global;
- reputacao publica do adversario ou score no diretorio.