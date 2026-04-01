# Runbook de Smoke Test - Onda 1

Data de referencia: 2026-04-01
Escopo: F-011, F-012, F-013
Objetivo: validar operacao ponta a ponta antes de piloto restrito.

## Preparacao

- [ ] Garantir ambiente com dados de time e jogadores ativos.
- [ ] Garantir pelo menos 1 partida agendada sem status COMPLETED/CANCELLED.
- [ ] Garantir usuario ADMIN e usuario PLAYER para teste de permissao.
- [ ] Limpar erros antigos conhecidos e registrar baseline inicial.

## Cenario A - Disponibilidade e Quorum

- [ ] PLAYER abre perfil e salva disponibilidade recorrente com sucesso.
- [ ] ADMIN abre formulario de partida e visualiza previsao de quorum.
- [ ] Troca de data/hora nao bloqueia submit do formulario.
- [ ] Falha temporaria na previsao exibe erro local sem quebrar a tela.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Cenario B - Escalacao Sugerida

- [ ] ADMIN abre detalhe de partida e carrega sugestao de escalacao.
- [ ] Recalculo de sugestao funciona sem erro fatal.
- [ ] Salvar escalacao manual funciona para partida SCHEDULED.
- [ ] Reset de escalacao manual funciona para partida SCHEDULED.
- [ ] Nao permite atleta duplicado entre titulares e banco.
- [ ] Nao permite mutacao de escalacao em partida nao agendada.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Cenario C - Bordero e Despesas

- [ ] ADMIN abre bordero da partida e ve checklist padrao.
- [ ] Atualiza checklist e check-in sem erro.
- [ ] Nao permite payload com jogador duplicado no check-in.
- [ ] Nao permite payload com sortOrder duplicado no checklist.
- [ ] Nao permite alteracao de bordero em partida nao agendada.
- [ ] Lanca despesa vinculada a partida e aparece no financeiro.
- [ ] Nao permite vincular despesa a partida cancelada.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Cenario D - Permissoes

- [ ] PLAYER nao acessa rotas ADMIN da Onda 1.
- [ ] ADMIN opera apenas recursos do proprio time.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Cenario E - Resiliencia de UI

- [ ] Lista de partidas mostra estado de erro quando fetch falha.
- [ ] Detalhe da partida mostra estado de erro com opcao de tentar novamente.
- [ ] Erro de refresh de escalacao nao apaga dados ja carregados.
- [ ] Erro de refresh de bordero nao apaga dados ja carregados.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Telemetria Minima Esperada

Verificar logs de servidor para eventos:

- [ ] match_availability_forecast_viewed
- [ ] match_lineup_saved
- [ ] match_lineup_reset
- [ ] match_bordereau_saved
- [ ] finance_match_expense_created

## Gate de Pronto para Piloto

- [ ] Todos os cenarios criticos A, B e C aprovados.
- [ ] Sem erro bloqueante de permissao.
- [ ] Sem regressao visual grave no dashboard de partidas.
- [ ] Pendencias nao criticas registradas com plano e owner.

Resumo final:
- Aprovado para piloto: [ ] Sim [ ] Nao
- Responsavel pela validacao:
- Data:
- Riscos remanescentes:
