
## Objetivo

1. Refazer o checkout com identidade HyroCode (não escuro absoluto, mais claro/elegante, profissional, totalmente responsivo).
2. Trocar o ID da URL de UUID para um slug curto aleatório (ex: `NyuK2x`).
3. Garantir bot Telegram 100% conectado e operante (sem header secreto, conforme pedido).
4. Logs de rastreio profissionais — sem imagens e sem links que gerem preview de imagem.

Nada de admin/dashboard volta. Stripe Pix permanece.

---

## 1. ID curto do checkout (`NyuK2`)

- Migration:
  - Adicionar `slug TEXT UNIQUE` em `pix_orders` (6 chars, alfanumérico, gerado por função `gen_short_id()` em SQL usando `gen_random_bytes` + base62).
  - Backfill nas linhas existentes.
  - Index único em `slug`.
- `checkout.functions.ts`:
  - `startCheckout` passa a retornar `{ slug }` em vez de `{ orderId }`.
  - `getCheckoutOrder` / `generatePix` / `getOrderStatus` aceitam `slug` (regex `^[A-Za-z0-9]{5,8}$`).
- Rota: renomear `src/routes/checkout.$orderId.tsx` → `src/routes/checkout.$slug.tsx`. Atualizar `Pricing.tsx` para navegar para `/checkout/{slug}`.
- Bot mostra o slug curto como identificador do pedido.

---

## 2. Redesign do checkout (tema HyroCode, profissional)

Direção visual: superfície clara/neutra elegante (não puro preto), tipografia display da marca, acentos sutis, micro-interações discretas. Inspiração estrutural do Cakto, mas linguagem HyroCode.

Estrutura (desktop):

```text
┌─ Barra fina superior: cadeado + "Ambiente seguro • SSL • Pix"
├─ Header: logo HyroCode (esq) · "Compra 100% segura" (dir)
├─ Stepper (1 Identificação → 2 Pagamento → 3 Confirmação)
│
│  ┌──────────────────────────────┐  ┌────────────────────────┐
│  │ Card "Seus dados"            │  │ Card resumo (sticky)   │
│  │  Nome / Email / CPF / Cel    │  │  Produto + bullets      │
│  │  Método: [Pix] (badge -off)  │  │  Subtotal/Total         │
│  │  CTA principal: Gerar Pix    │  │  Selos: LGPD/SSL/Pix    │
│  └──────────────────────────────┘  └────────────────────────┘
│
└─ Rodapé: vendedor HyroCode · contato · termos
```

Mobile: 1 coluna, resumo colapsável no topo, CTA fixo no rodapé (safe-area), inputs `h-12 text-[16px]` (evita zoom iOS), espaçamento generoso.

Tela Pix (etapa 2): QR centralizado em card branco com borda suave, valor + contador, abaixo o textarea "Pix copia e cola" + botão "Copiar código", aviso de aguardando confirmação, polling 4s mantido.

Tela Paga: ícone de confirmação, próximos passos (email enviado, WhatsApp em até X), CTA "Voltar ao site".

Tokens: usar variáveis semânticas (`--background`, `--card`, `--primary`, `--muted`, `--border`, `--shadow-elegant`). Adicionar (se faltar) `--checkout-surface` mais clara que o site, para destacar o checkout sem virar branco puro. Sem neon, sem gradientes berrantes.

Título da aba: `Checkout • Landing Page - HyroCode`.

---

## 3. Bot Telegram 100% operante

Estado atual: webhook exige header `x-telegram-bot-api-secret-token` — o usuário pediu para usar o token normal sem secret.

Mudanças:

- `telegram.server.ts`: remover `TELEGRAM_WEBHOOK_SECRET`.
- `telegram-webhook.ts`: remover checagem de header. Proteção continua sendo: (a) URL pública sem segredo é difícil de descobrir e (b) `isAdmin(chatId)` libera apenas o primeiro `/start` (já implementado).
- Re-registrar webhook via `curl` direto na API do Telegram apontando para `https://project--425fa925-7dc6-45c7-a96e-6e4790911994.lovable.app/api/public/telegram-webhook` **sem** `secret_token`, com `allowed_updates: ["message","callback_query"]`, `drop_pending_updates: true`.
- Validar com `getWebhookInfo` (esperar `pending_update_count: 0`, sem `last_error_message`).
- Smoke test: enviar `/start` ao bot e confirmar que retorna o menu.
- Token segue hard-coded no `telegram.server.ts` (pedido explícito do usuário).

---

## 4. Logs de rastreio sem imagens / sem preview

Problema: `referrer` pode conter URLs (ex: facebook/instagram) que o Telegram expande em preview com imagem. Hoje os logs já são texto, mas Telegram gera preview automático do primeiro link.

Mudanças em `renderTracking` e `renderCheckouts`:

- Em **todas** as chamadas `tg("sendMessage" | "editMessageText")` da view de rastreio: adicionar `link_preview_options: { is_disabled: true }` (e `disable_web_page_preview: true` como fallback).
- `referrer`: nunca mandar como link clicável. Sanitizar:
  - Mostrar apenas `host + path` curtos (sem `http(s)://`, sem querystring), dentro de backticks (` `` `) → o Telegram não cria preview de texto puro entre backticks.
  - Truncar para 50 chars.
- `path`: idem (backticks, sem domínio).
- Nada de `sendPhoto`/imagens — apenas texto Markdown.
- Confirmar que `flag(country_code)` (emoji) continua, é só caractere.

---

## 5. Arquivos afetados

- **Migration nova:** `pix_orders.slug` + função `gen_short_id()` + backfill.
- **Servidor:**
  - `src/lib/checkout.functions.ts` — schemas/handlers por `slug`, `startCheckout` retorna `slug`.
  - `src/lib/telegram.server.ts` — remove constante de secret.
  - `src/routes/api/public/telegram-webhook.ts` — remove checagem; sanitiza referrer; desabilita preview.
  - `src/routes/api/public/stripe-webhook.ts` — sem mudança funcional.
- **Frontend:**
  - `src/routes/checkout.$slug.tsx` (renomear e redesenhar conforme Seção 2).
  - `src/components/site/Pricing.tsx` — usa `slug` no navigate.
  - `src/styles.css` — tokens do checkout se necessário.
- **Re-deploy webhook** via `curl` (sandbox).

---

## 6. Ordem de execução

1. Migration (`slug` + backfill + função).
2. Reescrever `checkout.functions.ts` (slug).
3. Renomear/redesenhar a página `checkout.$slug.tsx`.
4. Atualizar `Pricing.tsx`.
5. Atualizar `telegram.server.ts` + `telegram-webhook.ts` (sem secret, sem preview, referrer sanitizado).
6. Re-registrar webhook do Telegram e validar `getWebhookInfo`.
7. Teste end-to-end: clicar no plano → `/checkout/{slug}` → preencher → QR → `/start` no bot → ver pedido com slug e tracking sem previews.

## Não mexer

- Hero, Footer, Navbar, SEO/sitemap, AntiInspect, schema de `visitor_events`, integração Stripe, `client.ts`/`types.ts` da Supabase.
