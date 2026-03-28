<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 (template) → 1.0.0
  Modified principles: N/A (initial adoption)
  Added sections:
    - Core Principles (5 principles defined)
    - Stack Tecnológica & Convenções
    - Escopo Funcional
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no updates needed (generic gates)
    - .specify/templates/spec-template.md ✅ no updates needed (generic)
    - .specify/templates/tasks-template.md ✅ no updates needed (generic)
    - .specify/templates/commands/ ✅ no command files exist
  Follow-up TODOs: None
-->

# Site Time Constitution

## Core Principles

### I. Componentes Reutilizáveis

- O frontend DEVE ser construído com componentes React reutilizáveis
  estilizados via Tailwind CSS.
- Componentes de UI (botões, cards, modais, tabelas) DEVEM ser
  genéricos e reutilizáveis em múltiplas features.
- Lógica de negócio NÃO DEVE residir em componentes de apresentação;
  separar hooks/services de componentes visuais.
- Rationale: Evita duplicação de código no frontend, garante
  consistência visual e acelera o desenvolvimento de novas telas.

### II. API-First

- Toda funcionalidade DEVE ser exposta via Next.js API Routes antes
  de ser consumida pelo frontend.
- O frontend DEVE consumir dados exclusivamente através das API Routes;
  acesso direto ao banco de dados a partir de componentes é proibido.
- Cada endpoint DEVE ter um contrato claro (request/response types)
  definido em TypeScript.
- Rationale: Desacopla frontend de backend, permite testes
  independentes de cada camada e viabiliza futuras integrações
  (mobile, terceiros).

### III. Type-Safety

- TypeScript DEVE ser usado com `strict: true` em todo o projeto
  (frontend e backend).
- Prisma DEVE ser o único ORM; queries raw SQL são proibidas exceto
  quando Prisma não suportar a operação (justificar no PR).
- Tipos gerados pelo Prisma Client DEVEM ser a fonte de verdade
  para entidades do domínio; NÃO duplicar definições manualmente.
- `any` é proibido; `unknown` com narrowing é a alternativa quando
  o tipo não for inferível.
- Rationale: Elimina classes inteiras de bugs em tempo de compilação
  e garante que schema do banco, API e frontend estejam sincronizados.

### IV. Segurança

- Rotas protegidas DEVEM exigir autenticação; requisições sem sessão
  válida DEVEM retornar 401.
- Autorização por nível de acesso (Admin/Jogador) DEVE ser verificada
  em server-side antes de executar qualquer operação.
- Toda entrada de usuário (body, query params, path params) DEVE ser
  validada em server-side com schema de validação (ex.: Zod).
- Dados sensíveis (senhas, tokens) NUNCA DEVEM ser expostos em
  responses ou logs.
- Rationale: Aplicação acessível publicamente; falhas de segurança
  comprometem dados pessoais de jogadores e finanças do time.

### V. Simplicidade

- YAGNI: NÃO implementar funcionalidades que não foram solicitadas.
- Começar com a solução mais simples que atenda aos requisitos;
  refatorar apenas quando houver necessidade comprovada.
- Abstrações DEVEM ser criadas somente quando houver pelo menos
  dois casos de uso concretos (Rule of Three).
- Premature optimization é proibida; medir antes de otimizar.
- Rationale: Projeto amador com escopo definido; complexidade
  desnecessária atrasa entregas e dificulta manutenção.

## Stack Tecnológica & Convenções

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend/API**: Next.js API Routes com Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Linguagem**: TypeScript (strict mode) em todo o projeto
- **Idioma do código**: Inglês (variáveis, funções, comentários
  técnicos, nomes de arquivos)
- **Idioma da UI**: Português (BR) para textos visíveis ao usuário
- **Estrutura de pastas**: Segue convenções do Next.js App Router
  (`app/`, `components/`, `lib/`, `prisma/`)

## Escopo Funcional

O projeto abrange as seguintes funcionalidades principais:

1. **Configuração do Time e Perfil Público (Vitrine)** — Página
   pública com informações do time.
2. **Gestão de Elenco** — CRUD de jogadores com níveis de acesso
   Admin e Jogador.
3. **Gestão de Jogos e Calendário** — Agendamento de partidas,
   confirmação de presença (RSVP), registro pós-jogo.
4. **Motor de Estatísticas** — Estatísticas individuais de jogadores
   e ranking geral do elenco.
5. **Solicitação de Amistosos** — Formulário público para convites
   e painel administrativo para gestão.
6. **Gestão Financeira (Caixinha)** — Controle de receitas e despesas
   do time.

## Governance

- Esta constitution é o documento máximo do projeto; todas as decisões
  técnicas e de processo DEVEM estar em conformidade.
- Alterações na constitution requerem: (1) descrição da mudança,
  (2) justificativa, (3) atualização de versão seguindo SemVer.
- Todo PR DEVE ser verificado contra os princípios desta constitution.
- Complexidade além do previsto DEVE ser justificada explicitamente
  referenciando qual princípio está sendo flexibilizado e por quê.
- Revisão de conformidade DEVE ocorrer a cada nova feature iniciada
  (via seção "Constitution Check" no plano de implementação).

**Version**: 1.0.0 | **Ratified**: 2026-03-28 | **Last Amended**: 2026-03-28
