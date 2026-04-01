# Plano de Staging Técnico — Roadmap de Crescimento 2026

**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Objetivo**: sequenciar mudanças de schema, APIs, UI e telemetria de forma aditiva, com o menor risco possível de retrabalho entre ondas.

---

## Princípios de Engenharia

### 1. Modelagem aditiva antes de refactor

Cada onda deve começar adicionando tabelas, campos e contratos novos sem quebrar fluxos já usados por partidas, RSVP, vitrine e finanças.

### 2. Derivação antes de persistência

Quando a feature puder nascer de cálculo em tempo real, ela deve evitar persistência inicial. Isso vale principalmente para F-012, F-014 e F-017.

### 3. Validar no backend, explicar no frontend

As regras de negócio devem morar em `lib/` e `app/api/`, enquanto o dashboard só consome payloads explicáveis e tolerantes a ausência de dados.

### 4. Instrumentação mínima e tardia

Eventos próprios só entram quando o banco não responder a pergunta de produto. O padrão continua sendo derivar o máximo possível de `Match`, `RSVP`, `Transaction`, `FriendlyRequest` e tabelas novas de cada onda.

### 5. Evitar acoplamento prematuro entre ondas

Onda 2 não deve depender de persistência extra da Onda 1 além do estritamente necessário. Onda 4 não deve introduzir cobrança real antes de forecast e valor percebido estarem estabilizados.

---

## Onda 1 — Coordenação Inteligente

### Objetivo técnico

Criar uma camada operacional nova ao redor de partidas sem reescrever o fluxo atual de RSVP, estatísticas e finanças.

### Schema stage

Adicionar apenas os blocos abaixo:

- `PlayerAvailabilityRule` ligado a `Player` para F-011;
- estruturas de presença/checklist ligadas a `Match` para F-013;
- campo opcional `matchId` em `Transaction` se a rastreabilidade financeira por jogo entrar já no MVP.

### API stage

Abrir rotas novas sem sobrecarregar handlers existentes:

- `app/api/players/me/availability/route.ts`;
- `app/api/matches/availability/route.ts`;
- `app/api/matches/[id]/lineup/route.ts`;
- `app/api/matches/[id]/bordereau/route.ts`.

### Domain stage

Criar módulos pequenos e reutilizáveis em `lib/`:

- agregador de disponibilidade/quorum;
- motor de sugestão de escalação;
- normalizador de despesas do borderô.

### UI stage

Concentrar a entrada e consumo em superfícies já existentes:

- perfil do jogador em `components/forms/PlayerSelfProfileForm.tsx`;
- criação/edição de partida em `components/forms/MatchForm.tsx`;
- detalhe da partida em `app/(dashboard)/matches/[id]/page.tsx`;
- finanças em `app/(dashboard)/finances/page.tsx`.

### Regra de contenção

Não persistir lineup manual, não gerar cobrança automática por jogador e não transformar o termômetro em bloqueio duro de agendamento no primeiro corte.

---

## Onda 2 — Loop do Jogador

### Objetivo técnico

Gerar recorrência a partir de dados já produzidos por partidas encerradas, sem abrir uma nova área pesada de backoffice.

### Schema stage

Evitar schema novo no primeiro corte da F-014. O recap deve nascer de agregação de `Match`, `MatchStats`, `Achievement`, `Player` e `Team`.

### API stage

Priorizar rotas derivadas e descartáveis:

- agregadores em `lib/achievements.ts` e novos utilitários de recap;
- rotas OG em `app/api/og/` para recap individual e coletivo.

### UI stage

Distribuir CTAs onde já existe tráfego natural:

- detalhe público do jogador em `app/vitrine/[slug]/jogadores/[id]/page.tsx`;
- detalhe de partida em `app/vitrine/[slug]/matches/[id]/page.tsx`;
- detalhe interno da partida em `app/(dashboard)/matches/[id]/page.tsx`.

### Regra de contenção

Não criar feed social, comentários ou biblioteca de mídia nesta onda. O foco é compartilhar ativos derivados, não abrir rede social interna.

---

## Onda 3 — Rede Entre Times

### Objetivo técnico

Expandir a vitrine pública e o fluxo de amistosos para descoberta e memória relacional, sem transformar o produto em marketplace amplo cedo demais.

### Schema stage

Introduzir modelagem em duas camadas:

- camada pública: opt-in de agenda aberta e slots publicados por time;
- camada privada/admin: perfil de adversário, histórico e review pós-jogo.

### API stage

Evoluir superfícies já existentes:

- `app/vitrine/page.tsx` e `app/vitrine/[slug]/page.tsx` para descoberta;
- `app/api/friendly-requests/route.ts` e `app/api/friendly-requests/[id]/route.ts` para origem contextualizada;
- rotas novas de CRM apenas quando o modelo de adversário estiver estável.

### UI stage

Separar claramente experiência pública e privada:

- público: diretório, filtros, slots e CTA de amistoso;
- privado: histórico do adversário, confiabilidade e notas internas.

### Regra de contenção

Não abrir score público de reputação no MVP da onda. Reputação deve começar como ferramenta interna do admin para evitar efeito colateral social e ruído de moderação.

---

## Onda 4 — Monetização

### Objetivo técnico

Monetizar valor já comprovado sem adicionar dependência de billing complexo antes da hora.

### Schema stage

Começar com modelagem de forecast e sinais de risco, não de assinatura complexa:

- projeções derivadas de `Transaction` e `MembershipPayment`;
- flags de feature gating só quando F-018/F-019 realmente entrarem em build.

### API stage

Estender primeiro o resumo financeiro atual:

- `app/api/finances/summary/route.ts` para projeção e risco;
- rotas auxiliares de cobrança assistida só se a equipe confirmar o fluxo de lembrete.

### UI stage

O dashboard financeiro deve mostrar primeiro:

- previsto vs realizado;
- risco de caixa;
- jogadores/pagamentos que exigem ação;
- explicação curta de por que o forecast está assim.

### Regra de contenção

Não integrar gateway de pagamento, split, assinatura recorrente externa ou sponsor marketplace no primeiro corte de monetização.

---

## Sequência Recomendada de Migrations

1. Onda 1: `PlayerAvailabilityRule`, checklist/presença de match e eventual `Transaction.matchId`.
2. Onda 2: preferir zero migrations.
3. Onda 3: settings públicos de agenda + slots + CRM de adversários.
4. Onda 4: somente campos realmente necessários para forecast persistido ou gating premium.

Cada migration deve ser pequena, reversível e isolada por feature. Evitar empilhar duas features grandes da mesma onda na mesma migration.

---

## Estratégia de Contratos

### Contratos internos

Toda feature nova deve nascer com um payload claro em `lib/validations/` antes da UI final.

### Contratos públicos

Tudo que tocar vitrine ou OG deve ser resiliente a ausência parcial de dados. O público não pode depender de consistência perfeita de estatística ou histórico para renderizar.

### Compatibilidade

Rotas atuais de partidas, finanças e amistosos não devem mudar shape de resposta no MVP das ondas. Adicionar campos novos é aceitável; quebrar payload existente não é.

---

## Focos de Teste por Onda

### Onda 1

- cálculo de quorum por horário;
- limite por posição no RSVP versus sugestão de lineup;
- rastreabilidade de despesa ligada à partida.

### Onda 2

- fallback de recap com estatística incompleta;
- geração de OG sem dependência de dados perfeitos;
- links de compartilhamento válidos.

### Onda 3

- descoberta regional com diretório pouco populado;
- criação e resposta de amistoso originado do diretório;
- consistência do vínculo entre adversário e histórico.

### Onda 4

- precisão básica do forecast;
- falsos positivos em risco de caixa;
- segurança das ações de cobrança assistida.

---

## Sinais de Quebra de Sequência

Interromper avanço para a próxima onda se ocorrer qualquer um destes cenários:

- Onda 1 ainda depende de operação paralela fora do sistema para o fluxo semanal principal;
- Onda 2 exige schema extra para funcionar porque a base de stats/OG ainda está frágil;
- Onda 3 abre diretório sem densidade mínima por região ou sem times com opt-in real;
- Onda 4 está sendo usada para justificar cobrança antes de retenção e valor operacional claros.

---

## Uso Recomendado Deste Arquivo

Usar este documento como trava de sequência antes de:

- abrir migrations novas;
- ampliar contrato de rotas existentes;
- puxar uma feature de onda futura para dentro da sprint corrente;
- introduzir persistência que o roadmap ainda não comprovou necessária.