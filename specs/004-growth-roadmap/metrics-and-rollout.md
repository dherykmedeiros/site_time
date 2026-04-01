# Métricas e Rollout — Roadmap de Crescimento 2026

**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Objetivo**: transformar o roadmap em execução mensurável, compatível com a instrumentação que o produto já tem hoje.

---

## Premissa Operacional

O repositório ainda não tem stack dedicada de product analytics como PostHog, Mixpanel ou GA. Então o plano de medição precisa nascer em duas camadas:

1. **Métricas operacionais a partir do banco**: partidas, RSVPs, estatísticas, transações, pagamentos, pedidos de amistoso e assinaturas de push.
2. **Sinais mínimos de produto via eventos próprios**: registrar apenas eventos centrais quando uma feature nova precisar de leitura comportamental que o banco sozinho não entrega.

Isso evita travar o roadmap por causa de analytics prematuro.

---

## Fontes de Verdade Já Disponíveis

### Banco atual

- `Match`, `RSVP`, `MatchStats`, `MatchPositionLimit`
- `FriendlyRequest`
- `Transaction`, `MembershipPayment`
- `Achievement`
- `PushSubscription`

### Superfícies já existentes que ajudam no rollout

- notificações push para nova partida e resultado;
- cards/OG já existentes e vitrine pública;
- fluxo de amistoso já disponível pela vitrine;
- módulo financeiro com transações e resumo mensal.

---

## Princípios de Medição

### 1. Medir uso real, não só clique

Sempre preferir “feature gerou dado durável” a “usuário abriu tela”.

### 2. Priorizar leading indicators semanais

O produto gira em ciclo semanal de treino/jogo. As métricas principais devem responder semanalmente.

### 3. Separar adoção de utilidade

Uma feature pode ser aberta e ainda não gerar efeito. Por isso cada item deve ter:

- métrica de adoção;
- métrica de utilidade;
- métrica de qualidade/risco.

### 4. Só introduzir evento novo quando o banco não resolver

Se a leitura já sai de `Match`, `RSVP`, `Transaction` ou `FriendlyRequest`, não criar telemetria redundante.

---

## Métricas por Onda

## Onda 1 — Operação Proativa

### F-011 Disponibilidade recorrente

**Adoção**

- percentual de jogadores ativos com pelo menos 1 regra cadastrada;
- percentual de partidas criadas após consulta do termômetro;
- número médio de regras por jogador que aderiu.

**Utilidade**

- redução de partidas com quorum final baixo;
- redução de partidas com posição crítica descoberta só após RSVP;
- tempo médio entre criação da partida e primeira confirmação relevante.

**Qualidade**

- diferença entre previsão inicial e confirmados finais;
- frequência de risco `HIGH` em jogos que mesmo assim foram agendados;
- taxa de edição/apagamento de regra logo após cadastro.

**Fonte principal**

- banco + eventual evento leve `match_availability_preview_requested` apenas se for necessário saber quantas consultas foram feitas no formulário.

### F-012 Escalação inteligente

**Adoção**

- percentual de partidas elegíveis em que a sugestão foi aberta;
- percentual de partidas com ao menos 1 recalculo;
- percentual de partidas com compartilhamento da escalação.

**Utilidade**

- percentual de partidas com titulares sugeridos cobrindo todas as posições críticas;
- redução de partidas com excesso severo em uma posição e ausência em outra;
- tempo até definição operacional da escalação em jogos com limite por posição.

**Qualidade**

- taxa de partidas com alerta de falta critica mesmo apos sugestao;
- taxa de recalculo repetido acima de 3 vezes por partida;
- percentual de sugestões geradas com confiança `LOW`.

**Fonte principal**

- resposta derivada do motor + evento leve `lineup_suggestion_viewed` e `lineup_recalculated`, porque essas ações não ficam persistidas no banco no MVP.

### F-013 Borderô do jogo

**Adoção**

- percentual de partidas realizadas com borderô iniciado;
- percentual de partidas com check-in real preenchido;
- percentual de partidas com ao menos uma despesa vinculada.

**Utilidade**

- diferença entre presença confirmada no RSVP e presença real registrada;
- percentual de despesas da semana vinculadas a partidas;
- número de partidas fechadas sem controle paralelo externo relatado pelo admin.

**Qualidade**

- partidas com borderô sem checklist e sem attendance;
- despesas sem categoria ou com descrição genérica demais;
- divergência entre valor total do borderô e despesas efetivamente salvas.

**Fonte principal**

- `MatchAttendance`, `MatchChecklistItem`, `Transaction.matchId`.

---

## Onda 2 — Hábito do Jogador

### F-014 Recap compartilhável

**Adoção**

- número de recaps gerados por semana;
- percentual de jogadores elegíveis que abriram seu recap;
- percentual de partidas com recap coletivo gerado.

**Utilidade**

- aumento de visitas em perfis públicos após publicação do recap;
- aumento de retorno semanal de jogadores com stats recentes;
- aumento de compartilhamentos por rodada.

**Qualidade**

- recaps sem dados suficientes gerados com fallback;
- taxa de erro na geração das imagens;
- diferença entre partidas encerradas e partidas com recap disponível.

**Fonte principal**

- rotas OG + evento leve `recap_generated` e `recap_shared`, porque visita pública e compartilhamento não ficam totalmente legíveis no banco atual.

---

## Onda 3 — Rede Entre Times

### F-015 Agenda aberta e diretório

**Adoção**

- percentual de times com opt-in público ativo;
- número de slots abertos publicados;
- número de buscas/filtros aplicados no diretório.

**Utilidade**

- número de pedidos de amistoso originados do diretório;
- taxa de resposta dos times listados;
- conversão de slot aberto em amistoso confirmado.

**Qualidade**

- diretórios com baixa densidade regional;
- taxa de times listados sem resposta;
- taxa de slots expirados sem nenhuma interação.

**Fonte principal**

- `FriendlyRequest` + novos modelos do diretório + evento leve `directory_search_performed` se a equipe quiser medir filtros usados.

### F-016 CRM de adversários

**Adoção**

- percentual de amistosos encerrados com review pós-jogo;
- número de adversários com histórico consolidado;
- percentual de admins que consultaram o perfil do adversário antes de novo convite.

**Utilidade**

- redução de no-show ou desmarcação em cima da hora;
- aumento de amistosos recorrentes com adversários bem avaliados;
- melhora da taxa de resposta para convites repetidos a adversários confiáveis.

**Qualidade**

- volume de reviews muito curtos ou sempre máximos;
- perfis de adversário duplicados;
- discrepância entre score alto e taxa real de comparecimento.

**Fonte principal**

- `FriendlyRequest` + novos modelos de CRM.

---

## Onda 4 — Monetização

### F-017 Financeiro preditivo

**Adoção**

- percentual de admins que abriram a projeção mensal;
- percentual de meses com forecast calculado;
- número de lembretes de cobrança assistida gerados.

**Utilidade**

- redução de inadimplência recorrente;
- aumento de pagamentos regularizados após lembrete;
- menor número de semanas com caixa negativo inesperado.

**Qualidade**

- diferença entre forecast e realizado do mês;
- cobranças sugeridas para jogadores já adimplentes;
- volume de despesas relevantes sem categoria, prejudicando previsão.

**Fonte principal**

- `Transaction`, `MembershipPayment` e regras do novo forecast.

### F-018/F-019 Monetização direta

**Adoção**

- times com parceiros cadastrados;
- times usando vitrine premium;
- intenção explícita de upgrade.

**Utilidade**

- cliques em parceiros;
- retenção dos times mais organizados;
- uso recorrente dos recursos premium.

**Qualidade**

- parceiros sem visualização suficiente;
- baixa distinção percebida entre plano free e pro;
- uso premium concentrado só em setup, sem recorrência.

---

## Instrumentação Mínima Recomendada

Se a equipe quiser manter o roadmap sem uma stack externa no primeiro ciclo, os únicos eventos novos recomendados são:

- `match_availability_preview_requested`
- `lineup_suggestion_viewed`
- `lineup_recalculated`
- `recap_generated`
- `recap_shared`
- `directory_search_performed`
- `forecast_viewed`
- `collection_message_generated`

### Campos mínimos por evento

- `teamId`
- `userId` quando existir
- `feature`
- `entityId` relevante (`matchId`, `playerId`, `requestId`)
- `occurredAt`

### Regra

Se a equipe optar por persistir isso no banco antes de adotar analytics externo, criar uma tabela única de eventos leves, não uma tabela por feature.

---

## Gates de Rollout

### Gate 1 — Liberar Onda 2

Só avançar se a Onda 1 atingir pelo menos estes sinais por 2 ciclos semanais consecutivos:

- pelo menos 40% dos jogadores ativos com disponibilidade cadastrada em times pilotos;
- pelo menos 50% das partidas novas usando termômetro ou com previsão disponível;
- pelo menos 30% das partidas realizadas com borderô iniciado.

### Gate 2 — Liberar Onda 3

- recap coletivo gerado em pelo menos 50% das partidas encerradas de times pilotos;
- aumento perceptível de retorno semanal de jogadores ativos;
- pelo menos um time piloto relatando uso recorrente fora do fluxo estrito de jogo.

### Gate 3 — Liberar Onda 4

- operação da Onda 1 está estável sem suporte manual intenso;
- diretório e rede já têm massa mínima em pelo menos uma praça/região;
- financeiro atual já é usado com consistência suficiente para sustentar forecast e cobrança assistida.

---

## Estratégia de Rollout Recomendada

### Fase A — Piloto fechado

- liberar primeiro para 2-5 times mais organizados;
- acompanhar manualmente o uso por 3 a 4 semanas;
- tratar feedback qualitativo do admin como insumo de produto, não ruído.

### Fase B — Abertura controlada

- liberar a todos os admins;
- manter experiências do jogador atrás de gatilhos contextuais simples;
- não anunciar rede pública ampla antes de haver estoque mínimo de times e slots.

### Fase C — Comunicação de valor

- divulgar benefícios em linguagem operacional: menos improviso, menos no-show, menos cobrança manual;
- só depois destacar inteligência, ranking e previsões.

---

## Painel Executivo Sem Analytics Externo

Mesmo antes de instrumentação dedicada, a equipe já consegue montar um painel semanal com:

1. partidas criadas, realizadas e canceladas;
2. confirmados médios por partida;
3. pagamentos recebidos no mês;
4. pedidos de amistoso recebidos, aprovados e convertidos;
5. assinaturas push ativas;
6. jogos com pós-jogo completo;
7. uso de cada feature nova com contagem de registros persistidos.

Esse painel já basta para decidir se o roadmap está melhorando o produto ou só aumentando superfície.

---

## Próxima Decisão Recomendada

Ao iniciar implementação, transformar este documento em um checklist operacional por onda, com owner, data e métrica-alvo por piloto.