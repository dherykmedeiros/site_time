# Contexto do Projeto
Aja como um Engenheiro de Software Sênior. Quero desenvolver uma aplicação web para gestão de times esportivos amadores. O sistema deve permitir que donos de times organizem seu elenco, finanças, jogos e estatísticas, além de permitir que times visitantes solicitem partidas amistosas.

# Stack Tecnológica
- Frontend: Next.js (App Router), React, Tailwind CSS.
- Backend/API: [NOTA: Inserir aqui Next.js API Routes com Prisma OU Django REST Framework].
- Banco de Dados: PostgreSQL.

# Funcionalidades Principais (Épicos)

## 1. Configuração do Time e Perfil Público
- O dono do time pode configurar: Nome, Escudo, Descrição, Cores e Informações Padrões (ex: local onde costumam mandar os jogos).
- Geração de uma página pública (Vitrine) mostrando o elenco, estatísticas gerais e um formulário para visitantes.

## 2. Gestão de Elenco
- CRUD de Jogadores (Nome, Posição, Número da camisa, Foto, Status de atividade).
- Níveis de acesso: Admin (Dono/Diretoria) e Jogador (Visualização e confirmação de presença).

## 3. Gestão de Jogos e Calendário
- Agendamento de partidas (Data, Horário, Local, Adversário, Tipo: Amistoso/Campeonato).
- Sistema de confirmação de presença (RSVP) para os jogadores do elenco.
- Quando a data do jogo passar, habilitar formulário de "Pós-Jogo" para adicionar estatísticas da partida (Placar, Gols, Assistências, Cartões).

## 4. Motor de Estatísticas
- Estatísticas individuais dos jogadores devem ser atreladas às partidas.
- O sistema deve agregar automaticamente as estatísticas de todas as partidas para compor o ranking geral do time (Artilheiros, Líder de Assistências, etc.).

## 5. Solicitação de Amistosos
- Visitantes podem acessar a página pública e preencher um formulário solicitando um jogo (Data, Horário, Local e Valor da cota/taxa).
- Admins recebem a solicitação em um painel e podem "Aprovar" ou "Rejeitar", disparando notificações adequadas.

## 6. Gestão Financeira (Caixinha)
- Controle de receitas (mensalidade dos jogadores, cotas de amistosos).
- Controle de despesas (aluguel de quadra/campo, arbitragem, material).

# Instruções de Geração para o Copilot
1. Comece gerando a arquitetura do Banco de Dados (Schema SQL ou Modelos ORM) para atender a todas essas entidades e seus relacionamentos.
2. Sugira a estrutura de pastas do projeto.
3. Crie os endpoints da API / Server Actions necessários para o fluxo de "Solicitação de Amistosos".
4. Foque em criar componentes reutilizáveis para o frontend.