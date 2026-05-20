# Plano de execução

Antes de tudo, **um ponto crítico que depende de você**:

> O erro atual do checkout (`The payment method type "pix" is invalid...`) **não é bug de código** — é a sua conta Stripe que ainda **não tem Pix ativado**. Eu posso deixar 100% do código pronto, mas o Pix só vai funcionar de verdade depois que você ativar em: Stripe Dashboard → Settings → Payments → Payment methods → **Pix** (precisa ser conta Stripe Brasil). Sem isso, qualquer tentativa retorna esse mesmo erro.

Vou seguir mesmo assim, deixando tudo pronto pra ativar no minuto que o Pix for liberado na sua conta.

---

## 1. Checkout novo (inspirado no Cakto, mais limpo e profissional)

**URL nova:** `/checkout/$orderId` (UUID gerado, ex: `/checkout/a1b2c3d4-...`). O `landing-premium` some da URL.

**Fluxo:**
1. Usuário clica em "Quero esse plano" no `Pricing.tsx`.
2. Botão chama server fn `startCheckout({ planKey })` → cria registro em `pix_orders` (status `draft`, sem dados de cliente ainda) e retorna `orderId` (UUID).
3. Frontend navega para `/checkout/{orderId}`.
4. Página carrega dados do pedido (plano, valor) via `getCheckoutOrder({ orderId })`.

**Layout (inspirado em pay.cakto.com.br, mas mais refinado):**
- **Banner topo full-width**: faixa escura com selo "Pagamento 100% seguro • Pix • SSL 256-bit" + logo HyroCode + cronômetro de oferta (visual, não funcional invasivo).
- **Header limpo**: logo + "Ambiente seguro".
- **Grid 2 colunas (desktop) / 1 coluna (mobile)**:
  - Esquerda: resumo do produto (nome **"Landing Page - HyroCode"**, descrição curta, valor, bullets do que inclui, badges LGPD/SSL/Pix).
  - Direita: formulário compacto (**apenas Nome, Email, CPF** — removido "sobre o projeto") → botão "Gerar Pix" → tela com QR + copia-e-cola.
- Tipografia/cores do design system existente (nada de neon), espaçamento generoso, micro-animações sutis.
- **Mobile total**: inputs `h-12 text-base` (sem zoom iOS), botões grandes, sticky CTA, QR centralizado, copia-e-cola com botão "Copiar" embaixo (não ao lado).
- Polling automático a cada 4s pra confirmar pagamento; tela de sucesso com próximos passos.

**Schema:** adiciono coluna `status='draft'` permitida em `pix_orders` (já existe), e tudo continua via `supabaseAdmin` + RLS atual.

---

## 2. Remover admin / dashboard / rastreio

Deletar:
- `src/routes/admin.tsx`, `admin.dashboard.tsx`, `admin.solicitacoes.tsx`, `admin.configuracoes.tsx`, `admin.rastreio.tsx`
- `src/routes/api/public/admin-*.ts` (admin-login, admin-stats, admin-contacts, admin-visitors, admin-settings, pricing-buttons)
- `src/components/admin/` (pasta inteira incluindo `VisitorMap.tsx`)
- `src/components/site/VisitorTracker.tsx` + rota `api/public/track.ts` (vai pro tracking via bot — ver §3)

Tracking de visitantes **continua** salvando em `visitor_events` (não removo a tabela, o bot vai ler dela), mas o painel admin web sai. O acesso vira **só pelo Telegram**.

> Espera — se eu remover o `VisitorTracker` e o `/api/public/track`, o bot não tem o que listar em "rastreio". **Vou manter** o `VisitorTracker` no site e o endpoint `track.ts` (são silenciosos, ninguém vê). Removo apenas a UI admin. Confirma essa interpretação? (Por padrão sigo assim.)

---

## 3. Bot Telegram (operante imediato)

**Token:** `8884174946:AAHW...` — vou **mover pra secret** `TELEGRAM_BOT_TOKEN` (não fica no código).

**Arquitetura (sem connector, chamada direta à API do Telegram):**
- Webhook em `src/routes/api/public/telegram-webhook.ts`.
- Secret token derivado de `TELEGRAM_BOT_TOKEN` no header `X-Telegram-Bot-Api-Secret-Token` (proteção contra spoofing).
- Registro do webhook feito por mim via `curl` após deploy: `setWebhook` apontando pra `https://project--425fa925-7dc6-45c7-a96e-6e4790911994-dev.lovable.app/api/public/telegram-webhook` (e também a URL de produção quando publicada).

**Comandos / menu interativo (Inline Keyboard):**
- `/start` → mensagem de boas-vindas + menu inline com 3 botões: **💳 Checkouts**, **🌍 Rastreio**, **📊 Resumo**.
- **💳 Checkouts** → lista últimos 10 pedidos da tabela `pix_orders` **+** busca em tempo real os `PaymentIntents` recentes da Stripe (`stripe.paymentIntents.list({ limit: 10 })`) com: status, valor, cliente, email, CPF, método, data. Botões de paginação (« anterior / próxima »).
- **🌍 Rastreio** → últimos 10 visitantes de `visitor_events`: IP, país (com bandeira), cidade, device, browser, página, referrer, VPN/proxy flag. Paginação.
- **📊 Resumo** → totais: visitantes hoje/7d/30d, pedidos pendentes, pedidos pagos, receita total.
- Filtro por **chat_id autorizado** (você manda `/start`, eu pego seu chat_id e adiciono à secret `TELEGRAM_ADMIN_CHAT_IDS`) — sem isso o bot ignora estranhos.

**Como autorizo seu chat_id sem você me passar manualmente?** Primeira mensagem `/start` de qualquer pessoa retorna o `chat_id` dela; você me diz qual é o seu e eu adiciono à secret. Ou faço modo simples: primeiro a mandar `/start` vira admin automaticamente. **Vou fazer essa segunda opção** (mais prático).

---

## 4. Correções pontuais
- `Pricing.tsx`: botão do plano premium agora chama `startCheckout` e navega pro UUID.
- Label do plano em todo lugar: **"Landing Page - HyroCode"**.
- Limpar imports/rotas órfãs após remoção do admin.

---

## 5. Secrets que vou pedir (em uma única tela)
- `TELEGRAM_BOT_TOKEN` — o token que você mandou (vou pré-preencher na descrição pra você só colar).
- `TELEGRAM_WEBHOOK_SECRET` — gero um valor sugerido, você só confirma.

`STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` já estão configurados.

---

## 6. O que **não** vou fazer (pra não bagunçar)
- Não mexo em Hero, Footer, Pricing visual, Navbar, SEO, sitemap, AntiInspect.
- Não removo a tabela `visitor_events` nem o tracker (bot precisa).
- Não toco em nada de Vercel/git além do que já existe.

---

## Ordem de execução
1. Migração: permitir `status='draft'` (constraint check) + índices.
2. Deletar arquivos do admin.
3. Reescrever `checkout.functions.ts` (+ `startCheckout`, `getCheckoutOrder`).
4. Reescrever `src/routes/checkout.$orderId.tsx` (novo arquivo) + deletar `checkout.$plan.tsx`.
5. Atualizar `Pricing.tsx`.
6. Criar `src/lib/telegram.server.ts` (helpers API Telegram) + `src/lib/telegram-bot.functions.ts`.
7. Criar `src/routes/api/public/telegram-webhook.ts`.
8. Pedir secrets.
9. Após aprovação dos secrets: `curl setWebhook` pra registrar o bot e testar com `/start`.

Posso seguir?