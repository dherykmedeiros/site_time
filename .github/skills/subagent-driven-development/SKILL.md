---
name: subagent-driven-development
description: "Use quando o pedido envolver subagent, subagente, exploracao de codebase, codebase mapping, investigacao paralela, decomposicao de tarefa, root cause analysis, refactor seguro, isolamento de contexto, planejamento por etapas ou implementacao guiada por descoberta antes de editar codigo."
---

# Subagent-Driven Development Skill

## Objetivo

Resolver tarefas com menor risco usando subagentes para explorar contexto, dividir investigacoes e reduzir suposicoes antes de editar arquivos.

## Quando Usar

- Quando a tarefa depende de entender varias areas do projeto antes de mudar codigo.
- Quando ha duvida sobre onde fica a logica correta ou qual fluxo realmente controla o comportamento.
- Quando vale investigar em paralelo arquivos, contratos, validacoes ou pontos de integracao.
- Quando a mudanca e grande o bastante para se beneficiar de descoberta estruturada antes da implementacao.
- Quando o pedido for de root cause analysis, mapeamento de responsabilidades ou refactor com risco de tocar em varios pontos.

## Limites e Nao Objetivos

- Nao usar subagente para tarefas triviais de um arquivo so, quando a leitura direta e mais rapida.
- Nao delegar a execucao inteira sem revisar o contexto retornado.
- Nao manter multiplas investigacoes abertas sem consolidar achados antes de editar.
- Nao usar subagentes para justificar complexidade desnecessaria.
- Nao usar como substituto para skills de dominio; ele orienta a descoberta, mas nao define sozinho criterios de UX, seguranca ou composicao Next.js.

## Processo Recomendado

1. Definir a pergunta certa:
- Formular buscas objetivas, com dominio, area e resultado esperado.
- Separar descobertas de implementacao para evitar edicoes prematuras.

2. Explorar em paralelo quando houver ganho real:
- Usar subagentes para mapear arquivos relevantes, fluxos de dados, validacoes, APIs e componentes relacionados.
- Pedir retorno curto, com caminhos de arquivo e conclusoes verificaveis.

3. Consolidar antes de agir:
- Cruzar os achados e identificar a menor mudanca correta.
- Confirmar dependencias, efeitos colaterais e convencoes do repositorio.

4. Implementar de forma focada:
- Editar apenas depois de entender onde esta a responsabilidade real.
- Preferir correcao na causa raiz em vez de remendos locais.

5. Verificar:
- Validar erros, impacto em arquivos relacionados e regressao basica do fluxo alterado.

## Heuristicas Praticas

- Se a pergunta for "onde isso e controlado?", comecar por descoberta via subagente.
- Se a pergunta for "como mudar este bloco especifico?", ler e editar direto.
- Se houver varias hipoteses plausiveis, investigar cada uma separadamente e comparar.
- Se os achados forem vagos, refazer a consulta com termos concretos do dominio.

## Relacao com Outras Skills

- Combine com `frontend-ux-ui` quando a descoberta precisar localizar gargalos de experiencia, formularios ou componentes antes de redesenhar a interface.
- Combine com `security-hardening` quando a investigacao envolver auth, autorizacao, validacoes, uploads ou endpoints sensiveis.
- Combine com `vercel-composition-patterns` quando a duvida principal estiver na boundary entre server/client, providers, actions ou route handlers.

## Saida Esperada

- Lista curta dos arquivos ou areas realmente relevantes.
- Hipotese principal com evidencias verificaveis.
- Alternativas descartadas quando houver mais de um caminho plausivel.
- Menor plano de mudanca seguro antes de editar.

## Nao Fazer

- Nao retornar achados genericos sem caminhos, simbolos ou responsabilidades concretas.
- Nao usar descoberta paralela quando a resposta ja estiver evidente em um unico arquivo.
- Nao transformar exploracao em planejamento excessivo sem ganho para a implementacao.

## Checklist de Entrega

- Contexto relevante descoberto antes da edicao.
- Escopo da mudanca reduzido ao minimo necessario.
- Achados consolidados em uma linha de implementacao coerente.
- Arquivos editados consistentes com os padroes do repositorio.
- Verificacao basica feita apos a implementacao.