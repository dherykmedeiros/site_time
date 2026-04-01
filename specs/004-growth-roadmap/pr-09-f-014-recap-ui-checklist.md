# Checklist Tecnico - PR-09 da F-014

**Feature**: F-014 Recap Compartilhavel do Jogador e da Rodada  
**PR alvo**: PR-09 - CTAs e integracao nas superficies  
**Data**: 2026-04-01  
**Objetivo**: expor o recap nas paginas certas do produto, preservando as boundaries atuais entre server components, client islands e rotas OG derivadas.

---

## Pre-requisitos

Esta PR assume que:

- `pr-08-f-014-recap-engine-checklist.md` ja foi concluido;
- as rotas OG de recap individual e coletivo ja estao funcionais;
- o escopo de UI da F-014 continua sem feed, sem historico e sem persistencia extra.

---

## Escopo Congelado da PR-09

Esta PR entrega apenas:

- CTA de recap individual no perfil publico do jogador;
- CTA de recap coletivo na pagina publica da partida concluida quando fizer sentido;
- CTA ou bloco de compartilhamento no dashboard admin da partida concluida.

Esta PR **nao** entrega:

- nova pagina timeline de recaps;
- analytics persistida por clique;
- editor visual de recap;
- carregamento client pesado para paginas publicas;
- substituicao do fluxo atual de compartilhamento de resultado.

---

## Ordem Recomendada de Trabalho

1. Integrar CTA no perfil publico do jogador.
2. Integrar CTA na pagina publica da partida concluida.
3. Integrar CTA no detalhe admin da partida concluida.
4. Executar smoke tests de exibicao condicional, links validos e estados sem recap.

---

## Checklist por Arquivo

### `app/vitrine/[slug]/jogadores/[id]/page.tsx`

- [ ] Adicionar verificacao server-side para disponibilidade do recap individual.
- [ ] Renderizar CTA `Compartilhar recap da rodada` apenas quando houver recap.
- [ ] O CTA deve apontar para a rota publica/OG correta, sem transformar a pagina em client component.
- [ ] Em ausencia de recap, nao renderizar CTA enganoso.
- [ ] Preservar a hierarquia visual existente da vitrine e acessibilidade do link.

### `app/vitrine/[slug]/matches/[id]/page.tsx`

- [ ] Adicionar CTA complementar de recap coletivo apenas quando a partida estiver `COMPLETED`.
- [ ] Manter o card OG atual de resultado como ativo principal.
- [ ] Nao quebrar `generateMetadata` existente da pagina publica.
- [ ] Se o recap nao existir, omitir o CTA em vez de mostrar erro visivel.

### `app/(dashboard)/matches/[id]/page.tsx`

- [ ] Adicionar CTA de compartilhamento do recap da rodada apenas para admin e partida concluida.
- [ ] Manter o fetch principal da pagina inalterado.
- [ ] Se necessario, calcular apenas a URL do recap no client a partir do `match.id` e `playerId`, sem buscar novo payload pesado.
- [ ] Preservar feedback claro de copia/compartilhamento no mesmo padrao das acoes atuais.

### `components/ui/` ou `components/dashboard/`

- [ ] So criar componente novo se o CTA ou bloco de recap se repetir em mais de uma superficie.
- [ ] Preferir componente pequeno e reutilizavel, sem provider novo.
- [ ] Garantir foco visivel, rotulo claro e leitura boa em mobile.

---

## Regras de Composicao

- [ ] Perfis publicos e paginas publicas continuam server components.
- [ ] Qualquer interatividade extra fica em ilha client pequena, nao na pagina inteira.
- [ ] As rotas OG seguem como fronteira de dados e renderizacao do ativo compartilhavel.
- [ ] Nenhuma regra de recap deve ser duplicada nas paginas.

---

## Smoke Test Manual da PR-09

### Cenario 1 - CTA no perfil publico

- [ ] Abrir perfil de jogador com recap disponivel.
- [ ] Confirmar CTA visivel e link funcional para o recap.

### Cenario 2 - perfil sem recap

- [ ] Abrir perfil de jogador sem recap disponivel.
- [ ] Confirmar ausencia do CTA e layout intacto.

### Cenario 3 - partida publica concluida

- [ ] Abrir pagina publica de partida concluida.
- [ ] Confirmar CTA complementar de recap sem quebrar metadata e share atual.

### Cenario 4 - dashboard admin

- [ ] Abrir detalhe de partida concluida com usuario admin.
- [ ] Confirmar CTA de recap disponivel.
- [ ] Validar que partida nao concluida nao exibe o CTA.

---

## Criterio de Pronto da PR-09

- [ ] recap exposto nas tres superficies planejadas quando houver dados.
- [ ] nenhum CTA renderizado em contexto sem recap.
- [ ] paginas publicas preservadas como server components.
- [ ] smoke test manual executado nos 4 cenarios.
- [ ] nenhuma mudanca indevida na metadata principal de resultado da partida.

---

## Handoff para a Onda Seguinte

Se a PR-09 fechar corretamente, a Onda 2 fica pronta para medicao leve e validacao de uso:

- acesso aos recaps por jogadores e admins;
- repeticao de compartilhamento em partidas concluidas;
- decisao sobre ampliar recap para mais superfices so depois de sinais reais.