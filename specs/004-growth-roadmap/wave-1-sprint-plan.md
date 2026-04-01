# Plano Tático — Onda 1

**Escopo**: F-011, F-012 e F-013  
**Objetivo**: sair de backlog preparado para execução incremental com marcos semanais e gates claros.

## Estratégia

A Onda 1 deve ser entregue em quatro sprints curtos, com liberação interna progressiva e sem abrir todas as superfícies ao mesmo tempo.

- Sprint 0: discovery final, travas de escopo e baseline
- Sprint 1: disponibilidade recorrente e termômetro de quorum
- Sprint 2: escalação sugerida explicável
- Sprint 3: borderô do jogo e fechamento operacional

## Sprint 0 — Congelamento e Preparação

**Objetivo**: impedir retrabalho antes de abrir migration, API e UI.

**Entradas obrigatórias**:

- `f-011-availability-mini-spec.md`
- `f-012-lineup-heuristics-mini-spec.md`
- `f-013-bordereau-mini-spec.md`
- `mvp-cutlines.md`
- `decision-log.md`
- `metrics-and-rollout.md`
- `wave-1-rollout-checklist.md`
- `wave-1-contract-freeze.md`
- `wave-1-acceptance-matrix.md`

**Entregáveis**:

- times piloto definidos;
- baseline das últimas 4 semanas preenchida;
- heurística explicável da F-012 congelada;
- contratos de schema, API e UI da Onda 1 congelados em um único artefato;
- corte de escopo revisado e aceito;
- checklist de rollout preenchido com owner por etapa.

**Saída mínima**:

- nenhum ponto ambíguo restante sobre persistência prematura, cobrança automática ou automação avançada.

## Sprint 1 — F-011 Disponibilidade Recorrente

**Objetivo**: fazer o admin enxergar risco de quorum antes de agendar.

**Escopo**:

- modelagem da disponibilidade recorrente;
- CRUD do jogador autenticado;
- agregador simples de quorum por partida/data;
- termômetro e alertas no formulário de partida.

**Arquivos-base prováveis**:

- `prisma/schema.prisma`
- `lib/validations/player.ts`
- `components/forms/PlayerSelfProfileForm.tsx`
- `components/forms/MatchForm.tsx`
- `app/api/players/me/availability/route.ts`
- `app/api/matches/availability/route.ts`

**Gate de aceite**:

- jogador consegue salvar disponibilidade recorrente;
- admin enxerga previsão simples por data/horário;
- risco por posição aparece sem travar o fluxo de criação da partida.

**Não entra neste sprint**:

- calendário avançado;
- sugestões automáticas por histórico de ausência;
- push automático de cobrança de resposta.

## Sprint 2 — F-012 Escalação Sugerida

**Objetivo**: transformar RSVP confirmado em sugestão explicável de titulares e banco.

**Escopo**:

- motor determinístico baseado em posição e limites existentes;
- endpoint de sugestão por partida;
- card de escalação sugerida na tela da partida;
- ação de recalcular;
- export simples em texto ou card estático;
- nenhuma persistência de trava manual no MVP.

**Arquivos-base prováveis**:

- `lib/validations/match.ts`
- `app/api/matches/[id]/lineup/route.ts`
- `app/(dashboard)/matches/[id]/page.tsx`
- `components/dashboard/`

**Gate de aceite**:

- partida com RSVPs suficientes gera titulares, banco e alertas;
- admin entende por que a sugestão foi produzida;
- recalcular reproduz uma nova leitura estável do motor sem exigir salvar lineup em banco.

**Não entra neste sprint**:

- otimização probabilística;
- recomendação por desempenho histórico;
- múltiplos esquemas táticos.

## Sprint 3 — F-013 Borderô do Jogo

**Objetivo**: fechar a rotina operacional do dia do jogo dentro do produto.

**Escopo**:

- checklist operacional da partida;
- presença real dos jogadores;
- despesas do jogo vinculadas à partida;
- rateio apenas como sugestão visual;
- destaque financeiro das transações ligadas ao jogo.

**Arquivos-base prováveis**:

- `prisma/schema.prisma`
- `lib/validations/finance.ts`
- `app/api/matches/[id]/bordereau/route.ts`
- `app/api/finances/route.ts`
- `app/(dashboard)/matches/[id]/page.tsx`
- `app/(dashboard)/finances/page.tsx`

**Gate de aceite**:

- admin conclui checklist, presença e custos do jogo sem sair da plataforma;
- despesas da partida ficam rastreáveis no financeiro;
- não há geração automática de pendência individual.

**Não entra neste sprint**:

- cobrança automática por jogador;
- conciliação bancária;
- repasse externo ou integração de pagamento.

## Sprint 4 — Hardening e Piloto

**Objetivo**: estabilizar UX, acesso e medição antes de ampliar uso.

**Escopo**:

- loading, empty e error states;
- revisão de permissões admin/jogador;
- smoke test dos três fluxos;
- execucao da matriz unica de aceite da Onda 1;
- piloto com 1 a 3 times;
- leitura dos sinais de adoção por 2 a 4 semanas.

**Gate de aceite**:

- fluxos principais sem bloqueio funcional grave;
- taxa mínima de uso semanal medida;
- pelo menos um ganho operacional percebido pelo admin piloto.

## Critérios de Go/No-Go entre Sprints

- Sprint 1 só avança se o termômetro for consultável sem fricção relevante na criação da partida.
- Sprint 2 só avança se a heurística da escalação continuar explicável e estável em cenários incompletos.
- Sprint 3 só avança se a relação partida-finanças estiver rastreável sem expandir o escopo para cobrança.
- Sprint 4 só libera Onda 2 se houver evidência de uso recorrente e feedback positivo dos admins piloto.

## Riscos Operacionais Mais Prováveis

- modelagem grande demais logo no Sprint 1;
- tentativa de transformar F-012 em IA opaca cedo demais;
- pressão para automatizar cobrança no mesmo ciclo do borderô;
- piloto aberto com poucos dados de baseline.

## Regra de Corte

Se qualquer sprint ameaçar puxar automação, billing, diretório público ou persistência complexa sem necessidade comprovada, o corte deve seguir `mvp-cutlines.md` e `decision-log.md`.