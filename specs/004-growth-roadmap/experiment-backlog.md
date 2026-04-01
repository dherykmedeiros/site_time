# Backlog de Experimentos - Roadmap de Crescimento 2026

**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Objetivo**: validar as apostas mais arriscadas com sinais baratos antes de transformar tudo em escopo de implementacao.

---

## Como usar

Cada experimento abaixo deve responder uma pergunta especifica de produto. Se o sinal vier fraco, o objetivo nao e insistir na feature completa, e sim reduzir escopo, adiar ou matar a aposta.

Prioridade de uso:

1. executar primeiro os experimentos que reduzem risco de uma onda inteira;
2. privilegiar prototipos, fake doors e operacao manual antes de persistencia nova;
3. so abrir implementacao completa quando o sinal minimo estiver claro.

---

## Onda 1 - Coordenacao Inteligente

### E-001 - Termometro de quorum sem persistencia nova

**Feature-alvo**: F-011  
**Pergunta**: o admin realmente consulta uma previsao antes de marcar o jogo?  
**Experimento**: prototipo navegavel do `MatchForm` com termometro usando dados simulados ou leitura manual do elenco atual.  
**Custo**: baixo.  
**Sinal de sucesso**:

- admins entendem o termometro sem explicacao longa;
- pelo menos 3 de 5 admins dizem que mudariam data/horario com base nele;
- alertas por posicao sao considerados acionaveis.

**Sinal de alerta**:

- admins pedem ver nomes individuais antes de confiar no sinal;
- o termometro e percebido como "bonito, mas inutil".

**Acao se falhar**: reduzir F-011 para alerta simples por posicao e adiar modelagem mais rica de disponibilidade recorrente.

### E-002 - Escalacao sugerida explicavel

**Feature-alvo**: F-012  
**Pergunta**: uma heuristica simples gera confianca suficiente sem parecer arbitraria?  
**Experimento**: mock com escalação sugerida para 3 cenarios reais de RSVP usando partidas antigas.  
**Custo**: baixo.  
**Sinal de sucesso**:

- admin entende porque cada titular foi sugerido;
- desequilibrios por posicao sao percebidos como uteis;
- pelo menos metade dos admins aceitaria usar a sugestao como ponto de partida semanal.

**Sinal de alerta**:

- admin quer editar tudo antes de confiar;
- pedido recorrente por "nota geral" ou ranking opaco para decidir escalação.

**Acao se falhar**: manter apenas diagnostico posicional e adiar sugestao automatica de titulares.

### E-003 - Bordero operacional em fluxo manual

**Feature-alvo**: F-013  
**Pergunta**: vale centralizar a rotina do dia do jogo dentro do app?  
**Experimento**: simular o bordero com checklist, presenca e despesas em uma planilha guiada por 2 jogos piloto.  
**Custo**: baixo.  
**Sinal de sucesso**:

- admin registra presenca e despesa no mesmo fluxo;
- o resumo final da partida substitui pelo menos um controle paralelo fora do app;
- rateio como sugestao ja e considerado suficiente.

**Sinal de alerta**:

- checklist quase nao e usado;
- admins querem cobranca automatica antes mesmo de usar o fluxo basico.

**Acao se falhar**: manter somente despesas vinculadas a partida e adiar checklist/check-in detalhado.

---

## Onda 2 - Retencao e Distribuicao

### E-004 - Fake door do recap compartilhavel

**Feature-alvo**: F-014  
**Pergunta**: jogador quer compartilhar recap pessoal ou isso so interessa ao admin?  
**Experimento**: botao de "gerar meu recap" com mock estatico para jogadores de times piloto.  
**Custo**: baixo.  
**Sinal de sucesso**:

- taxa de clique alta em relacao ao total de jogadores ativos da semana;
- compartilhamento espontaneo em WhatsApp/Instagram nos pilotos;
- feedback positivo sobre orgulho, comparacao e historico pessoal.

**Sinal de alerta**:

- curiosidade inicial sem compartilhamento real;
- recap percebido como repeticao do placar do time.

**Acao se falhar**: focar recap coletivo do time antes do individual.

---

## Onda 3 - Rede Entre Times

### E-005 - Agenda aberta com onboarding manual

**Feature-alvo**: F-015  
**Pergunta**: existe densidade suficiente para um diretorio gerar amistosos de verdade?  
**Experimento**: criar um piloto manual com 10 a 20 times convidados e slots publicados via formulario ou planilha operacional.  
**Custo**: medio.  
**Sinal de sucesso**:

- volume minimo de slots ativos por semana;
- taxa de resposta entre times acima do canal informal atual;
- admins entendem filtros de cidade, horario e nivel como suficientes para decidir contato.

**Sinal de alerta**:

- baixa adesao de times ao opt-in publico;
- muitos slots vencidos ou sem resposta.

**Acao se falhar**: manter agenda aberta como recurso de perfil sem abrir diretorio geografico amplo.

### E-006 - CRM de adversarios sem reputacao publica

**Feature-alvo**: F-016  
**Pergunta**: o valor do CRM vem do historico privado antes de qualquer selo publico?  
**Experimento**: admins registram 5 adversarios reais em uma estrutura operacional simples e avaliam utilidade do historico apos 3 a 4 partidas.  
**Custo**: medio.  
**Sinal de sucesso**:

- admin volta para consultar o historico antes de convidar outro time;
- score interno de confiabilidade muda decisao de convite;
- nao ha ansiedade forte por reviews publicas imediatas.

**Sinal de alerta**:

- historico privado nao altera comportamento;
- maior interesse esta so em expor reputacao publica.

**Acao se falhar**: colapsar F-016 em timeline simples de adversarios sem score composto.

---

## Onda 4 - Monetizacao

### E-007 - Forecast financeiro como relatorio assistido

**Feature-alvo**: F-017  
**Pergunta**: admins pagariam atencao a previsao mensal antes de existir cobranca automatica?  
**Experimento**: relatorio manual quinzenal usando dados do financeiro atual para 3 times piloto.  
**Custo**: medio.  
**Sinal de sucesso**:

- admins usam o forecast para agir antes de faltar caixa;
- lista de risco de inadimplencia gera cobranca real;
- pedido principal e por automacao leve, nao por ERP completo.

**Sinal de alerta**:

- forecast e lido como relatorio passivo sem acao;
- admin pede primeiro conciliacao bancaria ou checkout.

**Acao se falhar**: reduzir F-017 para painel de pendencias e tendencia, sem projecao mais sofisticada.

### E-008 - Vitrine de patrocinadores com captura manual

**Feature-alvo**: F-018  
**Pergunta**: patrocinador local valoriza visibilidade publica simples com metrica minima?  
**Experimento**: publicar bloco manual de parceiro em vitrines piloto e registrar cliques com rastreamento simples.  
**Custo**: baixo.  
**Sinal de sucesso**:

- times veem valor em mostrar parceiros na vitrine;
- parceiros pedem manutencao do bloco ou renovacao;
- tracking minimo de clique ja atende a conversa comercial.

**Sinal de alerta**:

- interesse do time existe, mas sem parceiro real usando;
- parceiros pedem relatorio pesado de impressao e conversao logo no inicio.

**Acao se falhar**: manter patrocinador so como elemento estatico de vitrine, sem promessa comercial forte.

### E-009 - Oferta Pro com venda consultiva

**Feature-alvo**: F-019  
**Pergunta**: existe disposicao real de pagar por ganho operacional e growth sem self-service?  
**Experimento**: proposta comercial manual para times mais organizados com ativacao assistida de um pacote Pro unico.  
**Custo**: medio.  
**Sinal de sucesso**:

- pelo menos alguns times aceitam conversa de upgrade;
- os argumentos de venda se concentram em eficiencia, previsibilidade e visibilidade;
- nao ha dependencia imediata de billing self-service para fechar interesse.

**Sinal de alerta**:

- interesse so aparece se o preco for simbolico;
- a conversa trava porque o valor ainda parece difuso.

**Acao se falhar**: adiar gating pago e manter monetizacao apenas via parceiros/patrocinios piloto.

---

## Ordem Recomendada dos Experimentos

1. E-001, E-002 e E-003 antes da implementacao mais larga da Onda 1.
2. E-004 em paralelo a estabilizacao da Onda 1.
3. E-005 e E-006 antes de abrir diretorio publico amplo.
4. E-007, E-008 e E-009 antes de qualquer billing ou empacotamento comercial definitivo.

---

## Regras de Decisao

- nao transformar experimento em requisito permanente sem releitura do mini-spec correspondente;
- nao abrir modelagem nova se o experimento puder ser resolvido com prototipo ou operacao manual;
- registrar o resultado de cada experimento em uma nota curta com `sinal`, `decisao` e `efeito no roadmap`.