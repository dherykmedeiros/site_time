# Mini-Spec Tecnico - F-019 Plano Pro em Camadas

**Feature**: F-019  
**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft pronto para implementacao controlada

---

## Objetivo

Empacotar o valor ja provado das ondas anteriores em um plano comercial simples, com gating claro por time e sem depender de billing complexo no primeiro corte.

---

## Encaixe no Produto Atual

Hoje o repositório nao mostra infraestrutura de checkout, assinatura recorrente externa ou feature gating centralizado. Isso muda a estrategia:

- primeiro definir entitlements de produto;
- depois adicionar estado comercial simples no time;
- por ultimo validar operacao manual de upgrade antes de qualquer billing self-service.

---

## Problema de Produto

Sem um plano comercial claro, o produto pode gerar valor administrativo real e ainda assim nao capturar receita. Ao mesmo tempo, cobrar cedo demais ou bloquear fluxos basicos destrói adocao.

F-019 precisa resolver este equilibrio.

---

## Escopo Fechado do MVP

### Incluido

- um unico plano pago `PRO` no backend, com grupos de beneficios apresentados como `Operacao` e `Growth` na UI;
- gating por time para recursos premium ja validados;
- tabela comparativa simples entre `Free` e `Pro`;
- provisionamento manual do plano para piloto comercial;
- estados de bloqueio brandos com CTA de interesse ou contato.

### Fora de Escopo

- checkout self-service;
- cobranca recorrente automatica;
- multiplos tiers pagos ativos no backend;
- trials complexos com expiracao automatica;
- dunning, invoices ou conciliacao de assinatura.

---

## Estrategia do MVP

### 1. Comercialmente simples, tecnicamente limpo

Mesmo que a narrativa comercial cite frentes de `Operacao` e `Growth`, o backend do MVP trabalha com apenas dois estados:

- `FREE`
- `PRO`

Isso respeita a linha de corte atual do roadmap e evita modelagem prematura de precificacao complexa.

### 2. Entitlements explicitos

Cada recurso premium precisa ser decidido por uma tabela de permissao central, nao por condicionais espalhadas na UI.

### 3. Gating sem quebrar experiencia basica

Core gratuito continua util. Recursos premium aparecem como camada adicional de eficiencia, previsibilidade ou visibilidade, nunca como bloqueio do uso essencial.

---

## Modelo de Dados Proposto

### Evolucao minima em `Team`

- `planTier` enum com `FREE | PRO`
- `planStatus` enum com `ACTIVE | INACTIVE | PILOT`
- `planStartedAt` opcional
- `planEndsAt` opcional
- `planNotes` opcional

### Dominio recomendado

Criar `lib/plan-entitlements.ts` com uma estrutura semelhante a:

```ts
type PlanTier = "FREE" | "PRO";

type PlanEntitlements = {
  recurringAvailability: boolean;
  lineupSuggestion: boolean;
  bordereau: boolean;
  predictiveFinance: boolean;
  sponsorsShowcase: boolean;
  advancedGrowthSignals: boolean;
};
```

---

## Regras de Negocio do MVP

### Recursos premium iniciais sugeridos

`PRO` desbloqueia apenas funcionalidades ja validadas por uso e valor percebido:

- F-011 disponibilidade recorrente;
- F-012 escalação sugerida;
- F-013 borderô do jogo;
- F-017 financeiro preditivo;
- F-018 vitrine de parceiros.

### Recursos mantidos no free

- auth basica;
- elenco e convites;
- partidas e RSVP;
- estatisticas essenciais;
- vitrine publica base;
- pedidos de amistoso basicos.

### Gating

Se o time nao tiver `PRO`, o sistema:

1. exibe preview ou card explicativo quando fizer sentido;
2. mostra CTA de interesse no upgrade;
3. nunca esconde ou corrompe dados essenciais do fluxo base.

---

## Superficie Tecnica Recomendada

### Modelagem e auth

- `prisma/schema.prisma`
- `lib/auth.ts`
- novo `lib/plan-entitlements.ts`

### API

- rotas existentes passam a consultar entitlements quando a feature premium for acessada;
- rota leve para consulta do plano do time em `app/api/teams/[teamId]/plan/route.ts`.

### UI administrativa

- `app/(dashboard)/team/page.tsx` ou configuracao equivalente para mostrar plano atual e beneficios;
- blocos de upgrade em features premium com copy consistente.

---

## Contrato de Plano Sugerido

```json
{
  "teamId": "team_1",
  "planTier": "PRO",
  "planStatus": "PILOT",
  "startedAt": "2026-04-01T00:00:00.000Z",
  "endsAt": null,
  "entitlements": {
    "recurringAvailability": true,
    "lineupSuggestion": true,
    "bordereau": true,
    "predictiveFinance": true,
    "sponsorsShowcase": true,
    "advancedGrowthSignals": false
  }
}
```

---

## UX do MVP

### Pagina de plano

- comparativo curto `Free vs Pro`;
- agrupamento visual dos beneficios em `Operacao` e `Growth`;
- selo de `Piloto` quando o time estiver em concessao manual.

### Estados bloqueados

- mensagem objetiva de valor;
- CTA `Tenho interesse` ou `Falar com o time`;
- nunca usar modal agressivo ou paywall interrompendo cadastro e operacao basica.

---

## Rollout Comercial Recomendado

### Fase 1

piloto manual com poucos times altamente engajados.

### Fase 2

ajuste da tabela de entitlements conforme uso real.

### Fase 3

so entao avaliar checkout simplificado ou camada adicional de crescimento paga.

---

## Riscos e Decisoes

### Risco principal

Tentar nascer com varias camadas, checkout e trials automaticos antes de provar valor torna a monetizacao frágil e a implementacao cara.

### Decisao congelada

Apesar do nome F-019 sugerir camadas, o MVP comercial nasce com uma unica camada paga `PRO`, organizada em grupos de beneficios. Camadas adicionais so entram depois que o gating, o valor percebido e a operacao manual estiverem estaveis.