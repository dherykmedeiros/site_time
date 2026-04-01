# Roadmap de Crescimento 2026 — Novas Funcionalidades e Melhorias

**Spec Branch**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft — Replanejado com base no produto atual

---

## Objetivo

Transformar a aplicação de um bom sistema de registro operacional em uma plataforma que:

- antecipa problemas antes do dia do jogo;
- aumenta o hábito de uso do jogador, não só do admin;
- cria efeito de rede entre times;
- abre espaço real para monetização sem parecer artificial.

---

## Estado Atual do Produto

O produto já ultrapassou a fase de MVP inicial e hoje cobre boa parte da operação de um time amador.

| Área | Estado atual |
|---|---|
| Auth com Admin/Jogador | ✅ Entregue |
| Vitrine pública do time | ✅ Entregue |
| Elenco com convites | ✅ Entregue |
| Partidas, RSVP e deep links | ✅ Entregue |
| Pós-jogo e estatísticas | ✅ Entregue |
| Perfil público do jogador | ✅ Entregue |
| Cards compartilháveis de resultado | ✅ Entregue |
| Controle de mensalidade | ✅ Entregue |
| Conquistas e badges | ✅ Entregue |
| Temporadas e classificação | ✅ Entregue |
| PWA + push notifications | ✅ Entregue |
| Convocação para WhatsApp | ✅ Entregue |

Conclusão: as próximas apostas não devem repetir funcionalidades já implementadas. O maior ganho agora está em coordenação inteligente, retenção do jogador e crescimento em rede.

---

## Diagnóstico Atual

Mesmo com a base pronta, ainda existem lacunas claras:

1. O admin ainda precisa adivinhar se vai conseguir montar time antes de criar ou confirmar um jogo.
2. A operação do dia do jogo continua espalhada entre app, grupo de WhatsApp e memória do organizador.
3. O jogador ainda entra mais para consultar do que para perseguir objetivos pessoais.
4. A descoberta entre times ainda é limitada; a vitrine existe, mas a rede ainda não existe.
5. O financeiro já registra passado, mas ainda não ajuda a prever risco de caixa e inadimplência.

---

## Tese de Crescimento

O próximo ciclo deve posicionar a aplicação em três papéis ao mesmo tempo:

- **Sistema de coordenação**: ajuda a montar elenco, prever faltas e organizar logística.
- **Sistema de identidade esportiva**: dá ao jogador motivos para voltar, compartilhar e se comparar.
- **Sistema de rede**: conecta times, melhora a qualidade dos amistosos e cria reputação.

---

## Eixos Estratégicos

### Eixo 1 — Operação Proativa

Evitar que o admin descubra os problemas tarde demais.

### Eixo 2 — Hábito do Jogador

Criar retorno recorrente do atleta ao produto, mesmo fora do dia do jogo.

### Eixo 3 — Rede Entre Times

Fazer a plataforma ser o lugar natural para encontrar adversários confiáveis.

### Eixo 4 — Monetização com Valor Claro

Cobrar por redução de esforço, previsibilidade e visibilidade, não por bloquear o básico.

---

## Funcionalidades Propostas

### [P1] F-011 — Central de Disponibilidade Recorrente

**Eixo**: Operação Proativa

**Problema que resolve**: o RSVP responde ao jogo já criado, mas não ajuda o admin a decidir se vale marcar aquele jogo em determinado dia e horário.

**Ideia**:

- Cada jogador informa padrões de disponibilidade: dias preferidos, horários inviáveis, frequência quinzenal, períodos de trabalho/estudo.
- O admin visualiza um termômetro de quorum ao montar uma nova partida.
- O sistema aponta risco antes da confirmação: “quorum provável baixo”, “faltam goleiros”, “sobram defensores”.

**Escopo inicial**:

- Preferências recorrentes por jogador.
- Indicador de quorum estimado no formulário de partida.
- Alertas simples por posição com base no elenco ativo e limites por posição já existentes.

**Por que vale agora**: reduz cancelamentos, retrabalho no WhatsApp e frustração do admin.

---

### [P1] F-012 — Escalação Inteligente e Banco Sugerido

**Eixo**: Operação Proativa

**Problema que resolve**: mesmo com RSVP confirmado, montar uma escalação equilibrada ainda é manual.

**Ideia**:

- Na página do jogo, o sistema sugere escalação titular e banco usando posição principal, limites por posição, presença recente e status de confirmação.
- O admin pode travar escolhas manualmente e pedir uma nova sugestão.
- O produto destaca desequilíbrios como “muitos atacantes”, “sem lateral direito”, “goleiro reserva ausente”.

**Escopo inicial**:

- Sugestão heurística, sem prometer “IA”.
- Foco em distribuição por posição e cumprimento de limites.
- Exportação da escalação em formato de card simples para compartilhar.

**Por que vale agora**: aproveita dados que o produto já tem e gera utilidade imediata toda semana.

---

### [P1] F-013 — Borderô do Jogo

**Eixo**: Operação Proativa

**Problema que resolve**: no dia da partida o admin precisa controlar presença real, custos extras e observações operacionais fora do sistema.

**Ideia**:

- Checklist do jogo: uniforme, bola, colete, arbitragem, campo pago, adversário confirmado.
- Check-in dos presentes no local.
- Registro de custos reais do jogo e rateio opcional entre presentes.
- Geração automática de pendências financeiras extras ligadas ao evento.

**Escopo inicial**:

- Checklist editável por partida.
- Check-in manual dos atletas presentes.
- Lançamento de despesas do jogo com sugestão de rateio.

**Por que vale agora**: aumenta stickiness operacional e fecha uma parte crítica da rotina do time.

---

### [P1] F-014 — Recap Compartilhável do Jogador e da Rodada

**Eixo**: Hábito do Jogador

**Problema que resolve**: o resultado compartilhável existe, mas ainda falta um motivo pessoal mais forte para cada jogador divulgar o produto.

**Ideia**:

- Card semanal do jogador com participação, gols, assistências, sequência de presença e badge conquistada.
- Card da rodada do time com “top 3 da semana”, “homem do jogo” e progresso da temporada.
- Versões próprias para WhatsApp Status e Instagram Stories.

**Escopo inicial**:

- Reaproveitar infraestrutura de OG/image generation.
- Um recap individual e um recap coletivo.
- Botão de compartilhamento no perfil do jogador e no dashboard.

**Por que vale agora**: reforça o loop viral sem depender só do admin.

---

### [P2] F-015 — Agenda Aberta e Diretório Geográfico de Times

**Eixo**: Rede Entre Times

**Problema que resolve**: a vitrine pública é útil, mas a descoberta ainda depende demais de links diretos.

**Ideia**:

- Times podem publicar “datas abertas” para amistosos.
- Diretório com filtros por cidade, região, tipo de campo, dia preferido e faixa de nível competitivo.
- Destaque para times responsivos e bem avaliados.

**Escopo inicial**:

- Opt-in para listagem pública.
- Lista filtrável de times.
- Publicação de disponibilidade por data.

**Por que vale depois**: esse é o primeiro passo real para efeito de rede.

---

### [P2] F-016 — CRM de Adversários e Reputação de Amistosos

**Eixo**: Rede Entre Times

**Problema que resolve**: organizar amistosos recorrentes exige memória do admin sobre quem responde bem, quem desmarca em cima da hora e quem vale chamar de novo.

**Ideia**:

- Histórico por adversário: convites enviados, taxa de resposta, no-show, partidas realizadas, custo médio.
- Avaliação pós-jogo com critérios simples: pontualidade, organização, esportividade.
- Ranking privado de confiabilidade para o admin e selo público opcional para o diretório.

**Escopo inicial**:

- Timeline por adversário.
- Score interno de confiabilidade.
- Avaliação curta pós-partida.

**Por que vale depois**: melhora a qualidade da rede e diferencia o produto dos grupos informais.

---

### [P2] F-017 — Financeiro Preditivo e Cobrança Assistida

**Eixo**: Monetização com Valor Claro

**Problema que resolve**: o módulo financeiro registra o que entrou e saiu, mas ainda não ajuda o admin a agir antes de faltar dinheiro.

**Ideia**:

- Projeção do caixa do mês com base em mensalidades esperadas, despesas recorrentes e eventos já agendados.
- Lista de risco de inadimplência com jogadores sem pagamento recente.
- Lembretes de cobrança com mensagem pronta para WhatsApp e comprovante simples após quitação.

**Escopo inicial**:

- Projeção mensal básica.
- Identificação automática de pendências recorrentes.
- Geração de mensagens prontas de cobrança e confirmação.

**Por que vale depois**: aumenta percepção de valor administrativo e prepara o terreno para plano pago.

---

### [P3] F-018 — Vitrine de Parceiros e Patrocinadores Locais

**Eixo**: Monetização com Valor Claro

**Problema que resolve**: muitos times conseguem apoio local informal, mas não têm onde exibir nem mensurar retorno para parceiros.

**Ideia**:

- Espaço na vitrine para patrocinadores do time.
- Cards com logo, cupom, contato e categoria do parceiro.
- Relatório simples de cliques/visualizações para entregar ao patrocinador.

**Escopo inicial**:

- Cadastro de parceiros por time.
- Bloco público na vitrine.
- Métrica simples de exposição.

**Por que vale depois**: cria valor econômico para o time e diferencia a plataforma para amadores mais organizados.

---

### [P3] F-019 — Plano Pro em Camadas

**Eixo**: Monetização com Valor Claro

**Proposta**:

- **Core gratuito**: gestão básica do time, jogos, vitrine e stats.
- **Pro Operação**: disponibilidade recorrente, escalação sugerida, borderô e financeiro preditivo.
- **Pro Growth**: agenda aberta, destaque no diretório, vitrine de patrocinadores, analytics de compartilhamento.

**Princípio**: monetizar ganho de eficiência, visibilidade e previsibilidade. O básico continua útil gratuitamente.

---

## Sequência Recomendada

### Onda 1 — Valor operacional imediato

- F-011 Central de disponibilidade recorrente
- F-012 Escalação inteligente e banco sugerido
- F-013 Borderô do jogo

### Onda 2 — Loop de retenção e viralização

- F-014 Recap compartilhável do jogador e da rodada
- ajustes nas badges e perfis públicos para reforçar recorrência

### Onda 3 — Efeito de rede

- F-015 Agenda aberta e diretório geográfico
- F-016 CRM de adversários e reputação

### Onda 4 — Monetização

- F-017 Financeiro preditivo e cobrança assistida
- F-018 Vitrine de parceiros
- F-019 Plano Pro em camadas

---

## Matriz de Prioridade

| Feature | Esforço | Impacto | Horizonte |
|---|---|---|---|
| F-011 Disponibilidade recorrente | Médio | Alto | Imediato |
| F-012 Escalação inteligente | Médio | Alto | Imediato |
| F-013 Borderô do jogo | Médio | Alto | Imediato |
| F-014 Recap compartilhável | Baixo/Médio | Alto | Curto prazo |
| F-015 Agenda aberta + diretório | Alto | Muito alto | Médio prazo |
| F-016 CRM de adversários | Médio | Médio/Alto | Médio prazo |
| F-017 Financeiro preditivo | Médio | Alto | Médio prazo |
| F-018 Vitrine de parceiros | Médio | Médio | Longo prazo |
| F-019 Plano Pro | Alto | Alto | Longo prazo |

---

## Métricas de Sucesso

- aumentar a taxa de RSVP concluído até 24h antes do jogo;
- reduzir partidas com quorum insuficiente ou improvisado;
- aumentar sessões por jogador ativo por mês;
- aumentar compartilhamentos originados de perfis e recaps, não só de resultados;
- aumentar a quantidade de amistosos iniciados dentro da plataforma;
- atingir uma primeira camada clara de funcionalidades monetizáveis sem degradar o plano gratuito.

---

## O Que Não Priorizar Agora

- chat interno completo;
- marketplace amplo com pagamento embutido desde o início;
- “IA” genérica sem dados e sem explicabilidade;
- funcionalidades de campeonato ultra complexas antes de consolidar a rede entre times.

---

## Resumo Executivo

O produto já tem base suficiente para sair da lógica de “sistema que registra o que aconteceu” e entrar na lógica de “sistema que ajuda o time a funcionar melhor e crescer”.

Se a prioridade for maximizar valor em curto prazo, a melhor aposta é:

1. F-011 Central de disponibilidade recorrente.
2. F-012 Escalação inteligente.
3. F-013 Borderô do jogo.
4. F-014 Recap compartilhável do jogador e da rodada.

Esse bloco combina utilidade semanal real para o admin com novos gatilhos de retorno e compartilhamento para o jogador.
