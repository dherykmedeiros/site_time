# Mini-Spec Tecnico - F-018 Vitrine de Parceiros e Patrocinadores Locais

**Feature**: F-018  
**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Status**: Draft pronto para implementacao incremental

---

## Objetivo

Dar ao time uma vitrine simples para exibir parceiros locais na pagina publica e, ao mesmo tempo, gerar sinal minimo de retorno para justificar esse espaco.

---

## Encaixe no Produto Atual

Hoje o produto ja possui:

- vitrine publica do time em `app/vitrine/[slug]/page.tsx`;
- identidade visual e blocos de conteudo do time;
- fluxo publico de descoberta e pedido de amistoso;
- infraestrutura suficiente para adicionar links rastreaveis leves sem depender de stack externa de ads.

O que falta e transformar a vitrine em um ativo economico simples para o time, sem virar marketplace ou ad server.

---

## Problema de Produto

Muitos times ja conseguem apoio local de barbearia, academia, loja esportiva, fisioterapia ou patrocinador informal. O app ainda nao ajuda o admin a:

- dar visibilidade consistente para esse parceiro;
- mostrar que houve ao menos interesse basico do publico;
- organizar esses apoios em um espaco profissional na vitrine.

---

## Escopo Fechado do MVP

### Incluido

- cadastro manual de parceiros por time;
- bloco publico de parceiros na vitrine do time;
- clique rastreavel por parceiro com contagem agregada minima;
- ordenacao manual e ativacao/desativacao de cards;
- CTA externo simples para WhatsApp, Instagram ou site do parceiro.

### Fora de Escopo

- cobranca automatica do patrocinador;
- portal self-service para parceiros;
- rotacao automatica de campanhas;
- relatorio comercial detalhado por impressao, origem ou conversao;
- marketplace interno de patrocinio.

---

## Estrategia do MVP

### 1. Cadastro enxuto pelo admin

O admin adiciona um parceiro com dados minimos:

- nome;
- categoria;
- logo opcional;
- descricao curta;
- link externo ou contato;
- cupom opcional;
- ordem de exibicao;
- status ativo.

### 2. Exibicao publica coerente com a vitrine

O bloco de parceiros entra na vitrine do time sem competir com os blocos principais de identidade, elenco e amistoso.

### 3. Medicao minima de valor

Cada clique no CTA do parceiro incrementa um contador agregado e registra `lastClickedAt`. No MVP isso basta para o admin demonstrar interesse basico, sem abrir telemetria complexa.

---

## Modelo de Dados Proposto

### Novo modelo `TeamSponsor`

- `id`
- `teamId`
- `name`
- `category` opcional
- `description` opcional
- `logoUrl` opcional
- `externalUrl` opcional
- `contactLabel` opcional
- `couponCode` opcional
- `displayOrder` com default `0`
- `isActive` com default `true`
- `clickCount` com default `0`
- `lastClickedAt` opcional
- `createdAt`
- `updatedAt`

### Decisao de persistencia

No MVP, armazenar apenas contagem agregada no proprio registro do parceiro. Nao criar tabela de eventos brutos nem dashboard analitico dedicado.

---

## Regras de Negocio do MVP

### Publicacao

So parceiros `isActive = true` aparecem na vitrine publica.

### Ordenacao

Exibir por `displayOrder ASC`, com fallback para `createdAt ASC`.

### Tracking

Ao clicar no CTA:

1. registrar incremento em `clickCount`;
2. atualizar `lastClickedAt`;
3. redirecionar para o destino externo.

### Integridade

Parceiro sem `externalUrl` ainda pode aparecer como bloco institucional, mas sem CTA clicavel.

---

## Superficie Tecnica Recomendada

### API privada

- `app/api/teams/[teamId]/sponsors/route.ts` para listar e salvar parceiros;
- `app/api/teams/[teamId]/sponsors/[sponsorId]/route.ts` para editar, reordenar e desativar.

### API publica

- `app/api/vitrine/sponsors/[sponsorId]/click/route.ts` para registrar clique e responder com destino.

### UI privada

- `app/(dashboard)/team/page.tsx` ou configuracao equivalente para gerenciar os parceiros;
- componente administrativo em `components/forms/` ou `components/dashboard/` para CRUD simples.

### UI publica

- expandir `app/vitrine/[slug]/page.tsx` com secao `Parceiros do time`;
- manter layout compacto, com no maximo 4-6 cards acima da dobra no MVP.

---

## Contrato de Resposta Sugerido

```json
{
  "sponsors": [
    {
      "id": "sp_1",
      "name": "Arena Norte",
      "category": "Campo society",
      "description": "Parceiro de locacao e apoio aos amistosos.",
      "logoUrl": "/uploads/sponsors/arena-norte.png",
      "externalUrl": "https://wa.me/5511999999999",
      "couponCode": "TIME10",
      "displayOrder": 1,
      "isActive": true,
      "clickCount": 38,
      "lastClickedAt": "2026-04-01T18:00:00.000Z"
    }
  ]
}
```

---

## UX do MVP

### Dashboard do time

- lista curta de parceiros com preview;
- CTA `Adicionar parceiro`;
- acoes `Editar`, `Desativar` e `Mover`;
- coluna simples de cliques acumulados.

### Vitrine publica

- secao discreta apos identidade principal do time;
- cards com logo, nome, categoria, descricao curta e CTA;
- sem excesso de destaque visual que polua a vitrine.

---

## Metricas Minimas

- times com pelo menos 1 parceiro ativo;
- parceiros com pelo menos 1 clique no periodo;
- media de cliques por parceiro ativo;
- percentual de vitrines com bloco de parceiros habilitado.

---

## Riscos e Decisoes

### Risco principal

Se a vitrine virar mural poluido, ela perde forca como pagina publica do time. Por isso o MVP precisa limitar volume, densidade visual e promessa comercial.

### Decisao congelada

F-018 nasce como prova de visibilidade para o time, nao como produto de ads. O admin mostra presenca e interesse basico; a plataforma ainda nao vende patrocinio nem cobra por exposicao.