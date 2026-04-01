---
name: "Agent Routing"
description: "Use quando houver duvida sobre qual agente, prompt ou skill do catalogo deve ser usado primeiro; cobre roteamento entre Customization Manager, Codebase Investigator e o fluxo Speckit."
---

# Agent Routing

## Ordem de Decisao

- Se o pedido for sobre customizacoes do Copilot em `.github/`, comece por `Customization Manager`.
- Se ainda nao estiver claro onde fica a responsabilidade tecnica e a tarefa for read-only, use `Codebase Investigator` antes de qualquer implementacao.
- Se o pedido for de produto e o objetivo for gerar artefatos Speckit, siga a ordem `specify -> clarify -> checklist opcional -> plan -> tasks -> analyze opcional -> implement -> taskstoissues opcional`.

- Use `Customization Manager` para criar, revisar, corrigir ou reorganizar qualquer customizacao em `.github/`.
- Use `Codebase Investigator` quando o objetivo ainda for descobrir ownership, entry points, causa raiz ou o melhor local de edicao sem implementar nada.
- Use `speckit.constitution` quando a mudanca for de governanca do projeto ou de regras que devem propagar para templates.
- Use `speckit.specify` quando a entrada ainda for um pedido de produto e o proximo artefato correto for `spec.md`.
- Use `speckit.clarify` quando `spec.md` ja existir, mas ainda houver ambiguidade material para UX, dados, seguranca ou validacao.
- Use `speckit.checklist` quando a necessidade for validar a qualidade dos requisitos escritos, nao a implementacao.
- Use `speckit.plan` quando a especificacao ja estiver estavel o bastante para gerar arquitetura, contratos e plano tecnico.
- Use `speckit.tasks` quando o plano ja existir e o proximo passo for derivar `tasks.md` em ordem de dependencia.
- Use `speckit.analyze` quando `spec.md`, `plan.md` e `tasks.md` precisarem de revisao read-only de consistencia antes da implementacao.
- Use `speckit.implement` apenas quando `tasks.md` estiver aprovado e a intencao ja for executar o trabalho.
- Use `speckit.taskstoissues` apenas quando as tarefas ja existirem e a decisao explicita for abrir issues no GitHub.
- Combine `subagent-driven-development` com uma skill de dominio quando a tarefa for discovery-heavy antes de editar.
- Combine `vercel-composition-patterns` com `frontend-ux-ui` ou `security-hardening` quando a discussao envolver App Router, server actions, providers ou route handlers com impacto em UX ou seguranca.

## Exemplos Rapidos

- "Crie uma skill nova para formularios acessiveis" -> `Customization Manager` + `frontend-ux-ui`.
- "Nao sei onde esse comportamento e controlado no App Router" -> `Codebase Investigator` + `vercel-composition-patterns`.
- "Tenho um pedido de feature e preciso comecar a documentacao" -> `speckit.specify`.
- "A spec existe, mas ainda faltam decisoes de seguranca e validacao" -> `speckit.clarify` + `security-hardening`.
- "A spec esta aprovada e agora preciso do plano tecnico" -> `speckit.plan`.
- "O plano esta pronto e quero quebrar em tarefas" -> `speckit.tasks`.
- "Quero uma revisao read-only antes de implementar" -> `speckit.analyze`.
- "As tarefas estao aprovadas e quero executar" -> `speckit.implement`.
- "As tarefas aprovadas devem virar issues no GitHub" -> `speckit.taskstoissues`.