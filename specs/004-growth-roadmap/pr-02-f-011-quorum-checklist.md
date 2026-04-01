# Checklist Técnico - PR-02 da F-011

**Feature**: F-011 Central de Disponibilidade Recorrente  
**PR alvo**: PR-02 - agregador de quorum e integração no MatchForm  
**Data**: 2026-04-01  
**Objetivo**: conectar a disponibilidade recorrente já persistida ao fluxo de agendamento da partida, sem bloquear submit nem ampliar o domínio de RSVP.

---

## Pré-requisito

Esta PR assume a PR-01 já mergeada com estes pontos prontos:

- model `PlayerAvailabilityRule` disponível no Prisma;
- `GET/PATCH /api/players/me/availability` funcionando;
- payload das regras recorrentes estabilizado.

Sem esse merge, a PR-02 tende a misturar persistência com leitura derivada e perder o corte correto da F-011.

---

## Escopo Congelado da PR-02

Esta PR entrega apenas:

- agregador derivado de quorum e cobertura por posição em `lib/`;
- validação do endpoint admin de previsão por data;
- rota `GET /api/matches/availability` protegida por admin e escopo de time;
- integração visual leve em `components/forms/MatchForm.tsx`;
- feedback de loading, vazio e erro não bloqueante no formulário.

Esta PR **não** entrega:

- persistência de snapshot de quorum na partida;
- alteração do payload de `POST /api/matches`;
- heurística de escalação da F-012;
- mudança automática de RSVP;
- calendário inteligente, melhor horário ou recomendação automática de data.

---

## Ordem Recomendada de Trabalho

1. Criar o módulo derivado de forecast em `lib/`.
2. Criar o schema da query do endpoint em `lib/validations/match-availability.ts`.
3. Implementar `app/api/matches/availability/route.ts`.
4. Integrar consulta não bloqueante em `components/forms/MatchForm.tsx`.
5. Executar smoke tests com data válida, data inválida e ausência de regras suficientes.

---

## Checklist por Arquivo

### `lib/match-availability.ts`

- [ ] Criar função pura `buildMatchAvailabilityForecast` ou nome equivalente.
- [ ] Receber como entrada:
- [ ] `matchDate: Date`.
- [ ] lista de jogadores ativos do time com `id`, `position` e `availabilityRules`.
- [ ] lista opcional de `positionLimits` já conhecidos para enriquecer a resposta.
- [ ] Normalizar o horário consultado em `dayOfWeek` e `minutesOfDay`.
- [ ] Casar regras por `dayOfWeek` e janela `[startMinutes, endMinutes)`.
- [ ] Aplicar interpretação conservadora de frequência:
- [ ] `WEEKLY` com peso cheio.
- [ ] `BIWEEKLY` com peso parcial.
- [ ] `MONTHLY_OPTIONAL` com peso menor e baixa confiança.
- [ ] Classificar cada jogador em `likelyAvailable`, `uncertain` ou `likelyUnavailable`.
- [ ] Gerar `coverageByPosition` agrupando por `Player.position`.
- [ ] Gerar `overallRisk` com `LOW`, `MEDIUM` ou `HIGH`.
- [ ] Gerar `explanations` curtas e explicáveis, sem linguagem probabilística exagerada.
- [ ] Garantir saída determinística para mesma entrada.
- [ ] Não ler Prisma dentro desse módulo.

### `lib/validations/match-availability.ts`

- [ ] Criar schema `matchAvailabilityQuerySchema` com `date` obrigatório em ISO string válida.
- [ ] Refinar `date` para rejeitar datas inválidas ou vazias.
- [ ] Exportar tipo inferido para a rota.
- [ ] Criar schema de resposta opcional se ajudar a tipar `overallRisk`, `positions` e `snapshot`.
- [ ] Não misturar esse contrato em `lib/validations/match.ts` se isso ampliar desnecessariamente o escopo do arquivo atual.

### `app/api/matches/availability/route.ts`

- [ ] Usar `requireAdmin`.
- [ ] Retornar `404` se `session.user.teamId` não existir.
- [ ] Ler `date` de `searchParams`.
- [ ] Validar query com `matchAvailabilityQuerySchema`.
- [ ] Em erro de validação, retornar `400` com `code: "VALIDATION_ERROR"`.
- [ ] Buscar apenas jogadores `ACTIVE` do time autenticado.
- [ ] Incluir `position` e `availabilityRules` na consulta Prisma.
- [ ] Não carregar RSVPs nem dados da partida nessa PR.
- [ ] Chamar o agregador puro para montar o snapshot.
- [ ] Retornar payload com:
- [ ] `snapshot.date` em ISO.
- [ ] `snapshot.activePlayers`.
- [ ] `snapshot.likelyAvailableCount`.
- [ ] `snapshot.uncertainCount`.
- [ ] `snapshot.likelyUnavailableCount`.
- [ ] `snapshot.overallRisk`.
- [ ] `positions[]` com cobertura por posição.
- [ ] `explanations[]` com frases curtas para UI.
- [ ] Se nenhum jogador tiver regras úteis, ainda retornar `200` com snapshot vazio ou de baixa confiança, sem tratar isso como erro fatal.

### `components/forms/MatchForm.tsx`

- [ ] Adicionar leitura reativa da data usando `watch("date")` do React Hook Form.
- [ ] Disparar consulta ao endpoint só quando a data for parseável.
- [ ] Não disparar fetch em loop enquanto o usuário ainda não informou horário suficiente.
- [ ] Adicionar estado local para `availabilitySnapshot`, `availabilityLoading` e `availabilityError`.
- [ ] Cancelar ou invalidar respostas antigas quando a data mudar rapidamente.
- [ ] Exibir bloco visual simples abaixo do campo de data ou do bloco de limites por posição.
- [ ] Mostrar loading discreto, sem travar o formulário.
- [ ] Mostrar resumo de quorum quando houver dados.
- [ ] Mostrar explicações curtas e alerta por posição quando disponível.
- [ ] Se a API falhar, mostrar aviso não bloqueante e permitir submit normalmente.
- [ ] Manter `onSubmit` intacto; a previsão não entra no payload de criação/edição da partida.
- [ ] Reaproveitar `positionLimits` do estado atual apenas para UI local; esta PR não recalcula forecast no cliente.

### `app/api/matches/route.ts`

- [ ] Não alterar nesta PR.
- [ ] Registrar no comentário da PR que a previsão é apenas leitura auxiliar do formulário e não interfere no contrato de criação da partida.

---

## Contrato de Resposta do Endpoint

### `GET /api/matches/availability?date=2026-04-09T22:00:00.000Z`

```json
{
  "snapshot": {
    "date": "2026-04-09T22:00:00.000Z",
    "activePlayers": 23,
    "likelyAvailableCount": 13,
    "uncertainCount": 5,
    "likelyUnavailableCount": 5,
    "overallRisk": "MEDIUM"
  },
  "positions": [
    {
      "position": "GOALKEEPER",
      "likelyAvailable": 1,
      "uncertain": 1,
      "likelyUnavailable": 0,
      "risk": "LOW"
    }
  ],
  "explanations": [
    "Ha apenas 1 goleiro com disponibilidade forte para este horario",
    "A base estimada de atletas disponiveis esta abaixo da media do elenco"
  ]
}
```

---

## Smoke Test Manual da PR-02

### Cenário 1 - consulta válida com base suficiente

- [ ] Salvar regras recorrentes para parte do elenco.
- [ ] Abrir `MatchForm` com data e horário futuros.
- [ ] Confirmar que o bloco de quorum aparece com resumo e explicações.

### Cenário 2 - consulta válida sem base suficiente

- [ ] Usar time com poucas regras cadastradas.
- [ ] Confirmar resposta `200` e UI com baixa confiança ou vazio explicável.
- [ ] Confirmar que o formulário continua utilizável.

### Cenário 3 - data inválida

- [ ] Forçar chamada com `date` inválida na URL do endpoint.
- [ ] Confirmar `400` com `VALIDATION_ERROR`.

### Cenário 4 - falha da API durante o formulário

- [ ] Simular erro do endpoint.
- [ ] Confirmar que `MatchForm` mostra aviso não bloqueante.
- [ ] Confirmar que a partida ainda pode ser salva.

### Cenário 5 - escopo de admin

- [ ] Autenticar usuário `PLAYER`.
- [ ] Confirmar bloqueio consistente via `requireAdmin`.

---

## Critério de Pronto da PR-02

- [ ] agregador derivado criado fora da rota.
- [ ] endpoint admin `GET /api/matches/availability` funcional.
- [ ] `MatchForm` consulta a previsão sem alterar o submit.
- [ ] estados de loading, vazio e erro não bloqueante implementados.
- [ ] smoke test manual executado nos 5 cenários.
- [ ] nenhuma persistência adicional criada em `Match` ou `RSVP`.

---

## Handoff para a PR Seguinte

Se esta PR fechar corretamente, a próxima abre a F-012 com menor risco:

- motor de escalação em `lib/`;
- `GET /api/matches/[id]/lineup/route.ts`;
- card de sugestão na tela de detalhe da partida.

Essa separação é importante para manter a F-011 como sinal pré-jogo e impedir que a PR-02 vire uma implementação disfarçada da F-012.
*** End Patch