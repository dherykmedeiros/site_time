---
name: "Customization Catalog Maintenance"
description: "Use quando estiver mantendo o catalogo de customizacoes em .github, revisando frontmatter, naming, handoffs, prompts, skills e o arquivo canonico copilot-instructions.md."
---

# Customization Catalog Maintenance

## Fonte de Verdade

- O roteamento principal vive em `.github/agents/customization-manager.agent.md`.
- A orientacao curta de escolha entre agentes vive em `.github/instructions/agent-routing.instructions.md`.
- O arquivo canonico de instrucoes de workspace e `.github/copilot-instructions.md`.

## Regras de Estrutura

- Agentes ficam em `.github/agents/*.agent.md` com `name`, `description`, `argument-hint` e `user-invocable` quando fizer sentido.
- Prompts ficam em `.github/prompts/*.prompt.md` e devem ser atalhos finos para agentes existentes.
- Skills ficam em `.github/skills/<name>/SKILL.md` e precisam ter `name` igual ao nome da pasta.
- Instructions ficam em `.github/instructions/*.instructions.md` e devem orientar comportamento recorrente, nao duplicar workflows inteiros.

## Regras de Descoberta

- Toda `description` deve conter palavras-chave reais que o agente possa usar para descobrir o artefato.
- Evite descricoes vagas como "ajuda geral" ou "faz varias coisas".
- Prefira responsabilidades unicas: um agente por fluxo, uma skill por dominio, um prompt por atalho.

## Handoffs e Skills

- So adicione `handoffs` quando o proximo passo for operacionalmente claro e o parser aceitar o bloco sem erro.
- Use skills de dominio apenas quando o pedido realmente pedir esse dominio; nao carregue skill so por proximidade semantica.
- Quando houver descoberta antes de editar, combine a skill `subagent-driven-development` com a skill de dominio apropriada.

## Arquivos Gerados

- Trate `.github/copilot-instructions.md` como arquivo gerado pelo fluxo Speckit e mantenha apenas uma copia no repositorio.
- Se houver secoes de adicao manual, preserve apenas o conteudo entre os marcadores definidos pelo arquivo.

## Checklist Antes de Fechar

- Frontmatter YAML valido e sem tabs.
- Nome do arquivo, `name` e responsabilidade coerentes.
- Prompt apontando para agente existente.
- Description com gatilhos de descoberta suficientes.
- Nenhuma regra importante duplicada em dois lugares conflitantes.
- Diagnosticos do editor sem erro na pasta `.github`.