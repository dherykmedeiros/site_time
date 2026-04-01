# Checklist Técnico - PR-04 da F-012

**Feature**: F-012 Escalacao Inteligente e Banco Sugerido  
**PR alvo**: PR-04 - exposicao visual da sugestao na tela da partida  
**Data**: 2026-04-01  
**Objetivo**: expor a sugestao de lineup no detalhe da partida com fetch dedicado, estados claros e CTA de recalcular, sem mover a heuristica para o client nem inflar o payload principal da pagina.

---

## Pré-requisitos

Esta PR assume a PR-03 já mergeada com estes pontos prontos:

- `GET /api/matches/[id]/lineup` funcional;
- contrato de `lineup.starters`, `bench`, `alerts` e `meta` estabilizado;
- decisão congelada de lineup efemera sem persistencia manual.

---

## Escopo Congelado da PR-04

Esta PR entrega apenas:

- bloco visual da sugestao no detalhe da partida;
- fetch dedicado do endpoint de lineup;
- CTA de recalcular como nova leitura do endpoint;
- estados de loading, vazio, erro e baixa confianca na UI admin.

Esta PR **não** entrega:

- editor visual de escalacao;
- drag and drop de jogadores;
- persistencia de override manual;
- exportacao grafica elaborada;
- alteracao do contrato de `GET /api/matches/[id]`.

---

## Ordem Recomendada de Trabalho

1. Criar componente local de lineup em `components/dashboard/`.
2. Integrar fetch dedicado em `app/(dashboard)/matches/[id]/page.tsx`.
3. Adicionar CTA de recalcular e mensagens de estado.
4. Executar smoke tests com admin, jogador comum, partida com poucos confirmados e erro do endpoint.

---

## Checklist por Arquivo

### `components/dashboard/SuggestedLineupCard.tsx`

- [ ] Criar componente client pequeno e focado apenas em apresentacao.
- [ ] Receber props com `loading`, `error`, `lineup`, `generatedAt`, `onRefresh` e `canRefresh`.
- [ ] Renderizar secoes separadas para titulares, banco e alertas.
- [ ] Exibir `reason` de cada jogador de forma curta e legivel.
- [ ] Mostrar badge ou texto de confianca com base em `lineup.meta.confidence`.
- [ ] Mostrar estado vazio explicavel quando nao houver confirmados suficientes.
- [ ] Mostrar estado de erro sem quebrar a pagina inteira.
- [ ] Reaproveitar `Card`, `Badge` e `Button` existentes.
- [ ] Nao recalcular heuristica no componente.

### `app/(dashboard)/matches/[id]/page.tsx`

- [ ] Adicionar estado local para `lineupData`, `lineupLoading`, `lineupError` e `lineupRefreshing`.
- [ ] Buscar lineup apenas para admin e apenas quando `match.status === "SCHEDULED"`.
- [ ] Manter `fetchMatch` separado de `fetchLineup` para nao acoplar os fluxos.
- [ ] Disparar `fetchLineup` depois que `match` estiver carregada e o usuario for admin.
- [ ] Implementar botao `Recalcular sugestao` como nova leitura de `GET /api/matches/[id]/lineup`.
- [ ] Preservar o resto da tela intacto: RSVP, convocacao, cancelamento e pos-jogo nao entram nesta PR.
- [ ] Inserir o card em ponto estavel da pagina, preferencialmente abaixo do resumo da partida e antes das acoes operacionais do admin.
- [ ] Se o endpoint falhar, mostrar erro local no card sem derrubar o detalhe da partida.
- [ ] Se o usuario nao for admin, nao renderizar o bloco.

### `app/api/matches/[id]/lineup/route.ts`

- [ ] Nao alterar nesta PR, salvo correcao pontual de serializacao descoberta no consumo real da UI.

### `app/api/matches/[id]/route.ts`

- [ ] Nao alterar nesta PR.
- [ ] Manter o contrato principal da partida separado da sugestao de lineup.

---

## Smoke Test Manual da PR-04

### Cenario 1 - admin com partida agendada e lineup disponivel

- [ ] Abrir detalhe de partida com RSVPs confirmados suficientes.
- [ ] Confirmar renderizacao de titulares, banco, alertas e confianca.

### Cenario 2 - admin com poucos confirmados

- [ ] Abrir partida com poucos confirmados.
- [ ] Confirmar estado vazio ou parcial explicavel, sem quebrar a tela.

### Cenario 3 - refresh manual

- [ ] Acionar `Recalcular sugestao`.
- [ ] Confirmar loading local e nova leitura do endpoint.

### Cenario 4 - erro do endpoint

- [ ] Simular falha em `GET /api/matches/[id]/lineup`.
- [ ] Confirmar erro local no card e resto da pagina funcional.

### Cenario 5 - usuario nao admin

- [ ] Abrir a mesma pagina como `PLAYER`.
- [ ] Confirmar que o card da sugestao nao aparece.

---

## Criterio de Pronto da PR-04

- [ ] card da sugestao criado em `components/dashboard/`.
- [ ] detalhe da partida consome o endpoint de lineup sem inflar a rota principal.
- [ ] CTA de recalcular funciona por nova leitura do endpoint.
- [ ] estados de loading, vazio e erro estao claros.
- [ ] smoke test manual executado nos 5 cenarios.
- [ ] nenhuma persistencia de override manual adicionada.

---

## Handoff para a PR Seguinte

Se esta PR fechar corretamente, a proxima fronteira operacional da Onda 1 fica pronta para o bordero:

- modelagem de checklist e presenca real da F-013;
- rota `app/api/matches/[id]/bordereau/route.ts`;
- vinculo minimo entre partida e financeiro.

Essa separacao evita misturar apresentacao da lineup com operacao do jogo na mesma PR.
*** End Patch