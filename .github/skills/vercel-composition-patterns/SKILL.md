---
name: vercel-composition-patterns
description: "Use quando o pedido envolver Vercel, Next.js App Router, composition patterns, composicao entre server components e client components, layouts aninhados, providers, server actions, route handlers, streaming, data fetching por camada ou definicao correta de boundaries entre UI, estado e dados."
---

# Vercel Composition Patterns Skill

## Objetivo

Guiar implementacoes em Next.js seguindo padroes de composicao que reduzem acoplamento, preservam performance e mantem limites claros entre renderizacao, dados e interatividade.

## Quando Usar

- Quando a tarefa envolver App Router, layouts, nested routes ou composicao entre segmentos de pagina.
- Quando houver duvida sobre o que deve ficar em server component, client component, action, provider ou route handler.
- Quando for preciso organizar data fetching sem espalhar logica de dados por componentes interativos.
- Quando a tela misturar streaming, loading states, auth, formularios e hidratacao parcial.
- Quando a arquitetura estiver ficando confusa por excesso de `use client`, providers globais ou componentes fazendo responsabilidades demais.

## Principios Obrigatorios

1. Compor por responsabilidade:
- Buscar dados o mais perto possivel da borda server.
- Manter componentes client pequenos e focados em interacao.
- Evitar mover arvores inteiras para client quando apenas uma ilha precisa de estado.

2. Delimitar boundaries com clareza:
- Usar server components para leitura de dados, auth, permisos e montagem inicial da tela.
- Usar client components para eventos, estado local, browser APIs e UX interativa.
- Usar server actions e route handlers apenas quando fizer sentido pela fronteira da operacao.

3. Compor camadas sem vazamento:
- Layouts definem estrutura compartilhada, nao regras de negocio acidentais.
- Providers devem ser os menores possiveis e instalados perto de quem consome.
- Evitar provider global quando o estado pertence a uma unica rota ou secao.

4. Otimizar fluxo percebido:
- Aproveitar `loading.tsx`, `error.tsx`, streaming e suspense onde houver ganho real.
- Evitar waterfalls de dados entre componentes quando a composicao puder ser simplificada.

## Processo Recomendado

1. Mapear a composicao atual:
- Identificar layout, page, componentes server/client, providers e pontos de fetch.

2. Escolher a menor boundary correta:
- Decidir onde fica cada responsabilidade: leitura, mutacao, estado, navegacao e apresentacao.

3. Reduzir acoplamento:
- Extrair ilhas client pequenas.
- Subir ou descer fetch apenas quando isso simplificar a arvore e o fluxo de dados.

4. Validar o fluxo completo:
- Conferir loading, erro, auth, revalidacao e comportamento apos mutacoes.

## Quando Nao Usar Sozinha

- Nao usar sozinha quando a tarefa for apenas refinamento visual, acessibilidade ou ergonomia de formulario; nesses casos, combinar com `frontend-ux-ui`.
- Nao usar sozinha quando a prioridade principal for auth, autorizacao, schema validation ou protecao contra abuso; nesses casos, combinar com `security-hardening`.
- Nao usar como atalho para investigacao ampla da codebase quando ainda nao esta claro qual rota, layout ou modulo controla o fluxo; nesses casos, combinar com `subagent-driven-development`.

## Heuristicas Praticas

- Se um componente so renderiza dados, prefira server component.
- Se um componente precisa de clique, input ou browser API, isole a interatividade em client component.
- Se um provider existe apenas para uma pagina, nao o promova para o layout raiz.
- Se a mutacao pertence ao proprio fluxo da UI, considere server action antes de criar API interna sem necessidade.
- Se a resposta precisa ser consumida por terceiros ou por multiplos clientes, route handler tende a ser a fronteira correta.

## Relacao com Outras Skills

- Complementa `frontend-ux-ui` quando a composicao da arvore precisa sustentar uma experiencia melhor de loading, erro e interacao.
- Complementa `security-hardening` quando a escolha entre server component, action e route handler afeta auth, autorizacao e exposicao de dados.

## Nao Fazer

- Nao marcar paginas inteiras com `use client` por conveniencia.
- Nao concentrar fetch, mutacao e apresentacao interativa no mesmo componente sem necessidade.
- Nao usar providers globais para estado local de formulario, modal ou pagina isolada.
- Nao duplicar regras de auth e acesso em varias camadas quando uma boundary server resolve.

## Checklist de Entrega

- Boundaries entre server e client estao explicitas.
- Data fetching esta na camada certa para o fluxo.
- Providers foram mantidos no menor escopo util.
- Loading, erro e mutacao respeitam o App Router.
- A composicao final reduz acoplamento e `use client` desnecessario.