# Wave 3 Kickoff Change Pack (F-015)

Data: 2026-04-01
Status: Pronto para iniciar PR-10

## Objetivo da proxima etapa

Abrir a Wave 3 com F-015 (Agenda Aberta + Diretorio Geografico) em duas entregas curtas:
- PR-10: discovery engine e slots
- PR-11: diretorio e UI publica/admin

## Escopo tecnico imediato (PR-10)

1. Banco e modelos
- Adicionar campos de descoberta no Team:
  - city, region, fieldType, competitiveLevel, publicDirectoryOptIn
- Criar modelo OpenMatchSlot com status OPEN/BOOKED/CLOSED
- Indexar por teamId, date, status

2. Validacoes
- Criar schemas Zod para:
  - Team discovery settings (update)
  - OpenMatchSlot create/update/list filters

3. APIs (App Router)
- GET app/api/teams/discovery/route.ts
  - filtros por nome, cidade, regiao, tipo de campo, dia da semana
  - retorna apenas times opt-in com dado minimo de descoberta
- GET/POST/PATCH app/api/teams/open-slots/route.ts
  - escopo do proprio time autenticado
  - soft-close de slot via status CLOSED

4. Guard rails e observabilidade
- Validar ownership em mutacoes de slots
- Bloquear updates de times sem permissao ADMIN
- Registrar eventos operacionais minimos:
  - open_slot_created
  - open_slot_closed
  - discovery_query_executed

## Escopo tecnico imediato (PR-11)

1. Vitrine diretorio
- Evoluir app/vitrine/page.tsx para filtros visiveis
- Exibir selo de agenda aberta por time
- Paginacao simples ou limit + carregar mais

2. Vitrine do time
- Em app/vitrine/[slug]/page.tsx, adicionar bloco:
  - Datas abertas para amistoso (slots OPEN)
- CTA para solicitar amistoso ja com contexto do slot

3. Dashboard
- Em app/(dashboard)/team/settings/page.tsx:
  - toggle de publicDirectoryOptIn
  - campos de descoberta (city/region/fieldType/competitiveLevel)
- Em area de friendly requests:
  - CRUD simples de slots (criar/listar/fechar)

## Ordem de execucao recomendada

1. Prisma migration e seed minimo para slots
2. Zod schemas e tipos compartilhados
3. APIs de discovery/open-slots
4. UI de dashboard para publicar/gerenciar slots
5. UI publica de diretorio e vitrine do time
6. Smoke test e gate de rollout da W3

## Checklist de pronto para abrir PR-10

- Migration aplicada sem drift
- Endpoints respondendo com validacao e auth
- Filtros basicos funcionando com dados reais
- Telemetria operacional em eventos-chave
- Sem regressao em flow atual de FriendlyRequest

## Riscos principais

- Diretorio sem dados minimos gera baixa utilidade
- Slots sem ownership claro causam edicao cruzada
- Filtros sem indice podem degradar performance

## Mitigacao

- Exigir opt-in + minimo de descoberta para listagem
- Validar teamId pelo usuario da sessao em toda mutacao
- Criar indices em city, region e status/date de OpenMatchSlot
