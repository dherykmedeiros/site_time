# Plano de migração: Vercel para Hostinger + Coolify

**Status:** planejado — não executado  
**Objetivo:** hospedar o Site Time em uma VPS da Hostinger administrada pelo Coolify, mantendo o PostgreSQL do Supabase nesta primeira etapa.

## Decisões de arquitetura

| Área | Decisão para a migração | Motivo |
|---|---|---|
| Aplicação | Container Docker multi-stage do Next.js, executado com `next start` na porta 3000 | Torna o build e o runtime reproduzíveis no Coolify. |
| Painel/orquestração | Coolify conectado ao repositório GitHub e à branch oficial de produção | Mantém deploy por commit sem depender da integração da Vercel. |
| Banco | Supabase PostgreSQL permanece externo à VPS | Evita uma migração de dados junto com a mudança de hospedagem. |
| Arquivos enviados | Supabase Storage permanece como origem de uploads | O diretório local do container é efêmero. |
| TLS e proxy | Domínio configurado no Coolify, com proxy e certificado gerenciados pelo painel | A aplicação continua recebendo HTTPS no domínio público. |
| Cache de OG | `Cache-Control` continua sendo emitido pela aplicação; a confirmação de HIT será feita pelos cabeçalhos do proxy/CDN realmente configurado | `x-vercel-cache` não é um contrato disponível fora da Vercel. |

## Pré-requisitos e informações pendentes

- VPS Hostinger com Docker e Coolify saudáveis, acesso administrativo restrito e backups do próprio servidor configurados.
- Domínio de produção definido e registro DNS `A` apontando para o IP público da VPS. Só remover o domínio da Vercel após a validação e a virada de DNS.
- Acesso do Coolify ao repositório GitHub e branch de produção atualmente usada pelo time.
- Inventário completo dos segredos de produção. Eles serão cadastrados somente na interface do Coolify, nunca no Git ou no `Dockerfile`.
- Backup verificável do banco Supabase antes da primeira migração e confirmação de que `DIRECT_URL` alcança o banco a partir da VPS.

## Variáveis de ambiente no Coolify

Cadastrar como **runtime variables**: `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_REGISTRATION_CODE`, `WEBHOOK_PIX_SECRET`, as variáveis VAPID, Resend/Brevo, Supabase Storage e Redis/Upstash quando utilizado. `NEXTAUTH_URL` deve ser a URL HTTPS canônica do novo domínio.

Não marcar segredos como variáveis de build, pois o `next build` não precisa deles. `NEXT_PUBLIC_VAPID_PUBLIC_KEY` pode ser disponibilizada no build somente se a verificação do build provar que ela precisa ser incorporada ao bundle; nesse caso, usar o mecanismo de secrets/build variables do Coolify, sem gravá-la na imagem.

## Plano de execução

### Fase 1 — Preparar o repositório

1. Criar `Dockerfile` multi-stage e `.dockerignore`; usar Node 20, `npm ci`, `npm run build` e `npm run start` ouvindo em `0.0.0.0:3000`.
2. Configurar `output: "standalone"` no Next.js ou copiar explicitamente os artefatos necessários para a imagem final. Validar Prisma Client, `sharp` e a geração de imagens OG dentro de Linux.
3. Adicionar teste local de imagem: build, container com variáveis de teste e `GET /api/health`, `/api/ready` e `/api/version`.
4. Manter `.env` fora da imagem e confirmar que uploads continuam indo para o Supabase Storage, não para `public/uploads`.

**Saída:** imagem reproduzível localmente e CI verde.

### Fase 2 — Configurar o Coolify

1. Criar projeto e ambiente de produção; conectar a origem GitHub e selecionar o build pack **Dockerfile**, diretório-base `/`, Dockerfile na raiz e porta exposta `3000`.
2. Cadastrar as variáveis acima, configurar o domínio HTTPS e validar que o processo não depende de `localhost` como URL pública.
3. Configurar health check HTTP em `/api/ready`, resposta esperada `200`. O endpoint verifica aplicação e banco; se usar health check definido no Dockerfile, a imagem deve conter o cliente HTTP correspondente.
4. Habilitar retenção de logs e configurar um destino externo de alertas/erros antes de receber tráfego real. Métricas exclusivas da Vercel não serão consideradas evidência operacional após a virada.

**Saída:** ambiente novo acessível por domínio temporário do Coolify, ainda sem mudança de DNS público.

### Fase 3 — Banco e primeiro deploy

1. Rodar `npx prisma migrate status` contra produção a partir de um ambiente autorizado.
2. Quando houver migrações pendentes, executar `npx prisma migrate deploy` uma única vez em etapa controlada do pipeline, com `DIRECT_URL`; nunca `prisma db push` em produção.
3. Fazer deploy da mesma revisão já aprovada pelo CI. Não usar comando pós-deploy para migrações: ele é tardio para uma alteração de schema e pode competir com tráfego.
4. Validar logs do container, `/api/health`, `/api/ready`, `/api/version`, login, upload, envio de e-mail, push e webhook PIX em ambiente de teste seguro.

**Saída:** revisão candidata operando no domínio temporário e pronta para smoke test.

### Fase 4 — Virada e validação

1. Executar `node scripts/smoke-test.js https://<novo-dominio>` e a suíte de checagens autenticadas essenciais.
2. Atualizar o DNS do domínio para a VPS e manter a aplicação da Vercel ativa como fallback até a propagação e as verificações concluírem.
3. Revalidar autenticação (cookies e callback URL), webhooks externos, e-mail, uploads, OG images, redirecionamentos e cabeçalhos de segurança.
4. Registrar o SHA, URL, horário, resultado do smoke test e configuração de rollback no documento operacional.

**Critério de aceite:** todos os endpoints do smoke test aprovados, `/api/ready` estável, fluxos críticos aprovados e nenhum erro novo nos logs/observabilidade durante a janela combinada.

### Fase 5 — Estabilização e desativação da Vercel

1. Monitorar erros 5xx, disponibilidade e uso de CPU/RAM da VPS durante pelo menos uma janela operacional acordada.
2. Só então remover o domínio e os segredos da Vercel; manter o projeto desativado ou com registro histórico pelo período de retenção definido.
3. Atualizar `DOCUMENTACAO_OPERACIONAL.md` com evidências reais do novo ambiente. Os registros atuais da Vercel devem permanecer como histórico, não como estado de produção.

## Rollback

Se o novo ambiente falhar após a virada, restaurar o DNS para a Vercel enquanto ela ainda estiver ativa e reverter a revisão no Coolify. Migrações devem ser aditivas e compatíveis antes da virada; se não forem, o rollback exige o procedimento de banco específico e não apenas a reversão da aplicação.

## Riscos a validar

- A VPS passa a concentrar responsabilidade por disponibilidade, patching, capacidade e logs que antes eram providos pela Vercel.
- `@sparticuz/chromium-min`, `puppeteer-core` e `sharp` precisam ser exercitados no container Linux final; não assumir compatibilidade a partir do ambiente Windows.
- O cache de imagens OG depende do proxy/CDN escolhido. O cabeçalho `Cache-Control` é necessário, mas não prova sozinho um cache HIT.
- DNS, `NEXTAUTH_URL` e provedores de webhook precisam usar o mesmo domínio HTTPS canônico para não romper autenticação nem callbacks.

## Referências operacionais

- [Coolify: deploy de Next.js](https://coolify.io/docs/applications/nextjs)
- [Coolify: build por Dockerfile](https://coolify.io/docs/applications/build-packs/dockerfile)
- [Coolify: health checks](https://coolify.io/docs/knowledge-base/health-checks)
- [Coolify: variáveis de ambiente](https://coolify.io/docs/knowledge-base/environment-variables)
