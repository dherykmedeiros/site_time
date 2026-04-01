# Decision Log - Roadmap de Crescimento 2026

**Roadmap**: `004-growth-roadmap`  
**Data base**: 2026-04-01  
**Objetivo**: concentrar as decisoes transversais do roadmap para evitar rediscutir o mesmo tema em cada feature.

---

## Como usar

- toda decisao daqui vale ate que um novo sinal de produto a contradiga;
- quando um experimento ou piloto invalidar um ponto, atualizar primeiro este arquivo e depois o mini-spec afetado;
- se uma discussao aparecer em grooming e ja estiver resolvida aqui, a regra e seguir o log e nao reabrir o tema sem evidencia nova.

---

## Decisoes Ativas

### D-001 - "Inteligencia" deve ser heuristica e explicavel

**Vale para**: F-011, F-012, F-017  
**Decisao**: usar regras deterministicas, sinais simples e textos explicativos; evitar linguagem de IA ou score opaco no MVP.  
**Motivo**: confiança do admin depende de entender por que o sistema sugeriu algo.  
**Implicacao**: toda sugestao deve vir com alertas e justificativa curta.

### D-002 - Persistencia nova so entra quando o fluxo nao puder nascer derivado

**Vale para**: F-012, F-014, F-017  
**Decisao**: priorizar calculo derivado e operacao manual/prototipo antes de adicionar tabelas ou estados duradouros.  
**Motivo**: reduzir churn de schema e evitar manter dados que podem envelhecer rapido.  
**Implicacao**: recap nasce derivado; previsao financeira nasce sobre dados existentes; travas da escalação so persistem se o piloto provar necessidade real.

### D-003 - Bordero nao gera cobranca automatica no MVP

**Vale para**: F-013, F-017  
**Decisao**: o bordero sugere rateio e registra despesas, mas nao cria pendencia individual automatica por jogador nesta fase.  
**Motivo**: cobranca automatica aumenta risco de erro e discussao operacional cedo demais.  
**Implicacao**: primeiro entregar rastreabilidade e contexto por partida; automacao de cobranca so depois de confianca no uso.

### D-004 - Recap deve reforcar identidade do jogador, nao duplicar o placar

**Vale para**: F-014  
**Decisao**: recap pessoal precisa destacar progresso, presenca, contribuicao e conquista; nao pode ser so uma arte do resultado com avatar.  
**Motivo**: compartilhamento cresce com sinal pessoal, nao com repeticao do conteudo do time.  
**Implicacao**: payload do recap deve priorizar narrativa individual e comparacao leve.

### D-005 - Rede entre times so abre com opt-in e densidade minima

**Vale para**: F-015, F-016  
**Decisao**: nao abrir diretorio publico amplo ate existir base minima de times e slots ativos com onboarding controlado.  
**Motivo**: diretorio vazio ou desatualizado destrói confiança cedo.  
**Implicacao**: primeiro piloto manual, depois discovery aberta por geografia e filtros.

### D-006 - Reputacao publica vem depois do historico privado

**Vale para**: F-016  
**Decisao**: CRM de adversarios nasce com timeline e score interno; selo publico e etapa posterior.  
**Motivo**: historico privado entrega valor mais cedo e reduz risco politico de uma reputacao publica mal calibrada.  
**Implicacao**: reviews publicas nao entram no primeiro corte da feature.

### D-007 - Monetizacao comeca por operacao e visibilidade, nao por billing completo

**Vale para**: F-017, F-018, F-019  
**Decisao**: validar valor via forecast assistido, sponsors showcase e ativacao manual do Pro antes de qualquer checkout self-service.  
**Motivo**: o produto ainda precisa provar recorrencia premium antes de carregar a stack comercial.  
**Implicacao**: bloquear trial automatizado, gateway e fatura complexa nesta fase.

### D-008 - Um unico plano Pro no backend; pacotes sao narrativa comercial

**Vale para**: F-019  
**Decisao**: manter um `planTier` simples com entitlements centrais; "Operacao" e "Growth" podem aparecer como linguagem de venda, nao como multiplos planos tecnicos.  
**Motivo**: reduz complexidade de gating e evita combinatoria prematura.  
**Implicacao**: estrutura comercial simplificada ate surgirem sinais claros de segmentacao real.

### D-009 - Todo rollout novo precisa de piloto pequeno antes de abertura ampla

**Vale para**: todas as ondas  
**Decisao**: nenhuma feature de alto impacto abre para toda a base sem piloto, checklist e baseline minimo.  
**Motivo**: o produto ainda esta num ponto em que erros de rollout podem contaminar a percepcao geral de confianca.  
**Implicacao**: usar `metrics-and-rollout.md` e `wave-1-rollout-checklist.md` como gate obrigatorio.

---

## Decisoes que Exigem Evidencia Nova para Mudar

- automatizar cobranca individual por presenca;
- abrir reputacao publica ampla entre times;
- vender plano com checkout self-service;
- criar multiplos tiers tecnicos no backend;
- persistir qualquer dado derivado so por conveniencia de UI.

---

## Mudancas de Estado

Quando uma decisao mudar, registrar no formato abaixo:

```md
### D-XYZ - Titulo
- Estado anterior:
- Nova decisao:
- Evidencia que motivou a mudanca:
- Mini-specs afetados:
- Tasks afetadas:
```