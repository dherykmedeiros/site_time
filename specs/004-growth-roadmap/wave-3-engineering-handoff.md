# Handoff Tecnico - Onda 3

**Escopo**: F-015 e F-016  
**Data**: 2026-04-01  
**Objetivo**: traduzir a camada de rede entre times em uma sequencia pequena de implementacao, com boundaries claras entre modelagem, discovery publica, hooks de CRM e UI admin.

---

## Leitura Operacional do Estado Atual

### Diretorio publico atual

- `app/vitrine/page.tsx` ja e server component, faz busca textual simples e lista ate 60 times;
- `app/vitrine/[slug]/page.tsx` ja concentra a vitrine publica do time e o formulario de amistoso;
- a F-015 deve evoluir essas superficies, sem criar um produto paralelo fora de `app/vitrine`.

### Fluxo atual de amistoso

- `app/api/friendly-requests/route.ts` recebe solicitacoes publicas e lista requests no admin;
- `app/api/friendly-requests/[id]/route.ts` aprova ou rejeita a solicitacao e cria `Match` automaticamente quando aprovada;
- `app/(dashboard)/friendly-requests/page.tsx` ja funciona como painel client do admin e e a superficie natural para primeiros sinais do CRM.

### Modelo atual

- `Team` ainda nao tem campos de descoberta publica além de `slug`, `description` e cores;
- `FriendlyRequest` e `Match.opponent` guardam informacao suficiente para nascer um CRM leve;
- a Onda 3 precisa adicionar modelos pequenos e focados, sem reescrever o fluxo de amistoso que ja funciona.

---

## Boundaries Congeladas

### Camada de dominio

- `lib/team-discovery.ts` deve concentrar filtros, shape do diretorio e normalizacao dos dados publicos;
- `lib/opponent-crm.ts` deve concentrar consolidacao por `normalizedKey`, timeline minima e recalculo do score privado;
- paginas e rotas nao devem recalcular score ou filtros em paralelo.

### Route handlers

- a descoberta publica entra em rota dedicada, sem inflar o render server de `app/vitrine/page.tsx` com logica espalhada;
- o CRUD de slots e opt-in publico deve ficar em rotas admin do proprio time;
- hooks de CRM devem nascer dentro das rotas de `friendly-requests`, sem duplicar eventos em pages client.

### App Router e composicao

- `app/vitrine/page.tsx` e `app/vitrine/[slug]/page.tsx` continuam server components;
- filtros interativos do diretorio podem nascer como query params simples antes de qualquer ilha client sofisticada;
- a UI admin de CRM pode entrar como ilha client pequena dentro de `app/(dashboard)/friendly-requests`, sem mover a navegacao inteira para outra arquitetura.

### Escopo congelado

- sem mapa geolocalizado;
- sem chat interno entre times;
- sem reputacao publica aberta;
- sem matching automatico;
- sem sincronizacao bidirecional entre dois times no MVP.

---

## Sequencia Recomendada de Implementacao

### PR-10 - F-015 Modelagem e APIs de discovery

**Objetivo**: entregar a base de dados e contratos da agenda aberta, sem misturar dashboard e UI publica no mesmo passo.

**Arquivos-alvo**:

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/validations/team.ts`
- `lib/team-discovery.ts`
- `app/api/teams/discovery/route.ts`
- `app/api/teams/open-slots/route.ts`

**Saida minima**:

- campos de descoberta publica no `Team`;
- modelo `OpenMatchSlot` com status minimo;
- rota publica de discovery com filtros basicos;
- rota admin de CRUD de slots e opt-in.

**Checklist operacional**:

- usar `pr-10-f-015-discovery-engine-checklist.md` como checklist por arquivo, contrato de payload e smoke test da base da feature.

### PR-11 - F-015 Diretorio e superficies publicas/admin

**Objetivo**: expor agenda aberta e filtros nas superficies certas sem reescrever a vitrine atual.

**Arquivos-alvo**:

- `app/vitrine/page.tsx`
- `app/vitrine/[slug]/page.tsx`
- `app/(dashboard)/team/`
- `app/(dashboard)/friendly-requests/page.tsx`

**Saida minima**:

- filtros por cidade, regiao, tipo de campo e agenda aberta na vitrine;
- selo visual de agenda aberta nos cards do diretorio;
- bloco `Datas abertas para amistoso` na vitrine do time;
- gestao simples de opt-in e slots no dashboard.

**Checklist operacional**:

- usar `pr-11-f-015-directory-ui-checklist.md` como checklist por arquivo, estados vazios e smoke test das superficies.

### PR-12 - F-016 Modelo e hooks de CRM

**Objetivo**: entregar o dominio de adversarios e o score privado sem acoplar isso de imediato a uma nova tela robusta.

**Arquivos-alvo**:

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/validations/friendly-request.ts`
- `lib/opponent-crm.ts`
- `app/api/friendly-requests/route.ts`
- `app/api/friendly-requests/[id]/route.ts`
- `app/api/opponents/route.ts`
- `app/api/opponents/[id]/route.ts`

**Saida minima**:

- modelos `OpponentProfile`, `OpponentInteraction` e `OpponentReview`;
- normalizacao por `normalizedKey`;
- hooks automáticos ao receber, aprovar e rejeitar solicitacao;
- rota admin de lista e detalhe de adversarios.

**Checklist operacional**:

- usar `pr-12-f-016-opponent-engine-checklist.md` como checklist por arquivo, score e smoke test da camada derivada.

### PR-13 - F-016 Painel admin e review pos-jogo

**Objetivo**: expor o CRM nas superficies certas sem quebrar o fluxo atual de solicitacoes.

**Arquivos-alvo**:

- `app/(dashboard)/friendly-requests/page.tsx`
- `app/(dashboard)/friendly-requests/opponents/page.tsx`
- `components/`
- `app/api/opponents/[id]/review/route.ts`

**Saida minima**:

- lista resumida de adversarios confiaveis e de risco no painel de amistosos;
- pagina ou secao de detalhe com timeline curta;
- review pos-jogo curta para amistosos concluidos;
- explicacao visivel do score privado.

**Checklist operacional**:

- usar `pr-13-f-016-opponent-ui-checklist.md` como checklist por arquivo, estados de interface e smoke test admin.

---

## Decisoes Tecnicas que Nao Devem Ser Reabertas

- nao criar um produto separado fora de `app/vitrine` para discovery entre times;
- nao mover `app/vitrine/page.tsx` inteiro para client so para filtros;
- nao publicar score de reputacao no diretorio no primeiro corte;
- nao criar partida real a partir de `OpenMatchSlot` sem aprovacao do fluxo atual;
- nao substituir `FriendlyRequest` por um dominio totalmente novo antes de provar valor do CRM leve.

---

## Contratos por Camada

### `lib/`

- `team-discovery` recebe filtros simples, aplica opt-in, densidade minima e monta o payload publico;
- `opponent-crm` normaliza nomes, consolida eventos e recalcula score privado sem logica duplicada nas rotas.

### `app/api/teams`

- a rota de discovery expõe somente dados publicos e ja filtrados;
- a rota de open slots e restrita ao admin do proprio time;
- query params simples devem bastar para o MVP.

### `app/api/opponents`

- detalhe e lista do CRM sao apenas admin;
- a review pos-jogo so pode existir para amistoso concluido;
- score e timeline retornam explicacao textual minima para a UI.

### Paginas publicas e admin

- vitrine publica apenas consome o payload de discovery e renderiza CTAs claros;
- dashboard de amistosos vira a porta inicial do CRM, sem exigir painel global novo no primeiro corte;
- ilhas client ficam pequenas e focadas em filtros locais, modal ou submit de review.

---

## Criterio de Pronto Para Codar

A Onda 3 pode abrir branch quando estes pontos forem tratados como baseline oficial:

- `f-015-open-schedule-directory-mini-spec.md` como contrato funcional da discovery publica;
- `f-016-opponent-crm-mini-spec.md` como contrato funcional do CRM privado;
- `wave-3-engineering-handoff.md` como sequencia oficial de PRs da Onda 3;
- `pr-10-f-015-discovery-engine-checklist.md` como guia tecnico da base de dados e APIs de discovery;
- `pr-11-f-015-directory-ui-checklist.md` como guia tecnico das superficies publicas e admin da F-015;
- `pr-12-f-016-opponent-engine-checklist.md` como guia tecnico do modelo e hooks do CRM;
- `pr-13-f-016-opponent-ui-checklist.md` como guia tecnico da UI admin e review pos-jogo.