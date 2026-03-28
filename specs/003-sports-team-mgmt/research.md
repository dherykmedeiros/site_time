# Research: Gestão de Times Esportivos Amadores

**Feature**: 003-sports-team-mgmt  
**Date**: 2026-03-28  
**Status**: Complete

## R1: Estratégia de Upload de Imagens (escudo, fotos de jogadores)

**Decision**: Upload via Next.js API Route com armazenamento local em `public/uploads/` para v1.

**Rationale**: A constitution exige simplicidade (Princípio V). Armazenamento local elimina dependência de serviços externos (S3, Cloudinary) e mantém o setup de desenvolvimento trivial. O volume esperado é baixo (~30 fotos de jogadores + 1 escudo por time).

**Alternatives considered**:
- **Cloudinary/S3**: Maior escalabilidade, mas adiciona complexidade de configuração, variáveis de ambiente extras e custos. Desnecessário para v1 com escopo single-tenant.
- **UploadThing**: Boa DX, mas adiciona dependência externa para um caso de uso simples.

**Implementation notes**:
- Validação server-side com Zod: tipo MIME (JPEG, PNG, WebP) e tamanho máximo 5 MB (FR-028)
- Renomear arquivos com UUID para evitar colisão e path traversal
- Servir via `public/uploads/` com Next.js static file serving
- Migração para cloud storage pode ser feita posteriormente sem alterar API contracts

---

## R2: Framework de Testes

**Decision**: Vitest para unit/integration tests + React Testing Library para componentes + Playwright para E2E.

**Rationale**: Vitest é mais rápido que Jest, tem suporte nativo a ESM (importante para Next.js 14+) e API compatível com Jest. Playwright é o padrão recomendado pelo Next.js para E2E.

**Alternatives considered**:
- **Jest**: Mais maduro, mas configuração ESM mais complexa com Next.js App Router. Performance inferior ao Vitest.
- **Cypress**: Popular para E2E, mas Playwright tem suporte melhor a múltiplos browsers e é mais rápido em CI.

---

## R3: Serviço de E-mail para Notificações

**Decision**: Resend para envio de e-mails transacionais (notificação de amistoso aprovado/rejeitado, convites de jogadores).

**Rationale**: API simples, SDK oficial para Node.js/Next.js, free tier (100 emails/dia) cobre o volume esperado. Boa integração com NextAuth para magic links de convite.

**Alternatives considered**:
- **Nodemailer + SMTP**: Mais configuração, necessita servidor SMTP. Menos confiável para deliverability.
- **SendGrid**: Mais enterprise, setup mais complexo, overkill para o volume esperado.
- **AWS SES**: Requer conta AWS e configuração de domínio. Complexidade desnecessária para v1.

---

## R4: Estratégia de Sessão NextAuth.js

**Decision**: JWT (JSON Web Tokens) para sessões.

**Rationale**: Simplicidade (Princípio V). JWT elimina necessidade de tabela de sessão no banco, reduz queries por request e simplifica o schema do Prisma. Para v1 com single-tenant, JWT é suficiente.

**Alternatives considered**:
- **Database sessions**: Melhor controle de revogação, mas adiciona tabela `Session` e query extra em cada request. Desnecessário para v1 onde revogação instantânea não é requisito.

**Implementation notes**:
- Usar `PrismaAdapter` do NextAuth para persistir User/Account
- JWT contém: userId, email, role, teamId
- Token expiry: 30 dias (padrão NextAuth)

---

## R5: Magic Link para Convites de Jogadores

**Decision**: Token de convite custom armazenado na tabela `InviteToken`, com página dedicada `app/(auth)/invite/[token]/page.tsx`.

**Rationale**: NextAuth Email Provider é projetado para login, não para convites vinculados a um Player específico. Um fluxo custom permite vincular o convite ao Player existente (FR-008.1) e é mais flexível.

**Alternatives considered**:
- **NextAuth Email Provider**: Genérico demais; não suporta vincular o novo User a um Player pré-existente sem workarounds complexos.

**Implementation notes**:
- Admin gera convite via `POST /api/players/invite` → cria InviteToken com playerId
- E-mail enviado via Resend com link `{BASE_URL}/invite/{token}`
- Jogador acessa link, cria conta (email + senha), token é consumido e User é vinculado ao Player
- Token expira em 7 dias, single-use

---

## R6: Rate Limiting no Formulário Público

**Decision**: Rate limiting in-memory com `@upstash/ratelimit` usando Upstash Redis, ou fallback para rate limiting baseado em IP com Map em memória para v1.

**Rationale**: FR-029 exige rate limiting no formulário de amistosos. Para v1, um rate limiter baseado em IP com Map em memória é suficiente (reinicia com restart do server, mas aceitável para v1 single-instance).

**Alternatives considered**:
- **Upstash Redis**: Persistente e distribuído, mas adiciona dependência externa. Bom upgrade path para v2.
- **next-rate-limit**: Pacote simples, mas pouco mantido.
- **Middleware-level**: Aplicar rate limit no Next.js middleware para todas as rotas públicas.

**Implementation notes**:
- Limite: 5 solicitações por IP por hora no endpoint `POST /api/friendly-requests`
- Resposta 429 (Too Many Requests) com header `Retry-After`

---

## R7: Deep Links para Compartilhamento via WhatsApp

**Decision**: URLs públicas da Vitrine como deep links: `{BASE_URL}/vitrine/{slug}/matches/{id}`.

**Rationale**: FR-013.1 pede link compartilhável. Usar URLs públicas da Vitrine como deep links é a solução mais simples — não requer infraestrutura adicional. O admin copia o link e cola no WhatsApp.

**Implementation notes**:
- Cada Match tem `shareToken` (UUID curto) para URL mais limpa opcionalmente
- Botão "Copiar link" no detalhe da partida para facilitar compartilhamento
- Meta tags OpenGraph na página para preview bonito no WhatsApp

---

## R8: Estratégia de Rankings e Estatísticas Agregadas

**Decision**: Cálculo sob demanda (on-read) via queries Prisma com aggregation.

**Rationale**: Volume baixo (~50 partidas/ano, ~30 jogadores) não justifica materialização (tabelas de cache) ou cron jobs. Princípio V (Simplicidade) manda calcular diretamente. Se performance degradar, migrar para views materializadas.

**Alternatives considered**:
- **Tabela de cache/materialized view**: Mais performante para escala, mas complexidade prematura para o volume esperado.
- **Cron job de aggregation**: Adiciona infraestrutura desnecessária.

**Implementation notes**:
- `groupBy` do Prisma para artilheiros, assistências, cartões
- Query de aproveitamento: COUNT por resultado (vitória/empate/derrota) baseado no placar
- Cache HTTP com `Cache-Control` ou `revalidate` do Next.js para a Vitrine pública

---

## R9: Validação de Imagens Server-Side

**Decision**: Validação de MIME type via magic bytes + Zod para metadados (tamanho, extensão).

**Rationale**: FR-028 exige restrição a JPEG, PNG, WebP com max 5 MB. Confiar apenas na extensão do arquivo é inseguro. Verificar magic bytes garante que o conteúdo é realmente uma imagem.

**Implementation notes**:
- Ler primeiros bytes do buffer para verificar magic bytes (JPEG: `FF D8 FF`, PNG: `89 50 4E 47`, WebP: `52 49 46 46`)
- Rejeitar com 400 se tipo não corresponder
- Processar/redimensionar com `sharp` para thumbnail (opcional, mas recomendado para performance da Vitrine)
