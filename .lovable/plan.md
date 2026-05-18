ns
# HyroCode — Premium Website

Build a sophisticated dark-themed marketing site for HyroCode, inspired by Stripe / Linear / Vercel / Framer. Uses the project's existing modern stack (TanStack Start + React + Tailwind v4 + TypeScript) — which compiles to clean modern HTML/CSS/JS and gives us SSR, routing, and performance out of the box.

The uploaded logo will be used **exactly as provided** (copied to `src/assets/hyrocode-logo.png`), never recreated or restyled — only resized and positioned.

## Pages & route structure

Single landing page (`/`) with anchored sections — appropriate here since the brief asks for one continuous premium scrolling experience, not a multi-page site.

- `src/routes/index.tsx` — assembles all sections, sets SEO head metadata
- `src/routes/__root.tsx` — minor head/meta polish (title: "HyroCode — Sites, sistemas e experiências digitais")

## Design system (`src/styles.css`)

Replace default tokens with a refined dark palette:

- `--background`: deep near-black with subtle blue cast (`oklch(0.14 0.02 250)`)
- `--foreground`: soft white (`oklch(0.97 0.005 250)`)
- `--card`: elevated dark surface with glass feel
- `--primary`: refined blue matching logo (`oklch(0.62 0.18 250)`) — NOT saturated/neon
- `--primary-glow`: lighter blue for gradients
- `--muted-foreground`: desaturated cool gray
- `--border`: low-opacity white (`oklch(1 0 0 / 0.08)`)
- Custom tokens: `--gradient-hero`, `--gradient-primary`, `--shadow-elegant`, `--shadow-glass`, `--glass-bg`, `--glass-border`

Force dark mode by default (apply `.dark` class on `<html>` or set tokens directly in `:root`).

**Typography:** Inter Tight (display, tight tracking) + Inter (body), loaded via Google Fonts in root `head()`. Distinctive enough to feel premium, broadly legible.

## Components (in `src/components/site/`)

1. **Navbar.tsx** — floating, fixed top, glass blur (`backdrop-blur-xl`), subtle border, logo left, minimal links (Serviços, Portfólio, Processo, Contato), primary CTA right. Mobile: sheet drawer with same polish.

2. **Hero.tsx** —
   - Headline: "Sites, sistemas e experiências digitais que elevam marcas."
   - Subhead: SaaS / plataformas / interfaces / automações
   - Two CTAs (primary + ghost secondary)
   - Background: layered radial gradients + subtle grid overlay + soft glow behind a floating dashboard mockup
   - Mockup = stylized browser frame with a generated premium dashboard image

3. **PortfolioSlider.tsx** — **most important section**
   - Horizontal auto-scrolling marquee, infinite loop, CSS `@keyframes` translate (pauses on hover, drag/touch on mobile)
   - Portrait cards (~3:4), rounded-2xl, subtle border, elegant shadow, overlay gradient on hover revealing name + category + tags
   - 8 cards, each with a realistic AI-generated UI screenshot (premium quality model) — prompts crafted as actual product UIs: analytics dashboard, CRM pipeline, SaaS billing portal, admin system, fintech app, project management tool, e-commerce admin, healthcare platform. Prompts will specify "realistic SaaS UI screenshot, dark theme, clean typography, no text errors, professional product design" to avoid amateur/gamer/fake look.

4. **Differentials.tsx** — 6-cell bento-ish grid: Alta Conversão, Mobile First, Performance, UX Premium, Sistemas Escaláveis, Integrações Inteligentes. Each cell: small icon, title, one-line description, subtle hover lift.

5. **Process.tsx** — 4-step horizontal flow (Estratégia → Design → Desenvolvimento → Entrega) with connecting line, numbered nodes, refined cards.

6. **FinalCTA.tsx** — Centered headline, supporting line, primary button, glow gradient backdrop.

7. **Footer.tsx** — Minimal: logo + tagline left, 3 small link columns (Empresa, Serviços, Contato), social icons row, copyright. Generous padding, low visual weight.

## Animations

- Tailwind utilities + `tw-animate-css` already available
- Scroll-reveal via `IntersectionObserver` hook (`useReveal`) applying fade-up class — restrained, single trigger
- Hover: subtle scale (1.02) + border brightness shift on cards
- Marquee: pure CSS, GPU-accelerated `transform: translateX`
- No parallax, no neon, no excessive motion

## Assets to generate

Via `imagegen` (premium tier for portfolio shots to ensure realistic typography):
- 1 hero dashboard mockup (1600×1000)
- 8 portfolio UI screenshots (900×1200 portrait)

Logo: `code--copy user-uploads://image.png src/assets/hyrocode-logo.png` — used as-is.

## SEO

Per-route `head()` on `/` with title, description, og:title, og:description, og:image (hero mockup), twitter:card. Single H1 in hero. Semantic `<section>` / `<nav>` / `<footer>`. Alt text on all images.

## Out of scope

- No backend / Lovable Cloud (no forms posting anywhere — CTAs are anchor links or `mailto:` placeholder)
- No additional routes — single-page experience as requested
- No blog, pricing page, or auth

## Deliverable

A pixel-perfect, fully responsive (mobile / tablet / notebook / desktop) dark premium marketing site that looks like it shipped from a senior product team at a funded SaaS company.
