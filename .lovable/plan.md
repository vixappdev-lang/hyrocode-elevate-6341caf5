
## 1. Modal "Entrar em contato" — responsividade mobile

Arquivo: `src/components/site/ContactModal.tsx`

- `DialogContent` hoje tem `sm:max-w-lg` mas sem largura/padding controlados no mobile → no celular fica colado nas bordas e os inputs estouram. Vou ajustar para:
  - `w-[calc(100vw-1.5rem)] max-w-[420px] sm:max-w-lg p-5 sm:p-6 max-h-[90dvh] overflow-y-auto rounded-2xl`
- Inputs/textarea/select: garantir `text-base sm:text-sm` (evita zoom do iOS) e `min-h-[44px]` para toque.
- Grid `Estado + WhatsApp`: manter `grid-cols-1 sm:grid-cols-2` (hoje quebra ok) e padronizar altura do `SelectTrigger` com os inputs (`h-11`).
- Botão de submit: `py-3.5` e largura total, já está, só padronizar com o resto.
- Título: reduzir no mobile (`text-xl sm:text-2xl`) para não quebrar feio.

Nada de lógica nova, só CSS/markup do modal.

## 2. SEO + logo no resultado do Google

Objetivo: aparecer com a logo HyroCode no card de busca (o "favicon" grande do Google) e melhorar o ranqueamento para buscas tipo "hyrocode", "criação de site", "landing page premium", "sistema sob medida", etc.

### 2a. Logo no Google (favicon + organization logo)

O Google usa: (a) `<link rel="icon">` 48×48+ quadrado nítido e (b) JSON-LD `Organization.logo` apontando pra URL pública.

Passos:
- Copiar `src/assets/hyrocode-logo.png` (já existe, não vou recriar) para `public/`:
  - `public/favicon.png` (512×512 - usa a versão já existente)
  - `public/apple-touch-icon.png` (180×180)
  - manter `public/favicon.ico` se existir
- Em `src/routes/__root.tsx`, dentro de `links`, adicionar:
  - `{ rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon.png" }`
  - `{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" }`
- Atualizar o JSON-LD `Organization` no `__root.tsx` para incluir:
  - `logo: "https://www.hyrocode.online/favicon.png"`
  - `url: "https://www.hyrocode.online"` (alinhar com domínio www, hoje está sem)

### 2b. SEO on-page para subir nas buscas

- `src/routes/__root.tsx`:
  - `canonical` → `https://www.hyrocode.online/` (hoje está `hyrocode.online` sem www, divergente do `og:url`/robots).
  - Adicionar `meta robots index,follow`, `meta theme-color`, `og:site_name`, `og:locale: pt_BR`.
  - Adicionar `keywords` (suave, ainda lido por alguns motores): criação de sites, landing page, sistema sob medida, dashboard, hyrocode, desenvolvimento web brasil.
- `src/routes/index.tsx`:
  - `head()` mais rico, com `og:image` apontando para `/favicon.png` ou um social pré-existente (já tem o `social-...webp`, mantenho).
  - Adicionar JSON-LD adicional `WebSite` com `potentialAction` (SearchAction) — habilita sitelinks searchbox.
  - Adicionar JSON-LD `LocalBusiness` / `ProfessionalService` se fizer sentido (vou usar `ProfessionalService` com nome HyroCode, área de atendimento Brasil).
- `public/robots.txt`: já está apontando os dois sitemaps, ok.
- Verificar que `/sitemap.xml` está retornando 200 e listando `/`. (Não vou mexer no sitemap se já funciona — apenas confirmo.)

Observação: indexação efetiva depende do Google Search Console. Se você ainda não verificou o domínio, posso adicionar a meta tag de verificação assim que me passar o token, mas isso é opcional pra esse loop.

## 3. Checkout próprio com Stripe (Pix only)

### 3a. Decisão técnica

- Pix no Stripe só funciona com conta Stripe **Brasil** + capability `pix_payments` ativa. É a integração **BYOK** (`STRIPE_SECRET_KEY` da sua conta). A integração "Seamless Payments" da Lovable não cobre Pix BR, então a BYOK é a correta aqui.
- Fluxo Pix oficial (docs.stripe.com/payments/pix): criar `PaymentIntent` com `payment_method_types: ['pix']` → confirmar → ler `next_action.pix_display_qr_code` que devolve `image_url_png`, `image_url_svg`, `data` (copia-e-cola) e `expires_at`.
- Confirmação assíncrona: usar webhook `payment_intent.succeeded` em `/api/public/stripe-webhook` para marcar pedido como pago.

### 3b. Banco de dados (migration)

Nova tabela `pix_orders`:
- `id uuid pk`, `created_at`, `updated_at`
- `plan_key text` (ex: `landing_premium`)
- `amount_cents int`, `currency text default 'brl'`
- `customer_name text`, `customer_email text`, `customer_cpf text`, `customer_about text`
- `status text` (`pending` | `paid` | `expired` | `failed`)
- `stripe_payment_intent_id text unique`
- `pix_qr_data text`, `pix_qr_image_url text`, `expires_at timestamptz`

RLS: nenhum SELECT público (acesso só via service role nas server functions). INSERT/UPDATE também só via service role.

### 3c. Server functions e rotas

- `src/lib/checkout.functions.ts` (createServerFn):
  - `createPixOrder({ planKey, name, email, cpf, about })`:
    - valida com zod (nome 2-120, email, cpf 11 dígitos com validador de DV, about ≤2000).
    - calcula `amount_cents` a partir de tabela server-side (não confiar no client).
    - cria PaymentIntent Stripe, confirma server-side com `payment_method_data: { type: 'pix' }`.
    - persiste em `pix_orders` com `pending`, devolve `{ orderId, qrImage, qrCopyPaste, expiresAt, amount }`.
  - `getPixOrder({ orderId })`: lê status para polling no front (sem expor PII).
- `src/routes/api/public/stripe-webhook.ts`:
  - verifica assinatura com `STRIPE_WEBHOOK_SECRET` (constructEvent).
  - em `payment_intent.succeeded` → marca `pix_orders` como `paid`.
  - em `payment_intent.payment_failed` → `failed`.

### 3d. Frontend do checkout

Nova rota: `src/routes/checkout.$plan.tsx` (ex.: `/checkout/landing-premium`).

Layout limpo, **respeitando o design system atual** (sem neon, sem cores chamativas extras, só os tokens já existentes — `bg-background`, `card/50`, `border-white/[0.08]`, `text-foreground`, tipografia display). Estrutura:

```text
┌─────────────────────────────────────────────┐
│  Banner topo (logo HyroCode + selo seguro)  │
│  "Pagamento 100% seguro • LGPD • Pix"       │
├─────────────────────────────────────────────┤
│  Esquerda (form)         │ Direita (resumo) │
│  Nome                    │ Plano: Landing…  │
│  Email                   │ Valor: R$ 497    │
│  CPF                     │ Forma: Pix       │
│  Sobre o projeto         │ Selos LGPD/SSL   │
│  [ Continuar ]           │                  │
└─────────────────────────────────────────────┘
```

Após "Continuar":
- estado `step = "pix"` no mesmo componente.
- mostra QR code centralizado (imagem retornada pelo Stripe).
- abaixo: campo `readonly` com o copia-e-cola + botão "Copiar Pix" (clipboard).
- contador regressivo até `expiresAt`.
- polling a cada 4s em `getPixOrder` → quando `paid`, troca para tela de sucesso com confirmação e próximos passos (WhatsApp HyroCode).

Mobile:
- grid `grid-cols-1 lg:grid-cols-[1fr_360px]`, resumo vira card no topo no mobile.
- inputs `h-12 text-base` (sem zoom iOS), botões `py-3.5`, padding container `px-4 sm:px-6`.
- QR code com `max-w-[260px] w-full mx-auto`.
- copia-e-cola: `font-mono text-xs break-all` + botão full-width no mobile.

CTA dos planos: trocar o `cta` de "QUERO ESSE" (Whatsapp) no `Pricing.tsx` para `Link to="/checkout/landing-premium"` no plano Landing Premium. O plano "Sistemas Sob Medida" continua abrindo o modal de contato (valor a consultar não cabe Pix direto).

### 3e. Validações de segurança

- Server: zod no input, CPF com checksum, valor da fonte de verdade no servidor.
- Webhook: assinatura obrigatória, `timingSafeEqual`.
- `pix_orders`: sem SELECT público; o endpoint `getPixOrder` retorna só `{ status, expiresAt }`.
- Nada de chave secreta no client; só `process.env.STRIPE_SECRET_KEY` dentro de `.handler()`.

### 3f. Secrets necessários (vou pedir depois da aprovação)

- `STRIPE_SECRET_KEY` — sua chave secreta (sk_live_... ou sk_test_... pra testar).
- `STRIPE_WEBHOOK_SECRET` — gerado quando você cria o endpoint webhook em https://dashboard.stripe.com/webhooks apontando pra `https://www.hyrocode.online/api/public/stripe-webhook` (te explico passo a passo).

Pré-requisito que **só você consegue fazer** no Stripe:
1. Conta Stripe Brasil verificada.
2. Ativar Pix no dashboard: Settings → Payment methods → Pix → Turn on.
3. Criar o webhook endpoint apontando pra URL acima, ouvindo `payment_intent.succeeded` e `payment_intent.payment_failed`.

## Arquivos afetados (resumo)

Editar:
- `src/components/site/ContactModal.tsx` (responsivo)
- `src/routes/__root.tsx` (SEO, favicon, JSON-LD)
- `src/routes/index.tsx` (head extra, JSON-LD WebSite)
- `src/components/site/Pricing.tsx` (CTA Landing Premium → /checkout)

Criar:
- `public/favicon.png`, `public/apple-touch-icon.png` (copiados da logo existente)
- `supabase/migrations/<ts>_pix_orders.sql`
- `src/lib/checkout.functions.ts`
- `src/routes/api/public/stripe-webhook.ts`
- `src/routes/checkout.$plan.tsx`
- `src/components/checkout/CheckoutForm.tsx`, `PixDisplay.tsx`, `OrderSummary.tsx`

Após aprovar este plano eu já peço as duas keys do Stripe e implemento tudo de uma vez.
