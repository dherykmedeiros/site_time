# Checklist Tecnico - PR-13 - F-016 Opponent UI

**Feature**: F-016 CRM de adversarios e reputacao  
**Objetivo da PR**: expor o CRM no fluxo admin de amistosos e habilitar review pos-jogo curta, sem redesenhar todo o dashboard.  
**Escopo**: UI admin, detalhe de adversario e review.

---

## Arquivos-Alvo

- `app/(dashboard)/friendly-requests/page.tsx`
- `app/(dashboard)/friendly-requests/opponents/page.tsx`
- `app/(dashboard)/matches/[id]/page.tsx` ou superficie pos-jogo equivalente
- `app/api/opponents/[id]/review/route.ts`
- `components/` apenas para blocos pequenos de timeline, score ou review

---

## Checklist por Superficie

### `app/(dashboard)/friendly-requests/page.tsx`

- adicionar bloco resumido de adversarios confiaveis e de risco sem esconder a fila de requests;
- permitir atalho para ver o detalhe do adversario associado a uma solicitacao;
- manter a pagina focada em operacao de aprovar/rejeitar, nao em analytics pesada.

### `app/(dashboard)/friendly-requests/opponents/page.tsx`

- criar lista admin ordenada por `lastInteractionAt`;
- permitir filtro simples por faixa de score;
- mostrar timeline curta, contatos conhecidos e notas internas do adversario;
- explicar score como heuristica operacional, nao verdade absoluta.

### `app/(dashboard)/matches/[id]/page.tsx` ou superficie pos-jogo equivalente

- habilitar review curta apenas para amistoso concluido;
- limitar o formulario a tres notas e comentario opcional;
- nao bloquear o restante do pos-jogo caso o admin ainda nao queira avaliar.

### `app/api/opponents/[id]/review/route.ts`

- restringir submit ao admin do time dono do CRM;
- validar que a partida e amistoso concluido antes de aceitar review;
- disparar recalculo do score apos salvar a review.

---

## Smoke Test da PR

1. Admin abre a lista de adversarios e encontra um adversario de amistoso recente.
2. O detalhe mostra timeline, score e ultima review sem erro.
3. Em amistoso concluido, o admin envia review curta e o score e recalculado.
4. Em partida nao concluida ou nao amistosa, a UI nao oferece review.
5. Estados vazios do CRM e da review aparecem de forma clara e nao quebram o fluxo principal.

---

## Fora de Escopo desta PR

- reputacao publica na vitrine;
- moderacao complexa de reviews;
- dashboards analiticos amplos;
- notificacoes automáticas por score.