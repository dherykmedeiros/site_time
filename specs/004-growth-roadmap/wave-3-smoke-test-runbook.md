# Runbook de Smoke Test - Onda 3

Data de referencia: 2026-04-01
Escopo: F-015
Objetivo: validar o diretorio de descoberta e a agenda aberta antes de ampliar o uso publico.

## Preparacao

- [ ] Garantir ambiente com pelo menos 2 times, sendo 1 com opt-in ativo no diretorio.
- [ ] Garantir 1 usuario ADMIN vinculado a time com permissao de editar configuracoes.
- [ ] Garantir pelo menos 2 slots OPEN cadastrados para um time.
- [ ] Garantir 1 time sem slot aberto para validar estado vazio.

## Cenario A - Configuracao de descoberta no dashboard

- [ ] ADMIN acessa configuracoes do time e salva city, region, fieldType e competitiveLevel.
- [ ] ADMIN ativa publicDirectoryOptIn com sucesso.
- [ ] Reabrir a pagina preserva os dados salvos.
- [ ] Usuario sem role ADMIN nao consegue alterar configuracoes ou slots.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Cenario B - Agenda aberta no dashboard

- [ ] ADMIN cria slot OPEN com data, faixa de horario, local e observacoes.
- [ ] Lista de slots mostra o novo item em ordem cronologica.
- [ ] ADMIN fecha um slot e o status muda para CLOSED.
- [ ] Nao e possivel editar slot de outro time por chamada direta.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Cenario C - Diretorio publico

- [ ] /vitrine lista apenas times com opt-in e dado minimo de descoberta.
- [ ] Filtro por cidade retorna subconjunto correto.
- [ ] Filtro por regiao retorna subconjunto correto.
- [ ] Filtro por tipo de campo retorna subconjunto correto.
- [ ] Filtro por dia da semana reduz pelos slots OPEN correspondentes.
- [ ] Estado vazio exibe filtros ativos e permite limpar filtros.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Cenario D - Vitrine do time

- [ ] Pagina publica do time mostra bloco Datas abertas para amistoso quando houver slots OPEN.
- [ ] Chips de descoberta exibem labels amigaveis.
- [ ] Clique em Solicitar neste horario leva ao formulario com data/local pre-preenchidos.
- [ ] Time sem slot aberto mostra mensagem de fallback sem quebrar o fluxo.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Cenario E - Solicitacao de amistoso com contexto

- [ ] Formulario abre pre-preenchido ao escolher slot especifico.
- [ ] Usuario pode ajustar os dados antes do envio.
- [ ] Envio cria FriendlyRequest sem erro.
- [ ] Reset apos sucesso preserva o contexto inicial do slot selecionado.

Evidencias:
- URL:
- Resultado:
- Observacoes:

## Telemetria Minima Esperada

Verificar logs de servidor para eventos:

- [ ] discovery_query_executed
- [ ] open_slot_created
- [ ] open_slot_closed

## Gate de Pronto para seguir com expansao publica

- [ ] Fluxos A, B, C e D aprovados.
- [ ] Sem erro de auth ou ownership nas rotas novas.
- [ ] Sem regressao no fluxo atual de FriendlyRequest.
- [ ] Pendencias nao criticas registradas com owner.

Resumo final:
- Aprovado para rollout interno: [ ] Sim [ ] Nao
- Responsavel pela validacao:
- Data:
- Riscos remanescentes:
