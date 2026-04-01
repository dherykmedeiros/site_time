# Mini-Spec Tecnico - F-015 Agenda Aberta e Diretorio Geografico de Times

**Feature**: F-015  
**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft pronto para implementacao incremental

---

## Objetivo

Transformar a vitrine publica em um ponto de descoberta entre times, permitindo opt-in para listagem publica mais rica e publicacao de datas abertas para amistosos.

---

## Encaixe no Produto Atual

Ja existe uma base importante:

- indice publico em `app/vitrine/page.tsx` com busca simples por time;
- pagina publica do time em `app/vitrine/[slug]/page.tsx`;
- formulario de solicitacao de amistoso com criacao de `FriendlyRequest`;
- dashboard de gestao de solicitacoes em `app/(dashboard)/friendly-requests/page.tsx`.

O gap atual e que a descoberta ainda depende de link direto ou busca textual basica.

---

## Problema de Produto

Hoje um time precisa ser encontrado antes para receber uma solicitacao. Falta uma camada de descoberta orientada a contexto:

- onde joga;
- quando costuma jogar;
- que tipo de amistoso busca;
- se esta realmente aberto a propostas.

---

## Escopo Fechado do MVP

### Incluido

- opt-in explicito para aparicao no diretorio publico;
- enriquecimento basico do perfil publico do time para descoberta;
- publicacao de datas abertas para amistosos;
- filtros por cidade, dia preferido e tipo de campo;
- CTA direto para solicitar amistoso a partir do diretorio.

### Fora de Escopo

- geolocalizacao por mapa;
- matching automatico entre times;
- chat interno;
- calendarios publicos recorrentes sofisticados;
- ranking publico de qualidade no primeiro corte.

---

## Modelo de Dados Proposto

### Campos novos em `Team`

- `city` opcional curto;
- `region` opcional curto;
- `fieldType` opcional enum simples (`GRASS`, `SYNTHETIC`, `FUTSAL`, `SOCIETY`, `OTHER`);
- `competitiveLevel` opcional enum simples (`CASUAL`, `INTERMEDIATE`, `COMPETITIVE`);
- `publicDirectoryOptIn` boolean `false` por padrao;
- `responseVisibility` opcional para uso futuro, fora do MVP.

### Novo modelo `OpenMatchSlot`

Campos minimos:

- `id`
- `teamId`
- `date`
- `timeLabel` opcional curto
- `venueLabel` opcional curto
- `notes` opcional curto
- `status` (`OPEN`, `BOOKED`, `CLOSED`)
- `createdAt`
- `updatedAt`

### Justificativa

- manter datas abertas separadas de `Match` evita criar partida antes de existir acordo;
- `publicDirectoryOptIn` protege times que querem vitrine, mas nao descoberta ativa;
- enriquecer `Team` permite filtro util sem novo modelo excessivo.

---

## Regras de Negocio do MVP

### 1. Quem aparece no diretorio

So aparecem times com:

- `publicDirectoryOptIn = true`;
- `slug` valido;
- pelo menos um dado minimo de descoberta: cidade ou regiao;
- vitrine publica acessivel.

### 2. Datas abertas

- um slot aberto nao cria `Match`;
- um slot pode ser referenciado pela UX de solicitacao de amistoso, mas a aprovacao continua criando a partida real apenas no fluxo admin atual;
- o time pode fechar um slot manualmente sem justificar no MVP.

### 3. Filtros iniciais do diretorio

- texto livre por nome do time;
- cidade;
- regiao;
- dia da semana inferido a partir de `date` do slot aberto;
- tipo de campo.

---

## Superficie Tecnica Recomendada

### Dashboard

- expandir `app/(dashboard)/team/settings/page.tsx` para configuracao de descoberta publica;
- criar gestao de agenda aberta em `app/(dashboard)/friendly-requests/page.tsx` ou pagina dedicada futura.

### Publico

- evoluir `app/vitrine/page.tsx` para funcionar como diretorio filtravel;
- expandir `app/vitrine/[slug]/page.tsx` para mostrar slots abertos quando existirem.

### API sugerida

- `app/api/teams/discovery/route.ts` para listar times publicos com filtros;
- `app/api/teams/open-slots/route.ts` para CRUD admin dos slots do proprio time.

---

## Contrato de Diretorio Sugerido

```json
{
  "teams": [
    {
      "id": "tm1",
      "name": "VARzea FC",
      "slug": "varzea-fc",
      "badgeUrl": "/uploads/badge.png",
      "city": "Sao Paulo",
      "region": "Zona Norte",
      "fieldType": "SOCIETY",
      "competitiveLevel": "INTERMEDIATE",
      "openSlots": [
        {
          "id": "slot1",
          "date": "2026-05-10T15:00:00.000Z",
          "timeLabel": "Sabado a tarde",
          "venueLabel": "Casa"
        }
      ]
    }
  ]
}
```

---

## UX do MVP

### No indice da vitrine

- o diretorio continua sendo a porta publica principal;
- filtros aparecem acima da lista;
- times com agenda aberta ganham selo visual de disponibilidade.

### Na vitrine do time

- mostrar bloco `Datas abertas para amistoso` quando houver slots `OPEN`;
- o formulario de amistoso pode preencher contexto a partir do slot escolhido, mas continua enviando para `FriendlyRequest`.

### No dashboard do time

- o opt-in do diretorio deve ficar proximo das configuracoes da vitrine publica;
- a agenda aberta deve ser simples: criar, listar e fechar slots.

---

## Riscos e Decisoes

### Risco principal

Abrir diretorio sem dados minimos gera lista bonita e pouco util. Por isso o MVP exige opt-in e dados basicos de descoberta.

### Decisao congelada

O diretorio nasce como extensao da vitrine existente, nao como produto separado. Isso reduz fragmentacao e reaproveita SEO, metadata e links publicos ja criados.
