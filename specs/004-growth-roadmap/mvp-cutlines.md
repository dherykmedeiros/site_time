# Linhas de Corte de Escopo - Roadmap de Crescimento 2026

**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Objetivo**: definir o que entra no MVP de cada feature, o que fica explicitamente para depois e o que nao deve entrar enquanto a tese ainda nao estiver validada.

---

## Regra de Uso

Quando houver duvida de escopo durante implementacao, aplicar esta ordem:

1. manter apenas o que sustenta o resultado principal da feature;
2. preferir calculo derivado e explicavel a persistencia prematura;
3. adiar automacao que gere promessa forte sem feedback real de uso;
4. cortar qualquer item que dependa de dois modulos novos ao mesmo tempo.

---

## Onda 1 - Operacao Proativa

### F-011 Disponibilidade recorrente

**Entra no MVP**

- cadastro de regras recorrentes por jogador autenticado;
- leitura admin de previsao simples por data e horario;
- termometro de quorum no formulario da partida;
- alertas simples por posicao com base no elenco ativo e disponibilidade prevista.

**Fica para depois**

- excecoes por periodo ferias/afastamento com calendario rico;
- sugestao automatica de melhor horario baseada em historico;
- notificacao proativa para jogadores atualizarem disponibilidade vencida.

**Fora de escopo por enquanto**

- integracao com Google Calendar;
- machine learning para previsao individual;
- score de confiabilidade pessoal do jogador exposto ao admin.

### F-012 Escalacao inteligente

**Entra no MVP**

- sugestao derivada em tempo real na pagina da partida;
- titulares, banco e alertas de desequilibrio;
- heuristica deterministica e explicavel usando RSVP confirmado, posicao principal e limites por posicao;
- recalculo simples sob demanda.

**Fica para depois**

- travas manuais persistidas entre sessoes;
- modo de formacao tatico visual;
- ajuste por retrospecto recente e minutos jogados.

**Fora de escopo por enquanto**

- IA generativa para comentar escalacao;
- ranking interno de desempenho para escolher titularidade;
- export grafico complexo com campo e arrastar-soltar.

### F-013 Bordero do jogo

**Entra no MVP**

- checklist operacional enxuto por partida;
- presenca real no local;
- despesas vinculadas a partida com rastreabilidade minima;
- rateio apenas visual, sem gerar cobranca automatica.

**Fica para depois**

- templates de checklist por tipo de partida;
- anexos simples de comprovante;
- consolidado de custo medio por local ou adversario.

**Fora de escopo por enquanto**

- caixa detalhado por pessoa no dia do jogo;
- cobranca individual automatica por presenca;
- conciliacao financeira com extrato bancario.

---

## Onda 2 - Loop do Jogador

### F-014 Recap compartilhavel

**Entra no MVP**

- recap individual com stats e conquistas recentes;
- recap coletivo da rodada ou partida;
- imagem OG ou payload compartilhavel simples;
- CTA para visitar perfil publico ou vitrine.

**Fica para depois**

- comparacao com media da temporada;
- recap mensal consolidado;
- ranking semanal com destaque editorial.

**Fora de escopo por enquanto**

- feed social interno;
- comentarios e curtidas dentro da plataforma;
- edicao manual de layout do recap pelo usuario.

---

## Onda 3 - Rede Entre Times

### F-015 Agenda aberta e diretorio

**Entra no MVP**

- opt-in publico do time para aparecer no diretorio enriquecido;
- slots abertos para amistoso com data aproximada e contexto minimo;
- filtros simples por regiao, cidade ou disponibilidade;
- CTA para abrir pedido de amistoso contextualizado.

**Fica para depois**

- ranking de resposta no diretorio;
- filtros por perfil tecnico de adversario;
- destaque pago de times no indice.

**Fora de escopo por enquanto**

- marketplace amplo com pagamento dentro da plataforma;
- matching automatico de adversarios em background;
- mapa em tempo real dependente de geolocalizacao fina.

### F-016 CRM de adversarios

**Entra no MVP**

- perfil consolidado por adversario recorrente;
- timeline minima de pedidos, aprovacoes e partidas;
- review simples pos-jogo pelo admin;
- indicacao resumida de confiabilidade operacional.

**Fica para depois**

- lembretes de follow-up;
- tags customizadas por adversario;
- score composto com peso por no-show, resposta e experiencia.

**Fora de escopo por enquanto**

- reputacao publica aberta para todos os times;
- comentarios livres visiveis externamente;
- ranking publico de melhores adversarios.

---

## Onda 4 - Monetizacao

### F-017 Financeiro preditivo

**Entra no MVP**

- forecast mensal simples baseado em padroes recentes;
- lista de pendencias e risco de caixa;
- mensagens assistidas de cobranca;
- visao resumida de risco administrativo.

**Fica para depois**

- sazonalidade por competicao;
- simulacoes de cenario;
- score de previsibilidade do caixa por time.

**Fora de escopo por enquanto**

- automacao de cobranca com gateway de pagamento;
- dunning multicanal completo;
- projection engine com modelos estatisticos avancados.

### F-018 Vitrine de parceiros

**Entra no MVP**

- bloco simples de parceiros na vitrine publica;
- links rastreaveis ou cliques contabilizaveis de forma minima;
- identidade visual coerente com o time.

**Fica para depois**

- relatorio de exposicao por parceiro;
- blocos rotativos por campanha;
- patrocinador em assets compartilhaveis selecionados.

**Fora de escopo por enquanto**

- ad server interno;
- cobranca automatica por impressao ou clique;
- inventario comercial multi-tenant completo.

### F-019 Plano Pro em camadas

**Entra no MVP**

- empacotamento simples de recursos premium validos;
- comparativo claro entre free e pro;
- gating basico por time.

**Fica para depois**

- mais de uma camada paga;
- trials complexos com automacao;
- bundles por tamanho do time ou liga.

**Fora de escopo por enquanto**

- billing recorrente sofisticado sem sinais claros de valor;
- paywall em fluxos nucleares de onboarding;
- sistema comercial complexo antes do PMF parcial admin.

---

## Sinais de Escopo Inflado

Se qualquer feature comecar a exigir 3 ou mais destes sinais ao mesmo tempo, o corte deve ser revisto:

- novo modelo Prisma + nova rota + nova tela complexa + nova telemetria dedicada;
- dependencias em duas ondas diferentes;
- configuracao avancada antes do primeiro uso real;
- promessa de automacao forte sem baseline operacional;
- necessidade de suporte manual para explicar o conceito toda semana.

---

## Uso Pratico na Execucao

- `spec.md` define a aposta de produto;
- os mini-specs congelam o contrato tecnico da feature;
- `tasks.md` organiza implementacao;
- este arquivo decide o que cortar quando tempo, complexidade ou feedback real apertarem.