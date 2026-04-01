# Checklist de Rollout — Onda 1

**Roadmap**: `004-growth-roadmap`  
**Escopo**: F-011, F-012, F-013  
**Data**: 2026-04-01

---

## Objetivo

Garantir que a Onda 1 entre em produção de forma controlada, mensurável e com baixo risco operacional para admins e jogadores.

---

## Antes de Desenvolver

- [ ] Confirmar 2-5 times piloto com rotina semanal estável.
- [ ] Confirmar quem será o owner de produto das ondas operacionais.
- [ ] Congelar os mini-specs F-011, F-012 e F-013 como referência de escopo do MVP.
- [ ] Definir se haverá tabela de eventos leves já no primeiro ciclo ou apenas medição via banco.
- [ ] Definir baseline manual das últimas 4 semanas: partidas criadas, presença média, no-show percebido, despesas registradas e uso do financeiro.

---

## Pronto para Build

### F-011 Disponibilidade recorrente

- [ ] Modelo `PlayerAvailabilityRule` confirmado.
- [ ] Semântica de `frequency` e `availability` validada.
- [ ] Termômetro do `MatchForm` desenhado como estimativa, não promessa.
- [ ] Critérios de risco `LOW/MEDIUM/HIGH` revisados com linguagem explicável.

### F-012 Escalação inteligente

- [ ] Heurística sem persistência de travas confirmada para o MVP.
- [ ] Regras de ordenação estável revisadas.
- [ ] Alertas de desequilíbrio cobrem goleiro, falta crítica e excesso por posição.
- [ ] CTA de recalcular não sugere precisão artificial.

### F-013 Borderô do jogo

- [ ] Checklist padrão enxuto revisado.
- [ ] `Transaction.matchId` aceito como vínculo financeiro mínimo.
- [ ] Rateio permanece apenas visual no MVP.
- [ ] Attendance usa presença real, não copia RSVP de forma cega.

---

## Pronto para QA

- [ ] Executar `wave-1-acceptance-matrix.md` e registrar cenarios cortados explicitamente pelo MVP.
- [ ] Criar partida e visualizar termômetro de quorum.
- [ ] Alterar data/horário e observar atualização da previsão.
- [ ] Abrir partida com confirmados e validar sugestão de escalação.
- [ ] Recalcular sugestão e verificar estabilidade dos critérios.
- [ ] Abrir borderô, marcar checklist e registrar presença real.
- [ ] Lançar despesa vinculada à partida e verificar reflexo no financeiro.
- [ ] Validar permissões de admin e jogador nas novas rotas.
- [ ] Validar estados vazios: sem regras, sem confirmados, sem despesas.

---

## Pronto para Piloto

- [ ] Habilitar a Onda 1 inicialmente só para times piloto.
- [ ] Comunicar o benefício em linguagem simples aos admins pilotos.
- [ ] Definir cadência semanal de revisão com feedback qualitativo.
- [ ] Preparar visão operacional das métricas mínimas da Onda 1.

### Métricas mínimas do piloto

- [ ] jogadores com disponibilidade cadastrada;
- [ ] partidas com previsão consultada;
- [ ] partidas com sugestão de escalação gerada;
- [ ] partidas com borderô iniciado;
- [ ] despesas vinculadas à partida.

---

## Critérios para Abrir para Mais Times

- [ ] Admins pilotos entendem o termômetro sem treinamento adicional.
- [ ] Sugestão de escalação é considerada útil, mesmo sem editor persistente.
- [ ] Borderô substitui pelo menos uma parte do controle externo do dia do jogo.
- [ ] Não há aumento relevante de suporte por confusão de UX ou incoerência de dados.
- [ ] Pelo menos 2 ciclos semanais completos ocorreram sem regressão operacional.

---

## Sinais de Corte ou Replanejamento

- [ ] previsão de quorum gera confiança baixa demais frente ao resultado real;
- [ ] admins recalculam escalação muitas vezes para chegar a algo aceitável;
- [ ] borderô vira só mais uma tela e não substitui rotina real;
- [ ] time piloto não percebe ganho de tempo ou clareza;
- [ ] a Onda 1 aumenta complexidade sem elevar uso semanal.

---

## Saída Esperada do Piloto

Ao final do piloto, a equipe deve conseguir responder com segurança:

1. F-011 reduz incerteza antes do agendamento?
2. F-012 acelera a montagem operacional do elenco?
3. F-013 centraliza o dia do jogo de forma útil?
4. A próxima prioridade deve ser retenção do jogador ou monetização admin?