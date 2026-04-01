# Checklist Tecnico - PR-10 - F-015 Discovery Engine

**Feature**: F-015 Agenda aberta e diretorio geografico  
**Objetivo da PR**: entregar a menor base correta de schema, validacao e APIs para discovery publica e slots abertos.  
**Escopo**: modelagem, contratos e rotas. Sem filtros ricos de UI ainda.

---

## Arquivos-Alvo

- `prisma/schema.prisma`
- `prisma/migrations/`
- `lib/validations/team.ts`
- `lib/team-discovery.ts`
- `app/api/teams/discovery/route.ts`
- `app/api/teams/open-slots/route.ts`

---

## Checklist por Arquivo

### `prisma/schema.prisma`

- adicionar em `Team` os campos `city`, `region`, `fieldType`, `competitiveLevel` e `publicDirectoryOptIn`;
- adicionar o modelo `OpenMatchSlot` com `teamId`, `date`, `timeLabel`, `venueLabel`, `notes`, `status`, `createdAt` e `updatedAt`;
- adicionar enums minimos para `fieldType`, `competitiveLevel` e status do slot apenas se ainda nao existirem equivalentes;
- manter o relacionamento de `OpenMatchSlot` ligado a `Team` e nao a `Match`.

### `prisma/migrations/`

- gerar migration pequena e isolada para os campos de discovery e o novo modelo de slots;
- evitar misturar nessa migration qualquer item da Onda 4 ou ajuste financeiro.

### `lib/validations/team.ts`

- criar schemas Zod para atualizar configuracao de discovery publica do time;
- criar schemas Zod para criar, editar e fechar `OpenMatchSlot`;
- limitar comprimentos de `timeLabel`, `venueLabel` e `notes` de forma compatível com o mini-spec.

### `lib/team-discovery.ts`

- criar função única para montar filtros e payload do diretorio;
- aplicar opt-in explicito e presença minima de `city` ou `region`;
- derivar `dayOfWeek` do slot no servidor, sem duplicar isso em page ou route;
- retornar payload publico enxuto com os campos previstos no mini-spec.

### `app/api/teams/discovery/route.ts`

- aceitar query params simples: `q`, `city`, `region`, `fieldType`, `dayOfWeek`, `openOnly`;
- responder apenas com dados publicos do time e slots `OPEN`;
- ordenar por times com slot aberto primeiro e depois por nome, sem score de reputacao ainda.

### `app/api/teams/open-slots/route.ts`

- restringir GET, POST e PATCH ao admin autenticado do proprio time;
- permitir CRUD minimo dos slots e atualizacao do opt-in do diretorio;
- nao criar `Match` automaticamente nem disparar `FriendlyRequest` nessa rota.

---

## Smoke Test da PR

1. Admin marca o time como opt-in no diretorio e salva cidade/regiao.
2. Admin cria um slot aberto futuro com horario e local resumidos.
3. `GET /api/teams/discovery` retorna o time com `openSlots` quando os filtros combinam.
4. `GET /api/teams/discovery?openOnly=true` nao retorna times sem slot aberto.
5. Usuario nao admin nao consegue criar ou editar slots pela rota admin.

---

## Fora de Escopo desta PR

- mexer em `app/vitrine/page.tsx` alem do necessario para smoke local;
- criar pagina nova de dashboard sofisticada para slots;
- integrar score de reputacao do CRM ao diretorio;
- matching automatico entre times.