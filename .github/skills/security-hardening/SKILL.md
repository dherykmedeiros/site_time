---
name: security-hardening
description: "Use quando o pedido envolver seguranca, hardening, auth, autorizacao, validacao de entrada, protecao de rotas/API, mitigacao de vulnerabilidades, evitar quebras em producao, resiliencia e estabilidade do site."
---

# Security Hardening and Stability Skill

## Objetivo

Aplicar praticas de seguranca e robustez para reduzir risco de vulnerabilidades e prevenir quebras do site durante mudancas.

## Principios Obrigatorios

1. Nao confiar em entrada externa:
- Validar e sanitizar toda entrada de API/form com schemas (ex.: Zod em `lib/validations`).
- Rejeitar payload invalido com erros explicitos e sem vazar detalhes internos.

2. AuthN e AuthZ em todas as camadas:
- Exigir sessao valida para operacoes protegidas.
- Verificar ownership/role antes de ler ou modificar dados sensiveis.
- Nunca confiar apenas na UI para restricoes de permissao.

3. Falhar com seguranca:
- Tratar excecoes com mensagens seguras ao cliente e log tecnico no servidor.
- Implementar guard clauses para estados inesperados.
- Evitar crash por `null`/`undefined` em fluxos criticos.

4. Protecao de endpoints:
- Aplicar rate limiting para rotas sensiveis (auth, upload, convites, mutacoes).
- Limitar tamanho e tipo de upload.
- Evitar respostas com dados alem do necessario.

5. Evitar regressao:
- Preservar contratos de API existentes ou versionar mudancas.
- Cobrir cenarios de erro e permissao em testes.
- Validar comportamento em ambiente local antes de finalizar.

## Processo Recomendado

1. Modelagem de risco rapida:
- Identificar superficie de ataque: entradas, rotas publicas, acoes de escrita, upload e auth.

2. Hardening por prioridade:
- Corrigir primeiro riscos criticos (auth bypass, injecao, exposicao de dados, DOS simples).

3. Implementacao defensiva:
- Adicionar validacao, verificacoes de permissao e limites operacionais.

4. Verificacao:
- Testar cenarios de sucesso, negacao de acesso, payload invalido e abuso basico.

## Checklist de Entrega

- Entradas validadas com schema em todos os pontos criticos.
- Rotas sensiveis protegidas com auth e autorizacao.
- Erros tratados sem quebrar a aplicacao.
- Rate limit e limites operacionais aplicados onde necessario.
- Mudancas sem quebra de contrato nao intencional.
