# Matriz de Aceite - Onda 1

**Escopo**: F-011, F-012 e F-013  
**Data**: 2026-04-01  
**Objetivo**: concentrar os cenarios minimos de aceite e smoke test da Onda 1 em um unico artefato operacional.

---

## Como Usar

- usar este arquivo como criterio unico de QA manual da Onda 1;
- marcar cada cenario apenas quando o fluxo estiver validado no dashboard e nas APIs correspondentes;
- se algum cenario falhar por exigir escopo fora do MVP, aplicar o corte definido em `mvp-cutlines.md` e `decision-log.md`.

---

## F-011 Disponibilidade Recorrente

### A001 - Jogador salva regras recorrentes validas

**Pre-condicoes**:

- usuario autenticado com `playerId` vinculado;
- jogador ativo no elenco;
- sem erro de permissao.

**Passos**:

1. abrir o perfil do jogador;
2. cadastrar ao menos duas regras recorrentes em dias distintos;
3. salvar o formulario;
4. recarregar a tela.

**Resultado esperado**:

- as regras reaparecem apos reload;
- os horarios permanecem consistentes;
- nenhuma regra duplicada invalida e criada silenciosamente.

### A002 - Validacao bloqueia regra inconsistente

**Pre-condicoes**:

- usuario autenticado com `playerId` vinculado.

**Passos**:

1. tentar salvar regra com `endMinutes` menor ou igual a `startMinutes`;
2. tentar salvar regra sem `dayOfWeek`;
3. tentar salvar payload com frequencia invalida.

**Resultado esperado**:

- a requisicao e rejeitada;
- a UI explica o erro sem limpar todo o formulario;
- nenhuma regra parcial e persistida.

### A003 - Admin visualiza previsao de quorum no formulario da partida

**Pre-condicoes**:

- existem jogadores com regras recorrentes cadastradas;
- admin autenticado;
- data e horario preenchidos no `MatchForm`.

**Passos**:

1. abrir criacao ou edicao de partida;
2. informar data e horario;
3. aguardar consulta de previsao;
4. alterar o horario para uma janela com disponibilidade diferente.

**Resultado esperado**:

- o termometro aparece sem bloquear o submit;
- o risco muda de forma coerente entre os horarios;
- alertas por posicao aparecem em linguagem curta e operacional.

### A004 - Estado vazio da previsao nao quebra o fluxo

**Pre-condicoes**:

- nenhum jogador com regra recorrente cadastrada.

**Passos**:

1. abrir o `MatchForm`;
2. preencher data e horario.

**Resultado esperado**:

- a tela mostra estado vazio explicavel;
- nao ha erro 500 nem bloqueio para criar a partida;
- o admin entende que a previsao ainda nao tem base suficiente.

---

## F-012 Escalacao Sugerida

### A005 - Partida com confirmados gera titulares, banco e alertas

**Pre-condicoes**:

- partida existente;
- ao menos 12 jogadores `ACTIVE` com RSVP `CONFIRMED`;
- limites por posicao configurados ou ausentes de forma conhecida.

**Passos**:

1. abrir o detalhe da partida;
2. acionar a leitura da sugestao;
3. conferir titulares, banco e alertas.

**Resultado esperado**:

- a resposta contem `starters`, `bench`, `alerts` e `meta`;
- apenas confirmados entram na sugestao;
- a distribuicao respeita os limites por posicao quando existirem.

### A006 - Recalculo e estavel e nao persiste lineup

**Pre-condicoes**:

- partida com lineup sugerida disponivel.

**Passos**:

1. abrir a tela da partida;
2. acionar `Recalcular sugestao`;
3. recarregar a pagina;
4. repetir a consulta sem alterar RSVPs.

**Resultado esperado**:

- a sugestao segue deterministica para a mesma entrada;
- nao surge nenhum dado persistido de lineup no banco;
- nao existem travas manuais mantidas entre refreshs.

### A007 - Cobertura incompleta gera alerta explicavel

**Pre-condicoes**:

- partida sem goleiro confirmado ou com falta critica em posicao limitada.

**Passos**:

1. abrir o detalhe da partida;
2. consultar a sugestao da escalação.

**Resultado esperado**:

- a sugestao retorna alertas operacionais claros;
- o sistema nao inventa adaptacao silenciosa complexa;
- a ausencia critica fica visivel para o admin.

### A008 - Jogadores pendentes e recusados ficam fora

**Pre-condicoes**:

- partida com mistura de `CONFIRMED`, `PENDING` e `DECLINED`.

**Passos**:

1. consultar a sugestao da partida;
2. comparar a saida com a lista de RSVPs.

**Resultado esperado**:

- apenas jogadores `CONFIRMED` aparecem em titulares ou banco;
- `PENDING` e `DECLINED` nao entram por acidente;
- o `meta.confirmedPlayers` bate com a base efetivamente usada.

---

## F-013 Bordereo do Jogo

### A009 - Admin conclui checklist e check-in sem sair da partida

**Pre-condicoes**:

- partida existente;
- admin autenticado.

**Passos**:

1. abrir a secao `Bordero`;
2. marcar itens do checklist;
3. registrar presenca real de jogadores presentes;
4. salvar alteracoes.

**Resultado esperado**:

- checklist e presenca reaparecem apos reload;
- RSVP e presenca real permanecem semanticamente separados;
- o fluxo nao exige navegar para o modulo financeiro.

### A010 - Despesa vinculada a partida aparece no financeiro

**Pre-condicoes**:

- partida existente;
- admin autenticado;
- categoria de despesa valida.

**Passos**:

1. registrar uma despesa do jogo no bordero;
2. abrir a tela de financas;
3. localizar a transacao criada.

**Resultado esperado**:

- a transacao e criada como `EXPENSE`;
- a relacao com a partida e rastreavel por `matchId`;
- a tela financeira destaca que a despesa nasceu da partida.

### A011 - Rateio e apenas informativo

**Pre-condicoes**:

- partida com presentes registrados e despesas lancadas.

**Passos**:

1. abrir resumo do bordero;
2. visualizar sugestao de rateio;
3. verificar pendencias financeiras do elenco.

**Resultado esperado**:

- a UI mostra apenas sugestao de valor por presente;
- nenhuma cobranca individual e criada automaticamente;
- o usuario nao interpreta o rateio como cobranca executada.

### A012 - Estado vazio do bordero e inicializado sem erro

**Pre-condicoes**:

- partida sem checklist customizado, sem presenca e sem despesas.

**Passos**:

1. abrir o bordero pela primeira vez;
2. verificar a resposta inicial da API.

**Resultado esperado**:

- itens default sao inicializados de forma segura;
- a tela abre sem erro de null ou lista vazia quebrada;
- o admin consegue comecar o preenchimento imediatamente.

---

## Cenarios Transversais

### A013 - Permissoes corretas por papel

**Passos**:

1. acessar rotas da Onda 1 como jogador comum;
2. repetir como admin;
3. repetir sem autenticacao.

**Resultado esperado**:

- apenas o proprio jogador edita a propria disponibilidade;
- apenas admin acessa previsao de partida, escalação sugerida e bordero;
- respostas negadas usam status coerente e sem vazar dados.

### A014 - Estados de loading, erro e vazio sao compreensiveis

**Passos**:

1. simular latencia nas rotas;
2. simular erro de validacao e erro inesperado;
3. abrir telas sem dados suficientes.

**Resultado esperado**:

- a UI nao pisca nem quebra layout;
- mensagens diferenciam falta de dados de falha real;
- o usuario entende a proxima acao recomendada.

### A015 - Smoke completo da Onda 1

**Passos**:

1. jogador salva disponibilidade;
2. admin cria partida consultando termometro;
3. jogadores confirmam RSVP;
4. admin abre a escalação sugerida;
5. admin registra bordero e despesa;
6. admin confere reflexo em financas.

**Resultado esperado**:

- o fluxo ponta a ponta fecha sem bloqueio funcional grave;
- os dados de cada modulo permanecem coerentes entre si;
- a Onda 1 fica apta para piloto controlado.

---

## Regra de Saida

A Onda 1 so deve entrar em piloto quando os cenarios A001 a A015 estiverem validados ou explicitamente cortados pelo MVP com registro no `decision-log.md`.