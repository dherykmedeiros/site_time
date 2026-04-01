# Ritmo Operacional do Roadmap

**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Objetivo**: transformar os artefatos do roadmap em uma rotina de execucao previsivel, com donos por papel, cadencia curta e pontos claros de decisao.

---

## Principio de Operacao

O roadmap deve ser operado como uma fila unica de entrega, nao como um conjunto solto de documentos. Cada semana precisa responder quatro perguntas:

1. qual PR esta em execucao agora;
2. qual gate precisa ficar verde para abrir a proxima PR;
3. qual risco mudou de estado;
4. qual sinal de produto foi aprendido no piloto ou no uso interno.

---

## Papeis Minimos

### Product Driver

Responsavel por proteger o corte de escopo, decidir quando abrir a proxima onda e manter `decision-log.md` como fonte unica de decisoes transversais.

### Tech Driver

Responsavel por manter a ordem tecnica definida em `execution-board.md`, `technical-staging-plan.md` e nos checklists de PR, evitando misturar schema, API e UI fora da sequencia.

### Ops Pilot Owner

Responsavel por coordenar time piloto, preencher baseline, recolher feedback operacional e manter `wave-1-rollout-checklist.md` atualizado.

### QA and Acceptance Owner

Responsavel por executar `wave-1-acceptance-matrix.md`, consolidar smoke tests e registrar regressao ou bloqueio antes de qualquer rollout mais amplo.

### Metrics Owner

Responsavel por preencher baseline, revisar sinais em `metrics-and-rollout.md` e bloquear leituras superficiais baseadas apenas em clique quando houver dado operacional melhor.

---

## Cerimonias Recomendadas

### Segunda-feira: Planejamento de Execucao

Objetivo: abrir ou continuar apenas a PR correta da fila.

Checklist:

- revisar `execution-board.md`;
- abrir uma copia operacional de `weekly-status-template.md` para a semana corrente;
- confirmar qual gate esta verde;
- abrir a PR usando o checklist tecnico correspondente;
- verificar se houve reabertura indevida de escopo contra `mvp-cutlines.md`.

### Quarta-feira: Revisao de Risco e Aprendizado

Objetivo: inspecionar se a PR corrente puxou risco estrutural ou de produto.

Checklist:

- revisar `risk-register.md`;
- atualizar `decision-log.md` apenas se houve decisao nova de verdade;
- confirmar se o que esta sendo construido ainda respeita o mini-spec da feature;
- registrar aprendizados do piloto ou de uso interno em nota curta no board do time.

### Sexta-feira: Aceite e Gate da Proxima Fila

Objetivo: decidir se a PR fecha, se a onda avanca ou se a fila para para hardening.

Checklist:

- executar smoke test minimo do checklist da PR;
- validar `wave-1-acceptance-matrix.md` quando aplicavel;
- revisar baseline e sinais em `metrics-and-rollout.md`;
- fechar o `weekly-status-template.md` com status, risco e proxima PR;
- decidir explicitamente se a proxima PR pode abrir.

---

## Regras de Avanco

### Abrir uma nova PR

So pode acontecer quando:

- a PR anterior funcionalmente obrigatoria estiver verde;
- o fora de escopo da PR anterior tiver sido respeitado;
- nao houver decisao transversal reaberta fora do `decision-log.md`.

### Abrir uma nova onda

So pode acontecer quando:

- o gate da onda anterior estiver verde em `execution-board.md`;
- o aprendizado operacional ja tiver sido lido por Product Driver e Metrics Owner;
- nao existir debito de hardening classificado como bloqueador.

### Segurar rollout

Deve acontecer quando:

- a feature tem uso aparente, mas baixa utilidade real;
- o piloto gera mais trabalho manual do que reduz;
- a implementacao exige reabrir um corte ja congelado do MVP.

---

## Artefatos Obrigatorios por Momento

### Antes de abrir a execucao de uma PR

- `execution-board.md`
- checklist tecnico da PR
- mini-spec da feature
- `decision-log.md`

### Antes de aprovar rollout de uma feature

- `metrics-and-rollout.md`
- `risk-register.md`
- `wave-1-acceptance-matrix.md` quando a feature estiver na W1
- checklist da PR ou da onda correspondente
- `weekly-status-template.md`

### Antes de abrir a proxima onda

- `implementation-readiness-review.md`
- `priority-scorecard.md`
- `mvp-cutlines.md`
- handoff tecnico da proxima onda

---

## Sinais de Alerta que Exigem Intervencao

- duas PRs seguidas precisando reabrir contrato de schema ou endpoint;
- discussao recorrente sobre algo ja travado no `decision-log.md`;
- piloto com uso semanal, mas sem ganho operacional percebido;
- roadmap avancando de onda sem baseline minimamente atualizada;
- PR tentando resolver motor, UI e rollout no mesmo pacote.

---

## Definicao de Semana Boa

Uma semana e considerada boa quando:

- uma PR pequena avancou de forma limpa;
- um gate foi validado ou negado com clareza;
- um risco relevante mudou de estado com base em evidencia;
- o roadmap ficou mais executavel, nao apenas maior.