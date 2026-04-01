# Revisão de Prontidão para Implementação

**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Objetivo**: verificar se os artefatos atuais já sustentam execução incremental sem reabrir decisões centrais.

## Resultado Geral

Status geral: **pronto para iniciar a Onda 1**.

O pacote atual já cobre:

- direção estratégica em `spec.md`;
- navegação única do pacote em `README.md`;
- sequência de execução em `plan.md` e `tasks.md`;
- checklists de PR para F-011, F-012 e F-013 na Onda 1;
- mini-specs das features F-011 a F-019;
- handoffs de engenharia das ondas 1 a 4;
- checklists de PR da Onda 1 ate a Onda 4;
- ritmo operacional com papeis e cerimonias em `operating-rhythm.md`;
- cortes de MVP, riscos, métricas, rollout, discovery e priorização.

Não há lacuna estrutural crítica para começar a implementação da Onda 1.

## Checagem por Etapa Speckit

### Spec

- Existe visão clara de problema, tese de crescimento, ondas e critérios de valor.
- O roadmap evita duplicar funcionalidades já existentes no produto.

### Plan

- Existe ordem coerente entre operação, retenção, rede e monetização.
- Dependências entre ondas estão explicitadas.

### Tasks

- A Onda 1 está quebrada em tarefas por dados, API, UI, hardening e rollout.
- As ondas seguintes estão tratadas como backlog preparado, com handoff e PRs pequenos suficientes para evitar rediscovery quando a execução avançar.

### Analyze

- As principais ambiguidades já foram reduzidas a ponto de não bloquear o início da implementação.
- As divergências restantes são de calibragem, não de arquitetura.

## Decisões Já Congeladas e Coerentes

### F-011 Disponibilidade recorrente

- mantém RSVP como fluxo separado;
- usa previsão explicável em vez de automação opaca;
- modelagem proposta é pequena o bastante para entrar sem distorcer o domínio atual.

### F-012 Escalação sugerida

- heurística determinística e explicável;
- sem promessa de IA;
- sem persistência de travas no primeiro corte.

### F-013 Borderô do jogo

- presença real, checklist e despesas ficam dentro da partida;
- rastreabilidade financeira via `Transaction.matchId`;
- rateio apenas como sugestão visual, sem cobrança automática.

### Ondas 2 a 4

- recap deriva de dados já existentes;
- rede entre times depende de densidade e opt-in antes de diretório amplo;
- monetização evita billing self-service precoce.

## Pontos de Atenção Antes de Codar

### 1. Timezone e janelas recorrentes da F-011

O modelo com `startMinutes` e `endMinutes` é adequado, mas a implementação precisa deixar explícito qual timezone do time governa a previsão.

### 2. Ordenação determinística da F-012

A ordenação por `shirtNumber` e `createdAt` resolve previsibilidade, mas exige fallback limpo para jogador sem número de camisa.

### 3. Semântica de presença real da F-013

O borderô precisa tratar RSVP e presença como sinais distintos sem gerar inconsistência visual no detalhe da partida.

### 4. Piloto pequeno de Onda 1

O piloto só faz sentido com baseline preenchida; sem isso, a leitura de impacto operacional fica fraca.

## Itens que Não Devem Ser Reabertos no Início da Implementação

- persistência de travas da F-012;
- cobrança automática individual no borderô;
- diretório público amplo sem densidade mínima;
- checkout self-service ou trial automatizado na Onda 4.

## Recomendação Operacional

Abrir a implementação usando esta ordem:

1. `wave-1-sprint-plan.md`
2. `wave-1-contract-freeze.md`
3. `wave-1-engineering-handoff.md`
4. `f-011-availability-mini-spec.md`
5. `pr-01-f-011-implementation-checklist.md`
6. `pr-02-f-011-quorum-checklist.md`
7. `f-012-lineup-heuristics-mini-spec.md`
8. `pr-03-f-012-lineup-engine-checklist.md`
9. `pr-04-f-012-lineup-ui-checklist.md`
10. `f-013-bordereau-mini-spec.md`
11. `pr-05-f-013-bordereau-operations-checklist.md`
12. `pr-06-f-013-match-expenses-checklist.md`
13. `pr-07-wave-1-hardening-pilot-checklist.md`
14. `metrics-and-rollout.md`

## Critério de Saída desta Revisão

O roadmap deixa de ser apenas planejamento e já pode servir como baseline oficial para abertura da execução da Onda 1.