# Handoff Tecnico - Onda 2

**Escopo**: F-014  
**Data**: 2026-04-01  
**Objetivo**: traduzir o recap compartilhavel da rodada em uma sequencia pequena de implementacao, com boundaries claras entre agregacao de dados, rotas OG e CTAs nas superficies publicas e admin.

---

## Leitura Operacional do Estado Atual

### Perfil publico do jogador

- `app/vitrine/[slug]/jogadores/[id]/page.tsx` ja e server component e concentra carreira, ultimas partidas e conquistas;
- a F-014 deve reaproveitar essa pagina como ponto de descoberta do recap, sem mover o perfil inteiro para client;
- o CTA pode ser um link simples para a rota publica/OG do recap, renderizado apenas quando houver recap disponivel.

### Pagina publica da partida

- `app/vitrine/[slug]/matches/[id]/page.tsx` ja gera metadata e usa `/api/og/match/[id]` para partidas concluidas;
- a F-014 deve entrar como ativo complementar da rodada, sem substituir o card OG atual de resultado;
- a logica de disponibilidade do recap deve ser derivada da ultima partida concluida ou da partida publica atual, sem job agendado no MVP.

### Detalhe admin da partida

- `app/(dashboard)/matches/[id]/page.tsx` ja e client e concentra compartilhamento, RSVP e pos-jogo;
- para evitar inflar o payload principal, a F-014 deve entrar como CTA e bloco leve, sem acoplar o recap ao `GET /api/matches/[id]`;
- o detalhe admin pode exibir links de compartilhamento prontos quando a partida estiver concluida.

### Infraestrutura OG atual

- `app/api/og/match/[id]/route.tsx` ja prova o padrao de ImageResponse no App Router;
- a Onda 2 deve reaproveitar esse padrao com rotas dedicadas para recap individual e recap coletivo;
- a agregacao de dados deve ficar em `lib/`, deixando as rotas OG focadas em buscar payload pronto e renderizar imagem.

---

## Boundaries Congeladas

### Camada de dominio

- `lib/player-recap.ts` e `lib/team-recap.ts` devem concentrar agregacao, heuristicas e formacao do payload neutro;
- rotas OG e paginas nao devem recalcular regras de homem da rodada ou achievement em destaque;
- a Onda 2 continua 100% derivada de dados existentes.

### Route handlers OG

- rotas novas entram em `app/api/og/player-recap/[playerId]/route.tsx` e `app/api/og/team-recap/[matchId]/route.tsx`;
- a resposta continua publica apenas para dados ja expostos na vitrine ou em links publicos do time;
- em ausencia de recap disponivel, retornar `404` simples e nao card vazio enganoso.

### App Router e composicao

- perfis publicos e paginas publicas de partida continuam server components;
- qualquer interatividade de compartilhar fica em links simples ou pequenas ilhas client, nunca promovendo a pagina inteira para client;
- metadata e OG permanecem desacopladas do dashboard admin.

### Escopo congelado

- sem feed de recaps;
- sem persistencia dedicada para recap;
- sem analytics nova no MVP;
- sem job para gerar recap semanal;
- sem video, carousel ou editor de layout.

---

## Sequencia Recomendada de Implementacao

### PR-08 - F-014 Agregadores e rotas OG

**Objetivo**: entregar a base derivada e compartilhavel da feature sem tocar UX interativa ainda.

**Arquivos-alvo**:

- `lib/player-recap.ts`
- `lib/team-recap.ts`
- `app/api/og/player-recap/[playerId]/route.tsx`
- `app/api/og/team-recap/[matchId]/route.tsx`

**Saida minima**:

- recap individual derivado da ultima partida concluida do jogador;
- recap coletivo derivado de uma partida concluida do time;
- heuristica de homem da rodada e achievement em destaque centralizadas em `lib/`;
- `404` consistente quando nao houver dados suficientes.

**Checklist operacional**:

- usar `pr-08-f-014-recap-engine-checklist.md` como checklist por arquivo, contrato das rotas OG e smoke test da camada derivada.

### PR-09 - F-014 CTAs e integracao de superficie

**Objetivo**: expor o recap nas superficies corretas sem quebrar a composicao atual das paginas.

**Arquivos-alvo**:

- `app/vitrine/[slug]/jogadores/[id]/page.tsx`
- `app/vitrine/[slug]/matches/[id]/page.tsx`
- `app/(dashboard)/matches/[id]/page.tsx`

**Saida minima**:

- CTA de recap individual no perfil publico quando houver recap disponivel;
- CTA de recap da rodada na partida concluida;
- links de compartilhamento no dashboard admin sem acoplar recap ao payload principal da partida.

**Checklist operacional**:

- usar `pr-09-f-014-recap-ui-checklist.md` como checklist por arquivo, estados de exibicao e smoke test das superficies.

---

## Decisoes Tecnicas que Nao Devem Ser Reabertas

- nao mover o perfil publico do jogador para client so para compartilhar recap;
- nao acoplar recap ao `GET /api/matches/[id]` do dashboard;
- nao criar tabela nova para armazenar recap derivado no MVP;
- nao substituir o OG atual de resultado por recap coletivo;
- nao depender de analytics persistida para liberar a primeira versao.

---

## Contratos por Camada

### `lib/`

- `player-recap` recebe jogador, ultima partida concluida, stats e achievement recente;
- `team-recap` recebe partida concluida, stats agregadas, time e resumo opcional da temporada;
- ambos retornam payload neutro que pode ser usado por OG e futuras views internas.

### `app/api/og`

- as rotas devem apenas validar disponibilidade, chamar agregadores e renderizar `ImageResponse`;
- datas devem sair em formato legivel pt-BR;
- ausencias parciais de dados nao devem quebrar o card se o minimo necessario existir.

### Paginas publicas e admin

- apenas renderizam CTA quando o recap existir;
- links devem ser claros sobre o ativo compartilhado;
- a composicao atual de server/client deve ser preservada.

---

## Criterio de Pronto Para Codar

A Onda 2 pode abrir branch quando estes pontos forem tratados como baseline oficial:

- `f-014-recap-mini-spec.md` como contrato funcional da feature;
- `wave-2-engineering-handoff.md` como sequencia oficial de PRs da Onda 2;
- `pr-08-f-014-recap-engine-checklist.md` como guia tecnico da base derivada;
- `pr-09-f-014-recap-ui-checklist.md` como guia tecnico das superficies publicas e admin.