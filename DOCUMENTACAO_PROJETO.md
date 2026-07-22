# 🏆 Documentação do Projeto: Site Time (Gestão de Time de Futebol)

Este documento contém a listagem completa de todas as **tecnologias utilizadas** e **funcionalidades implementadas** no sistema de gestão de equipes esportivas.

---

## 🛠️ Tecnologias Utilizadas

### **1. Core & Framework Full-Stack**
- **[Next.js 16 (App Router)](https://nextjs.org/)**: Framework Full-Stack React com renderização Server-Side (SSR), Client-Side (CSR), Server Actions e rotas de API otimizadas.
- **[React 19 & React DOM 19](https://react.dev/)**: Biblioteca de interface de usuário utilizando os conceitos mais recentes do React (Server Components, Hooks avançados).
- **[TypeScript 5](https://www.typescriptlang.org/)**: Linguagem com tipagem estática que garante segurança, autocomplete e prevenção de erros em todo o ecossistema da aplicação.

### **2. Estilização & UI / UX**
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Framework CSS utilitário para design responsivo, moderno e altamente customizável.
- **[Lucide React](https://lucide.dev/)**: Conjunto de ícones vetoriais modernos e leves.
- **[React Draggable](https://github.com/react-grid-layout/react-draggable)**: Biblioteca para suporte a arrastar e soltar elementos (utilizado na prancheta tática e posicionamento no campo).

### **3. Banco de Dados & Persistência**
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional de alto desempenho.
- **[Prisma ORM 7](https://www.prisma.io/)**: ORM para Node.js e TypeScript com migrações automáticas, tipagem forte do esquema e consultas eficientes (`@prisma/client`, `@prisma/adapter-pg`, `pg`).

### **4. Autenticação & Autorização**
- **[NextAuth.js v4](https://next-auth.js.org/)**: Gerenciamento completo de sessões, autenticação segura e controle de papéis (`Role-Based Access Control - RBAC`) integrado ao Prisma (`@auth/prisma-adapter`).
- **[BcryptJS](https://github.com/dperini/bcrypt.js)**: Criptografia e hashing seguro de senhas de usuários.

### **5. Validação & Formulários**
- **[Zod 4](https://zod.dev/)**: Validação e inferência de esquemas de dados de entrada tanto no frontend quanto no backend.
- **[React Hook Form](https://react-hook-form.com/)**: Gerenciamento reativo de formulários com foco em performance e integração via `@hookform/resolvers`.

### **6. Notificações, E-mails & PWA**
- **[Web Push](https://github.com/web-push-libs/web-push)**: Notificações Push nativas enviadas diretamente para navegadores web e dispositivos móveis.
- **[Resend](https://resend.com/)**: Plataforma moderna para envio de e-mails transacionais (convites para atletas, alertas, redefinição de senha).

### **7. Processamento de Mídia & Renderização Dinâmica**
- **[Puppeteer Core](https://pptr.dev/) & [Sparticuz Chromium](https://github.com/Sparticuz/chromium)**: Navegador headless para captura de telas e geração no servidor de artes visuais (Recaps de partidas, cards de estatísticas).
- **[Sharp](https://sharp.pixelplumbing.com/)**: Biblioteca de alto desempenho para redimensionamento, conversão e otimização de imagens de upload (fotos de atletas, escudos, fotos de jogos).

### **8. Testes & Qualidade de Código**
- **[Vitest](https://vitest.dev/)**: Framework de testes unitários e de integração extremamente rápido.
- **[Playwright](https://playwright.dev/)**: Suíte de testes End-to-End (E2E) com suporte a testes visuais e modo UI interativo.
- **[ESLint 9](https://eslint.org/)**: Análise estática de código com regras customizadas para Next.js e TypeScript.

---

## ⚡ Funcionalidades do Sistema

### 🔐 1. Autenticação e Controle de Acesso (RBAC)
- **Login, Registro e Troca de Senha**: Fluxo completo de autenticação com validação e funcionalidade de troca obrigatória de senha no primeiro acesso (`mustChangePassword`).
- **Níveis de Permissão (Roles)**:
  - **ADMIN**: Acesso total às configurações do time, finanças, elenco, regras e convocações.
  - **COACH (Técnico)**: Acesso à gestão tática, escalações, convocações e avaliações de atletas.
  - **MATERIAL_DIRECTOR (Diretor de Material)**: Gestão de estoque, equipamentos e logística de jogos.
  - **PLAYER (Jogador)**: Acesso a confirmação de presença (RSVP), votação, perfil próprio e mural.
- **Tokens de Convite (`InviteToken`)**: Geração de links únicos para cadastro de novos atletas diretamente vinculados à equipe.

---

### 🏃 2. Gestão de Elenco e Atletas (Squad Management)
- **Cadastro Completo do Atleta**: Nome completo, apelido, número de camisa único, posição principal e secundária, idade, telefone, bio e foto de perfil.
- **Status do Atleta**: Controle de disponibilidade (Ativo / Inativo).
- **Regras Individuais de Disponibilidade (`PlayerAvailabilityRule`)**:
  - Definição de horários e dias da semana disponíveis por jogador.
  - Frequências: Semanal, Quinzenal ou Mensal/Opcional.
- **Perfil do Jogador**: Histórico de estatísticas individuais (gols, assistências, cartões), presenças e conquistas.

---

### 📅 3. Gestão de Partidas e Calendário (Match Management)
- **Tipos de Partida**: Suporte a Amistosos (`FRIENDLY`) e Campeonatos (`CHAMPIONSHIP`).
- **Detalhes da Partida**: Data, horário, adversário (com foto/escudo), local, endereço com geolocalização (latitude/longitude), e indicação de mandante ou visitante.
- **Status do Confronto**: Agendada (`SCHEDULED`), Concluída (`COMPLETED`) ou Cancelada (`CANCELLED`).
- **Cobrança por Partida (Taxa de Jogo)**: Definição de valor por atleta, chave PIX e controle individual de comprovantes de pagamento.
- **Checklist Pré e Pós-Jogo**: Lista de checagem personalizada por partida (bolas, uniformes, água, pagamento da quadra).
- **Votação de Melhor da Partida (Craque do Jogo)**: Sistema de votação interna onde os atletas escolhem o destaque da partida.
- **Enquete de Datas (`DatePoll`)**: Criação de enquetes interativas para o elenco votar no melhor dia/horário para agendamento de partidas.
- **Galeria de Fotos da Partida (`MatchPhoto`)**: Upload e visualização de fotos dos jogos.
- **Jogadores Convidados (`GuestPlayer`)**: Inclusão temporária de atletas externos para partidas específicas sem necessidade de cadastro no elenco fixo.

---

### 📋 4. Escalação Visual & Prancheta Tática
- **Formações Táticas Pré-definidas**: 4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 3-4-3, 5-3-2, 4-1-4-1, 5-4-1.
- **Estilos de Bloco Defensivo**: Recuado (Baixo), Equilibrado ou Pressionante (Alto).
- **Campo Interativo com Arrastar e Soltar (Drag & Drop)**: Posicionamento visual dos titulares e reservas no campo utilizando coordenadas em tempo real.
- **Escalação Padrão da Equipe**: Configuração de uma escalação base padrão para agilizar novos jogos.
- **Limite de Jogadores por Posição**: Definição de tetos de inscritos/convocados por posição (ex: máximo 2 goleiros, 4 zagueiros).

---

### ⏱️ 5. Confirmação de Presença (RSVP) & Lista de Chamada
- **Painel de RSVP**: Confirmação, recusa ou pendência dos atletas convocados.
- **Convocação Direta**: Opção para marcar quais atletas do elenco estão convocados (`summoned`) para cada partida.
- **Histórico de RSVP (`RSVPStatusLog`)**: Registro de auditoria com data e alteração de status de cada resposta de presença.
- **Lista de Chamada em Campo (`MatchAttendance`)**: Marcação de presença real no dia do jogo, hora do check-in e número utilizado na partida.

---

### 🔴 6. Cobertura de Partida ao Vivo (Live Match Tracker)
- **Cronômetro e Status em Tempo Real**: Pré-jogo, 1º Tempo, Intervalo, 2º Tempo e Encerrado.
- **Placar Dinâmico**: Atualização de placar em tempo real durante o jogo.
- **Feed de Eventos da Partida (`MatchLiveEvent`)**:
  - Gols e Assistências (vinculados aos atletas ou convidados).
  - Cartões Amarelos e Vermelhos.
  - Substituições.

---

### 📊 7. Estatísticas, Classificação & Temporadas
- **Estatísticas Individuais e Coletivas**: Gols, assistências, cartões e jogos disputados.
- **Rankings Rápidos**: Tabela de artilharia, líderes de assistências e ranking de disciplina.
- **Sistema de Conquistas (Badges / Achievements)**:
  - 🎩 *Hat-Trick* (3 gols na mesma partida).
  - ⚽ *Artilheiro da Rodada*.
  - 🅰️ *Maestro de Assistências*.
  - 📅 *100% de Presença no Mês*.
  - 🎖️ *Veterano de Clube*.
- **Gestão de Temporadas (`Season`)**: Organização de campeonatos por Ligas, Copas e Torneios com acompanhamento de período.

---

### 🎨 8. Geração de Recaps Visuais (Match Recap & Stories)
- **Geração de Artes para Redes Sociais**: Criação de cards visuais automatizados via renderização headless no servidor.
- **Destaques do Jogo**: Imagens estilizadas com placar, autores dos gols, garçons e estatísticas prontas para publicação no Instagram Stories e WhatsApp.

---

### 💰 9. Gestão Financeira do Clube (Finances)
- **Fluxo de Caixa**: Registro de Entradas (`INCOME`) e Saídas (`EXPENSE`).
- **Categorização Financeira**: Mensalidades, Taxa de Amistoso, Taxa de Jogo, Aluguel de Campo, Arbitragem, Equipamentos e Outros.
- **Controle de Mensalidades (`MembershipPayment`)**: Matriz mensal indicando pagamento de cada atleta por mês/ano.
- **Controle de Pagamento de Jogos (`MatchPayment`)**: Acompanhamento de pagamentos por partida com upload e validação de comprovantes de transferência.

---

### ⚖️ 10. Regulamento, Disciplina, Advertências e Suspensões
- **Regulamento Interno (`Rule`)**: Cadastro das regras da equipe com grau de severidade.
- **Tipos de Punições Personalizáveis (`PunishmentType`)**: Configuração de punições (Advertência, Suspensão por jogos, Multas).
- **Regra de Acúmulo Automático (`PunishmentAccumulationRule`)**:
  - Regra configurável de conversão automática (ex: 3 advertências geram automaticamente 1 jogo de suspensão).
  - Janela de expiração em dias configurável para caducidade de advertências.
- **Aplicação e Cumprimento de Suspensões (`Fine`)**: Controle de punições ativas, cumpridas ou canceladas, com vinculação direta à partida em que o atleta deverá cumprir a suspensão.

---

### ⭐ 11. Avaliação Técnica e Tática de Atletas
- **Avaliações da Comissão Técnica (`PlayerEvaluation`)**: Avaliação quantitativa (notas de 1 a 5) em 4 pilares: *Técnica*, *Tática*, *Físico* e *Disciplina*, com parecer técnico em texto.
- **Avaliação entre Atletas (`MatchPlayerRating`)**: Classificação pós-jogo por estrelas dada pelos companheiros de time.

---

### 📦 12. Gestão de Equipamentos e Material Esportivo
- **Controle de Estoque de Materiais (`Equipment`)**:
  - Categorias: Uniformes, Meias, Bolas, Coletes e Outros.
  - Métricas: Quantidade Total, Disponível, Mínima em estoque, Danificada e Perdida.
  - Estado de conservação (Novo, Bom, Usado, Ruim) e local de armazenamento.
- **Pedidos de Compra (`EquipmentOrder`)**: Fluxo de solicitação e recebimento de novos materiais.
- **Controle de Logística de Jogo (`MatchEquipment`)**: Registro de quais materiais foram levados para o jogo e confirmação de retorno pós-partida.

---

### 💬 13. Central de Comunicação e Notificações
- **Mural do Time (`TeamMessage`)**: Chat interno da equipe com opção de fixar avisos importantes (`pinned`) e reagir com emojis.
- **Sistema Multicanal de Notificações (`Notification` & Push)**:
  - Notificações in-app e Notificações Push no celular/navegador.
  - Tipos: Nova partida agendada, convocação/RSVP, cobrança de mensalidade/jogo, aplicação de punição, aviso fixado e recap disponível.

---

### 🌐 14. Interação Pública, Desafios e Recrutamento
- **Solicitação Externa de Amistosos (`FriendlyRequestForm`)**: Formulário público para times adversários marcarem jogos com o clube (com propostas de data, local e taxa).
- **Painel de Horários/Vagas Abertas (`OpenMatchSlot`)**: Divulgação pública de horários disponíveis da equipe para receber propostas de amistosos.
- **Peneira e Recrutamento (`RecruitmentForm`)**: Formulário público para novos jogadores solicitarem um teste no clube.
- **Página/Perfil Público da Equipe (`/slug-do-time`)**: Landing page pública exibindo escudo, foto dos uniformes (Home/Away/GK), modalidades (Grama, Sintético, Futsal, Society), nível competitivo e informações do clube.

---

### 🎯 15. Estúdio de Jogadas Ensaiavas (Tactical Plays)
- **Criador de Jogadas Táticas**: Ferramenta para desenhar e armazenar jogadas ensaiadas (escanteios, faltas, saídas de bola) com dados de movimentação salvos em formato vetorial/JSON.

---

### 📈 16. Telemetria e Monitoramento do Sistema
- **Endpoint de Telemetria (`/api/telemetry`)**: Coleta autônoma de métricas de desempenho e tratamento de erros do sistema.
