# Registro de Riscos — Roadmap de Crescimento 2026

**Roadmap**: `004-growth-roadmap`  
**Data**: 2026-04-01  
**Objetivo**: explicitar os principais riscos de produto e engenharia, seus sinais precoces e a resposta recomendada antes que o roadmap perca foco.

---

## Escala Usada

- `Probabilidade`: baixa, média, alta
- `Impacto`: moderado, alto, crítico
- `Resposta`: evitar, mitigar, aceitar com monitoramento

---

## R-01 — Heurística sem confiança do admin

**Área**: F-011 e F-012  
**Probabilidade**: média  
**Impacto**: alto  
**Resposta**: mitigar

### Descrição

Se o termômetro de disponibilidade e a escalação sugerida parecerem arbitrários, o admin ignora a feature e volta para WhatsApp e planilhas.

### Sinais precoces

- muitos recalculos por partida sem convergência;
- sugestões abertas, mas não compartilhadas nem usadas na rotina;
- feedback recorrente de “não faz sentido”.

### Mitigação

- manter heurística determinística e explicável;
- exibir sempre o motivo dos alertas;
- evitar IA opaca ou score composto difícil de ler no MVP.

### Fallback

recuar para modo somente informativo, com alertas e cobertura por posição, sem vender “escalação inteligente” como decisão final.

---

## R-02 — Escopo operacional inflado na Onda 1

**Área**: F-011, F-012, F-013  
**Probabilidade**: alta  
**Impacto**: crítico  
**Resposta**: evitar

### Descrição

A equipe tenta resolver disponibilidade, lineup, check-in, despesas, rateio e cobrança automática no mesmo corte, atrasando valor semanal visível.

### Sinais precoces

- migrations acopladas demais;
- necessidade de UI nova em várias páginas ao mesmo tempo;
- tasks da Onda 1 passando a depender de decisões de monetização ou cobrança.

### Mitigação

- usar `mvp-cutlines.md` como trava obrigatória de escopo;
- manter rateio apenas como sugestão visual no MVP;
- não persistir travas manuais da lineup na primeira iteração.

### Fallback

quebrar a Onda 1 em duas releases internas: previsão + lineup primeiro, borderô financeiro depois.

---

## R-03 — Diretório público sem densidade suficiente

**Área**: F-015  
**Probabilidade**: média  
**Impacto**: alto  
**Resposta**: mitigar

### Descrição

Abrir agenda pública cedo demais pode gerar um diretório vazio, sem resposta e com sensação de baixa liquidez.

### Sinais precoces

- poucas equipes com opt-in ativo;
- poucos slots por região;
- buscas com baixo resultado útil.

### Mitigação

- começar com opt-in explícito;
- priorizar regiões onde já há times ativos;
- esconder estados vazios atrás de filtros ou pilotos regionais.

### Fallback

manter a feature como agenda aberta só dentro da vitrine individual do time antes de abrir um diretório amplo.

---

## R-04 — CRM de adversários virar ferramenta de conflito social

**Área**: F-016  
**Probabilidade**: média  
**Impacto**: alto  
**Resposta**: mitigar

### Descrição

Se reputação e reviews virarem sinal público cedo demais, a feature pode criar atrito, incentivo a avaliações enviesadas e necessidade de moderação.

### Sinais precoces

- reviews muito extremos ou repetitivos;
- tentativas de usar o score como exposição pública;
- divergência entre review e comportamento real do amistoso.

### Mitigação

- começar com reputação privada para admins;
- usar texto curto estruturado e poucos campos objetivos;
- evitar nota pública no MVP.

### Fallback

reduzir o CRM a histórico de interações e confiabilidade operacional, sem score agregado visível.

---

## R-05 — Forecast financeiro com falsa precisão

**Área**: F-017  
**Probabilidade**: média  
**Impacto**: alto  
**Resposta**: mitigar

### Descrição

Se o financeiro preditivo aparentar precisão maior do que a base suporta, o admin perde confiança rápido.

### Sinais precoces

- diferença alta entre previsto e realizado;
- recomendações de cobrança incoerentes;
- muitas despesas categorizadas como `OTHER` prejudicando a leitura.

### Mitigação

- explicar o forecast como projeção assistida;
- exibir confiança e premissas simples;
- começar com cenários conservadores e poucos sinais de risco.

### Fallback

manter a feature em modo de resumo projetado do mês, sem recomendações automatizadas de ação.

---

## R-06 — Telemetria prematura virar dívida

**Área**: todas as ondas  
**Probabilidade**: alta  
**Impacto**: moderado  
**Resposta**: evitar

### Descrição

Adicionar eventos demais antes de saber quais decisões dependem deles consome tempo e polui o modelo de dados.

### Sinais precoces

- eventos sem consumo claro em review semanal;
- múltiplos pontos de tracking para a mesma ação;
- dificuldade para responder perguntas simples com banco + poucos eventos.

### Mitigação

- seguir `metrics-and-rollout.md` como fonte única;
- criar evento novo só quando o banco não responder;
- revisar trimestralmente o inventário de eventos leves.

### Fallback

congelar novos eventos e trabalhar temporariamente só com métricas derivadas do banco.

---

## R-07 — Monetização antes de valor percebido

**Área**: F-018 e F-019  
**Probabilidade**: média  
**Impacto**: crítico  
**Resposta**: evitar

### Descrição

Cobrar cedo demais pode reduzir adoção, especialmente se o valor ainda não estiver claro para admins e atletas.

### Sinais precoces

- baixa adoção da Onda 1;
- retenção fraca na Onda 2;
- forecast financeiro ainda pouco confiável.

### Mitigação

- manter monetização dependente dos gates da `priority-scorecard.md` e `metrics-and-rollout.md`;
- vender primeiro ganho operacional e previsibilidade;
- evitar paywall em recursos básicos de coordenação do time.

### Fallback

adiar F-019 e testar só monetização indireta ou visibilidade premium em times mais engajados.

---

## R-08 — Dependência excessiva de um único admin

**Área**: todas as ondas  
**Probabilidade**: média  
**Impacto**: alto  
**Resposta**: mitigar

### Descrição

Se o valor ficar concentrado só no admin, o produto cresce pouco entre jogadores e times.

### Sinais precoces

- uso semanal quase todo concentrado em contas admin;
- pouca abertura de perfis públicos e recaps;
- baixo preenchimento voluntário de disponibilidade pelos atletas.

### Mitigação

- empurrar Onda 2 logo após estabilizar Onda 1;
- manter UX leve para jogador nas features de perfil e recap;
- usar push e ativos compartilháveis como ponte de retenção.

### Fallback

separar backlog de “valor do atleta” e antecipar parte da Onda 2 antes de abrir rede entre times.

---

## Ritual Recomendado de Revisão

Revisar este arquivo:

- antes de iniciar uma nova onda;
- ao final de cada piloto;
- sempre que uma task começar a puxar dependências fora da sua onda original.

Se dois ou mais riscos entrarem em estado vermelho ao mesmo tempo, a recomendação é pausar expansão e fechar estabilidade da onda corrente.