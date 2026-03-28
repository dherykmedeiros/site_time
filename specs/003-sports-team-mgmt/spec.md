# Feature Specification: Gestão de Times Esportivos Amadores

**Feature Branch**: `003-sports-team-mgmt`  
**Created**: 2026-03-28  
**Status**: Draft  
**Sport**: Futebol (v1 — football-specific)  
**Input**: User description: "Aplicação web para gestão de times esportivos amadores. O sistema deve permitir que donos de times organizem seu elenco, finanças, jogos e estatísticas, além de permitir que times visitantes solicitem partidas amistosas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configuração do Time e Perfil Público (Priority: P1)

O dono de um time esportivo amador acessa o sistema, cria sua conta e configura o perfil do time: nome, escudo (upload de imagem), descrição, cores do time e informações padrão como o local onde costumam mandar seus jogos. Após configurar, o sistema gera automaticamente uma página pública (Vitrine) que exibe o elenco, estatísticas gerais do time e um formulário para visitantes solicitarem partidas.

**Why this priority**: Sem o perfil do time configurado, nenhuma outra funcionalidade faz sentido. É o ponto de entrada e a base sobre a qual todo o sistema opera. A Vitrine pública é o principal canal de aquisição de adversários.

**Independent Test**: Pode ser testado criando uma conta, configurando um time completo e verificando que a página pública é acessível por URL e exibe corretamente todas as informações.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado sem time, **When** ele preenche nome, escudo, descrição, cores e local padrão e salva, **Then** o time é criado e uma página pública é gerada com URL acessível.
2. **Given** um time configurado, **When** um visitante acessa a URL pública, **Then** ele vê o elenco, estatísticas gerais e o formulário de solicitação de amistoso.
3. **Given** um admin do time, **When** ele edita qualquer informação do perfil, **Then** as alterações refletem imediatamente na página pública.

---

### User Story 2 - Gestão de Elenco (Priority: P1)

O administrador do time cadastra os jogadores do elenco com nome, posição, número da camisa, foto e status (ativo/inativo). Os jogadores podem ter acesso ao sistema com permissão limitada para visualizar informações do time e confirmar presença em jogos. O admin pode promover jogadores para o papel de co-administrador (diretoria).

**Why this priority**: O elenco é a entidade central do sistema. Sem jogadores cadastrados, não há como registrar estatísticas, confirmar presença ou gerar a Vitrine.

**Independent Test**: Pode ser testado cadastrando jogadores, editando seus dados, alternando status e verificando que a lista aparece corretamente no painel e na Vitrine.

**Acceptance Scenarios**:

1. **Given** um admin autenticado, **When** ele adiciona um novo jogador com todos os campos obrigatórios, **Then** o jogador aparece na lista do elenco.
2. **Given** um jogador cadastrado, **When** o admin altera seu status para inativo, **Then** o jogador deixa de aparecer no elenco ativo mas permanece no histórico.
3. **Given** um jogador com acesso ao sistema, **When** ele faz login, **Then** ele visualiza o calendário de jogos e pode confirmar ou recusar presença, mas não pode editar dados do time.
4. **Given** um admin, **When** ele promove um jogador para Admin/Diretoria, **Then** o jogador passa a ter permissões de administração.

---

### User Story 3 - Agendamento de Jogos e Confirmação de Presença (Priority: P2)

O administrador agenda partidas informando data, horário, local, nome do adversário e tipo (amistoso ou campeonato). Após o agendamento, todos os jogadores ativos recebem uma notificação e podem confirmar ou recusar presença. O admin visualiza em tempo real quantos jogadores confirmaram.

**Why this priority**: A gestão de jogos é o coração operacional do time. Sem agendamento e confirmação de presença, o time não consegue organizar suas partidas.

**Independent Test**: Pode ser testado agendando uma partida, verificando que os jogadores recebem a notificação, confirmar presença com diferentes jogadores e validar o contador de confirmações.

**Acceptance Scenarios**:

1. **Given** um admin autenticado, **When** ele cria uma partida com data, horário, local, adversário e tipo, **Then** a partida aparece no calendário do time.
2. **Given** uma partida agendada, **When** um jogador ativo acessa o sistema, **Then** ele pode confirmar ou recusar presença.
3. **Given** jogadores confirmando presença, **When** o admin visualiza os detalhes da partida, **Then** ele vê a lista de confirmados, recusados e pendentes.
4. **Given** uma partida agendada, **When** a data da partida ainda não passou, **Then** o formulário de pós-jogo não está disponível.

---

### User Story 4 - Registro de Estatísticas Pós-Jogo (Priority: P2)

Após a data de uma partida passar, o sistema habilita um formulário de pós-jogo onde o admin registra o placar e as estatísticas individuais: gols, assistências e cartões (amarelo/vermelho) de cada jogador que participou. Essas estatísticas são vinculadas ao jogador e à partida.

**Why this priority**: As estatísticas dão sentido competitivo ao sistema e são o diferencial que mantém os jogadores engajados. Dependem de jogos e elenco já cadastrados.

**Independent Test**: Pode ser testado criando um jogo com data passada, preenchendo o formulário de pós-jogo e verificando que as estatísticas são salvas e vinculadas aos jogadores corretos.

**Acceptance Scenarios**:

1. **Given** uma partida cuja data já passou, **When** o admin acessa os detalhes da partida, **Then** o formulário de pós-jogo está habilitado.
2. **Given** o formulário de pós-jogo, **When** o admin registra placar, gols, assistências e cartões, **Then** as estatísticas são salvas e associadas à partida e aos jogadores.
3. **Given** uma partida com estatísticas registradas, **When** qualquer usuário visualiza os detalhes da partida, **Then** ele vê o placar e as estatísticas individuais.

---

### User Story 5 - Motor de Estatísticas e Rankings (Priority: P3)

O sistema agrega automaticamente as estatísticas de todas as partidas para gerar rankings do time: artilheiros, líderes de assistências, jogadores com mais cartões, aproveitamento do time (vitórias/empates/derrotas). Esses rankings são visíveis no painel do admin e na página pública.

**Why this priority**: Rankings são derivados de dados existentes e adicionam valor analítico. Não bloqueiam funcionalidades essenciais e podem ser implementados após o registro de estatísticas funcionar.

**Independent Test**: Pode ser testado registrando estatísticas em múltiplas partidas e verificando que os rankings são calculados e exibidos corretamente, com ordenação adequada.

**Acceptance Scenarios**:

1. **Given** estatísticas registradas em pelo menos duas partidas, **When** um usuário acessa o ranking de artilheiros, **Then** os jogadores são listados em ordem decrescente de gols.
2. **Given** um time com histórico de partidas, **When** um visitante acessa a Vitrine, **Then** ele vê estatísticas agregadas do time (total de jogos, vitórias, empates, derrotas, aproveitamento).
3. **Given** estatísticas atualizadas em uma nova partida, **When** o ranking é acessado, **Then** ele reflete os dados mais recentes sem necessidade de ação manual.

---

### User Story 6 - Solicitação de Amistosos via Vitrine (Priority: P3)

Um visitante (representante de outro time) acessa a página pública de um time e preenche o formulário de solicitação de amistoso informando: nome do time visitante, contato, data/horários sugeridos, local sugerido e valor de cota/taxa proposto. O admin recebe a solicitação em seu painel e pode aprovar ou rejeitar, gerando uma notificação para o solicitante.

**Why this priority**: Funcionalidade chave para conectar times, mas depende da Vitrine (P1) estar funcionando. Visitantes podem ser contactados por outros meios no início.

**Independent Test**: Pode ser testado acessando a Vitrine como visitante, preenchendo o formulário, verificando que a solicitação aparece no painel do admin, e testando aprovação/rejeição com notificação.

**Acceptance Scenarios**:

1. **Given** um visitante na página pública de um time, **When** ele preenche o formulário de amistoso com todos os campos e envia, **Then** a solicitação é registrada e o visitante recebe confirmação de recebimento.
2. **Given** uma solicitação de amistoso pendente, **When** o admin a aprova, **Then** o solicitante é notificado e a partida é automaticamente adicionada ao calendário do time.
3. **Given** uma solicitação de amistoso pendente, **When** o admin a rejeita, **Then** o solicitante é notificado com o motivo da rejeição.
4. **Given** um formulário de amistoso, **When** o visitante envia sem preencher campos obrigatórios, **Then** o sistema exibe mensagens de validação claras.

---

### User Story 7 - Gestão Financeira (Caixinha) (Priority: P3)

O admin registra receitas (mensalidades dos jogadores, cotas recebidas de amistosos) e despesas (aluguel de quadra/campo, arbitragem, material esportivo). O sistema exibe o saldo atual, histórico de transações e permite filtrar por período. O sistema pode gerar um resumo financeiro mensal.

**Why this priority**: A gestão financeira é importante para organização do time, mas pode ser feita manualmente no início. Não bloqueia a operação esportiva.

**Independent Test**: Pode ser testado registrando receitas e despesas, verificando saldo, aplicando filtros de período e gerando um resumo mensal.

**Acceptance Scenarios**:

1. **Given** um admin autenticado, **When** ele registra uma receita com valor, descrição, categoria e data, **Then** o valor é adicionado ao saldo e aparece no histórico.
2. **Given** um admin autenticado, **When** ele registra uma despesa com valor, descrição, categoria e data, **Then** o valor é subtraído do saldo e aparece no histórico.
3. **Given** transações registradas ao longo de vários meses, **When** o admin filtra por um período específico, **Then** apenas as transações dentro do período selecionado são exibidas.
4. **Given** transações registradas, **When** o admin acessa o resumo financeiro de um mês, **Then** ele vê total de receitas, total de despesas e saldo do período.

---

### Edge Cases

- O que acontece quando um jogador é removido do elenco mas possui estatísticas registradas em partidas anteriores? As estatísticas são preservadas no histórico.
- O que acontece quando um admin tenta registrar estatísticas de pós-jogo para uma partida cuja data ainda não passou? O formulário permanece bloqueado.
- O que acontece quando dois times solicitam amistoso na mesma data e horário? O admin recebe ambas solicitações e decide qual aprovar; aprovar uma não bloqueia a outra automaticamente.
- O que acontece quando o admin tenta deletar uma partida que já possui estatísticas registradas? O sistema exige confirmação explícita antes de deletar, alertando que estatísticas serão perdidas.
- O que acontece quando um jogador tenta confirmar presença em um jogo após a data ter passado? A confirmação de presença é bloqueada automaticamente.
- O que acontece quando o escudo do time é um arquivo com formato não suportado? O sistema aceita apenas formatos de imagem padrão e exibe mensagem de erro para formatos inválidos.
- O que acontece quando um visitante envia múltiplas solicitações de amistoso em curto intervalo? O sistema implementa rate limiting para evitar spam.

## Clarifications

### Session 2026-03-28

- Q: Qual a relação entre Player e User? Player exige conta (User) para existir, ou pode existir independentemente? → A: Player existe sem User; admin cadastra jogador e pode enviar link de convite para o jogador criar conta opcionalmente.
- Q: Jogadores devem ter acesso de leitura aos dados financeiros (caixinha) ou apenas admins? → A: Sim, jogadores têm acesso read-only às finanças para transparência.
- Q: O sistema é específico para futebol ou multi-esporte? → A: Futebol-específico na v1; campos de estatísticas são gols, assistências e cartões.
- Q: Qual o target concreto de carregamento de página para SC-008? → A: < 3 segundos em conexão 4G móvel.
- Q: Como jogadores ficam sabendo de novas partidas se não acessam o app? → A: Notificações in-app + link compartilhável (deep link) que o admin cola no grupo de WhatsApp.

## Requirements *(mandatory)*

### Functional Requirements

**Configuração e Autenticação**

- **FR-001**: Sistema DEVE permitir criação de conta com e-mail e senha.
- **FR-002**: Sistema DEVE suportar dois níveis de acesso: Admin (Dono/Diretoria) e Jogador.
- **FR-003**: Admin DEVE poder criar e configurar um time com: nome, escudo (imagem), descrição, cores e local padrão de jogos.
- **FR-004**: Sistema DEVE gerar uma página pública (Vitrine) com URL única para cada time configurado.

**Elenco**

- **FR-005**: Admin DEVE poder cadastrar jogadores com: nome, posição, número da camisa, foto e status (ativo/inativo).
- **FR-006**: Admin DEVE poder editar e remover jogadores do elenco.
- **FR-007**: Admin DEVE poder promover jogadores para o nível Admin (Diretoria).
- **FR-008**: Jogadores com acesso ao sistema DEVEM visualizar calendário, informações do time e dados financeiros (read-only), mas não editá-los.
- **FR-008.1**: Admin DEVE poder cadastrar jogadores no elenco sem exigir que tenham conta no sistema. O admin pode enviar um link de convite para o jogador criar conta opcionalmente.
- **FR-009**: Sistema DEVE preservar o histórico de estatísticas de jogadores removidos ou inativos.

**Jogos e Calendário**

- **FR-010**: Admin DEVE poder agendar partidas com: data, horário, local, adversário e tipo (Amistoso/Campeonato).
- **FR-011**: Sistema DEVE permitir que jogadores ativos confirmem ou recusem presença em partidas futuras.
- **FR-012**: Admin DEVE visualizar o status de confirmação de presença (confirmado/recusado/pendente) de cada jogador para cada partida.
- **FR-013**: Sistema DEVE bloquear confirmação de presença após a data/hora da partida passar.
- **FR-013.1**: Sistema DEVE gerar um link compartilhável (deep link) para cada partida agendada, permitindo que o admin copie e cole no grupo de WhatsApp para notificar jogadores.

**Estatísticas**

- **FR-014**: Sistema DEVE habilitar formulário de pós-jogo apenas após a data/hora da partida ter passado.
- **FR-015**: Admin DEVE poder registrar no pós-jogo: placar, gols por jogador, assistências por jogador e cartões (amarelo/vermelho) por jogador.
- **FR-016**: Estatísticas individuais DEVEM ser vinculadas à partida e ao jogador.
- **FR-017**: Sistema DEVE agregar automaticamente as estatísticas de todas as partidas para gerar rankings (artilheiro, líder de assistências, cartões, aproveitamento do time).

**Amistosos**

- **FR-018**: Visitantes DEVEM poder enviar solicitação de amistoso via formulário na Vitrine com: nome do time visitante, contato, data/horários sugeridos, local sugerido e valor de cota/taxa.
- **FR-019**: Admin DEVE poder visualizar solicitações pendentes e aprová-las ou rejeitá-las.
- **FR-020**: Ao aprovar uma solicitação, o sistema DEVE criar automaticamente a partida no calendário do time.
- **FR-021**: Sistema DEVE notificar o solicitante sobre aprovação ou rejeição.

**Financeiro**

- **FR-022**: Admin DEVE poder registrar receitas com: valor, descrição, categoria (mensalidade, cota de amistoso, outro) e data.
- **FR-023**: Admin DEVE poder registrar despesas com: valor, descrição, categoria (aluguel de quadra, arbitragem, material, outro) e data.
- **FR-024**: Sistema DEVE exibir saldo atual calculado (receitas - despesas).
- **FR-025**: Sistema DEVE permitir filtrar transações por período e categoria.
- **FR-026**: Sistema DEVE gerar resumo financeiro mensal com totais de receitas, despesas e saldo.

**Segurança e Validação**

- **FR-027**: Sistema DEVE validar todos os campos obrigatórios nos formulários antes de envio.
- **FR-028**: Upload de imagens (escudo, fotos) DEVE ser restrito a formatos padrão (JPEG, PNG, WebP) e tamanho máximo de 5 MB.
- **FR-029**: Sistema DEVE implementar rate limiting no formulário público de solicitação de amistosos.
- **FR-030**: Apenas admins DEVEM poder executar operações de escrita (criar, editar, deletar) em dados do time.

### Key Entities

- **Time (Team)**: Entidade central. Nome, escudo, descrição, cores, local padrão, URL da Vitrine. Um time tem muitos jogadores, partidas e transações financeiras.
- **Usuário (User)**: Pessoa com acesso ao sistema. E-mail, senha, papel (Admin ou Jogador). Cada Admin pertence a um time. Um User pode ser vinculado a um Player, mas a existência do Player não exige User (o admin cadastra jogadores e opcionalmente envia link de convite para criação de conta).
- **Jogador (Player)**: Membro do elenco. Nome, posição, número da camisa, foto, status (ativo/inativo). Pode existir sem conta de User associada. Relação opcional 1:1 com User. Possui muitas estatísticas de partidas.
- **Partida (Match)**: Jogo agendado ou realizado. Data, horário, local, adversário, tipo (Amistoso/Campeonato), placar. Possui muitas confirmações de presença e estatísticas.
- **Confirmação de Presença (RSVP)**: Relação entre um jogador e uma partida. Status (confirmado/recusado/pendente).
- **Estatística de Partida (MatchStats)**: Estatísticas individuais de um jogador em uma partida. Gols, assistências, cartão amarelo, cartão vermelho.
- **Solicitação de Amistoso (FriendlyRequest)**: Pedido de um visitante para jogar. Nome do time visitante, contato, data/horários sugeridos, local, valor de cota, status (pendente/aprovado/rejeitado).
- **Transação Financeira (Transaction)**: Registro de receita ou despesa. Tipo (receita/despesa), valor, descrição, categoria, data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um admin consegue criar conta, configurar o time e ter a Vitrine publicada em menos de 10 minutos.
- **SC-002**: Um admin consegue cadastrar um jogador completo (com foto) em menos de 2 minutos.
- **SC-003**: Um jogador consegue confirmar presença em uma partida em menos de 30 segundos após acessar o sistema.
- **SC-004**: Após o registro de estatísticas de uma partida, os rankings do time são atualizados automaticamente sem intervenção manual.
- **SC-005**: Um visitante consegue preencher e enviar o formulário de solicitação de amistoso em menos de 3 minutos.
- **SC-006**: O admin visualiza solicitações pendentes e consegue aprovar/rejeitar em menos de 1 minuto por solicitação.
- **SC-007**: O resumo financeiro mensal é gerado sob demanda e apresenta dados corretos baseados nas transações cadastradas.
- **SC-008**: As páginas principais carregam em menos de 3 segundos em conexão 4G móvel.
- **SC-009**: 90% dos admins de time conseguem completar o fluxo completo (configurar time, adicionar elenco, agendar jogo) sem assistência externa.
- **SC-010**: As estatísticas agregadas na Vitrine pública refletem 100% das partidas com pós-jogo registrado, sem divergências.

## Assumptions

- Usuários possuem conexão estável à internet (aplicação web sem modo offline).
- Cada conta de admin gerencia apenas um time (relação 1:1 entre admin e time na v1).
- Notificações ao solicitante de amistoso serão feitas via e-mail informado no formulário.
- Notificações internas para jogadores (presença, novos jogos) serão feitas via links compartilháveis (deep links) que o admin pode copiar e colar em grupos de WhatsApp. Não há sistema de notificação in-app dedicado na v1 (sem bell icon, push notifications, ou notification center). "In-app" no contexto da v1 significa apenas que jogadores logados veem partidas e RSVPs no dashboard. Não há integração direta com a API do WhatsApp; o compartilhamento é manual.
- O sistema não gerencia campeonatos completos (tabelas, chaves, fases); apenas registra partidas individuais do tipo "Campeonato".
- Autenticação será baseada em e-mail e senha com sessões seguras; integração com provedores sociais (Google, Facebook) está fora do escopo da v1.
- Não há cobrança automática ou integração com gateways de pagamento; o módulo financeiro é apenas para controle manual de receitas e despesas.
- O sistema será single-tenant por time: cada time tem seus dados isolados e não há busca cruzada entre times.
- As imagens (escudo e fotos de jogadores) serão armazenadas com limite de 5 MB por arquivo.
- O idioma da interface será Português Brasileiro (pt-BR).
