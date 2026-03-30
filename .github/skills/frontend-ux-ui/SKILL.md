---
name: frontend-ux-ui
description: "Use quando o pedido envolver frontend, UX, UI, design system, acessibilidade, responsividade, formulários, componentes visuais, melhorias de experiência do usuário, layout de páginas, refinamento visual ou consistência de interface em Next.js + Tailwind."
---

# Frontend UX/UI Improvement Skill

## Objetivo

Entregar melhorias de UX/UI com base em padroes consolidados da comunidade, mantendo consistencia visual, acessibilidade e boa performance em desktop e mobile.

## Padroes Obrigatorios

1. Acessibilidade primeiro:
- Seguir WCAG 2.2 AA para contraste, foco visivel, semantica HTML e navegacao por teclado.
- Garantir labels, `aria-*` quando necessario, mensagens de erro legiveis e estados de carregamento.

2. Design orientado por sistema:
- Reutilizar e evoluir componentes em `components/ui` antes de criar variantes ad-hoc.
- Padronizar tokens visuais (spacing, radius, color, typography) no tema global.
- Evitar estilos inline repetidos; extrair para utilitarios ou componentes.

3. UX de fluxo:
- Reduzir friccao em formularios (validacao em tempo util, textos de ajuda, feedback claro).
- Usar loading, empty state, error state e success state em telas de dados.
- Preservar contexto de navegacao para o usuario nao se perder no fluxo.

4. Responsividade real:
- Validar breakpoints mobile (>=320px), tablet e desktop.
- Evitar overflow horizontal e alvos de clique pequenos.
- Priorizar leitura rapida com hierarquia visual clara.

5. Performance percebida:
- Preferir renderizacao progressiva com skeletons e transicoes suaves.
- Minimizar layout shift e custo de render de componentes pesados.

## Processo Recomendado

1. Diagnostico rapido:
- Identificar o problema principal de UX (ex.: confusao no fluxo, baixa legibilidade, baixa descoberta de acao).

2. Definir direcao visual:
- Escolher uma linha visual consistente com o produto atual.
- Evitar mudancas que quebrem o padrao existente sem justificativa.

3. Implementar incrementalmente:
- Ajustar primeiro estrutura e usabilidade, depois refinamentos visuais.
- Preferir pequenas alteracoes com impacto alto.

4. Validar:
- Conferir teclado, leitor de tela basico, contraste e responsividade.
- Verificar regressao em telas relacionadas.

## Checklist de Entrega

- Fluxo principal mais claro e com menos cliques desnecessarios.
- Estados de loading/erro/vazio definidos.
- Componentes reutilizaveis atualizados no lugar correto.
- Layout funcionando em mobile e desktop.
- Sem regressao visual obvia nas rotas relacionadas.
