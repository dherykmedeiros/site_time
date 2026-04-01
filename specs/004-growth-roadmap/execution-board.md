# Quadro de Execucao do Roadmap

**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Objetivo**: concentrar em um unico quadro a sequencia de PRs, gates e sinais de pronto para cada onda, sem obrigar o time a navegar por todos os artefatos para entender a fila de execucao.

---

## Ordem Mestra de Execucao

| Ordem | Onda | PR | Feature | Objetivo curto | Gate para abrir |
|---|---|---|---|---|---|
| 1 | W1 | PR-01 | F-011 | disponibilidade recorrente do jogador | `wave-1-contract-freeze.md` |
| 2 | W1 | PR-02 | F-011 | quorum e risco por partida | PR-01 funcional |
| 3 | W1 | PR-03 | F-012 | motor de escalação sugerida | PR-02 funcional |
| 4 | W1 | PR-04 | F-012 | UI e recálculo da escalação | PR-03 funcional |
| 5 | W1 | PR-05 | F-013 | borderô operacional | PR-02 funcional |
| 6 | W1 | PR-06 | F-013 | despesas do jogo e vínculo financeiro | PR-05 funcional |
| 7 | W1 | PR-07 | W1 | hardening e piloto | PR-04 e PR-06 funcionais |
| 8 | W2 | PR-08 | F-014 | recap engine e OG | gate de W1 em verde |
| 9 | W2 | PR-09 | F-014 | CTAs e integração de superfície | PR-08 funcional |
| 10 | W3 | PR-10 | F-015 | discovery engine e slots | gate de W2 em verde |
| 11 | W3 | PR-11 | F-015 | diretório e UI pública/admin | PR-10 funcional |
| 12 | W3 | PR-12 | F-016 | modelo e hooks de CRM | PR-10 funcional |
| 13 | W3 | PR-13 | F-016 | UI admin e review pós-jogo | PR-12 funcional |
| 14 | W4 | PR-14 | F-017 | forecast e collections | gate de W3 em verde |
| 15 | W4 | PR-15 | F-017 | projeção financeira na UI | PR-14 funcional |
| 16 | W4 | PR-16 | F-018 | modelo e APIs de sponsors | PR-14 funcional |
| 17 | W4 | PR-17 | F-018 | UI admin e vitrine pública | PR-16 funcional |
| 18 | W4 | PR-18 | F-019 | entitlements e gating backend | PR-14 funcional |
| 19 | W4 | PR-19 | F-019 | plano na UI e bloqueios brandos | PR-18 funcional |

---

## Gates por Onda

### Gate para abrir W1

- `implementation-readiness-review.md` lido;
- `wave-1-contract-freeze.md` tratado como baseline;
- `wave-1-engineering-handoff.md` e `wave-1-acceptance-matrix.md` alinhados;
- time piloto inicial identificado em `wave-1-rollout-checklist.md`.

### Gate para abrir W2

- PR-07 concluida;
- smoke manual da Onda 1 em verde;
- baseline e sinais preenchidos em `metrics-and-rollout.md`;
- piloto da Onda 1 sem regressao operacional critica.

### Gate para abrir W3

- PR-08 e PR-09 concluídas;
- recap derivado provou uso organico suficiente;
- decisao de densidade minima e opt-in continua valida no `decision-log.md`.

### Gate para abrir W4

- discovery entre times com sinais de uso reais;
- `priority-scorecard.md` e `metrics-and-rollout.md` revalidados;
- monetizacao ainda respeita a trava sem checkout nem billing automatico.

---

## Paralelismo Seguro

### W1

- PR-05 pode avancar quando PR-02 estabilizar o contexto de partida, sem esperar PR-04.
- PR-07 depende do fechamento funcional de PR-04 e PR-06.

### W2

- W2 e apenas uma cadeia curta: PR-08 antes de PR-09.

### W3

- PR-12 pode começar depois de PR-10, em paralelo a PR-11 se a base de discovery estiver estavel.
- PR-13 depende apenas de PR-12, nao de PR-11.

### W4

- PR-16 e PR-18 podem andar em paralelo depois de PR-14, se a configuracao do time nao conflitar.
- PR-15 depende de PR-14.
- PR-17 depende de PR-16.
- PR-19 depende de PR-18 e idealmente valida junto com PR-15 para manter copy coerente.

---

## Definition of Done por PR

Cada PR so deve avancar para review final quando estes itens estiverem em verde:

- checklist tecnico da PR preenchido;
- smoke test minimo executado;
- fora de escopo respeitado;
- sem reabertura de decisoes ja congeladas no `decision-log.md`;
- sem mistura de concerns que pertencem a PR posterior.

---

## Riscos de Sequenciamento que Merecem Vigilancia

- PR-02 inflar o `MatchForm` antes de estabilizar o agregador de quorum;
- PR-04 tentar persistir escalação ou travas manuais fora do corte do MVP;
- PR-11 abrir diretório visual antes de opt-in e slots estarem confiaveis;
- PR-14 misturar forecast e resumo historico no mesmo contrato de API;
- PR-18 aplicar gating so na UI e deixar rota premium sem protecao real.

---

## Uso Recomendado do Quadro

1. Planejar sprint olhando primeiro este arquivo.
2. Abrir a PR usando o checklist tecnico correspondente como fonte principal.
3. Validar o gate da onda antes de pular para a proxima sequencia.
4. Operar a semana usando `operating-rhythm.md` para definir cadencia, donos por papel e criterio de avanço.
5. Atualizar owners, status e data real de rollout em uma copia operacional deste quadro quando a implementacao comecar.
6. Consolidar o status semanal em `weekly-status-template.md` para registrar gate, risco, aprendizado e proxima PR.